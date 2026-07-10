import type { Game } from './defs'

const games = new Map<string, Game>()

export function createGame(gameId: string, game: Game) {
  games.set(gameId, game)
}

export function getGame(gameId: string): Game | undefined {
  return games.get(gameId)
}

export function setGame(gameId: string, game: Game) {
  games.set(gameId, game)
}
