import { immerable } from 'immer';

const ALPHABET = 'a-z'
const N_TILDE = 'ñ'
const ACCENTS = 'áéíóúü'

export function isSpanishLetter(letter: string): boolean {
  const allSpanishLettersRegex = new RegExp(`^[${ALPHABET}${N_TILDE}${ACCENTS}]+$`)
  return allSpanishLettersRegex.test(letter.toLowerCase())
}

export function isPlainLetter(letter: string): boolean {
  const allPlainLettersRegex = new RegExp(`^[${ALPHABET}${N_TILDE}]+$`)
  return allPlainLettersRegex.test(letter)
}

const spanishToPlainMap: Record<string, string> = {
  'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u',
}

export function toPlainLetters(s: string): string {
  const accentRegex = new RegExp(`[${ACCENTS}]`, 'g')
  const notSpanishLetterRegex = new RegExp(`[^${ALPHABET}${N_TILDE}${ACCENTS}]`, 'g')
  return s.toLowerCase().replace(notSpanishLetterRegex, '').replace(accentRegex, (c) => spanishToPlainMap[c])
}

export class Letter {
  letter: string
  revealed: boolean
  green: boolean

  constructor(content: string) {
    this.letter = content
    this.revealed = !isSpanishLetter(content)
    this.green = false
  }

  guess(plainPrompt: string) {
    if (this.revealed) return
    if (plainPrompt !== toPlainLetters(this.letter)) return
    this.reveal(true)
  }

  reveal(green: boolean) {
    this.revealed = true
    this.green = this.green || green
  }
}

export class Word {
  content: string
  letters: Letter[]

  constructor(content: string) {
    this.content = content
    this.letters = content.split('').map(letter => new Letter(letter))
  }

  getLetterCount() {
    return this.letters.filter(letter => isSpanishLetter(letter.letter)).length
  }

  getRevealedLetterCount() {
    return this.letters.filter(letter => isSpanishLetter(letter.letter) && letter.revealed).length
  }

  isFullyRevealed(): boolean {
    return this.getRevealedLetterCount() === this.getLetterCount()
  }

  guess(plainPrompt: string) {
    if (plainPrompt !== toPlainLetters(this.content)) return 
    this.letters.forEach(letter => letter.reveal(false))
  }

  guessLetter(plainPrompt: string) {
    this.letters.forEach(letter => letter.guess(plainPrompt))
  }

  reveal(green: boolean) {
    this.letters.forEach(letter => letter.reveal(green))
  }
}

export class WordToGuess extends Word {

}

export class Definition {
  words: Word[]

  constructor(content: string) {
    this.words = content.split(' ').map(word => new Word(word))
  }

  getLetterCount() {
    return this.words.reduce((acc, word) => acc + word.getLetterCount(), 0)
  }

  getRevealedLetterCount() {
    return this.words.reduce((acc, word) => acc + word.getRevealedLetterCount(), 0)
  }

  guessWord(prompt: string) {
    this.words.forEach(word => word.guess(prompt))
  }

  guessLetter(prompt: string) {
    this.words.forEach(word => word.guessLetter(prompt))
  }

  reveal(green: boolean) {
    this.words.forEach(word => word.reveal(green))
  }
}

export class Game {
  [immerable] = true
  
  wordToGuess: WordToGuess
  definitions: Definition[]

  guessedWords: string[]
  revealedLetters: string[]
  revealedWords: number[][]
  uncoveredWords: string[]
  failedWords: string[]

  constructor(word: string, definitions: string[]) {
    this.wordToGuess = new WordToGuess(word)
    this.definitions = definitions.map(def => new Definition(def))
    this.guessedWords = []
    this.revealedLetters = []
    this.revealedWords = []
    this.uncoveredWords = []
    this.failedWords = []
  }

  isInDefinitions(plainPrompt: string): boolean {
    return this.definitions.some(def => def.words.some(word => {
      console.log(toPlainLetters(word.content), plainPrompt)
      return toPlainLetters(word.content) === plainPrompt
    }))
  }

  getFullyRevealedWordPositions(): number[][] {
    const positions: number[][] = []
    this.definitions.forEach((def, defIndex) => {
      def.words.forEach((word, wordIndex) => {
        if (word.isFullyRevealed()) {
          positions.push([defIndex, wordIndex])
        }
      })
    })
    return positions
  }

  getLetterCount() {
    return this.definitions.reduce((acc, def) => acc + def.getLetterCount(), 0)
  }

  getRevealedLetterCount() {
    return this.definitions.reduce((acc, def) => acc + def.getRevealedLetterCount(), 0)
  }

  riskWordToGuess(prompt: string): 'invalid-letter' | 'not-full' | 'correct' | 'wrong' {
    prompt = prompt.toLowerCase()
    if (!isSpanishLetter(prompt)) return 'invalid-letter'
    const plainPrompt = toPlainLetters(prompt);
    if (plainPrompt.length < this.wordToGuess.getLetterCount())
      return 'not-full'
    else if (plainPrompt === toPlainLetters(this.wordToGuess.content))
      return 'correct'
    else
      return 'wrong'
  }

  guessWord(prompt: string): 'empty' | 'invalid-letter' | 'already-guessed' | 'not-found' | 'ok' {
    if (!prompt) 
      return 'empty'
    
    prompt = prompt.toLowerCase()
    if (!isSpanishLetter(prompt))
      return 'invalid-letter'
  
    const plainPrompt = toPlainLetters(prompt)
    if (this.guessedWords.includes(plainPrompt))
      return 'already-guessed'
    this.guessedWords.push(plainPrompt)

    const wordFound = this.isInDefinitions(plainPrompt)
    if (!wordFound) {
      this.failedWords.push(plainPrompt)
      return 'not-found'
    }
    else {
      this.definitions.forEach(def => def.guessWord(plainPrompt))
      return 'ok'
    }
  }

  guessLetter(prompt: string): 'empty' | 'invalid-letter' | 'already-revealed' | 'no-letters-left' | 'ok' {
    if (!prompt) 
      return 'empty'

    prompt = prompt.toLowerCase()
    if (!isSpanishLetter(prompt))
      return 'invalid-letter'

    const plainPrompt = toPlainLetters(prompt)
  
    if (this.revealedLetters.includes(plainPrompt)) 
      return 'already-revealed'
    if (this.revealedLetters.length >= 3)
      return 'no-letters-left'
  
    this.definitions.forEach(def => def.guessLetter(plainPrompt))
    this.wordToGuess.guessLetter(plainPrompt)
    this.revealedLetters.push(plainPrompt)
    return 'ok'
  }

  revealWord(position: number[]): 'invalid-position' | 'already-revealed' | 'no-reveals-left' | 'ok' {
    if (!position || position.length !== 2)
      return 'invalid-position'

    const [defIndex, wordIndex] = position
    if (defIndex < 0 || defIndex >= this.definitions.length)
      return 'invalid-position'
    if (wordIndex < 0 || wordIndex >= this.definitions[defIndex].words.length)
      return 'invalid-position'
  
    const word = this.definitions[defIndex].words[wordIndex]
    
    if (word.isFullyRevealed())
      return 'already-revealed'
    if (this.revealedWords.length >= 3)
      return 'no-reveals-left'

    word.reveal(true)
    this.revealedWords.push(position)
    return 'ok'
  }
}
