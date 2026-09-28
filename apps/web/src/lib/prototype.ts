export type TechStatus = 'Da imparare' | 'In studio' | 'Acquisita' | 'In consolidamento';

export type Technique = {
  id: string;
  name: string;
  category: string;
  level: string;
  status: TechStatus;
  validated: boolean;
  favorite: boolean;
  saved: boolean;
  hidden: boolean;
  choreography: boolean;
};

export type Mission = {
  id: string;
  title: string;
  body: string;
  progress: string;
  xp: number;
  credits: number;
  assignedBy: string;
};

export type CoachMessage = {
  id: string;
  from: 'sara' | 'davide' | 'auto';
  category: string;
  text: string;
  at: string;
};

export type SharedMedia = {
  id: string;
  name: string;
  kind: string;
  previewUrl: string;
  shared: boolean;
  note: string;
};

/** Chiavi sezione con sfondo dedicabile */
export type BgSection =
  | 'splash'
  | 'stanza'
  | 'repertorio'
  | 'anatomia'
  | 'zen'
  | 'avatar'
  | 'giochi'
  | 'premi'
  | 'coach';

export type Snapshot = {
  gender: 'donna' | 'uomo';
  nickname: string;
  hair: string;
  skin: string;
  outfit: string;
  outfitPiece: string;
  outfitColor: string;
  accessory: string;
  avatarEffect: string;
  room: string;
  plant: number;
  xp: number;
  credits: number;
  levelLabel: string;
  techniques: Technique[];
  notes: string[];
  missions: Mission[];
  messages: CoachMessage[];
  media: SharedMedia[];
  story: string;
  showTitle: string;
  emotion: string;
  music: string;
  duration: string;
  timeline: string[];
  rewards: string[];
  unlockedCosmetics: string[];
  /** Override locali (data URL) per sezione — prova locale, non server */
  bgOverrides: Partial<Record<BgSection, string>>;
};

export const STORAGE_KEY = 'fa-dz-prototype-v2';
export const BG_STORAGE_KEY = 'fa-dz-bg-overrides-v1';

/** Nove PNG ambientali allegate → sezioni */
export const DEFAULT_BACKGROUNDS: Record<BgSection, string> = {
  splash:
    '/art/ingresso.png',
  stanza:
    '/art/stanza.png',
  repertorio:
    'https://horizons-cdn.hostinger.com/5e29205c-f5da-410b-a10b-af938aa2cdc7/dec0e3c21575644adcb2c6aca92e89f2.png',
  anatomia:
    'https://horizons-cdn.hostinger.com/5e29205c-f5da-410b-a10b-af938aa2cdc7/e720771c5b25adf65c95d1e6da57f4b8.png',
  zen:
    'https://horizons-cdn.hostinger.com/5e29205c-f5da-410b-a10b-af938aa2cdc7/2f597c46dbaf7c287f6f3bdd5eefefe0.png',
  avatar:
    '/art/avatar-room.png',
  giochi:
    'https://horizons-cdn.hostinger.com/5e29205c-f5da-410b-a10b-af938aa2cdc7/49fe58ec0d091a95fdb591555aed577e.png',
  premi:
    'https://horizons-cdn.hostinger.com/5e29205c-f5da-410b-a10b-af938aa2cdc7/e8121a01ddf92e59d0c0084821ee9f2b.png',
  coach:
    'https://horizons-cdn.hostinger.com/5e29205c-f5da-410b-a10b-af938aa2cdc7/726f920b74645cdd9e12de4e46c673ab.png',
};

export const BG_SECTION_LABELS: Record<BgSection, string> = {
  splash: 'Ingresso / Splash',
  stanza: 'Stanza atleta',
  repertorio: 'Figure e repertorio',
  anatomia: 'Anatomia',
  zen: 'Benessere e Dynamic Zen',
  avatar: 'Avatar e personalizza',
  giochi: 'Giochi',
  premi: 'Premi',
  coach: 'Pannello coach',
};

