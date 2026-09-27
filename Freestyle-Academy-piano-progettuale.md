# Freestyle Academy · piano progettuale

**Riferimento visivo:** tavola originale da 11 schermate e otto schermate singole ricevute il 27 settembre 2026. **Marchi:** logo Freestyle Academy arancione/nero e logo Dynamic Zen oro/nero ricevuti nella stessa consegna. **Stato:** piano operativo; nessuna pubblicazione autorizzata.

## 1. Obiettivo e criterio di approvazione

Costruire una web app mobile interattiva che riproduca il linguaggio del concept: illustrazioni cinematografiche, interno notturno, accenti oro/ambra, seta viola, interfaccia scura con bordi luminosi, elementi nel paesaggio e navigazione inferiore. Ogni schermata deve essere confrontata accanto al riferimento sullo stesso formato mobile prima di essere considerata approvata. I pulsanti, i testi e gli stati sono livelli veri, indipendenti dagli sfondi. Il fotomontaggio originale serve come riferimento: i suoi pixel appiattiti non contengono i livelli recuperabili dell'illustrazione sottostante.

**Ordine grafico:** ingresso → scelta atleta → personalizzazione → home/portali → stanza → missioni → tessuti → anatomia → benessere → primo soccorso → premi. Il sistema UI (font, bottoni, tab, icone, sfondi, spaziature) viene definito su ingresso, avatar e home; poi riutilizzato nelle altre schermate.

**Logo:** utilizzare i file consegnati come marchi originali. Il marchio Freestyle Academy resta leggibile nella sua palette nero/arancio, eventualmente in un supporto chiaro/localmente illuminato; Dynamic Zen oro su un supporto scuro. Non sostituirli con triangoli, cerchi o emoji inventati. Richiedere eventuali versioni vettoriali/trasparenti prima della variante finale su sfondi complessi; non ricostruire il lettering con un font simile e spacciarlo per ufficiale.

## 2. Inventario reale della demo React attuale

| Area | Cosa esiste nel codice | Per avere la funzione completa |
|---|---|---|
| Ingresso e stanza | Scelta locale Sara/Davide; stanza illustrata, hotspot, navigazione, XP/crediti demo | Sistema visivo aderente al concept, profili reali, salvataggio sincronizzato |
| Repertorio | Sei tecniche nominate da Davide; filtri, stati, preferiti, visibilità, flag di convalida | Contenuti e media approvati dal coach, cronologia delle convalide |
| Missioni | Elenco, dettagli, assegnazione locale del coach; selettore foto/video | Upload sicuro persistente, accesso coach, consenso/condivisione, stato e verifica |
| Giochi | Sequenza Misteriosa testuale giocabile; altri otto giochi nel catalogo come voci bloccate | Carte visive e contenuti reali; sviluppare uno alla volta memoria, riflessi, ritmo, ascolto e creatività |
| Dynamic Zen | Attività a testo, pianta, diario scritto | Visuali dedicate, esercizi/audio validati, permessi reali e dati privati protetti |
| Avatar | Immagini 2D alternative per alcune acconciature e outfit; selezioni salvate sul dispositivo | Modello 3D riggato, controlli viso/corpo, indumenti e accessori 3D |
| Anatomia | Solo tre segnaposto; nessuno schema anatomico | Atlante illustrato/3D verificato e collegamenti alle figure |
| Primo soccorso | Presente nel concept, non come modulo giocabile nella demo | Scenari e risposte con revisione professionale prima dell'uso |
| Coreografia | Campi storia/emozione e semplice timeline di figure | Editor ordinabile con musica/tempo, video, salvataggi e revisione coach |
| Coach | Tab locali, messaggi, missioni, feedback e convalida demo | Account separati, permessi per atleta, database, audit e contenuti amministrabili |
| Premi | Crediti demo e riscatti simulati | Inventario reale, regole approvate, disponibilità e verifica dei riscatti |
| Immagini di base | Override locali delle immagini di sezione | Libreria amministratore sul server: caricamento, sostituzione, anteprima, ripristino e versioni |
| Dati | `localStorage`; anteprime media con `URL.createObjectURL` | Backend, account, storage media, backup; il file scelto ora non viene realmente inviato |

**Stato da comunicare nella demo:** i messaggi e i dati tra Sara e Davide convivono solo nello stesso browser/dispositivo. La selezione del file mostra una preview locale, non lo consegna al coach. Alcuni filtri delle missioni e varie schede gioco sono ancora dimostrativi. Non chiamare queste funzioni “complete”.

## 3. Avatar 3D: specifica realizzabile

### Requisiti del personaggio

