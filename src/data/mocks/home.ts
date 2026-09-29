/**
 * Home page content — passed into the home view via props (no hardcoded
 * content in components — see obsidian/frontend/component-conventions.md).
 *
 * Every string, link and asset below is transcribed from the GRIDO1 hero
 * frame in Figma (823:247). Casing is left as the design's copy sets it; the
 * uppercase look comes from the `uppercase` utility, not from the data.
 */

export interface HeroLink {
  label: string;
  href: string;
}

export interface HeroMetaRow {
  /** Small mark shown before the label — a flag, a team badge, an icon. */
  icon: string;
  /** Empty when the mark only repeats the label and adds nothing for a reader. */
  iconAlt: string;
  /** Intrinsic box, in design px — each mark is a different shape. */
  iconWidth: number;
  iconHeight: number;
  label: string;
}

export interface HeroStat {
  label: string;
  value: string;
}

/** A season headline figure — the value leads, the label trails it. */
export interface SeasonStat {
  value: string;
  label: string;
}

export interface HomeContent {
  hero: {
    brand: {
      name: string;
      logo: string;
      href: string;
    };
    nav: HeroLink[];
    garage: HeroLink;
    driver: {
      id: string;
      firstName: string;
      lastName: string;
      tagline: string;
      /** Bot-path poster — the same portrait the scene renders. */
      portrait: string;
      meta: HeroMetaRow[];
    };
    nextRace: {
      eyebrow: string;
      name: string;
      circuit: string;
      date: string;
      map: string;
      mapAlt: string;
    };
    season: {
      eyebrow: string;
      stats: HeroStat[];
    };
    trailer: {
      label: string;
      duration: string;
      href: string;
    };
    profile: HeroLink;
    socials: HeroLink[];
  };
  season: {
    /** One line per rendered line — the design breaks it by hand. */
    headline: string[];
    intro: string;
    badge: {
      /** The design splits the two halves across two colours. */
      series: string;
      season: string;
    };
    stats: SeasonStat[];
  };
  footer: {
    /** One line per rendered line — the design breaks it by hand. */
    headline: string[];
    nav: { label: string; href: string }[];
    cta: { label: string; href: string };
    socials: { label: string; href: string }[];
    copyright: string;
  };
  paddock: {
    /** One line per rendered line — the design breaks it by hand. */
    headline: string[];
    intro: string;
    cta: { label: string; href: string };
    /** The race the block is reporting on. */
    meet: { name: string; circuit: string; date: string };
    stats: PaddockStat[];
    calendar: PaddockRound[];
  };
  timeline: {
    /** One line per rendered line — the design breaks it by hand. */
    headline: string[];
    /**
     * Top to bottom. `side` frames sit in the gutter and alternate left and
     * right; `centre` frames straddle the rail. The updated frame opens and
     * closes on a `centre` row — four of them, with three `side` rows between:
     * 169 + 4x462 + 3x217 + 32 is the frame's 2700 exactly. The count is not
     * fixed — the rail and its resting point are measured off the entries.
     */
    entries: TimelineEntry[];
  };
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface PaddockStat {
  icon: string;
  label: string;
  value: string;
}

export interface PaddockRound {
  round: string;
  name: string;
  date: string;
  /** The design's own x for the card, and its width, in the 1440 frame. */
  x: number;
  width: number;
  /** Races already run carry their finish; the rest carry a dot. */
  result?: string;
  /** The round the block is reporting on — cyan, and bracketed. */
  live?: boolean;
}

export interface TimelineEntry {
  year: string;
  /** Which frame this row carries. */
  frame: "side" | "centre";
  /** Set on `side` rows only — `centre` rows always straddle the rail. */
  align?: "left" | "right";
  /**
   * Lead sentence, set bold, then the rest. `centre` rows set it beside their
   * plate; `side` rows on the far side of the rail from theirs.
   */
  copyLead?: string;
  copy?: string;
  /** The design measures the copy column per row. */
  copyWidth?: number;
  /** The photograph in the frame, and what it shows. */
  image: string;
  alt: string;
}

const UI = "/assets/hero/ui";

const PADDOCK = "/assets/paddock";

export const homeContent: HomeContent = {
  hero: {
    brand: {
      name: "Grido1 Racing Systems",
      logo: `${UI}/grido1-logo.webp`,
      href: "/",
    },
    nav: [
      { label: "Driver", href: "/driver" },
      { label: "SEASON", href: "/season" },
      { label: "journal", href: "/journal" },
      { label: "next race", href: "/next-race" },
      { label: "store", href: "/store" },
    ],
    garage: { label: "Garage", href: "/garage" },
    driver: {
      id: "driver_017",
      firstName: "christopher",
      lastName: "feghali",
      tagline: "Lebanese racing driver, Red Bull athlete, Drivex Eurocup-3 2026 season",
      portrait: "/assets/hero/scene/person-diffuse.webp",
      meta: [
        {
          icon: `${UI}/flag-lebanon.webp`,
          iconAlt: "Lebanon",
          iconWidth: 18,
          iconHeight: 12,
          label: "Lebanon",
        },
        {
          icon: `${UI}/icon-rookie.svg`,
          iconAlt: "",
          iconWidth: 16,
          iconHeight: 16,
          label: "eurocup-3 season_2026",
        },
        {
          icon: `${UI}/icon-drivex.svg`,
          iconAlt: "",
          iconWidth: 14,
          iconHeight: 14,
          label: "Drivex · Red Bull athlete",
        },
      ],
    },
    nextRace: {
      eyebrow: "next race",
      name: "round 06 · jerez",
      circuit: "circuito de jerez",
      date: "25–27 sep 2026",
      map: `${UI}/circuit-jerez.webp`,
      mapAlt: "Circuito de Jerez – Ángel Nieto circuit layout",
    },
    season: {
      eyebrow: "Career stats",
      stats: [
        { label: "Titles", value: "8×" },
        { label: "World", value: "1" },
        { label: "Followers", value: "53K" },
      ],
    },
    trailer: {
      label: "watch trailer",
      duration: "01:26",
      href: "/trailer",
    },
    profile: { label: "view profile", href: "/driver/christopher-feghali" },
    socials: [
      { label: "inst", href: "https://instagram.com/christopherfeghali" },
      { label: "x", href: "https://x.com" },
      { label: "youtube", href: "https://youtube.com" },
    ],
  },
  season: {
    headline: ["the season", "so far"],
    intro: "Every race is a step forward. Here's how the season is shaping up.",
    badge: {
      series: "F1",
      season: "/ 2026",
    },
    stats: [
      { value: "P1", label: "in the championship" },
      { value: "6", label: "wins" },
      { value: "9", label: "podiums." },
    ],
  },
  footer: {
    headline: ["keep pushing", "forward"],
    nav: [
      { label: "driver", href: "/driver" },
      { label: "season", href: "/season" },
      { label: "journal", href: "/journal" },
      { label: "next race", href: "/next-race" },
      { label: "store", href: "/store" },
    ],
    cta: { label: "legal documents", href: "/legal" },
    socials: [
      { label: "inst", href: "https://instagram.com" },
      { label: "x", href: "https://x.com" },
      { label: "youtube", href: "https://youtube.com" },
    ],
    copyright: "© 2026 GRID01 Racing Systems. All rights reserved.",
  },
  paddock: {
    headline: ["from the", "paddock"],
    intro:
      "A composed drive through a difficult weekend secured another podium — and kept Kimi at the top of the championship.",
    cta: { label: "read story", href: "/stories/hungarian-gp" },
    meet: {
      name: "hungarian gp",
      circuit: "silverstone",
      date: "july 12, 2026",
    },
    stats: [
      { icon: `${PADDOCK}/icon-flag.svg`, label: "last result", value: "P4" },
      { icon: `${PADDOCK}/icon-bars.svg`, label: "points gained", value: "+12" },
      { icon: `${PADDOCK}/icon-trophy.svg`, label: "championship", value: "P1" },
      { icon: `${PADDOCK}/icon-gauge.svg`, label: "points", value: "118" },
    ],
    // The design sets each card's own x and width in the 1440 frame; they are
    // not on a grid, so they are carried rather than derived.
    calendar: [
      { round: "round 11", name: "austrian gp", date: "29 jun", x: 347, width: 100, result: "p6" },
      { round: "round 12", name: "british gp", date: "12 jul", x: 511, width: 100, result: "p4" },
      { round: "round 13", name: "belgian gp", date: "27 jul", x: 675, width: 100, live: true },
      { round: "round 14", name: "hungarian gp", date: "03 aug", x: 839, width: 114 },
      { round: "round 15", name: "dutch gp", date: "31 aug", x: 1017, width: 76 },
    ],
  },
  timeline: {
    // Christopher's own line — the "Road to Formula 1" chapter on
    // christopherfeghali.racing. The about page's "Ten years. One trajectory."
    // runs past the right edge at this size: "trajectory" alone is the width
    // the heading has.
    headline: ["road to", "formula 1"],
    // Career timeline from christopherfeghali.racing/about ("02 / Career") and
    // its honours list. Every row carries copy: side rows set it on the far
    // side of the rail from their photograph (see `timeline-row.tsx`).
    // The two karting photographs are VroomKart's from the 2022 RMC Grand
    // Finals in Portimão (vroomkart.com/news/42839) — press images, to be
    // cleared with the photographer or swapped for the team's own. The Red
    // Bull portrait is Red Bull's own 2026 driver portrait (redbull.com
    // junior team profile).
    entries: [
      {
        year: "2018",
        frame: "centre",
        copyLead: "Lebanese kart champion ×8.",
        copy: "Eight national titles between 2018 and 2022 — and three MENA Cup region championships.",
        copyWidth: 262,
        image: "/assets/timeline/2018-karting.webp",
        alt: "Christopher in his Team Lebanon karting suit, pointing a finger up for number one",
      },
      {
        year: "2022",
        frame: "side",
        align: "right",
        copyLead: "Rotax world champion.",
        copy: "Crowned Mini MAX World Champion — a first for Lebanon.",
        copyWidth: 240,
        image: "/assets/timeline/2022-world-champion.webp",
        alt: "Christopher on the top step of the Rotax Mini MAX podium at the 2022 Grand Finals, under the Lebanese flag",
      },
      {
        year: "2024",
        frame: "centre",
        copyLead: "Single-seater debut.",
        copy: "Made the jump to single-seaters with Drivex in the Spanish F4 Championship.",
        copyWidth: 262,
        image: "/assets/timeline/2024-f4.webp",
        alt: "Christopher's Drivex single-seater cresting a kerb",
      },
      {
        year: "2024",
        frame: "side",
        align: "left",
        copyLead: "Red Bull athlete.",
        copy: "Signed as a Red Bull athlete — one of the most prestigious driver development programmes in motorsport.",
        copyWidth: 250,
        image: "/assets/timeline/2024-red-bull-portrait.webp",
        alt: "Christopher in his Red Bull race suit",
      },
      {
        year: "2025",
        frame: "centre",
        copyLead: "Eurocup-3 with Drivex.",
        copy: "A full Eurocup-3 season — the direct stepping stone to FIA Formula 3.",
        copyWidth: 262,
        image: "/assets/timeline/2025-eurocup3.webp",
        alt: "Christopher's Drivex car on track at Aragón",
      },
      {
        year: "2025",
        frame: "side",
        align: "right",
        copyLead: "Race winner.",
        copy: "A Eurocup-3 sprint race win in his first season in the championship.",
        copyWidth: 240,
        image: "/assets/timeline/2025-win.webp",
        alt: "Christopher on the podium",
      },
      {
        year: "2026",
        frame: "centre",
        copyLead: "The mission continues.",
        copy: "A second Eurocup-3 campaign. Eight rounds. Eight F1 circuits. One target.",
        copyWidth: 262,
        image: "/assets/timeline/2026-season-v2.webp",
        alt: "Christopher's car cresting a hill against the sky",
      },
    ],
  },
};