export const initialTechniques: Technique[] = [
  {
    id: 't1',
    name: 'Salita (panino)',
    category: 'Fondamentali',
    level: 'Base',
    status: 'Acquisita',
    validated: false,
    favorite: true,
    saved: true,
    hidden: false,
    choreography: false,
  },
  {
    id: 't2',
    name: 'Chiave scalino',
    category: 'Figure',
    level: 'Base',
    status: 'In studio',
    validated: false,
    favorite: false,
    saved: true,
    hidden: false,
    choreography: false,
  },
  {
    id: 't3',
    name: 'Chiave di ventre',
    category: 'Figure',
    level: 'Base',
    status: 'In studio',
    validated: false,
    favorite: true,
    saved: false,
    hidden: false,
    choreography: true,
  },
  {
    id: 't4',
    name: 'Panino giro',
    category: 'Transizioni',
    level: 'Base',
    status: 'Da imparare',
    validated: false,
    favorite: false,
    saved: false,
    hidden: false,
    choreography: false,
  },
  {
    id: 't5',
    name: 'Doppio scalino',
    category: 'Figure',
    level: 'Intermedio',
    status: 'Da imparare',
    validated: false,
    favorite: false,
    saved: false,
    hidden: false,
    choreography: false,
  },
  {
    id: 't6',
    name: 'Inversioni',
    category: 'Avanzate',
    level: 'Intermedio',
    status: 'Da imparare',
    validated: false,
    favorite: false,
    saved: false,
    hidden: false,
    choreography: false,
  },
];

export const initialState: Snapshot = {
  gender: 'donna',
  nickname: 'Sara',
  hair: 'Chignon',
  skin: 'Media',
  outfit: 'Ambra',
  outfitPiece: 'Base',
  outfitColor: '#10151d',
  accessory: 'Nessuno',
  avatarEffect: 'Nessuno',
  room: 'Santuario',
  plant: 2,
  xp: 420,
  credits: 85,
  levelLabel: 'BASE · CONOSCO',
  techniques: initialTechniques,
  notes: ['Oggi ho trovato più calma prima di salire.'],
  missions: [
    {
      id: 'm1',
      title: 'Missione Fluidità',
      body: 'Davide ha osservato le tue transizioni. Completa una breve presenza Dynamic Zen, poi una prova in palestra da convalidare.',
      progress: '1/3',
      xp: 40,
      credits: 15,
      assignedBy: 'Davide',
    },
  ],
  messages: [
    {
      id: 'msg0',
      from: 'davide',
      category: 'Allenamento',
      text: 'Ottimo lavoro, Sara. Nella prossima lezione guardiamo insieme il passaggio tra le figure.',
      at: 'Ieri',
    },
  ],
  media: [],
  story: '',
  showTitle: 'Il mio primo volo',
  emotion: 'Libertà',
  music: '',
  duration: '2 minuti',
  timeline: ['Intro', 'Salita (panino)', 'Transizione', 'Pausa', 'Chiave di ventre', 'Finale'],
  rewards: [],
  unlockedCosmetics: ['hair-chignon', 'skin-media', 'outfit-ambra', 'acc-nessuno'],
  bgOverrides: {},
};

export const paths = [
  {
    title: 'Base',
    concept: 'Conosco',
    items:
      'Corpo, sicurezza, prime tecniche aeree, respirazione e defaticamento. Contenuti demo da validare in palestra.',
    open: true,
  },
  {
    title: 'Intermedio',
    concept: 'Collego',
    items: 'Transizioni, combinazioni, fluidità e musicalità. Livello futuro.',
    open: false,
  },
  {
    title: 'Avanzato',
    concept: 'Creo',
    items: 'Creatività, interpretazione e costruzione coreografica. Livello futuro.',
    open: false,
  },
  {
    title: 'Coach',
    concept: 'Insegno',
    items: 'Scenari didattici demo. Non costituisce una qualifica professionale.',
    open: false,
  },
];

