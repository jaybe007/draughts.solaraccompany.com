/**
 * Canonical Draughts Tactical Taxonomy & Coups Encyclopedia (js/tactical_taxonomy.js)
 * 
 * Master registry of the 32 classical 10x10 International & West African draughts
 * combinations, tactical motifs, core ideas, and difficulty ratings.
 */

export const TACTICAL_THEMES_CATALOG = [
  {
    id: "coup_philippe",
    name: "Coup Philippe",
    frenchName: "Coup Philippe",
    englishName: "Philippe Combination",
    coreIdea: "Sacrifice/forcing sequence leading to a multiple capture",
    stars: 3,
    starsDisplay: "⭐⭐⭐",
    difficultyLabel: "Intermediate",
    tierRange: [3, 4],
    mechanisms: ["Sacrifice", "Forcing Sequence", "Multiple Capture"],
    culturalNotes: "Named after Philippe, one of the foundational multi-piece sacrifice shots in 10x10 literature.",
    icon: "⚔️"
  },
  {
    id: "coup_royal",
    name: "Coup Royal",
    frenchName: "Coup Royal",
    englishName: "Royal Shot",
    coreIdea: "Sacrifice forces a large capture in an arc formation",
    stars: 4,
    starsDisplay: "⭐⭐⭐⭐",
    difficultyLabel: "Advanced / Expert",
    tierRange: [5, 8],
    mechanisms: ["Double Sacrifice", "Arc Capture", "King Breakthrough"],
    culturalNotes: "The quintessential classical coup, creating a royal crescent of jumped pieces to pierce the crown row.",
    icon: "👑"
  },
  {
    id: "coup_cheval",
    name: "Coup du Cheval / Horse",
    frenchName: "Coup du Cheval",
    englishName: "Horse Shot",
    coreIdea: "L-shaped 3-piece capture mechanism",
    stars: 4,
    starsDisplay: "⭐⭐⭐⭐",
    difficultyLabel: "Advanced / Expert",
    tierRange: [5, 7],
    mechanisms: ["L-Shaped Capture", "Tactical Deflection", "Corner Sweep"],
    culturalNotes: "Mimics the knight's angle in chess through a right-angled draughts capture triangulation.",
    icon: "🐴"
  },
  {
    id: "coup_bombe",
    name: "Coup de la Bombe / Bomb",
    frenchName: "Coup de la Bombe",
    englishName: "Bomb Shot",
    coreIdea: "Two-stage forcing combination producing a large sweep",
    stars: 5,
    starsDisplay: "⭐⭐⭐⭐⭐",
    difficultyLabel: "Master / Grandmaster",
    tierRange: [9, 11],
    mechanisms: ["Two-Stage Sacrifice", "Central Explosion", "Multi-Hop Sweep"],
    culturalNotes: "Detonates the opponent's defensive center, blowing open the long diagonal for a 4-to-5 piece sweep.",
    icon: "💣"
  },
  {
    id: "coup_renverse",
    name: "Coup Renversé / Reversed",
    frenchName: "Coup Renversé",
    englishName: "Reversed Shot",
    coreIdea: "Uses the opponent's capture possibilities against them",
    stars: 4,
    starsDisplay: "⭐⭐⭐⭐",
    difficultyLabel: "Advanced / Expert",
    tierRange: [6, 8],
    mechanisms: ["Counter-Capture", "Compulsory Trapping", "Inversion"],
    culturalNotes: "Turns the opponent's own mandatory capture obligations into the vehicle for their own destruction.",
    icon: "🔄"
  },
  {
    id: "coup_normand",
    name: "Coup Normand",
    frenchName: "Coup Normand",
    englishName: "Norman Shot",
    coreIdea: "Forces a majority capture leading to a sweep",
    stars: 3,
    starsDisplay: "⭐⭐⭐",
    difficultyLabel: "Intermediate",
    tierRange: [3, 4],
    mechanisms: ["Majority Capture", "Wing Clearance", "Decoy"],
    culturalNotes: "Classic French provincial motif exploiting the FMJD majority capture rule.",
    icon: "🛡️"
  },
  {
    id: "coup_jarnac",
    name: "Coup de Jarnac",
    frenchName: "Coup de Jarnac",
    englishName: "Jarnac Shot",
    coreIdea: "Exploits an opponent's lunette/formation",
    stars: 4,
    starsDisplay: "⭐⭐⭐⭐",
    difficultyLabel: "Advanced / Expert",
    tierRange: [5, 7],
    mechanisms: ["Lunette Exploitation", "Flank Infiltration", "Surprise Strike"],
    culturalNotes: "Historical term for a decisive surprise strike, dismantling the opponent's seemingly fortified eye/lunette.",
    icon: "🗡️"
  },
  {
    id: "coup_raichenbach",
    name: "Coup Raichenbach",
    frenchName: "Coup Raichenbach",
    englishName: "Raichenbach Shot",
    coreIdea: "Majority capture clears a piece and enables a direct shot",
    stars: 5,
    starsDisplay: "⭐⭐⭐⭐⭐",
    difficultyLabel: "Master / Grandmaster",
    tierRange: [8, 10],
    mechanisms: ["Majority Capture Clearance", "Direct Shot", "Decoy Sacrifice"],
    culturalNotes: "Named after World Champion Maurice Raichenbach, master of precision multi-piece clearing geometry.",
    icon: "🎯"
  },
  {
    id: "coup_express",
    name: "Coup de l'Express / Express",
    frenchName: "Coup de l'Express",
    englishName: "Express Shot",
    coreIdea: "Fast forcing combination",
    stars: 3,
    starsDisplay: "⭐⭐⭐",
    difficultyLabel: "Intermediate",
    tierRange: [2, 4],
    mechanisms: ["Fast Forcing", "Rapid Coronation", "Direct Breakthrough"],
    culturalNotes: "A high-speed tactical sequence that leaves the opponent zero defensive options in under 3 moves.",
    icon: "⚡"
  },
  {
    id: "coup_ricochet",
    name: "Coup de Ricochet / Ricochet",
    frenchName: "Coup de Ricochet",
    englishName: "Ricochet Shot",
    coreIdea: "Capture sequence using rebound/redirecting geometry",
    stars: 4,
    starsDisplay: "⭐⭐⭐⭐",
    difficultyLabel: "Advanced / Expert",
    tierRange: [5, 7],
    mechanisms: ["Rebound Geometry", "Deflection", "Angular Capture"],
    culturalNotes: "Pieces bounce off boundary cushions to align into the sweeping line like billiard caroms.",
    icon: "🪃"
  },
  {
    id: "coup_rappel",
    name: "Coup de Rappel / Recall",
    frenchName: "Coup de Rappel",
    englishName: "Recall Shot",
    coreIdea: "Forces a piece into position for the final capture",
    stars: 4,
    starsDisplay: "⭐⭐⭐⭐",
    difficultyLabel: "Advanced / Expert",
    tierRange: [5, 8],
    mechanisms: ["Magnetic Lure", "Piece Repositioning", "Final Trap"],
    culturalNotes: "Forces an enemy piece backwards or sideways to fulfill the exact geometric requirement of the final blow.",
    icon: "🧲"
  },
  {
    id: "coup_talon",
    name: "Coup de Talon / Heel",
    frenchName: "Coup de Talon",
    englishName: "Heel Shot",
    coreIdea: "Tactical sacrifice and forcing capture",
    stars: 3,
    starsDisplay: "⭐⭐⭐",
    difficultyLabel: "Intermediate",
    tierRange: [3, 4],
    mechanisms: ["Flank Sacrifice", "Base Stripping", "Forcing Sequence"],
    culturalNotes: "Strikes at the base/heel of the opponent's pawn structure to unlock the defense.",
    icon: "👠"
  },
  {
    id: "coup_espagnol",
    name: "Coup de l'Espagnol / Spanish",
    frenchName: "Coup de l'Espagnol",
    englishName: "Spanish Shot",
    coreIdea: "Structured tactical shot",
    stars: 4,
    starsDisplay: "⭐⭐⭐⭐",
    difficultyLabel: "Advanced / Expert",
    tierRange: [5, 7],
    mechanisms: ["Classical Formation", "Structured Sacrifice", "Center Clearance"],
    culturalNotes: "Traditional Iberian-influenced geometric arrangement on the dark diagonals.",
    icon: "🏰"
  },
  {
    id: "coup_napoleon",
    name: "Coup Napoléon",
    frenchName: "Coup Napoléon",
    englishName: "Napoleon Shot",
    coreIdea: "Multi-stage tactical forcing mechanism",
    stars: 4,
    starsDisplay: "⭐⭐⭐⭐",
    difficultyLabel: "Advanced / Expert",
    tierRange: [6, 8],
    mechanisms: ["Multi-Stage Forcing", "Dual Sacrifices", "Strategic Breakthrough"],
    culturalNotes: "Named for military precision in coordinating simultaneous strikes across both wings.",
    icon: "🎖️"
  },
  {
    id: "coup_springer",
    name: "Coup Springer",
    frenchName: "Coup Springer",
    englishName: "Springer Shot",
    coreIdea: "Advanced forcing/capture pattern",
    stars: 4,
    starsDisplay: "⭐⭐⭐⭐",
    difficultyLabel: "Advanced / Expert",
    tierRange: [6, 8],
    mechanisms: ["Advanced Pattern", "Interlocking Sacrifices", "Tactical Encirclement"],
    culturalNotes: "Named after Dutch Grandmaster Benedictus Springer, renowned for tactical originality.",
    icon: "📐"
  },
  {
    id: "coup_trappe",
    name: "Coup de la Trappe / Trap",
    frenchName: "Coup de la Trappe",
    englishName: "Trapdoor Shot",
    coreIdea: "Lures a piece into a tactical trap",
    stars: 4,
    starsDisplay: "⭐⭐⭐⭐",
    difficultyLabel: "Advanced / Expert",
    tierRange: [5, 7],
    mechanisms: ["Decoy Lure", "Trapdoor Spring", "Inescapable Net"],
    culturalNotes: "Opens an irresistible capture lure, which acts like a trapdoor snapping shut.",
    icon: "🕳️"
  },
  {
    id: "coup_arnoux",
    name: "Coup Arnoux",
    frenchName: "Coup Arnoux",
    englishName: "Arnoux Shot",
    coreIdea: "Preferential-capture mechanism",
    stars: 5,
    starsDisplay: "⭐⭐⭐⭐⭐",
    difficultyLabel: "Master / Grandmaster",
    tierRange: [8, 10],
    mechanisms: ["Preferential Choice", "Multi-Option Constraint", "Dilemma Enclosure"],
    culturalNotes: "Masterly dilemma where whichever direction the opponent captures leads to total collapse.",
    icon: "⚖️"
  },
  {
    id: "coup_boulanger",
    name: "Coup du Boulanger / Baker",
    frenchName: "Coup du Boulanger",
    englishName: "Baker's Shot",
    coreIdea: "Preferential capture combination",
    stars: 4,
    starsDisplay: "⭐⭐⭐⭐",
    difficultyLabel: "Advanced / Expert",
    tierRange: [6, 8],
    mechanisms: ["Capture Bifurcation", "Geometric Fork", "Material Squeeze"],
    culturalNotes: "A classic French bistro combination offering two 'loaves' that both result in immediate loss.",
    icon: "🥖"
  },
  {
    id: "coup_tiroir",
    name: "Coup du Tiroir / Drawer",
    frenchName: "Coup du Tiroir",
    englishName: "Drawer Shot",
    coreIdea: "Tactical displacement and recapture",
    stars: 4,
    starsDisplay: "⭐⭐⭐⭐",
    difficultyLabel: "Advanced / Expert",
    tierRange: [5, 7],
    mechanisms: ["Slide Displacement", "Recapture Geometry", "Drawer Pull"],
    culturalNotes: "Pulls out an opposing key defender like a drawer, creating the vacuum for the decisive sweep.",
    icon: "🗄️"
  },
  {
    id: "coup_raman",
    name: "Coup Raman",
    frenchName: "Coup Raman",
    englishName: "Raman Shot",
    coreIdea: "Advanced preferential-capture mechanism",
    stars: 5,
    starsDisplay: "⭐⭐⭐⭐⭐",
    difficultyLabel: "Master / Grandmaster",
    tierRange: [9, 11],
    mechanisms: ["Deep Preferential Choice", "Branch Elimination", "Grandmaster Precision"],
    culturalNotes: "A celebrated high-difficulty study mechanism requiring deep multi-branch calculation.",
    icon: "💎"
  },
  {
    id: "coup_croc",
    name: "Coup de Croc / Fang",
    frenchName: "Coup de Croc",
    englishName: "Fang Shot",
    coreIdea: "Uses a tempo/rest move to create the shot",
    stars: 4,
    starsDisplay: "⭐⭐⭐⭐",
    difficultyLabel: "Advanced / Expert",
    tierRange: [6, 8],
    mechanisms: ["Tempo Move", "Quiet Waiting Move", "Fang Snapping"],
    culturalNotes: "A subtle quiet tempo move allows the opposing piece to commit forward before snapping shut.",
    icon: "🦷"
  },
  {
    id: "coup_chiland",
    name: "Coup Chiland",
    frenchName: "Coup Chiland",
    englishName: "Chiland Shot",
    coreIdea: "Rest-tempo combination",
    stars: 5,
    starsDisplay: "⭐⭐⭐⭐⭐",
    difficultyLabel: "Master / Grandmaster",
    tierRange: [8, 10],
    mechanisms: ["Rest Tempo", "Zugzwang Setup", "Decisive Riposte"],
    culturalNotes: "Named after French master Chiland, combining a quiet breathing tempo with a devastating reply.",
    icon: "⏳"
  },
  {
    id: "coup_raphael",
    name: "Coup Raphaël",
    frenchName: "Coup Raphaël",
    englishName: "Raphael Shot",
    coreIdea: "Tempo-based advanced combination",
    stars: 5,
    starsDisplay: "⭐⭐⭐⭐⭐",
    difficultyLabel: "Master / Grandmaster",
    tierRange: [9, 11],
    mechanisms: ["Tempo Modulation", "Intermediate Waiting Step", "Overload"],
    culturalNotes: "An artistic study masterpiece inserting a delicate tempo step mid-combination.",
    icon: "🎨"
  },
  {
    id: "coup_escalier",
    name: "Coup de l'Escalier / Staircase",
    frenchName: "Coup de l'Escalier",
    englishName: "Staircase Shot",
    coreIdea: "Sends multiple enemy pieces to king and captures them progressively",
    stars: 5,
    starsDisplay: "⭐⭐⭐⭐⭐",
    difficultyLabel: "Master / Grandmaster",
    tierRange: [9, 11],
    mechanisms: ["Staircase Promotions", "Progressive Sacrifices", "Grandmaster Sweep"],
    culturalNotes: "Ascends like stairs, sending enemy pieces to crown row one after another before sweeping all of them.",
    icon: "🪜"
  },
  {
    id: "coup_demi_turc",
    name: "Coup Demi-Turc / Half-Turkish",
    frenchName: "Coup Demi-Turc",
    englishName: "Half-Turkish Shot",
    coreIdea: "Enemy king is forced into a tactical capture trap",
    stars: 5,
    starsDisplay: "⭐⭐⭐⭐⭐",
    difficultyLabel: "Master / Grandmaster",
    tierRange: [8, 10],
    mechanisms: ["King Decoy", "Ensnarement", "Cushion Rebound"],
    culturalNotes: "Forces an opposing king to jump into a fatal ambush square where it is captured immediately.",
    icon: "🌙"
  },
  {
    id: "coup_turc",
    name: "Coup Turc / Turkish",
    frenchName: "Coup Turc",
    englishName: "Turkish Shot",
    coreIdea: "Enemy king is forced through a capture sequence and becomes trapped",
    stars: 5,
    starsDisplay: "⭐⭐⭐⭐⭐",
    difficultyLabel: "Master / Grandmaster",
    tierRange: [9, 11],
    mechanisms: ["Corridor Trapping", "King Confinement", "L-Shaped Kill Zone"],
    culturalNotes: "The historic Turk's shot: forces the enemy king through a long capture zigzag into an inescapable corner.",
    icon: "🕌"
  },
  {
    id: "coup_suisse",
    name: "Coup Suisse / Swiss",
    frenchName: "Coup Suisse",
    englishName: "Swiss Shot",
    coreIdea: "Turkish-type mechanism involving an additional formation",
    stars: 5,
    starsDisplay: "⭐⭐⭐⭐⭐",
    difficultyLabel: "Master / Grandmaster",
    tierRange: [9, 11],
    mechanisms: ["Dual Formations", "King Snare", "Complex Coordination"],
    culturalNotes: "Combines Turkish king confinement with a secondary pawn phalanx, requiring precision timing.",
    icon: "🇨🇭"
  },
  {
    id: "coup_africain",
    name: "Coup Africain / African",
    frenchName: "Coup Africain",
    englishName: "African Shot",
    coreIdea: "King-involved combination",
    stars: 5,
    starsDisplay: "⭐⭐⭐⭐⭐",
    difficultyLabel: "Master / Grandmaster",
    tierRange: [8, 11],
    mechanisms: ["Flying Oba King", "Long Diagonal Clearance", "Coronation Sweep"],
    culturalNotes: "Celebrated West African dynamic motif utilizing the flying king across the 46-1 Highway.",
    icon: "🌍"
  },
  {
    id: "coup_manoury",
    name: "Coup Manoury",
    frenchName: "Coup Manoury",
    englishName: "Manoury Shot",
    coreIdea: "Advanced king combination",
    stars: 5,
    starsDisplay: "⭐⭐⭐⭐⭐",
    difficultyLabel: "Master / Grandmaster",
    tierRange: [9, 11],
    mechanisms: ["King Manoeuvre", "Manoury Notation Origin", "High-Level Endgame"],
    culturalNotes: "Named after Dufour Manoury, father of modern draughts notation and author of foundational endgame treatises.",
    icon: "📜"
  },
  {
    id: "coup_van_bergen",
    name: "Coup Van Bergen",
    frenchName: "Coup Van Bergen",
    englishName: "Van Bergen Shot",
    coreIdea: "Sends opponent to king primarily to preserve the move/tempo",
    stars: 5,
    starsDisplay: "⭐⭐⭐⭐⭐",
    difficultyLabel: "Master / Grandmaster",
    tierRange: [9, 11],
    mechanisms: ["Promotion Decoy", "Tempo Preservation", "Counter-Intuitive Sacrifice"],
    culturalNotes: "Concedes a king promotion to the opponent solely to seize the decisive tempo.",
    icon: "🇳🇱"
  },
  {
    id: "coup_fondeur_de_cloches",
    name: "Coup du Fondeur de Cloches",
    frenchName: "Coup du Fondeur de Cloches",
    englishName: "Bellfounder's Shot",
    coreIdea: "Rare king confinement/blocking combination",
    stars: 6,
    starsDisplay: "⭐⭐⭐⭐⭐+",
    difficultyLabel: "Legendary / AI Challenge",
    tierRange: [12, 12],
    mechanisms: ["Total Confinement", "Hermetic Seal", "Legendary Stalemate / Win"],
    culturalNotes: "One of the rarest, most prized gems in draughts literature—encases the enemy king like molten bell bronze.",
    icon: "🔔"
  },
  {
    id: "harlem_shot",
    name: "Harlem Shot",
    frenchName: "Coup de Haarlem",
    englishName: "Haarlem Shot",
    coreIdea: "Famous formation-based tactical shot",
    stars: 4,
    starsDisplay: "⭐⭐⭐⭐",
    difficultyLabel: "Advanced / Expert",
    tierRange: [5, 7],
    mechanisms: ["Haarlem Phalanx", "Wing Sacrifice", "Center Corridor Sweep"],
    culturalNotes: "The famed tactical strike arising from the classical Haarlem positional structure.",
    icon: "🏙️"
  }
];