- Due basi iniziali selezionabili: **donna** e **uomo**; nome e aspetto scelti dall'utente. Una scelta non deve bloccare colori, acconciature o vestiti.
- Rotazione con trascinamento, zoom con pinch e gesture, ripristino camera, luce leggibile e tre inquadrature rapide (intero, viso, outfit). Sul telefono i controlli non devono confliggere con lo scorrimento dei menu.
- Volto regolabile mediante controlli selezionati: forma generale, naso, occhi, bocca, sopracciglia e carnagione; intervalli limitati e mesh verificate per evitare deformazioni.
- Corpo regolabile con uno o più controlli di silhouette che coprano anche l'aspetto **molto esile** e **più corposo** chiesto da Davide, senza giudizi o punteggi corporei. Questo richiede blend shape dedicate e prova dei vestiti su tutti gli estremi: un semplice ridimensionamento 3D deforma viso, mani e tessuti.
- Capelli: tagli e acconciature 3D sostituibili, colori e accessori; attenzione a incastri con cappucci e spalle.
- Outfit: capi modulari (top, body, maglie, felpe, pantaloni, leggings, scarpe), colore per capo e per parti del capo, materiali, accessori, preset gratuiti e sblocchi collegati a missioni/percorso.
- **Biancheria intima di base sempre equipaggiata:** ogni avatar nasce con uno strato coprente; l'azione di togliere un indumento esterno non può rimuovere questo strato. Bloccare anche negli stati, nei preset, nel salvataggio e nel rendering eventuali combinazioni che lascino il modello scoperto.
- Salvataggio di avatar e outfit come parametri 3D riproducibili, non come una singola immagine. Foto/ritratti 2D opzionali per il profilo e il catalogo.

### Sartoria del costume di gara

**Prima versione utile:** scegliere base del costume, pannelli e colori, pattern, maniche, scollatura entro modelli predisposti, decorazioni, fronte/retro, nome del progetto; ruotare e salvare, esportare un'anteprima. **Seconda versione:** più tagli e materiali, personalizzazione dei pannelli e condivisione col coach. **Eventuale prodotto commerciale:** misure, taglie, scheda tecnica e flusso con sartoria reale richiedono un progetto distinto e verifica umana; un render 3D non garantisce vestibilità né produzione.

### Tecnologia e dipendenze

Creare i modelli, indumenti e capelli in **Blender** con uno scheletro condiviso dove possibile e shape keys/morph target per viso e corporatura. Esportare in **glTF/GLB** con mesh, materiali, rig e morph target. Nel progetto React utilizzare **React Three Fiber/Three.js** per visualizzazione, orbita, zoom, cambio mesh/materiali e salvataggio dei parametri. Questi strumenti rendono la funzione tecnicamente possibile; **non producono automaticamente** un avatar rifinito e centinaia di combinazioni: serve progettazione 3D e collaudo delle intersezioni fra corpo e vestiti. Mettere in scena 3D solo l'avatar, usando sfondi 2D cinematografici per mantenere le prestazioni mobile.

**Prova tecnica obbligatoria prima di estendere il catalogo:** due personaggi GLB, tre silhouette per ciascuno, un capello scambiabile, due outfit con colori separati, uno strato di biancheria non removibile, trascinamento/zoom su Android, salvataggio e ricaricamento, nessuna compenetrazione evidente. Se il test non regge sul telefono, semplificare asset e materiali prima di aggiungere contenuti.

## 4. Moduli e progressione

| Modulo | Esperienza desiderata | Realizzabilità e ordine |
|---|---|---|
| Home / stanza | Portali interattivi verso Tessuti Aerei, Dynamic Zen, Repertorio, giochi e pianta | Alta; prima schermata navigabile, stile approvato prima di replicare |
| Repertorio / figure | Schede, stati, preferite, video coach, link anatomia e coreografia | Alta; nomi già presenti, istruzioni tecniche solo dopo validazione di Davide |
| Missioni | Giornaliere, settimanali, speciali, prove foto/video, risposte coach, ricompense | Alta con backend e storage; la verifica è una decisione del coach |
| Giochi cognitivi | Memoria e sequenze, riflessi/tempo di reazione, creatività, suono/ascolto, ritmo e tempo musicale | Alta a moduli; prototipo singolo per ogni categoria e sblocchi configurabili |
| Dynamic Zen / benessere | Respiro, presenza, movimento, visualizzazione, diario e pianta | Alta per contenuti/autovalutazione; non presentare come diagnosi o terapia |
| Anatomia | Mappe muscolari e articolari, ricerca, tappe di studio e collegamenti alle figure | Alta con tavole verificate; 3D anatomico avanzato è un progetto separato |
| Primo soccorso | Quiz situazionali e feedback educativo | Tecnica alta, contenuti da validare da personale competente prima del rilascio |
| Coreografia | Editor di sequenza, musica, durata, emozione, note e condivisione | Media; definire editing e diritti del materiale musicale prima del catalogo |
| Premi | XP distinto da crediti, oggetti estetici, sblocchi, eventuali premi reali | Alta per premi virtuali; i premi reali richiedono inventario e verifica |
| Dashboard Davide | Crea/archivia missioni e figure, valida contenuti, gestisce media, sfondi, cosmetici e giochi | Alta con backend; controlli per atleta e tracciamento delle modifiche |
| Avatar 3D completo | Due basi, morph corporei/facciali, mesh intercambiabili, outfit e sartoria | Fattibile, ma è il modulo con il maggior lavoro 3D; sviluppare con prova tecnica prima del catalogo |

