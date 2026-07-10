# Dictale

A word game

## Structure

```
dictale/
├── data/
│   └── word_list.json      # shared dictionary
├── packages/
│   ├── shared/             # react components, types, styles.
│   ├── client-react/       # pure React client (using Vite)
│   ├── logic-next/         # Next.js backend (though API routes) + frontend
│   ├── logic-python/       # Python backend (FastAPI)
│   └── logic-haskell/      # Haskell implementation
└── downloaders/            # downloader scripts
```

## REST API

All backends expose the same endpoint suite and return the same `GameStateView`.

| Endpoint | Action |
|---|---|
| `POST /api/game` | start game → `{ gameId, state }` |
| `POST /api/game/:id/guess-word` | guess a definition word |
| `POST /api/game/:id/guess-letter` | reveal a letter (máx. 3) |
| `POST /api/game/:id/reveal-word` | reveal a whole word (máx. 3) |
| `POST /api/game/:id/guess-final` | risk the final word |
| `POST /api/game/:id/surrender` | surrender (returns `answer`) |

## How to run different combinations

### Next.js full-stack

```bash
npm install
npm run dev:next        # http://localhost:3000
```

### Python backend + React client

```bash
# Console 1 — backend
python3 -m venv .venv && .venv/bin/pip install -r packages/logic-python/requirements.txt
npm run dev:python      # http://localhost:8000

# Console 2 — client
npm run dev:client      # http://localhost:5173
```

### Haskell (experimental)

```bash
cd packages/logic-haskell
runghc Game.hs
```

