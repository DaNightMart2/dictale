import type { Game } from './defs'
import type { GameStateView, LetterView, WordView } from '@shared/types/game-state'

function letterToView(l: { revealed: boolean; green: boolean; letter: string }): LetterView {
  return {
    revealed: l.revealed,
    green: l.green,
    char: l.revealed ? l.letter : '_',
  }
}

function wordToView(w: { letters: { revealed: boolean; green: boolean; letter: string }[] }): WordView {
  return {
    letters: w.letters.map(letterToView),
  }
}

export function gameToStateView(game: Game, opts?: { gameEnded?: boolean; gameWon?: boolean }): GameStateView {
  const letterCount = game.getLetterCount()
  const revealedCount = game.getRevealedLetterCount()
  const progress = letterCount > 0 ? Math.floor(100 * revealedCount / letterCount) : 0

  return {
    wordToGuess: wordToView(game.wordToGuess),
    definitions: game.definitions.map(def => ({
      words: def.words.map(wordToView),
    })),
    revealedLetters: [...game.revealedLetters],
    revealedWords: game.revealedWords.map(p => [...p]),
    failedWords: [...game.failedWords],
    gameEnded: opts?.gameEnded ?? false,
    gameWon: opts?.gameWon ?? false,
    progress,
    ...(opts?.gameEnded ? { answer: game.wordToGuess.content } : {}),
  }
}