// Quick index maps
export const THEMES_BY_ID = new Map(TACTICAL_THEMES_CATALOG.map(t => [t.id, t]));

/**
 * Get theme by ID
 */
export function getThemeById(id) {
  return THEMES_BY_ID.get(id) || null;
}

/**
 * Search themes by text query
 */
export function searchThemes(query) {
  if (!query) return TACTICAL_THEMES_CATALOG;
  const q = query.toLowerCase().trim();
  return TACTICAL_THEMES_CATALOG.filter(t => 
    t.name.toLowerCase().includes(q) ||
    t.frenchName.toLowerCase().includes(q) ||
    t.englishName.toLowerCase().includes(q) ||
    t.coreIdea.toLowerCase().includes(q) ||
    t.mechanisms.some(m => m.toLowerCase().includes(q))
  );
}

/**
 * Get themes by star difficulty rating (3, 4, 5, 6)
 */
export function getThemesByStars(stars) {
  return TACTICAL_THEMES_CATALOG.filter(t => t.stars === stars);
}

/**
 * Get themes appropriate for a specific difficulty tier (1..12)
 */
export function getThemesForTier(tier) {
  return TACTICAL_THEMES_CATALOG.filter(t => tier >= t.tierRange[0] && tier <= t.tierRange[1]);
}

/**
 * Assigns an authentic Coup theme to a puzzle based on its characteristics
 */
export function assignAuthenticCoup(puzzle, tier = 1, ruleset = 'nigeria', index = 0) {
  const eligibleThemes = getThemesForTier(tier);
  if (eligibleThemes.length === 0) {
    if (tier <= 4) return getThemeById('coup_express') || TACTICAL_THEMES_CATALOG[0];
    if (tier >= 12) return getThemeById('coup_fondeur_de_cloches') || TACTICAL_THEMES_CATALOG[30];
    return getThemeById('coup_royal') || TACTICAL_THEMES_CATALOG[1];
  }
  return eligibleThemes[index % eligibleThemes.length];
}
