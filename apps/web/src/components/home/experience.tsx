import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Clapperboard,
  Coins,
  Dumbbell,
  Flower2,
  Gamepad2,
  Heart,
  House,
  ImagePlus,
  Leaf,
  LockKeyhole,
  MessageCircle,
  Mic,
  NotebookPen,
  Palette,
  Play,
  Plus,
  Send,
  Sparkles,
  Star,
  Trophy,
  Video,
  X,
  Bone,
  Image as ImageIcon,
  RotateCcw,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  avatarOptions,
  BG_SECTION_LABELS,
  DEFAULT_BACKGROUNDS,
  gamesCatalog,
  initialState,
  loadSnapshot,
  paths,
  prizes,
  resolveBackground,
  saveSnapshot,
  zenActivities,
  type BgSection,
  type Snapshot,
  type TechStatus,
} from '@/lib/prototype';
import { AvatarFigure } from '@/components/home/avatar-figure';

type Mode = 'splash' | 'create-athlete' | 'onboarding-customize' | 'sara' | 'davide';
type Page =
  | 'stanza'
  | 'allenati'
  | 'zen'
  | 'gioca'
  | 'repertorio'
  | 'anatomia'
  | 'diario'
  | 'crea'
  | 'percorso'
  | 'premi'
  | 'personalizza'
  | 'davide-chat'
  | 'missioni';

const titles: Record<Page, { eye: string; h: string }> = {
  stanza: { eye: 'LA TUA BASE', h: 'Bentornata' },
  allenati: { eye: 'PREPARAZIONE', h: 'Allenati' },
  zen: { eye: 'DYNAMIC ZEN', h: 'Benessere' },
  gioca: { eye: 'SALA GIOCHI', h: 'Giochi' },
  repertorio: { eye: 'FIGURE', h: 'Repertorio' },
  anatomia: { eye: 'ANATOMIA', h: 'Spazio verificato' },
  diario: { eye: 'PRIVATO', h: 'Diario' },
  crea: { eye: 'LAB', h: 'Crea spettacolo' },
  percorso: { eye: 'CRESCITA', h: 'Percorso' },
  premi: { eye: 'RICOMPENSE', h: 'Premi' },
  personalizza: { eye: 'STILE', h: 'Personalizza' },
  'davide-chat': { eye: 'COACH', h: 'Chiedi a Davide' },
  missioni: { eye: 'OBIETTIVI', h: 'Missioni' },
};

const pageToBg: Partial<Record<Page, BgSection>> = {
  stanza: 'stanza',
  repertorio: 'repertorio',
  anatomia: 'anatomia',
  zen: 'zen',
  personalizza: 'avatar',
  gioca: 'giochi',
  premi: 'premi',
  diario: 'zen',
  allenati: 'repertorio',
  percorso: 'stanza',
  crea: 'repertorio',
  missioni: 'stanza',
  'davide-chat': 'coach',
};

const gameSequence = ['Salita (panino)', 'Chiave scalino', 'Transizione', 'Chiave di ventre'];
const bgSections = Object.keys(DEFAULT_BACKGROUNDS) as BgSection[];

const femaleLookPresets = [
  { src: '/art/sara-athlete.png', hair: 'Chignon', outfit: 'Ambra', label: 'Chignon' },
  { src: '/art/sara-loose.png', hair: 'Sciolti', outfit: 'Ambra', label: 'Sciolti' },
  { src: '/art/sara-braid.png', hair: 'Treccia', outfit: 'Ambra', label: 'Treccia' },
  { src: '/art/sara-teal.png', hair: 'Chignon', outfit: 'Teal', label: 'Teal' },
] as const;

const onboardingEffects = [
  { id: 'none', label: 'Nessuno', tone: '#64748b' },
  { id: 'amber', label: 'Aura ambra', tone: '#eda64b' },
  { id: 'violet', label: 'Aura viola', tone: '#a855f7' },
  { id: 'teal', label: 'Aura teal', tone: '#2dd4bf' },
] as const;