export const prizes = [
  { title: 'Fascia avatar', price: 25, type: 'Accessorio avatar' },
  { title: 'Luci calde stanza', price: 35, type: 'Oggetto stanza' },
  { title: 'Pianta lunare', price: 45, type: 'Oggetto stanza' },
  { title: 'T-shirt Freestyle Academy', price: 180, type: 'Premio reale · demo' },
  { title: 'Lezione', price: 320, type: 'Premio reale · demo' },
  { title: 'Workshop', price: 500, type: 'Premio reale · demo' },
  { title: 'Sconto merch 5€', price: 120, type: 'Premio reale · demo' },
];

export const zenActivities = [
  {
    id: 'z1',
    title: 'Presenza',
    detail: 'Tre respiri lenti. Nota tre cose che senti intorno a te.',
    tag: 'Presenza',
  },
  {
    id: 'z2',
    title: 'Respirazione',
    detail: 'Inspira 4 · trattieni 2 · espira 6. Ripeti cinque volte.',
    tag: 'Respiro',
  },
  {
    id: 'z3',
    title: 'Meditazione dinamica',
    detail: 'Muovi le spalle in cerchio lento, senza forzare.',
    tag: 'Movimento',
  },
  {
    id: 'z4',
    title: 'Kōan',
    detail: '«Cosa resta quando smetti di cercare la forma perfetta?»',
    tag: 'Riflessione',
  },
  {
    id: 'z5',
    title: 'Cura della pianta',
    detail: 'Un gesto di attenzione. La pianta cresce con te e non muore se ti assenti.',
    tag: 'Cura',
  },
];

export type GameCategory =
  | 'Memoria e attenzione'
  | 'Riflessi e tempo di reazione'
  | 'Creatività'
  | 'Ascolto'
  | 'Ritmo e tempo musicale';

export type GameEntry = {
  id: string;
  title: string;
  category: GameCategory;
  detail: string;
  playable: boolean;
  unlock: string;
  unlocked: boolean;
};

export const gamesCatalog: GameEntry[] = [
  {
    id: 'sequenza',
    title: 'Sequenza Misteriosa',
    category: 'Memoria e attenzione',
    detail: 'Memorizza l’ordine delle figure e ricostruiscilo. Nessuna penalità se sbagli.',
    playable: true,
    unlock: 'Disponibile da subito',
    unlocked: true,
  },
  {
    id: 'carte-ombra',
    title: 'Carte ombra',
    category: 'Memoria e attenzione',
    detail: 'Riconosci le silhouette delle figure.',
    playable: false,
    unlock: 'Sblocca a Intermedio · Collego',
    unlocked: false,
  },
  {
    id: 'flash-tocco',
    title: 'Flash tocco',
    category: 'Riflessi e tempo di reazione',
    detail: 'Tocca i punti luminosi prima che spariscano.',
    playable: false,
    unlock: 'Sblocca con Missione Fluidità completata',
    unlocked: false,
  },
  {
    id: 'eco-gesto',
    title: 'Eco del gesto',
    category: 'Riflessi e tempo di reazione',
    detail: 'Ripeti una sequenza di gesti a ritmo crescente.',
    playable: false,
    unlock: 'Sblocca a Intermedio · Collego',
    unlocked: false,
  },
  {
    id: 'mosaico-volo',
    title: 'Mosaico in volo',
    category: 'Creatività',
    detail: 'Componi un percorso libero con pezzi del repertorio.',
    playable: false,
    unlock: 'Sblocca a Avanzato · Creo',
    unlocked: false,
  },
  {
    id: 'storia-tessuto',
    title: 'Storia sul tessuto',
    category: 'Creatività',
    detail: 'Scegli emozioni e costruisci una mini-narrazione.',
    playable: false,
    unlock: 'Sblocca con 3 figure convalidate',
    unlocked: false,
  },
  {
    id: 'ascolto-spazio',
    title: 'Ascolto dello spazio',
    category: 'Ascolto',
    detail: 'Individua suoni e silenzi in una scena immersiva.',
    playable: false,
    unlock: 'Sblocca dopo 5 attività Dynamic Zen',
    unlocked: false,
  },
  {
    id: 'battito-seta',
    title: 'Battito di seta',
    category: 'Ritmo e tempo musicale',
    detail: 'Segui il tempo musicale con tocchi precisi.',
    playable: false,
    unlock: 'Sblocca a Intermedio · Collego',
    unlocked: false,
  },
  {
    id: 'frase-musicale',
    title: 'Frase musicale',
    category: 'Ritmo e tempo musicale',
    detail: 'Abbina figure a battute di una frase.',
    playable: false,
    unlock: 'Sblocca a Avanzato · Creo',
    unlocked: false,
  },
];

