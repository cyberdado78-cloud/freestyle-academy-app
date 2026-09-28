# Freestyle Academy · passaggio alla prossima chat

## Obiettivo
Realizzare una app mobile web fedele alla tavola del concept (11 schermate) con Freestyle Academy e Dynamic Zen. Tenere stile cinematografico, palette notte/ambra/seta viola, elementi UI distinti dagli sfondi, pulsanti nella posizione prevista e navigazione interattiva. Marchi originali forniti. Non pubblicare né spendere crediti Hostinger per iterazioni grafiche.

## Cosa è stato fatto davvero
- Progetto React esportato da Hostinger e modificato; sorgenti in `apps/web/src`.
- Splash ricostruito in livelli: sfondo illustrato, atleta separato, scritte, pulsanti, loghi originali; scelta donna/uomo. Questa è una prova 2D, non un avatar 3D.
- Schermate successive sono ancora la demo precedente e non hanno fedeltà completa al concept. Alcune funzionano solo con dati sullo stesso browser (`localStorage`). La selezione di un video NON effettua upload verso il coach. I giochi oltre Sequenza Misteriosa sono in buona parte voci dimostrative.
- Prova tecnica autonoma `Freestyle-Academy-prova-avatar-3d.html`: modello geometrico con due basi, rotazione a un dito, pinch zoom e traslazione con due dita, corpulenza; biancheria sempre presente. Non ha la qualità visiva del concept e non è integrata nel progetto React. Non spacciarla per avatar finale.
- Un piano completo si trova in `Freestyle-Academy-piano-progettuale.md`.

## Cosa manca prioritariamente
1. Direzione artistica: ricostruire ingresso, scelta atleta, personalizzazione e home con misure/confronto per ogni schermata rispetto alle immagini nella cartella `reference-concept`.
2. Due modelli 3D artistici reali uomo/donna, rig, morph viso e corpo (esile → più corposo), capelli, outfit e accessori modulari, costume di gara configurabile, materiali/colori. Abbigliamento intimo minimo non removibile in qualunque stato. Una foto piatta non è un modello 3D; non promettere il 3D definitivo se esiste solo un'immagine.
3. Prova smartphone dei modelli reali prima di ampliare catalogo. Poi backend con account separati per atleta e Davide, storage media, missioni e convalide reali.
4. Illustrazioni dedicate ad anatomia e Dynamic Zen, figure, giochi cognitivi, riflessi, ascolto, ritmo, suono, creatività, premi, stanza, dashboard Davide con cambio immagini.

## Aggiornamento repository · 27 settembre 2026

- Ripristinata nel repository la cartella `reference-concept/`, prima assente dal push iniziale.
- Verificati con esito positivo build di produzione, TypeScript e lint.
- Corretto il percorso mobile ingresso → atleta → personalizzazione → stanza: l’atleta femminile usa ora la figura intera, i preset cambiano realmente l’anteprima e le scelte donna/uomo, look, capo e colore vengono conservate nel browser.
- Inserito il logo Freestyle Academy originale con trasparenza e corretta la composizione verticale dell’ingresso sui telefoni con altezza ridotta.
- Eseguito controllo automatico del flusso su viewport mobile 393×851 senza errori JavaScript.
- Il limite resta invariato: sono asset 2D interattivi, non modelli 3D riggati.

## Marchi e immagini
- `apps/web/public/art/freestyle-academy-logo-transparent.png`: logo originale Freestyle Academy con trasparenza; non sostituire il lettering con uno inventato.
- `apps/web/public/art/dynamic-zen-logo.png`: ensō oro su nero.
- `reference-concept/` contiene le schermate del concept e la tavola originale. Sono immagini appiattite: servono da riferimento, i singoli livelli non si estraggono esattamente.
- `apps/web/public/art/ingresso.png`, `splash-athlete.png`, `splash-athlete-man.png` sono livelli temporanei utilizzati nell'ingresso.

## Per lavorare sul codice
Apri la radice del repository, esegui `npm ci`, quindi `npm run dev -w apps/web` in un ambiente con Node.js. Per la verifica di compilazione: `npm run build`. Il progetto contiene molte dipendenze Hostinger ereditate; non sono incluse credenziali né `node_modules`. Non pubblicare senza richiesta esplicita.

## Messaggio per riprendere
«Continuiamo Freestyle Academy dal pacchetto allegato. Leggi `CONTINUA-QUI-FREESTYLE-ACADEMY.md` e il piano. Il concept nelle immagini è il riferimento visivo vincolante. Migliora il progetto React con risultati verificabili, senza inventare funzioni già complete. Prima consegna: schermate ingresso, scelta atleta, personalizzazione e home fedeli alle reference; per il 3D, distingui sempre modelli reali da prove geometriche. Non pubblicare il sito.»
