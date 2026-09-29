/**
 * Device tier for the hero scene — decided once at construction, read by
 * everything (DPR, frame budget, pointer, antialias, mask cost) so values can
 * never drift apart. Feature-local port of the canonical device module from
 * the optimize-3d-scene skill (§2).
 *
 * Read at construction, and re-read when the container's **width** changes or
 * the pointer class flips — a device does not change tier mid-session, but a
 * window dragged across a breakpoint and a device emulator switched off both
 * do, and the scene has to follow (`HeroScene.retune`). What is baked into
 * shader source or the GL context (`trailSamples`, `antialias`) stays as
 * built; everything else is live.
 */

export type TierName = "mobile" | "tablet" | "desktop";

export interface SceneTier {
  name: TierName;
  mobile: boolean;
  /**
   * Touch-class input. Distinct from `mobile`, which a merely-narrow desktop
   * window also satisfies — this one is about the device, and it is what
   * gates the resize handler (see the iOS URL-bar note in the skill, §13).
   */
  coarsePointer: boolean;
  reducedMotion: boolean;
  /** Renderer pixel-ratio cap. */
  maxDpr: number;
  /** Minimum ms between renders for the shared ticker (0 = every tick). */
  frameInterval: number;
  /** Whether the cursor drives the reveal at all. */
  pointerEnabled: boolean;
  antialias: boolean;
  /**
   * Length of the reveal's pointer history, and therefore the per-fragment
   * loop bound. The single biggest fill-rate lever in this scene: the mask is
   * evaluated over a full-screen backdrop, twice (cursor + sweep), so every
   * sample is paid for across the frame. Shortening it on a phone costs a
   * slightly stubbier trail and nothing else.
   */
  trailSamples: number;
  /**
   * Whether the scanning wireframe is drawn. The helmet is ~38k triangles,
   * so its wireframe is ~114k line segments per frame — over a helmet some
   * 300px wide on a phone, most of them sub-pixel, which is costly on a
   * tile-based mobile GPU. It was off on phones for that; it is on
   * everywhere now so the phone shows the same effect as desktop.
   */
  outline: boolean;
  /**
   * Whether the liquid reveal runs at all after the entrance — the cursor
   * trail and the idle sweep that stands in for it on touch. It was off on a
   * phone (2026-09-08): the sweep never rests, and its warp is two noise
   * fetches plus up to 18 capsule distances per fragment of the helmet,
   * every frame. It is back on there, because without it the helmet only
   * exists for the entrance burn; off only where the scene is frozen
   * (reduced motion, or a phone in energy saver).
   */
  reveal: boolean;
  /**
   * Play the entrance, then stop drawing on a settled frame. WebGL keeps the
   * last frame on the canvas, so a frozen scene costs zero.
   */
  freeze: boolean;
}

/**
 * The cap for touch tiers, as the shared ticker measures it.
 *
 * The ticker skips while `time - last <= framerate`, so a budget of exactly
 * 1000/60 lets a 60Hz screen through every tick (16.67 is not <= 16.67 minus
 * float noise… until it is), and on a 120Hz screen the first tick past it
 * lands at 25ms — 40fps, not 60. Two milliseconds under puts 60Hz on every
 * tick and 120Hz on every second one, which is what "60" is meant to say.
 */
const CAP_60 = 1000 / 60 - 2;

/**
 * The nearest web-exposed proxy for iOS Low Power Mode, which has no API.
 * Save-Data is an explicit request to spend less; 2GB or under is the class of
 * device that cannot hold a 60fps fragment loop anyway.
 */
const isEnergySaver = (): boolean => {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  return Boolean(nav.connection?.saveData) || (nav.deviceMemory ?? 8) <= 2;
};

export const getSceneTier = (): SceneTier => {
  // The coarse-pointer clause is what catches tablets and large phones; width
  // alone misses an iPad in landscape.
  const coarse = window.matchMedia("(hover: none) and (pointer: coarse)")
    .matches;
  const width = window.innerWidth;
  const name: TierName =
    width < 768 || (coarse && width < 1024)
      ? "mobile"
      : coarse || width < 1280
        ? "tablet"
        : "desktop";

  const mobile = name === "mobile";
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const saver = isEnergySaver();

  return {
    name,
    mobile,
    coarsePointer: coarse,
    reducedMotion,
    // 1 → 1.25 → 1.5. Held at 1 on a phone rather than the skill's 0.85: this
    // scene draws hairline backdrop contours, and sub-1.0 aliases them
    // visibly (§6's hard-edged-geometry exception). Not above 1.5 anywhere —
    // a 3× phone at its native ratio would draw nine times the fragments of
    // this for no difference a reader can see.
    maxDpr: mobile ? 1 : name === "tablet" ? 1.25 : 1.5,
    // Touch tiers cap at 60, desktop runs every tick. This was 1000/30 on a
    // phone (26fps as the ticker measures it) and 1000/45 on a tablet, on the
    // skill's argument that a slowly evolving field cannot show a halved
    // frame rate — but nothing in this scene evolves slowly. The idle sweep
    // is a 0.45s stroke, the entrance is a burn, and the helmet tilts with
    // the pointer; at 26fps every one of them stepped, and it was reported
    // as lag from a device emulator on a desktop GPU, where fill cannot have
    // been the cost. The frame is paid for elsewhere: the backdrop's reveal
    // loop no longer runs where it is invisible, and the wireframe is off.
    frameInterval: name === "desktop" ? 0 : CAP_60,
    // Touch too: a finger on the hero drives the same liquid trail the
    // cursor does on desktop (pointermove fires for a touch drag until the
    // browser takes it over as a scroll). The phone used to park the pointer
    // and rely on the idle sweep alone, which read as a different effect.
    pointerEnabled: !reducedMotion,
    antialias: name === "desktop",
    // 44 on a phone as on a tablet, for the same trail length the cursor
    // leaves on desktop; the DPR cap of 1 keeps the fill cost down.
    trailSamples: mobile ? 44 : name === "tablet" ? 44 : 72,
    // The scanning wireframe is part of the effect everywhere now.
    outline: true,
    // On everywhere the scene is not frozen. The phone had it off
    // (2026-09-08, see `SceneTier.reveal`), which left the helmet visible
    // only for the entrance burn — on a phone the site read as a portrait
    // with no helmet at all. The sweep runs with the phone's own budget: 28
    // trail samples, no wireframe, DPR 1, and the broad brush `index.tsx`
    // sets below 640.
    reveal: !(reducedMotion || (mobile && saver)),
    freeze: reducedMotion || (mobile && saver),
  };
};
