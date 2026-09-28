# Freestyle Academy App

Prototipo mobile-first React/React Router per l’esperienza Freestyle Academy × Dynamic Zen.

## Stato attuale

- Percorso navigabile: ingresso → creazione atleta → personalizzazione → stanza.
- Scelta donna/uomo, look, capo e colore salvati nel browser.
- Avatar ancora 2D: il modello 3D artistico non è incluso e l’interfaccia lo dichiara esplicitamente.
- Stanza, repertorio, missioni, giochi, Dynamic Zen e pannello coach sono prototipi locali; non sostituiscono ancora account, database e upload reali.
- Il riferimento visivo vincolante è in `reference-concept/`.

## Avvio locale

```bash
npm ci
npm run dev -w apps/web
```

Build e controlli:

```bash
npm run build
npm run typecheck
npm run lint
```

PocketBase richiede il binario previsto da `apps/pocketbase/package.json` e le relative variabili d’ambiente. Il frontend può essere verificato graficamente anche senza avviare PocketBase.

Non pubblicare o acquistare crediti Hostinger per le iterazioni grafiche senza approvazione esplicita.
