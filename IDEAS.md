# Ideas

Main goal: centralized repo with a whole bunch of alternative implementations of a word game: Dictale. For educational purposes.

## Status (2026-07-10)

Repo restructured into a `packages/` monorepo. Each backend owns its game engine;
`packages/shared` holds only what clients may see (components, `GameStateView` types, styles).
All backends speak the same REST contract, so `client-react` can point at any of them
(`BACKEND_URL` env for the dev proxy).

## Implementations

1. **Pure HTML/JS** — parked.
   Should not be written by hand: the idea is to *derive* it from the React implementation
   via codegen (a script that transforms the React source into nicely formatted vanilla
   HTML/JS). Real compiler-ish project, educational in its own right. Do later.
2. **React client** — done (`packages/client-react`).
   Client-side components only, no game logic; connects to any backend through the shared
   REST contract.
3. **Next.js backend** — done (`packages/logic-next`), via API routes.
   Pending: a *server actions* variant as a separate implementation, to compare both
   approaches side by side.
4. **Python backend** — done (`packages/logic-python`, FastAPI). No Vite frontend of its
   own; `client-react` connects to it.
5. **Haskell** — in progress (`packages/logic-haskell`). Pure game state + hand-rolled JSON
   so far. Next: letter normalization (accents/ñ), full game rules, and a minimal HTTP
   server speaking the shared REST contract. Just for functional fun.

## Pending

- Server-actions variant of the Next.js backend.
- Grow the Haskell engine into a real backend.
- Codegen: React → plain HTML/JS.
- Game state is in-memory in both backends: fine for education, resets on restart.
