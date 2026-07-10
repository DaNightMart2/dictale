# Dictale

Dictale es un juego de palabras en español: cada día hay una palabra oculta y hay que
adivinarla a partir de sus definiciones, que se van revelando palabra por palabra.

Este repo es a la vez el juego y un ejercicio educativo: el mismo juego implementado
varias veces, con la lógica siempre en el backend y un cliente intercambiable.
Cada backend implementa su propio motor del juego (esa es la gracia), y todos hablan
el mismo contrato REST, así que el mismo cliente funciona contra cualquiera.

## Estructura

```
dictale/
├── data/
│   └── word_list.json      # diccionario compartido por todos los backends (nunca se sirve al cliente)
├── packages/
│   ├── shared/             # lo único que ve el cliente: componentes React, tipos (GameStateView), estilos
│   ├── client-react/       # cliente React puro (Vite), sin lógica de juego; se conecta a cualquier backend
│   ├── logic-next/         # backend autoritativo en Next.js (API routes) + su propio frontend
│   ├── logic-python/       # backend autoritativo en Python (FastAPI)
│   └── logic-haskell/      # motor del juego en Haskell (en progreso)
├── downloaders/            # scripts para construir word_list.json (Wiktionary)
└── private/                # datos crudos de diccionario (no versionado)
```

## Contrato REST

Todos los backends exponen los mismos endpoints y devuelven el mismo `GameStateView`
enmascarado (las definiciones completas nunca salen del servidor):

| Endpoint | Acción |
|---|---|
| `POST /api/game` | crear partida → `{ gameId, state }` |
| `POST /api/game/:id/guess-word` | arriesgar una palabra de las definiciones |
| `POST /api/game/:id/guess-letter` | revelar una letra (máx. 3) |
| `POST /api/game/:id/reveal-word` | revelar una palabra entera (máx. 3) |
| `POST /api/game/:id/guess-final` | arriesgar la palabra final |
| `POST /api/game/:id/surrender` | rendirse (devuelve `answer`) |

## Cómo correr cada combinación

### Next.js full-stack (frontend + backend juntos)

```bash
npm install
npm run dev:next        # http://localhost:3000
```

### Cliente React + backend Python

```bash
# Terminal 1 — backend
python3 -m venv .venv && .venv/bin/pip install -r packages/logic-python/requirements.txt
npm run dev:python      # http://localhost:8000

# Terminal 2 — cliente (el dev server proxya /api al backend)
npm run dev:client      # http://localhost:5173
```

### Cliente React + backend Next.js

```bash
# Terminal 1
npm run dev:next

# Terminal 2 — apuntar el proxy al backend Next
BACKEND_URL=http://localhost:3000 npm run dev:client
```

### Haskell (experimental)

```bash
cd packages/logic-haskell
runghc Game.hs
```

## Requisitos

- Node.js 18+
- Python 3.10+ (solo para `logic-python` y `downloaders/`)
- GHC (solo para `logic-haskell`)
