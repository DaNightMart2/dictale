/**
 * GameStateView - serializable format for API responses and shared components
 */

export interface LetterView {
  revealed: boolean
  green: boolean
  char: string
}

export interface WordView {
  letters: LetterView[]
}

export interface DefinitionView {
  words: WordView[]
}

export interface GameStateView {
  wordToGuess: WordView
  definitions: DefinitionView[]
  revealedLetters: string[]
  revealedWords: number[][]
  failedWords: string[]
  gameEnded: boolean
  gameWon: boolean
  progress: number
  /** When gameEnded, the actual word (for display) */
  answer?: string
}