export type CosmeticOption = {
  id: string;
  label: string;
  free: boolean;
  unlockHint?: string;
};

export const avatarOptions = {
  hair: [
    { id: 'hair-chignon', label: 'Chignon', free: true },
    { id: 'hair-sciolti', label: 'Sciolti', free: true },
    { id: 'hair-treccia', label: 'Treccia', free: true },
    { id: 'hair-corona', label: 'Corona di trecce', free: false, unlockHint: 'Missione Fluidità' },
  ] as CosmeticOption[],
  skin: [
    { id: 'skin-chiara', label: 'Chiara', free: true },
    { id: 'skin-media', label: 'Media', free: true },
    { id: 'skin-olivastra', label: 'Olivastra', free: true },
    { id: 'skin-scura', label: 'Scura', free: true },
  ] as CosmeticOption[],
  outfit: [
    { id: 'outfit-ambra', label: 'Ambra', free: true },
    { id: 'outfit-notte', label: 'Notte', free: true },
    { id: 'outfit-teal', label: 'Teal', free: true },
    { id: 'outfit-seta', label: 'Seta bordeaux', free: false, unlockHint: 'Percorso Intermedio' },
  ] as CosmeticOption[],
  accessory: [
    { id: 'acc-nessuno', label: 'Nessuno', free: true },
    { id: 'acc-fascia', label: 'Fascia', free: true },
    { id: 'acc-stelle', label: 'Stelle', free: false, unlockHint: '50 crediti o missione' },
    { id: 'acc-bracciale', label: 'Bracciale luce', free: false, unlockHint: '3 figure convalidate' },
  ] as CosmeticOption[],
};

export function resolveBackground(
  section: BgSection,
  overrides?: Partial<Record<BgSection, string>>,
): string {
  return overrides?.[section] || DEFAULT_BACKGROUNDS[section];
}

export function loadBgOverrides(): Partial<Record<BgSection, string>> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(BG_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<Record<BgSection, string>>;
  } catch {
    return {};
  }
}

export function saveBgOverrides(overrides: Partial<Record<BgSection, string>>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BG_STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    /* quota */
  }
}

export function loadSnapshot(): Snapshot {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('fa-dz-prototype-v1');
    const overrides = loadBgOverrides();
    if (!raw) return { ...initialState, bgOverrides: overrides };
    const parsed = JSON.parse(raw) as Partial<Snapshot>;
    return {
      ...initialState,
      ...parsed,
      skin: parsed.skin || initialState.skin,
      techniques: parsed.techniques?.length ? parsed.techniques : initialTechniques,
      missions: parsed.missions?.length ? parsed.missions : initialState.missions,
      messages: parsed.messages ?? initialState.messages,
      media: parsed.media ?? [],
      notes: parsed.notes ?? initialState.notes,
      timeline: parsed.timeline?.length ? parsed.timeline : initialState.timeline,
      rewards: parsed.rewards ?? [],
      unlockedCosmetics: parsed.unlockedCosmetics?.length
        ? parsed.unlockedCosmetics
        : initialState.unlockedCosmetics,
      bgOverrides: { ...overrides, ...(parsed.bgOverrides || {}) },
    };
  } catch {
    return { ...initialState, bgOverrides: loadBgOverrides() };
  }
}

export function saveSnapshot(state: Snapshot) {
  if (typeof window === 'undefined') return;
  try {
    const { bgOverrides, ...rest } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    saveBgOverrides(bgOverrides || {});
  } catch {
    /* ignore quota */
  }
}