type OnboardTab = 'OUTFIT' | 'CAPELLI' | 'ACCESSORI' | 'EFFETTI';

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function InteractiveAthletePreview({
  gender,
  label,
  imageSrc,
  compact = false,
  accessory = 'Nessuno',
  effect = 'Nessuno',
}: {
  gender: 'donna' | 'uomo';
  label: string;
  imageSrc: string;
  compact?: boolean;
  accessory?: string;
  effect?: string;
}) {
  const [view, setView] = useState({ scale: 1, x: 0, y: 0, rotate: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ distance: number; cx: number; cy: number; view: typeof view } | null>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
  const reset = () => setView({ scale: 1, x: 0, y: 0, rotate: 0 });
  const down = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    if (pts.length === 1) last.current = pts[0];
    if (pts.length === 2) {
      const [a,b] = pts; gesture.current = { distance: Math.hypot(b.x-a.x,b.y-a.y), cx:(a.x+b.x)/2, cy:(a.y+b.y)/2, view };
    }
  };
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    if (pts.length === 1 && last.current) {
      const p=pts[0], dx=p.x-last.current.x, dy=p.y-last.current.y;
      setView(v => v.scale > 1.03 ? { ...v, x: clamp(v.x+dx,-150,150), y: clamp(v.y+dy,-150,150) } : { ...v, rotate: clamp(v.rotate+dx*.35,-32,32) });
      last.current=p;
    } else if (pts.length === 2 && gesture.current) {
      const [a,b]=pts, d=Math.hypot(b.x-a.x,b.y-a.y), cx=(a.x+b.x)/2, cy=(a.y+b.y)/2, g=gesture.current;
      setView({ ...g.view, scale: clamp(g.view.scale*d/g.distance,.72,2.6), x: clamp(g.view.x+(cx-g.cx),-150,150), y: clamp(g.view.y+(cy-g.cy),-150,150) });
    }
  };
  const up = (e: React.PointerEvent<HTMLDivElement>) => { pointers.current.delete(e.pointerId); gesture.current=null; const pts=[...pointers.current.values()]; last.current=pts[0]||null; };
  const effectClass = effect === 'Aura ambra' ? 'effect-amber' : effect === 'Aura viola' ? 'effect-violet' : effect === 'Aura teal' ? 'effect-teal' : '';
  return <div className={`interactive-athlete ${compact?'compact':''} ${effectClass}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={(e)=>{e.preventDefault(); setView(v=>({...v,scale:clamp(v.scale-e.deltaY*.001,.72,2.6)}));}}>
    <div className="interactive-glow" aria-hidden />
    <img draggable={false} style={{transform:`translate3d(${view.x}px,${view.y}px,0) scale(${view.scale}) rotateY(${view.rotate}deg)`}} src={imageSrc} alt={`Anteprima atleta ${gender}`} />
    {accessory !== 'Nessuno' ? <span className="interactive-accessory"><Sparkles size={11}/>{accessory}</span> : null}
    <span className="interactive-label">{label}</span>
    <button type="button" className="preview-reset" onPointerDown={e=>e.stopPropagation()} onClick={reset} aria-label="Reimposta vista"><RotateCcw size={14}/></button>
  </div>;
}

export function Experience() {
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<Mode>('splash');
  const [athleteGender, setAthleteGender] = useState<'donna' | 'uomo'>('donna');
  const [page, setPage] = useState<Page>('stanza');
  const [roomExplorer, setRoomExplorer] = useState(false);
  const [state, setState] = useState<Snapshot>(initialState);
  const [toast, setToast] = useState('');
  const [filter, setFilter] = useState('Tutte');
  const [selected, setSelected] = useState(0);
  const [game, setGame] = useState<'ready' | 'show' | 'guess' | 'won' | 'miss'>('ready');
  const [answers, setAnswers] = useState<string[]>([]);
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [zenMode, setZenMode] = useState<'Ascoltami' | 'Aiutami'>('Ascoltami');
  const [zenReply, setZenReply] = useState('');
  const [topic, setTopic] = useState('Allenamento');
  const [message, setMessage] = useState('');
  const [coachTab, setCoachTab] = useState('Percorso');
  const [coachReply, setCoachReply] = useState('');
  const [missionTitle, setMissionTitle] = useState('');
  const [missionBody, setMissionBody] = useState('');
  const [pendingFile, setPendingFile] = useState<{
    name: string;
    kind: string;
    previewUrl: string;
  } | null>(null);
  const [zenDone, setZenDone] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<'catalog' | 'sequenza'>('catalog');
  const [openMission, setOpenMission] = useState<string | null>(null);
  const [bgTarget, setBgTarget] = useState<BgSection>('stanza');
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [cosmeticTab, setCosmeticTab] = useState<'Capelli' | 'Carnagione' | 'Outfit' | 'Accessori'>(
    'Capelli',
  );
  const [builderTab, setBuilderTab] = useState('Volto');
  const [builderPreset, setBuilderPreset] = useState(0);
  const [onboardTab, setOnboardTab] = useState<OnboardTab>('OUTFIT');
  const [outfitChoice, setOutfitChoice] = useState('Base');
  const [outfitColor, setOutfitColor] = useState('#10151d');
  const [onboardAccessory, setOnboardAccessory] = useState('Nessuno');
  const [onboardEffect, setOnboardEffect] = useState('Nessuno');
  const fileRef = useRef<HTMLInputElement>(null);
  const bgFileRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const snapshot = loadSnapshot();
    setState(snapshot);
    setAthleteGender(snapshot.gender);
    setOutfitChoice(snapshot.outfitPiece);
    setOutfitColor(snapshot.outfitColor);
    setOnboardAccessory(snapshot.accessory);
    setOnboardEffect(snapshot.avatarEffect);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || mode === 'splash') return;
    saveSnapshot(state);
  }, [state, hydrated, mode]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const notify = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 3800);
  };

  const update = (fn: (s: Snapshot) => Snapshot) => setState(fn);
  const bg = (section: BgSection) => resolveBackground(section, state.bgOverrides);

  const go = (p: Page) => {
    setPage(p);
    setRoomExplorer(false);
    if (p === 'gioca') setActiveGame('catalog');
  };

  const enterSara = () => {
    update((s) => ({ ...s, gender: athleteGender, nickname: athleteGender === 'uomo' ? 'Alex' : 'Sara' }));
    setMode('create-athlete');
  };

  const openOnboardingCustomize = () => setMode('onboarding-customize');
  const finishOnboarding = () => {
    const look = femaleLookPresets[builderPreset % femaleLookPresets.length];
    update((s) => ({
      ...s,
      gender: athleteGender,
      nickname: athleteGender === 'uomo' ? 'Alex' : 'Sara',
      hair: athleteGender === 'donna' ? look.hair : s.hair,
      outfit: athleteGender === 'donna' ? look.outfit : s.outfit,
      outfitPiece: outfitChoice,
      outfitColor,
      accessory: onboardAccessory,
      avatarEffect: onboardEffect,
    }));
    setMode('sara');
    setPage('stanza');
  };

  const enterDavide = () => {
    setMode('davide');
    setPage('stanza');
    setCoachTab('Percorso');
  };

  const exitMode = () => {
    setMode('splash');
    setPage('stanza');
    setGame('ready');
    setAnswers([]);
  };

  const visibleTechs = useMemo(() => {
    return state.techniques
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => {
        if (filter === 'Nascoste') return t.hidden;
        if (t.hidden) return false;
        if (filter === 'Tutte') return true;
        if (filter === 'In studio') return t.status === 'In studio';
        if (filter === 'Acquisite') return t.status === 'Acquisita';
        if (filter === 'Convalidate') return t.validated;
        if (filter === 'Preferite') return t.favorite;
        if (filter === 'Salvate') return t.saved;
        return true;
      });
  }, [state.techniques, filter]);

  const changeTech = (index: number, patch: Partial<Snapshot['techniques'][number]>) => {
    update((s) => ({
      ...s,
      techniques: s.techniques.map((t, i) => (i === index ? { ...t, ...patch } : t)),
    }));
  };

  const startGame = () => {
    setAnswers([]);
    setShuffled([...gameSequence].sort(() => Math.random() - 0.5));
    setGame('show');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setGame('guess'), 3200);
  };

  const pickCard = (item: string) => {
    if (game !== 'guess') return;
    const next = [...answers, item];
    setAnswers(next);
    if (next.length === gameSequence.length) {
      const ok = next.every((x, i) => x === gameSequence[i]);
      if (ok) {
        setGame('won');
        update((s) => ({ ...s, xp: s.xp + 25, credits: s.credits + 10 }));
        notify('+25 XP · +10 crediti');
      } else {
        setGame('miss');
        notify('Non è ancora la sequenza giusta. Riprova senza penalità.');
      }
    }
  };

  const danger = (text: string) =>
    /suicid|autoles|farmi del male|uccidermi|non voglio vivere|pericolo immediato/i.test(text);

  const submitNote = () => {
    if (!note.trim()) return;
    if (danger(note)) {
      setZenReply(
        'Se sei in pericolo immediato, contatta subito una persona fidata o un adulto appropriato e i servizi di emergenza del tuo territorio (in Italia, 112). Non affrontarlo da sola.',
      );
      return;
    }
    update((s) => ({ ...s, notes: [note.trim(), ...s.notes] }));
    setNote('');
    setZenReply(
      zenMode === 'Ascoltami'
        ? 'Ti ho ascoltata senza interrompere. Vuoi lasciare questo pensiero qui oppure lavorarci insieme?'
        : 'Prova tre respiri lenti, un piccolo movimento delle spalle o un gesto di cura per la tua pianta. Scegli ciò che senti giusto.',
    );
  };

  const onFile = (file: File | null) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setPendingFile({ name: file.name, kind: file.type || 'file', previewUrl });
  };

  const sharePending = () => {
    if (!pendingFile) return;
    update((s) => ({
      ...s,
      media: [
        {
          id: uid(),
          name: pendingFile.name,
          kind: pendingFile.kind,
          previewUrl: pendingFile.previewUrl,
          shared: true,
          note: 'Anteprima locale: il file non è stato inviato',
        },
        ...s.media,
      ],
    }));
    setPendingFile(null);
    notify('Condivisione demo registrata. Anteprima locale: il file non è stato inviato.');
  };

  const sendToDavide = () => {
    if (!message.trim()) {
      notify('Scrivi un messaggio prima di inviarlo.');
      return;
    }
    update((s) => ({
      ...s,
      messages: [
        { id: uid(), from: 'sara', category: topic, text: message.trim(), at: 'Ora' },
        ...s.messages,
      ],
    }));
    setMessage('');
    notify('Richiesta salvata. Davide la vede nel pannello coach.');
  };

  const coachSend = () => {
    if (!coachReply.trim()) return;
    update((s) => ({
      ...s,
      messages: [
        { id: uid(), from: 'davide', category: 'Risposta', text: coachReply.trim(), at: 'Ora' },
        ...s.messages,
      ],
    }));
    setCoachReply('');
    notify('Risposta di Davide inviata a Sara.');
  };

  const assignMission = () => {
    if (!missionTitle.trim()) {
      notify('Scrivi un titolo missione.');
      return;
    }
    update((s) => ({
      ...s,
      missions: [
        {
          id: uid(),
          title: missionTitle.trim(),
          body: missionBody.trim() || 'Missione assegnata da Davide (demo).',
          progress: '0/1',
          xp: 30,
          credits: 10,
          assignedBy: 'Davide',
        },
        ...s.missions,
      ],
    }));
    setMissionTitle('');
    setMissionBody('');
    notify('Missione assegnata a Sara.');
  };

  const applyBgOverride = async (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) {
      notify('Seleziona un’immagine valida.');
      return;
    }
    try {
      setBgPreview(await fileToDataUrl(file));
    } catch {
      notify('Impossibile leggere il file.');
    }
  };

  const saveBgOverride = () => {
    if (!bgPreview) return;
    update((s) => ({
      ...s,
      bgOverrides: { ...s.bgOverrides, [bgTarget]: bgPreview },
    }));
    setBgPreview(null);
    notify(
      'Sfondo aggiornato in prova locale sul dispositivo. Non è un salvataggio sul server.',
    );
  };

  const restoreDefaultBg = () => {
    update((s) => {
      const next = { ...s.bgOverrides };
      delete next[bgTarget];
      return { ...s, bgOverrides: next };
    });
    setBgPreview(null);
    setConfirmRemove(false);
    notify('Ripristinato lo sfondo di base per questa sezione.');
  };

  const removeOverride = () => {
    if (!state.bgOverrides[bgTarget]) {
      notify('Nessun override attivo: è già lo sfondo di base.');
      setConfirmRemove(false);
      return;
    }
    restoreDefaultBg();
  };

  const isCosmeticUnlocked = (id: string, free: boolean) =>
    free || state.unlockedCosmetics.includes(id);

  const tech = state.techniques[selected] ?? state.techniques[0];
  const sectionBgKey = pageToBg[page] || 'stanza';
  const currentPageBg = bg(sectionBgKey);
  const selectedFemaleLook = femaleLookPresets[builderPreset % femaleLookPresets.length];
  const onboardingAthleteImage =
    athleteGender === 'uomo' ? '/art/splash-athlete-man.png' : selectedFemaleLook.src;

  const Toast = () =>
    toast ? (
      <div className="toast" role="status">
        <Check size={16} />
        {toast}
        <button type="button" aria-label="Chiudi" onClick={() => setToast('')}>
          <X size={15} />
        </button>
      </div>
    ) : null;

  if (!hydrated) {
    return <div className="loading-screen">Prepariamo la tua stanza…</div>;
  }

  /* ——— SPLASH ——— */
  if (mode === 'splash') {
    return (
      <main className="splash">
        <div className="splash-art" style={{ backgroundImage: `url('${bg('splash')}')` }} aria-hidden />
        <img className="splash-athlete" src={athleteGender === 'uomo' ? '/art/splash-athlete-man.png' : '/art/splash-athlete.png'} alt="" aria-hidden="true" />
        <div className="splash-particles" aria-hidden />
        <div className="splash-masthead rise">
          <div className="splash-wordmark"><span>FREESTYLE</span><strong>ACADEMY</strong></div>
          <p>CORPO · MENTE · MOVIMENTO · CONSAPEVOLEZZA</p>
        </div>
        <div className="splash-content rise">
          <div className="btn-stack">
            <button type="button" className="btn-gold" onClick={enterSara}>INIZIA IL TUO VIAGGIO</button>
            <button type="button" className="btn-primary" onClick={enterSara}>ACCEDI</button>
            <button type="button" className="btn-primary splash-register" onClick={enterSara}>REGISTRATI</button>
          </div>
          <button type="button" className="coach-entry" onClick={enterDavide}>ACCESSO COACH · DAVIDE</button>
          <div className="splash-brands" aria-label="I marchi del progetto">
            <span><img src="/art/freestyle-academy-logo-transparent.png" alt="Freestyle Academy" /></span>
            <span><img src="/art/dynamic-zen-logo.png" alt="Dynamic Zen" /></span>
          </div>
          <p className="splash-note">Prova visiva · l’avatar 3D è in preparazione</p>
        </div>
      </main>
    );
  }


  if (mode === 'create-athlete') {
    return (
      <main className="onboard-screen">
        <div className="onboard-bg" style={{ backgroundImage: `url('${bg('avatar')}')` }} aria-hidden />
        <div className="onboard-veil" aria-hidden />
        <header className="onboard-header fa-safe">
          <button className="round-back" type="button" onClick={() => setMode('splash')}><ArrowLeft size={20}/></button>
          <div><h1>CREA IL TUO ATLETA</h1><p>Scegli il tuo stile, esprimi la tua energia</p></div>
        </header>
        <div className="gender-cards fa-safe">
          <button className={athleteGender === 'donna' ? 'on' : ''} onClick={() => { setAthleteGender('donna'); setBuilderPreset(0); update((s) => ({ ...s, gender: 'donna', nickname: 'Sara' })); }}>♀ <span>RAGAZZA</span></button>
          <button className={athleteGender === 'uomo' ? 'on' : ''} onClick={() => { setAthleteGender('uomo'); setBuilderPreset(0); update((s) => ({ ...s, gender: 'uomo', nickname: 'Alex' })); }}>♂ <span>RAGAZZO</span></button>
        </div>
        <section className="athlete-builder fa-safe">
          <nav className="builder-menu" aria-label="Categorie avatar">
            {['Volto','Capelli','Skin','Outfit','Accessori','Colori','Effetti'].map((x)=><button type="button" key={x} className={builderTab===x?'on':''} onClick={()=>setBuilderTab(x)}>{x}</button>)}
          </nav>
          <InteractiveAthletePreview
            gender={athleteGender}
            imageSrc={onboardingAthleteImage}
            label={`${builderTab.toUpperCase()} · PROVA 2D`}
            accessory={onboardAccessory}
            effect={onboardEffect}
          />
          <div className="builder-thumbs" aria-label="Preset visivi">
            {(athleteGender === 'uomo' ? [{ src: '/art/splash-athlete-man.png', label: 'Base uomo' }] : femaleLookPresets).map((look, i)=><button type="button" key={look.label} aria-label={`Aspetto ${look.label}`} className={i===builderPreset?'on':''} onClick={()=>setBuilderPreset(i)}><img src={look.src} alt=""/></button>)}
          </div>
        </section>
        <div className="onboard-bottom fa-safe"><button className="btn-gold" onClick={openOnboardingCustomize}>AVANTI</button><small>Il modello 3D artistico non è ancora integrato: questa è una prova visiva 2D.</small></div>
      </main>
    );
  }

  if (mode === 'onboarding-customize') {
    return (
      <main className="onboard-screen customize-screen">
        <div className="onboard-bg" style={{ backgroundImage: `url('${bg('avatar')}')` }} aria-hidden />
        <div className="onboard-veil" aria-hidden />
        <header className="onboard-header fa-safe">
          <button className="round-back" type="button" onClick={() => setMode('create-athlete')}><ArrowLeft size={20}/></button>
          <div><h1>PERSONALIZZAZIONE</h1><p>Crea un look che ti rappresenta</p></div>
        </header>
        <div className="custom-tabs fa-safe">{(['OUTFIT','CAPELLI','ACCESSORI','EFFETTI'] as const).map((x)=><button type="button" className={onboardTab===x?'on':''} key={x} onClick={()=>{ setOnboardTab(x); if (x === 'CAPELLI' && athleteGender === 'donna' && builderPreset > 2) setBuilderPreset(0); }}>{x}</button>)}</div>
        <section className="custom-layout fa-safe">
          <InteractiveAthletePreview
            gender={athleteGender}
            imageSrc={onboardingAthleteImage}
            label="TRASCINA · PIZZICA · SPOSTA"
            accessory={onboardAccessory}
            effect={onboardEffect}
            compact
          />
          <div className="outfit-panel">
            {onboardTab === 'OUTFIT' ? <>
              <div className="outfit-grid">{['Base','Top','Felpa','Pantaloni','Leggings','Scarpe'].map((x,i)=><button type="button" key={x} className={outfitChoice===x?'on':''} onClick={()=>setOutfitChoice(x)}><span>{i<2?'◆':'▣'}</span><small>{x}</small></button>)}</div>
              <div className="swatches">{['#10151d','#a84238','#7c398f','#3185c7','#d9c7b0','#e18c9d'].map(c=><button type="button" key={c} className={outfitColor===c?'on':''} style={{background:c}} aria-label={`Colore ${c}`} onClick={()=>setOutfitColor(c)} />)}</div>
              <div className="choice-readout"><span>OUTFIT</span><strong>{outfitChoice}</strong><i style={{background:outfitColor}} /></div>
            </> : null}
            {onboardTab === 'CAPELLI' ? <>
              <p className="panel-note">Scegli l'acconciatura. L'anteprima usa le immagini disponibili.</p>
              <div className="outfit-grid option-grid">{(athleteGender === 'uomo' ? [{ src: '/art/splash-athlete-man.png', label: 'Base uomo' }] : femaleLookPresets.slice(0,3)).map((look,i)=><button type="button" key={look.label} className={builderPreset===i?'on':''} onClick={()=>setBuilderPreset(i)}><img src={look.src} alt=""/><small>{look.label}</small></button>)}</div>
              <div className="choice-readout"><span>CAPELLI</span><strong>{athleteGender === 'uomo' ? 'Base uomo' : selectedFemaleLook.hair}</strong></div>
            </> : null}
            {onboardTab === 'ACCESSORI' ? <>
              <p className="panel-note">Selezione salvata. Il modello grafico dell'accessorio arriverà con gli asset 3D.</p>
              <div className="outfit-grid">{avatarOptions.accessory.filter((item)=>item.free).map((item)=><button type="button" key={item.id} className={onboardAccessory===item.label?'on':''} onClick={()=>setOnboardAccessory(item.label)}><span className="choice-symbol">{item.label === 'Nessuno' ? '—' : '✦'}</span><small>{item.label}</small></button>)}</div>
              <div className="choice-readout"><span>ACCESSORIO</span><strong>{onboardAccessory}</strong></div>
            </> : null}
            {onboardTab === 'EFFETTI' ? <>
              <p className="panel-note">Aggiungi un'aura luminosa visibile subito nell'anteprima.</p>
              <div className="outfit-grid effect-grid">{onboardingEffects.map((item)=><button type="button" key={item.id} className={onboardEffect===item.label?'on':''} onClick={()=>setOnboardEffect(item.label)}><span className="effect-dot" style={{background:item.tone}}/><small>{item.label}</small></button>)}</div>
              <div className="choice-readout"><span>EFFETTO</span><strong>{onboardEffect}</strong></div>
            </> : null}
          </div>
        </section>
        <div className="look-strip fa-safe">{(athleteGender === 'uomo' ? [{ src: '/art/splash-athlete-man.png', label: 'Base uomo' }] : femaleLookPresets).map((look,i)=><button type="button" key={look.label} aria-label={`Look ${look.label}`} className={i===builderPreset?'on':''} onClick={()=>setBuilderPreset(i)}><img src={look.src} alt=""/></button>)}</div>
        <div className="onboard-bottom fa-safe"><button className="btn-gold" onClick={finishOnboarding}>EQUIPAGGIA</button><small>Outfit e colori sono dimostrativi finché non saranno disponibili asset 3D reali.</small></div>
      </main>
    );
  }

  /* ——— COACH ——— */
  if (mode === 'davide') {
    return (
      <div className="fa-app">
        <div className="scene-bg" style={{ backgroundImage: `url('${bg('coach')}')` }} aria-hidden />
        <div className="scene-veil heavy" aria-hidden />
        <header className="topbar fa-safe">
          <div className="hud-profile">
            <span className="mode-chip">COACH</span>
            <div className="hud-meta">
              <strong>Davide</strong>
              <small>PANNELLO DEMO</small>
            </div>
          </div>
          <div className="stat-pills">
            <button type="button" className="btn-soft" style={{ minHeight: 34 }} onClick={enterSara}>
              Vista Sara
            </button>
            <button type="button" className="btn-ghost" style={{ minHeight: 34, padding: '6px 10px' }} onClick={exitMode}>
              Esci
            </button>
          </div>
        </header>
        <div className="page-scroll rise">
          <div className="panel" style={{ marginBottom: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
            <AvatarFigure
              hair={state.hair}
              skin={state.skin}
              outfit={state.outfit}
              accessory={state.accessory}
              size="sm"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className="eyebrow">ATLETA</span>
              <strong style={{ fontSize: 15 }}>{state.nickname}</strong>
              <div className="muted" style={{ fontSize: 11 }}>
                {state.levelLabel} · {state.xp} XP · {state.credits} crediti
              </div>
            </div>
          </div>

          <div className="coach-tabs">
            {['Percorso', 'Repertorio', 'Missioni', 'Richieste', 'Media', 'Coreografie', 'Premi', 'Immagini'].map(
              (t) => (
                <button
                  key={t}
                  type="button"
                  className={coachTab === t ? 'on' : ''}
                  onClick={() => setCoachTab(t)}
                >
                  {t}
                </button>
              ),
            )}
          </div>

          {coachTab === 'Percorso' && (
            <div className="stack">
              {paths.map((p, i) => (
                <div className="path-item" key={p.title}>
                  <span className="path-num">0{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <span className="tag">{p.concept}</span>
                    <h3 style={{ margin: '4px 0' }}>{p.title}</h3>
                    <p className="muted" style={{ fontSize: 11 }}>
                      {p.items}
                    </p>
                  </div>
                  {p.open ? <span className="path-open">IN CORSO</span> : <span className="path-lock"><LockKeyhole size={16} /></span>}
                </div>
              ))}
            </div>
          )}

          {coachTab === 'Repertorio' && (
            <div className="stack">
              {state.techniques.map((t, i) => (
                <div className="panel" key={t.id}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                    <span className="tag">{t.status}</span>
                    {t.validated && <span className="tag ok">Convalidata</span>}
                  </div>
                  <strong>{t.name}</strong>
                  <p className="muted" style={{ fontSize: 11, marginTop: 4 }}>
                    {t.category} · {t.level}
                  </p>
                  <div className="action-row">
                    <button
                      type="button"
                      className="chip-btn"
                      onClick={() => {
                        changeTech(i, { validated: true, status: 'Acquisita' });
                        notify(`${t.name} convalidata. Sara lo vedrà nel repertorio.`);
                      }}
                    >
                      Convalida
                    </button>
                    <button
                      type="button"
                      className="chip-btn"
                      onClick={() => {
                        changeTech(i, { status: 'In consolidamento' });
                        notify('Stato: In consolidamento.');
                      }}
                    >
                      Consolidamento
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {coachTab === 'Missioni' && (
            <div className="stack">
              <div className="panel">
                <h2>Assegna missione</h2>
                <label className="field">
                  Titolo
                  <input value={missionTitle} onChange={(e) => setMissionTitle(e.target.value)} placeholder="Es. Fluidità" />
                </label>
                <label className="field">
                  Descrizione
                  <textarea value={missionBody} onChange={(e) => setMissionBody(e.target.value)} rows={2} />
                </label>
                <button type="button" className="btn-gold" onClick={assignMission}>
                  Assegna a Sara
                </button>
              </div>
              {state.missions.map((m) => (
                <div className="mission-row" key={m.id} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <span className="tag">DA {m.assignedBy.toUpperCase()}</span>
                  <strong style={{ marginTop: 6 }}>{m.title}</strong>
                  <p className="muted" style={{ fontSize: 11, marginTop: 4 }}>
                    {m.body}
                  </p>
                  <div className="mission-rewards">
                    <span>+{m.xp} XP</span>
                    <span className="cr">+{m.credits} cr</span>
                    <span>{m.progress}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {coachTab === 'Richieste' && (
            <div className="panel">
              <h2>Inbox con Sara</h2>
              <p className="muted" style={{ marginBottom: 8 }}>
                Diario privato non visibile. Risposte etichettate «RISPOSTA DI DAVIDE».
              </p>
              {state.messages.map((m) => (
                <div key={m.id} className={`bubble ${m.from === 'davide' ? 'davide' : m.from === 'auto' ? 'auto' : ''}`}>
                  <small>
                    {m.from === 'davide'
                      ? 'RISPOSTA DI DAVIDE'
                      : m.from === 'auto'
                        ? 'AUTO · NON È DAVIDE'
                        : `SARA · ${m.category}`}{' '}
                    · {m.at}
                  </small>
                  <p>{m.text}</p>
                </div>
              ))}
              <label className="field">
                Rispondi
                <textarea value={coachReply} onChange={(e) => setCoachReply(e.target.value)} rows={2} />
              </label>
              <button type="button" className="btn-gold" onClick={coachSend}>
                Invia <Send size={14} />
              </button>
            </div>
          )}

          {coachTab === 'Media' && (
            <div className="panel">
              <h2>Media condivisi</h2>
              <p className="muted" style={{ marginBottom: 8 }}>
                Solo file che Sara ha scelto di condividere.
              </p>
              {state.media.filter((m) => m.shared).length === 0 && <p className="muted">Nessun file.</p>}
              {state.media
                .filter((m) => m.shared)
                .map((m) => (
                  <div className="preview-file" key={m.id}>
                    <strong>{m.name}</strong>
                    <div className="muted">{m.note}</div>
                    {m.kind.startsWith('image/') && <img src={m.previewUrl} alt="" />}
                  </div>
                ))}
            </div>
          )}

          {coachTab === 'Coreografie' && (
            <div className="panel">
              <h2>{state.showTitle}</h2>
              <p className="muted">{state.story || 'Nessuna storia.'}</p>
              <div className="timeline">
                {state.timeline.map((x, i) => (
                  <div className="tl-step" key={`${x}-${i}`}>
                    <small>0{i + 1}</small>
                    <strong>{x}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {coachTab === 'Premi' && (
            <div className="panel">
              <h2>Riscatti</h2>
              <p className="muted">Crediti Sara: {state.credits}</p>
              {state.rewards.length === 0 && <p className="muted">Nessun riscatto.</p>}
              {state.rewards.map((r, i) => (
                <div className="coach-row" key={i}>
                  <div>
                    <strong style={{ fontSize: 13 }}>{r}</strong>
                  </div>
                  <button type="button" className="chip-btn" onClick={() => notify('Riscatto convalidato (demo).')}>
                    Convalida
                  </button>
                </div>
              ))}
            </div>
          )}

          {coachTab === 'Immagini' && (
            <div className="panel">
              <span className="tag">IMMAGINI DELL&apos;APP</span>
              <h2>Sfondi sezioni</h2>
              <p className="demo-banner" style={{ marginTop: 8 }}>
                Prova locale: le immagini restano in questo browser. Nessun upload sul server.
              </p>
              <label className="field">
                Sezione
                <select
                  value={bgTarget}
                  onChange={(e) => {
                    setBgTarget(e.target.value as BgSection);
                    setBgPreview(null);
                    setConfirmRemove(false);
                  }}
                >
                  {bgSections.map((k) => (
                    <option key={k} value={k}>
                      {BG_SECTION_LABELS[k]}
                    </option>
                  ))}
                </select>
              </label>
              <div className="bg-manage-grid">
                <div className="bg-thumb-card">
                  <span className="eyebrow">BASE</span>
                  <img src={DEFAULT_BACKGROUNDS[bgTarget]} alt="" className="bg-thumb" />
                  <button type="button" className="chip-btn" onClick={restoreDefaultBg}>
                    <RotateCcw size={12} /> Base
                  </button>
                </div>
                <div className="bg-thumb-card">
                  <span className="eyebrow">ATTUALE</span>
                  <img src={bg(bgTarget)} alt="" className="bg-thumb" />
                  {state.bgOverrides[bgTarget] ? <span className="tag teal">Override</span> : <span className="tag">Base</span>}
                </div>
              </div>
              <input ref={bgFileRef} type="file" accept="image/*" hidden onChange={(e) => applyBgOverride(e.target.files?.[0] ?? null)} />
              <button type="button" className="btn-gold" style={{ width: '100%', marginTop: 10 }} onClick={() => bgFileRef.current?.click()}>
                <Upload size={14} /> Carica
              </button>
              {bgPreview && (
                <div className="preview-file">
                  <img src={bgPreview} alt="" />
                  <div className="action-row">
                    <button type="button" className="btn-gold" onClick={saveBgOverride}>
                      Associa
                    </button>
                    <button type="button" className="btn-ghost" onClick={() => setBgPreview(null)}>
                      Annulla
                    </button>
                  </div>
                </div>
              )}
              <div className="action-row" style={{ marginTop: 8 }}>
                {!confirmRemove ? (
                  <button type="button" className="chip-btn" onClick={() => setConfirmRemove(true)} disabled={!state.bgOverrides[bgTarget]}>
                    <Trash2 size={12} /> Rimuovi override
                  </button>
                ) : (
                  <>
                    <button type="button" className="btn-gold" onClick={removeOverride}>
                      Conferma
                    </button>
                    <button type="button" className="btn-ghost" onClick={() => setConfirmRemove(false)}>
                      Annulla
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <Toast />
      </div>
    );
  }

  /* ——— SARA ——— */
  const showNav = true;

  return (
    <div className="fa-app">
      <div className="scene-bg" style={{ backgroundImage: `url('${currentPageBg}')` }} aria-hidden />
      <div className={`scene-veil${page === 'stanza' ? '' : ' heavy'}`} aria-hidden />

      <header className={`topbar fa-safe ${page === 'stanza' ? 'room-topbar' : ''}`}>
        <button type="button" className="hud-profile" onClick={() => go('personalizza')} aria-label="Apri il profilo di Sara">
          <span className="portrait-medallion"><img src={athleteGender === 'uomo' ? '/art/splash-athlete-man.png' : '/art/sara-portrait.png'} alt="" /></span>
          <div className="hud-meta">
            <strong>{state.nickname.toUpperCase()}</strong>
            <small>{state.levelLabel}</small>
            {page === 'stanza' && <><span className="hud-xp-rail"><span style={{ width: `${Math.min(100, state.xp % 100)}%` }} /></span><span className="hud-xp-number">{state.xp} XP</span></>}
          </div>
        </button>
        <div className="stat-pills">
          {page !== 'stanza' && <span className="pill"><Star size={12} /> {state.xp}</span>}
          <span className="pill teal"><Coins size={15} /> {state.credits}</span>
          <button type="button" className="room-settings" onClick={exitMode} aria-label="Cambia modalità" title="Cambia modalità">⚙</button>
        </div>
      </header>

      {page === 'stanza' ? (
        <main className="stanza-stage room-stage" aria-label="La stanza interattiva di Sara">
          <div className="room-intro"><span>IL TUO MONDO</span><h1>Scegli dove entrare</h1></div>
          <div className="room-hotspots" aria-label="Luoghi interattivi della stanza">
            <button type="button" className="room-marker room-marker-silks" onClick={() => go('allenati')}><span className="marker-icon"><Dumbbell size={17} /></span> TESSUTI AEREI</button>
            <button type="button" className="room-marker room-marker-book" onClick={() => go('repertorio')}><span className="marker-icon"><BookOpen size={17} /></span> Repertorio</button>
            <button type="button" className="room-marker room-marker-zen" onClick={() => go('zen')}><span className="marker-icon"><Flower2 size={17} /></span> DYNAMIC ZEN</button>
            <button type="button" className="room-marker room-marker-plant" onClick={() => { update((s) => ({ ...s, plant: s.plant + 1, xp: s.xp + 2 })); notify('La pianta è cresciuta. +2 XP'); }}><span className="marker-icon"><Leaf size={17} /></span> La tua pianta</button>
          </div>
          <div className="room-footer">
            <div className="room-progress"><div className="room-progress-heading"><span>PERCORSO BASE · CONOSCO</span><strong>{state.xp % 100}/100 XP</strong></div><div className="room-progress-track"><span style={{ width: `${state.xp % 100}%` }} /></div></div>
            <div className="room-actions"><button type="button" className="room-action-primary" onClick={() => setRoomExplorer(true)}><Sparkles size={18} /> Esplora la base</button><button type="button" className="room-action-secondary" onClick={() => go('davide-chat')}><MessageCircle size={18} /> Chiedi a Davide</button></div>

          </div>
          {roomExplorer && <div className="room-explorer-backdrop" role="presentation" onClick={() => setRoomExplorer(false)}>
            <section className="room-explorer" role="dialog" aria-modal="true" aria-label="Esplora la base" onClick={(e) => e.stopPropagation()}>
              <div className="room-explorer-heading"><div><span className="eyebrow">ESPLORA LA BASE</span><h2>Scegli il tuo prossimo passo</h2></div><button type="button" onClick={() => setRoomExplorer(false)} aria-label="Chiudi"><X size={19} /></button></div>
              <div className="room-explorer-grid">
                {([['missioni','Missioni',Star],['gioca','Gioca',Gamepad2],['diario','Diario',NotebookPen],['crea','Crea spettacolo',Clapperboard],['percorso','Percorso',Trophy],['premi','Premi',Sparkles],['anatomia','Anatomia',Bone],['personalizza','Avatar',Palette]] as const).map(([destination,label,Icon]) => <button type="button" key={destination} onClick={() => go(destination)}><Icon size={22} /><span>{label}</span><ChevronRight size={14} /></button>)}
              </div>
            </section>
          </div>}
        </main>
      ) : (
        <div className={`page-scroll rise has-nav ${page === 'personalizza' ? '' : 'has-fab'}`}>
          <button type="button" className="back-btn" onClick={() => go('stanza')}>
            <ArrowLeft size={14} /> Stanza
          </button>
          <div style={{ marginBottom: 8 }}>
            <span className="eyebrow">{titles[page].eye}</span>
            <h1 style={{ margin: 0, fontSize: 22, letterSpacing: '-0.03em', fontWeight: 800 }}>{titles[page].h}</h1>
          </div>

          {page === 'repertorio' && (
            <>
              <p className="demo-banner">Figure demo · contenuti da validare in palestra.</p>
              <div className="metric-row">
                {[
                  ['OK', state.techniques.filter((t) => t.status === 'Acquisita').length],
                  ['✓', state.techniques.filter((t) => t.validated).length],
                  ['Studio', state.techniques.filter((t) => t.status === 'In studio').length],
                  ['♥', state.techniques.filter((t) => t.favorite).length],
                ].map(([l, n]) => (
                  <div className="metric" key={l as string}>
                    <strong>{n}</strong>
                    <small>{l}</small>
                  </div>
                ))}
              </div>
              <div className="chips">
                {['Tutte', 'In studio', 'Acquisite', 'Convalidate', 'Preferite', 'Salvate', 'Nascoste'].map((f) => (
                  <button key={f} type="button" className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>
                    {f}
                  </button>
                ))}
              </div>
              <div className="tech-list">
                {visibleTechs.map(({ t, i }) => (
                  <button key={t.id} type="button" className={`tech-item ${selected === i ? 'on' : ''}`} onClick={() => setSelected(i)}>
                    <span className="tech-glyph">✦</span>
                    <span style={{ flex: 1 }}>
                      <strong>{t.name}</strong>
                      <small>
                        {t.category} · {t.status}
                        {t.validated ? ' · ✓ Davide' : ''}
                      </small>
                    </span>
                    <ChevronRight size={14} />
                  </button>
                ))}
              </div>
              {tech && (
                <div className="panel">
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                    <span className="tag">{tech.level}</span>
                    <span className="tag teal">{tech.category}</span>
                    {tech.validated && <span className="tag ok">✓ Convalidata</span>}
                  </div>
                  <h2>{tech.name}</h2>
                  <p className="muted" style={{ marginTop: 4 }}>
                    Nessuna istruzione tecnica automatica. Contenuto da validare.
                  </p>
                  <label className="field">
                    Stato
                    <select
                      value={tech.status}
                      onChange={(e) => {
                        changeTech(selected, { status: e.target.value as TechStatus });
                        notify(`Stato: ${e.target.value}`);
                      }}
                    >
                      {(['Da imparare', 'In studio', 'Acquisita', 'In consolidamento'] as TechStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="action-row">
                    <button type="button" className={`chip-btn ${tech.favorite ? 'on' : ''}`} onClick={() => changeTech(selected, { favorite: !tech.favorite })}>
                      <Heart size={12} fill={tech.favorite ? 'currentColor' : 'none'} /> Preferita
                    </button>
                    <button type="button" className={`chip-btn ${tech.saved ? 'on' : ''}`} onClick={() => changeTech(selected, { saved: !tech.saved })}>
                      {tech.saved ? 'Salvata' : 'Salva'}
                    </button>
                    <button
                      type="button"
                      className={`chip-btn ${tech.hidden ? 'on' : ''}`}
                      onClick={() => {
                        changeTech(selected, { hidden: !tech.hidden });
                        notify(tech.hidden ? 'Visibile.' : 'Nascosta.');
                      }}
                    >
                      {tech.hidden ? 'Mostra' : 'Nascondi'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {page === 'anatomia' && (
            <div className="panel">
              <span className="tag">DA VALIDARE</span>
              <h2>Materiali verificati</h2>
              <p style={{ marginTop: 8 }}>
                Nessuno schema anatomico generato. Solo contenuti verificati da Davide.
              </p>
              <div className="anatomy-slots">
                {['Vista generale', 'Articolazioni', 'Respiro e postura'].map((slot) => (
                  <div className="anatomy-slot" key={slot}>
                    <ImageIcon size={18} color="#e9a95b" />
                    <strong>{slot}</strong>
                    <small className="muted">In attesa</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {page === 'gioca' && (
            <>
              {activeGame === 'catalog' && (
                <div className="stack">
                  {gamesCatalog.map((g) => (
                    <div className="game-cat-card" key={g.id}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                          {g.playable && g.unlocked ? <span className="tag ok">Giocabile</span> : <span className="tag">In arrivo</span>}
                        </div>
                        <h3>{g.title}</h3>
                        <p className="muted" style={{ fontSize: 11 }}>
                          {g.detail}
                        </p>
                        {!g.playable && (
                          <p style={{ marginTop: 4, fontSize: 10, color: '#d4b48a' }}>
                            <LockKeyhole size={10} style={{ display: 'inline' }} /> {g.unlock}
                          </p>
                        )}
                      </div>
                      {g.playable && g.unlocked ? (
                        <button
                          type="button"
                          className="btn-gold"
                          style={{ minHeight: 40, flex: 'none', padding: '8px 12px' }}
                          onClick={() => {
                            setActiveGame('sequenza');
                            setGame('ready');
                            setAnswers([]);
                          }}
                        >
                          <Play size={14} />
                        </button>
                      ) : (
                        <LockKeyhole size={16} color="#708292" />
                      )}
                    </div>
                  ))}
                </div>
              )}
              {activeGame === 'sequenza' && (
                <>
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => {
                      setActiveGame('catalog');
                      setGame('ready');
                    }}
                  >
                    <ArrowLeft size={14} /> Catalogo
                  </button>
                  <div className="game-stage">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="tag">SEQUENZA MISTERIOSA</span>
                      <span className="muted" style={{ fontSize: 10, fontWeight: 800 }}>
                        +25 XP · +10 cr
                      </span>
                    </div>
                    {game === 'ready' && (
                      <>
                        <p className="muted" style={{ margin: '10px 0' }}>
                          Memorizza l&apos;ordine, poi ricostruisci. Nessuna penalità.
                        </p>
                        <button type="button" className="btn-gold" onClick={startGame}>
                          Inizia <Play size={14} />
                        </button>
                      </>
                    )}
                    {game === 'show' && (
                      <>
                        <p className="muted" style={{ margin: '8px 0' }}>
                          Memorizza…
                        </p>
                        <div className="card-row">
                          {gameSequence.map((x, i) => (
                            <div className="mem-card" key={x}>
                              <small>0{i + 1}</small>
                              <strong>{x}</strong>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {(game === 'guess' || game === 'miss') && (
                      <>
                        <div className="slot-row" style={{ marginTop: 10 }}>
                          {gameSequence.map((_, i) => (
                            <div key={i} className={`slot ${answers[i] ? 'filled' : ''}`}>
                              {answers[i] || `0${i + 1}`}
                            </div>
                          ))}
                        </div>
                        <div className="choice-grid">
                          {shuffled
                            .filter((x) => !answers.includes(x))
                            .map((x) => (
                              <button key={x} type="button" onClick={() => pickCard(x)}>
                                {x}
                              </button>
                            ))}
                        </div>
                        {game === 'miss' && (
                          <button type="button" className="btn-gold" style={{ width: '100%', marginTop: 10 }} onClick={startGame}>
                            Riprova
                          </button>
                        )}
                      </>
                    )}
                    {game === 'won' && (
                      <div className="win-box">
                        <Sparkles size={28} />
                        <h3>Sequenza ok!</h3>
                        <p>+25 XP · +10 crediti</p>
                        <button
                          type="button"
                          className="btn-gold"
                          onClick={() => {
                            setGame('ready');
                            setAnswers([]);
                          }}
                        >
                          Ancora
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {page === 'missioni' && (
            <>
              <div className="chips">
                {['Giornaliere', 'Settimanali', 'Speciali'].map((c, i) => (
                  <button key={c} type="button" className={i === 0 ? 'on' : ''}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="stack">
                {state.missions.map((m) => (
                  <div key={m.id}>
                    <button type="button" className="mission-row" onClick={() => setOpenMission(openMission === m.id ? null : m.id)}>
                      <span className="mi">
                        <Star size={16} />
                      </span>
                      <span style={{ flex: 1 }}>
                        <strong>{m.title}</strong>
                        <small>
                          {m.progress} · da {m.assignedBy}
                        </small>
                        <span className="mission-rewards">
                          <span>+{m.xp} XP</span>
                          <span className="cr">+{m.credits} cr</span>
                        </span>
                      </span>
                      <ChevronRight size={14} />
                    </button>
                    {openMission === m.id && (
                      <div className="panel" style={{ marginTop: 6 }}>
                        <p>{m.body}</p>
                        <div className="divider" />
                        <span className="eyebrow">PROVA / MEDIA</span>
                        <input ref={fileRef} type="file" accept="image/*,video/*" hidden onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
                        <button type="button" className="btn-gold" style={{ width: '100%', marginTop: 8 }} onClick={() => fileRef.current?.click()}>
                          <ImagePlus size={14} /> Foto o video
                        </button>
                        {pendingFile && (
                          <div className="preview-file">
                            <strong>{pendingFile.name}</strong>
                            {pendingFile.kind.startsWith('image/') && <img src={pendingFile.previewUrl} alt="" />}
                            {pendingFile.kind.startsWith('video/') && (
                              <video src={pendingFile.previewUrl} controls style={{ width: '100%', marginTop: 6, borderRadius: 8 }} />
                            )}
                            <p className="muted" style={{ marginTop: 6 }}>
                              Anteprima locale: il file non è stato inviato
                            </p>
                            <div className="action-row">
                              <button type="button" className="btn-gold" onClick={sharePending}>
                                Condividi con Davide
                              </button>
                              <button type="button" className="btn-ghost" onClick={() => setPendingFile(null)}>
                                Annulla
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {page === 'zen' && (
            <>
              <p className="demo-banner">Non è un servizio sanitario. Nessuna diagnosi.</p>
              <div className="plant-mini" style={{ marginBottom: 8 }}>
                <div className="plant-orb">
                  <Leaf size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: 13 }}>Pianta · cura {state.plant}</strong>
                  <p className="muted" style={{ fontSize: 11 }}>
                    Non muore se ti assenti
                  </p>
                </div>
              </div>
              <div className="zen-grid">
                {zenActivities.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    className="zen-card"
                    onClick={() => {
                      setZenDone(z.id);
                      if (z.id === 'z5') {
                        update((s) => ({ ...s, plant: s.plant + 1, xp: s.xp + 3 }));
                        notify('Pianta curata. +3 XP');
                      } else {
                        update((s) => ({ ...s, xp: s.xp + 3 }));
                        notify(`${z.title} · +3 XP`);
                      }
                    }}
                  >
                    <span className="tag violet">{z.tag}</span>
                    <strong>{z.title}</strong>
                    <p className="muted">{z.detail}</p>
                    {zenDone === z.id && (
                      <span className="tag ok" style={{ marginTop: 6 }}>
                        Completata
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <button type="button" className="btn-primary" style={{ width: '100%', marginTop: 10 }} onClick={() => go('diario')}>
                Diario privato <NotebookPen size={14} />
              </button>
            </>
          )}

          {page === 'diario' && (
            <>
              <p className="demo-banner">Privato. Davide non legge salvo tua condivisione.</p>
              <div className="panel">
                <div className="chips">
                  <button type="button" className={zenMode === 'Ascoltami' ? 'on' : ''} onClick={() => setZenMode('Ascoltami')}>
                    Ascoltami
                  </button>
                  <button type="button" className={zenMode === 'Aiutami' ? 'on' : ''} onClick={() => setZenMode('Aiutami')}>
                    Aiutami
                  </button>
                </div>
                <label className="field">
                  Scrivi
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Come ti senti?" rows={3} />
                </label>
                <div className="action-row">
                  <button type="button" className="btn-gold" onClick={submitNote}>
                    Salva
                  </button>
                  <button type="button" className="chip-btn" onClick={() => notify('Parla · Anteprima futura')}>
                    <Mic size={12} /> Parla
                  </button>
                  <button type="button" className="chip-btn" onClick={() => notify('Video · Anteprima futura')}>
                    <Video size={12} /> Video
                  </button>
                </div>
                {zenReply && (
                  <div className="bubble" style={{ marginTop: 8 }}>
                    <small>DYNAMIC ZEN</small>
                    <p>{zenReply}</p>
                  </div>
                )}
              </div>
              <div className="panel" style={{ marginTop: 8 }}>
                <h3>Solo per te</h3>
                {state.notes.length === 0 && <p className="muted">Nessuna nota.</p>}
                {state.notes.map((n, i) => (
                  <div className="note-entry" key={i}>
                    <span>NOTA</span>
                    <p className="muted">{n}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {page === 'davide-chat' && (
            <>
              <div className="panel">
                <label className="field">
                  Categoria
                  <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                    {['Allenamento', 'Coreografia', 'Dynamic Zen', 'Voglio parlare', 'Altro'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  Messaggio
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Scrivi a Davide…" />
                </label>
                <button type="button" className="btn-gold" onClick={sendToDavide}>
                  Invia <Send size={14} />
                </button>
              </div>
              <div className="panel" style={{ marginTop: 8 }}>
                {state.messages.map((m) => (
                  <div key={m.id} className={`bubble ${m.from === 'davide' ? 'davide' : m.from === 'auto' ? 'auto' : ''}`}>
                    <small>
                      {m.from === 'davide' ? 'RISPOSTA DI DAVIDE' : m.from === 'auto' ? 'AUTO' : `TU · ${m.category}`} · {m.at}
                    </small>
                    <p>{m.text}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {page === 'percorso' && (
            <div className="stack">
              {paths.map((p, i) => (
                <div className="path-item" key={p.title}>
                  <span className="path-num">0{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <span className="tag">{p.concept}</span>
                    <h3 style={{ margin: '4px 0' }}>{p.title}</h3>
                    <p className="muted" style={{ fontSize: 11 }}>
                      {p.items}
                    </p>
                  </div>
                  {p.open ? <span className="path-open">IN CORSO</span> : <span className="path-lock"><LockKeyhole size={16} /></span>}
                </div>
              ))}
            </div>
          )}

          {page === 'allenati' && (
            <div className="stack">
              <p className="demo-banner">Aree demo. Nessuna istruzione tecnica non validata.</p>
              {['Riscaldamento', 'Mobilità', 'Forza a terra', 'Lavoro sui tessuti', 'Defaticamento', 'Presenza'].map((x, i) => (
                <div className="panel" key={x} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span className="tag">0{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: 13 }}>{x}</strong>
                    <p className="muted" style={{ fontSize: 11 }}>
                      Da validare in palestra
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {page === 'crea' && (
            <>
              <div className="panel">
                <label className="field">
                  Titolo
                  <input value={state.showTitle} onChange={(e) => update((s) => ({ ...s, showTitle: e.target.value }))} />
                </label>
                <label className="field">
                  Storia
                  <textarea value={state.story} onChange={(e) => update((s) => ({ ...s, story: e.target.value }))} rows={2} />
                </label>
                <label className="field">
                  Emozione
                  <input value={state.emotion} onChange={(e) => update((s) => ({ ...s, emotion: e.target.value }))} />
                </label>
              </div>
              <div className="panel" style={{ marginTop: 8 }}>
                <span className="eyebrow">TIMELINE</span>
                <div className="timeline">
                  {state.timeline.map((x, i) => (
                    <div className="tl-step" key={`${x}-${i}`}>
                      <small>0{i + 1}</small>
                      <strong>{x}</strong>
                    </div>
                  ))}
                </div>
                {state.techniques
                  .filter((t) => !t.hidden)
                  .slice(0, 4)
                  .map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className="tech-item"
                      style={{ marginTop: 6 }}
                      onClick={() => {
                        update((s) => ({
                          ...s,
                          timeline: [...s.timeline.slice(0, -1), t.name, 'Finale'],
                        }));
                        notify(`${t.name} in timeline`);
                      }}
                    >
                      <span className="tech-glyph">
                        <Plus size={14} />
                      </span>
                      <span style={{ flex: 1 }}>
                        <strong>{t.name}</strong>
                        <small>{t.status}</small>
                      </span>
                    </button>
                  ))}
              </div>
            </>
          )}

          {page === 'personalizza' && (
            <>
              <p className="demo-banner">{athleteGender === 'uomo' ? 'Atleta uomo: anteprima visiva. La personalizzazione maschile e il modello 3D sono ancora da realizzare.' : 'Capelli e outfit cambiano nell’anteprima. Carnagione e accessori: selezione demo, varianti visive in preparazione.'}</p>
              <div className="avatar-stage">
                <div className="avatar-preview-card">
                  {athleteGender === 'uomo' ? <img className="male-preview" src="/art/splash-athlete-man.png" alt="Anteprima atleta uomo" /> : <AvatarFigure
                    hair={state.hair}
                    skin={state.skin}
                    outfit={state.outfit}
                    accessory={state.accessory}
                    effect={state.avatarEffect}
                    size="hero"
                  />}
                  <strong className="avatar-preview-name">{state.nickname}</strong>
                  <small className="avatar-preview-details">
                    {state.hair} · {state.skin} · {state.outfit} · {state.accessory} · {state.avatarEffect}
                  </small>
                </div>
              </div>
              <div className="panel" style={{ marginTop: 8 }}>
                <label className="field">
                  Nickname
                  <input
                    maxLength={24}
                    value={state.nickname}
                    onChange={(e) => update((s) => ({ ...s, nickname: e.target.value || 'Sara' }))}
                  />
                </label>
                {athleteGender === 'uomo' ? <p className="demo-banner">Le opzioni 2D qui sotto sono ancora predisposte per l’atleta donna; saranno sostituite dai capi e capelli del modello maschile 3D.</p> : <><div className="chips">
                  {(['Capelli', 'Carnagione', 'Outfit', 'Accessori'] as const).map((t) => (
                    <button key={t} type="button" className={cosmeticTab === t ? 'on' : ''} onClick={() => setCosmeticTab(t)}>
                      {t}
                    </button>
                  ))}
                </div>
                {cosmeticTab === 'Capelli' && (
                  <div className="cosmetic-grid">
                    {avatarOptions.hair.map((o) => {
                      const unlocked = isCosmeticUnlocked(o.id, o.free);
                      return (
                        <button
                          key={o.id}
                          type="button"
                          className={`cosmetic-chip ${state.hair === o.label ? 'on' : ''} ${!unlocked ? 'locked' : ''}`}
                          disabled={!unlocked}
                          onClick={() => unlocked && update((s) => ({ ...s, hair: o.label }))}
                        >
                          <AvatarFigure hair={o.label} skin={state.skin} outfit={state.outfit} accessory="Nessuno" size="sm" className="mini" />
                          <span>
                            <strong>{o.label}</strong>
                            <small>{o.free ? 'Gratuito' : unlocked ? 'Sbloccato' : o.unlockHint}</small>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {cosmeticTab === 'Carnagione' && (
                  <div className="cosmetic-grid">
                    {avatarOptions.skin.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        className={`cosmetic-chip ${state.skin === o.label ? 'on' : ''}`}
                        onClick={() => update((s) => ({ ...s, skin: o.label }))}
                      >
                        <AvatarFigure hair={state.hair} skin={o.label} outfit={state.outfit} accessory="Nessuno" size="sm" className="mini" />
                        <span>
                          <strong>{o.label}</strong>
                          <small>Gratuito</small>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {cosmeticTab === 'Outfit' && (
                  <div className="cosmetic-grid">
                    {avatarOptions.outfit.map((o) => {
                      const unlocked = isCosmeticUnlocked(o.id, o.free);
                      return (
                        <button
                          key={o.id}
                          type="button"
                          className={`cosmetic-chip ${state.outfit === o.label ? 'on' : ''} ${!unlocked ? 'locked' : ''}`}
                          disabled={!unlocked}
                          onClick={() => unlocked && update((s) => ({ ...s, outfit: o.label }))}
                        >
                          <AvatarFigure hair={state.hair} skin={state.skin} outfit={o.label} accessory="Nessuno" size="sm" className="mini" />
                          <span>
                            <strong>{o.label}</strong>
                            <small>{o.free ? 'Gratuito' : unlocked ? 'Sbloccato' : o.unlockHint}</small>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {cosmeticTab === 'Accessori' && (
                  <div className="cosmetic-grid">
                    {avatarOptions.accessory.map((o) => {
                      const unlocked = isCosmeticUnlocked(o.id, o.free);
                      return (
                        <button
                          key={o.id}
                          type="button"
                          className={`cosmetic-chip ${state.accessory === o.label ? 'on' : ''} ${!unlocked ? 'locked' : ''}`}
                          disabled={!unlocked}
                          onClick={() => unlocked && update((s) => ({ ...s, accessory: o.label }))}
                        >
                          <AvatarFigure hair={state.hair} skin={state.skin} outfit={state.outfit} accessory={o.label} size="sm" className="mini" />
                          <span>
                            <strong>{o.label}</strong>
                            <small>{o.free ? 'Gratuito' : unlocked ? 'Sbloccato' : o.unlockHint}</small>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                </>}
                <label className="field">
                  Stanza
                  <select value={state.room} onChange={(e) => update((s) => ({ ...s, room: e.target.value }))}>
                    {['Santuario', 'Nido Zen', 'Aurora'].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
                <button type="button" className="btn-gold" style={{ width: '100%' }} onClick={() => notify('Stile salvato sul dispositivo.')}>
                  Salva stile
                </button>
                <button type="button" className="avatar-coach-link" onClick={() => go('davide-chat')}>Chiedi a Davide →</button>
              </div>
            </>
          )}

          {page === 'premi' && (
            <>
              <div className="panel" style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                <Coins size={24} color="#e9a95b" />
                <div>
                  <strong style={{ fontSize: 24, color: '#f2c283' }}>{state.credits}</strong>
                  <div className="muted" style={{ fontSize: 11 }}>
                    crediti · XP separati ({state.xp})
                  </div>
                </div>
              </div>
              <p className="demo-banner">Nessun pagamento reale.</p>
              <div className="reward-grid">
                {prizes.map((p) => (
                  <div className="panel" key={p.title}>
                    <span className="tag">{p.type}</span>
                    <h3>{p.title}</h3>
                    <p style={{ margin: '6px 0 8px', color: 'var(--gold-soft)', fontWeight: 800, fontSize: 13 }}>
                      {p.price} cr
                    </p>
                    <button
                      type="button"
                      className="btn-gold"
                      style={{ width: '100%', minHeight: 40, fontSize: 11 }}
                      disabled={state.credits < p.price}
                      onClick={() => {
                        update((s) => ({
                          ...s,
                          credits: s.credits - p.price,
                          rewards: [...s.rewards, `${p.title} · DEMO-${Math.floor(Math.random() * 9000 + 1000)}`],
                        }));
                        notify('Riscatto demo. Mostra il codice al coach.');
                      }}
                    >
                      {state.credits < p.price ? 'Insufficienti' : 'Riscatta'}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {showNav && (
        <>
          <button type="button" className={`fab-davide ${page === 'stanza' || page === 'personalizza' ? 'room-fab-hidden' : ''}`} onClick={() => go('davide-chat')}>
            <MessageCircle size={16} />
            <span>Chiedi a Davide</span>
          </button>
          <nav className="bottom-nav concept-nav" aria-label="Navigazione">
            <button type="button" className={page === 'stanza' ? 'on' : ''} onClick={() => go('stanza')}><House size={21} />Home</button>
            <button type="button" className={page === 'missioni' ? 'on' : ''} onClick={() => go('missioni')}><Star size={21} />Missioni</button>
            <button type="button" className={page === 'repertorio' || page === 'anatomia' ? 'on' : ''} onClick={() => go('repertorio')}><BookOpen size={21} />Apprendi</button>
            <button type="button" className={page === 'personalizza' ? 'on' : ''} onClick={() => go('personalizza')}><Palette size={21} />Profilo</button>
            <button type="button" className={page === 'premi' ? 'on' : ''} onClick={() => go('premi')}><Trophy size={21} />Premi</button>
          </nav>
        </>
      )}
      <Toast />
    </div>
  );
}