**Progressione:** BASE · CONOSCO → INTERMEDIO · COLLEGO → AVANZATO · CREO → COACH · INSEGNO. Regole XP/crediti e condizioni di sblocco definite in un documento unico, con controllo per evitare che ripetere un'azione o ricaricare la pagina attribuisca premi illimitati.

## 5. Patrimonio visivo da produrre

| Ambiente/asset | Presente | Da realizzare o verificare |
|---|---|---|
| Ingresso, atleta, home, missioni, tessuti, Zen, anatomia, primo soccorso, premi e stanza | Reference visive appiattite e alcune ricostruzioni | Sfondi puliti senza UI e senza avatar stampato sopra; personaggi separati; miniature dei giochi e delle figure |
| Logo Freestyle Academy | Originale bitmap arancio/nero fornito | Variante trasparente/vettoriale verificata e regole di contrasto; non alterare lettering |
| Logo Dynamic Zen | Originale bitmap oro/nero fornito | Variante trasparente per sfondi scuri e piccolo marchio leggibile |
| Anatomia | Mockup di schermata; nessun atlante reale approvato | Tavole corpo intero e regioni selezionabili, muscoli/articolazioni rilevanti, testo con fonte e revisione |
| Benessere | Mockup Dynamic Zen e sfondo di sezione | Portale Zen, visuali distinte per respiro, presenza, movimento, visualizzazione e pianta, eventuale audio approvato |
| Figure | Mockup Sequenza Misteriosa e nomi del repertorio | Foto/video o silhouette delle sei tecniche iniziali approvati da Davide, con crediti/licenze chiare |
| Avatar 3D | Quattro immagini 2D dimostrative, non modello 3D | Basi donna/uomo, rig, morph, capigliature, underwear permanente, capi, texture, versioni ottimizzate GLB |
| Sartoria | Non esiste | Template costume, pannelli UV/materiali, palette, preset e anteprima esportabile |
| Giochi, suono, ritmo | Titoli in catalogo | Carte visive, suoni originali/licenziati, feedback coerenti con il concept |

Ogni asset ha file sorgente, versione esportata, proprietario/diritti, dimensioni mobile, stato `bozza → revisione → approvato`. La dashboard può sostituire le immagini approvate senza toccare il codice; la versione precedente resta ripristinabile.

## 6. Sequenza di lavoro con consegne verificabili

1. **Fondamenta visive.** Inserire i loghi originali, ottenere/creare varianti utilizzabili su sfondi scuri, fissare misure e tipografia. Ricostruire ingresso, scelta avatar e home con confronto fianco a fianco su Android. Consegna: tre schermate navigabili e kit UI.
2. **Prova 3D.** Due basi con biancheria permanente, drag/zoom, silhouette, volto, capelli, due outfit, colori e salvataggio. Consegna: percorso ingresso → atleta → personalizza → stanza funzionante sul telefono, con misure di peso e fluidità.
3. **Nucleo didattico.** Repertorio iniziale, missioni e prova media realmente consegnata al coach, feedback e convalida, una Sequenza Misteriosa visiva. Consegna: ciclo completo atleta/coaching su due account reali.
4. **Mondo visivo.** Immagini anatomia e benessere revisionate, premi, altri giochi, coreografia e stanza personale coerenti con il concept. Consegna: moduli navigabili con contenuti approvati.
5. **Sartoria e contenuti continui.** Costume 3D con pannelli/colori, salvataggio e anteprima; dashboard per sfondi, figure, missioni, giochi e sblocchi. Consegna: aggiornare contenuti senza richiedere ogni volta modifiche al codice.
6. **Collaudo prima della pubblicazione.** Android piccolo/grande, caricamento 3D, accessibilità, account separati, privacy diario, prova upload, stato offline, backup/ripristino. Pubblicazione e sottodominio solo dopo un'esperienza approvata.

**Vincolo di costo:** non acquistare altri crediti Hostinger per tentativi grafici. La parte sostanziale è progettazione UI, creazione asset 3D/2D e sviluppo React. Hosting e sottodominio sono attività finali, non risolvono la fedeltà al concept.

## 7. Decisioni da fissare per evitare rilavorazioni

- Confermare le tre schermate base (ingresso, scelta atleta, home) a confronto con l'immagine riferimento.
- Consegnare, se esistono, versioni trasparenti o vettoriali dei due loghi; conservare comunque i bitmap originali.
- Approvare l'ambito minimo dei controlli facciali e delle forme del corpo dopo la prima prova 3D; l'aggettivo “totalmente” da solo non definisce limiti di mesh e vestiti.
- Confermare contenuti e regole degli sblocchi con Davide, distinguendo premio virtuale e premio reale.
- Per anatomia, primo soccorso e attività fisiche: assegnare la revisione dei testi/immagini alle persone competenti prima del rilascio.

## 8. Riferimenti tecnici ufficiali

- React Three Fiber, scena Canvas: https://r3f.docs.pmnd.rs/getting-started/your-first-scene
- Three.js OrbitControls: https://threejs.org/docs/pages/OrbitControls.html
- Standard glTF 2.0 (mesh, skinning, morph target): https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html
- Blender Shape Keys: https://docs.blender.org/manual/en/latest/animation/shape_keys/introduction.html
