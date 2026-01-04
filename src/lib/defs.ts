import { immerable } from 'immer';

String.prototype.toPlainLetters = function() 
{
  return this.replace(/[^a-zA-Z]/g, '').toLowerCase()
}

export function isValidLetter(letter: string): boolean 
{
  return /^[a-zA-Z]$/.test(letter)
}

export class Letter 
{
  letter: string
  revealed: boolean
  green: boolean

  constructor(content: string) 
  {
    this.letter = content
    this.revealed = !isValidLetter(content)
    this.green = false
  }

  guess(prompt: string) 
  {
    if (!this.revealed && prompt === this.letter.toLowerCase())
      this.reveal(true)
  }

  reveal(green: boolean)
  {
    this.revealed = true
    this.green = this.green || green
  }
}

export class Word 
{
  content: string
  letters: Letter[]

  constructor(content: string) 
  {
    this.content = content
    this.letters = content.split('').map(letter => new Letter(letter))
  }

  isEqual(prompt: string): boolean
  {
    return this.content.toPlainLetters() == prompt
  }

  getLetterCount()
  {
    return this.letters.filter(letter => isValidLetter(letter.letter)).length
  }

  getRevealedLetterCount()
  {
    return this.letters.filter(letter => letter.revealed && isValidLetter(letter.letter)).length
  }

  isFullyRevealed(): boolean
  {
    return this.getRevealedLetterCount() === this.getLetterCount()
  }

  guess(prompt: string)
  {
    if (this.isEqual(prompt)) 
    {
      this.letters.forEach(letter => letter.reveal(false))
    }
  }

  guessLetter(prompt: string) 
  {
    this.letters.forEach(letter => letter.guess(prompt))
  }

  reveal(green: boolean)
  {
    this.letters.forEach(letter => letter.reveal(green))
  }
}

export class WordToGuess extends Word 
{

}

export class Definition 
{
  words: Word[]

  constructor(content: string) 
  {
    this.words = content.split(' ').map(word => new Word(word))
  }

  getLetterCount()
  {
    return this.words.reduce((acc, word) => acc + word.getLetterCount(), 0)
  }

  getRevealedLetterCount()
  {
    return this.words.reduce((acc, word) => acc + word.getRevealedLetterCount(), 0)
  }

  guessWord(prompt: string) 
  {
    this.words.forEach(word => word.guess(prompt))
  }

  guessLetter(prompt: string)
  {
    this.words.forEach(word => word.guessLetter(prompt))
  }

  reveal(green: boolean)
  {
    this.words.forEach(word => word.reveal(green))
  }
}

export class Game
{
  [immerable] = true
  
  wordToGuess: WordToGuess
  definitions: Definition[]

  guessedWords: string[]
  revealedLetters: string[]
  revealedWords: number[][]
  uncoveredWords: string[]
  failedWords: string[]

  constructor(word: string, definitions: string[])
  {
    this.wordToGuess = new WordToGuess(word)
    this.definitions = definitions.map(def => new Definition(def))
    this.guessedWords = []
    this.revealedLetters = []
    this.revealedWords = []
    this.uncoveredWords = []
    this.failedWords = []
  }

  getAllWordsInDefinitions(): string[]
  {
    const words: string[] = []
    this.definitions.forEach(def => {
      def.words.forEach(word => {
        const plainWord = word.content.toPlainLetters()
        if (plainWord && !words.includes(plainWord)) {
          words.push(plainWord)
        }
      })
    })
    return words
  }

  getFullyRevealedWordPositions(): number[][]
  {
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

  getLetterCount()
  {
    return this.definitions.reduce((acc, def) => acc + def.getLetterCount(), 0)
  }

  getRevealedLetterCount()
  {
    return this.definitions.reduce((acc, def) => acc + def.getRevealedLetterCount(), 0)
  }

  riskWordToGuess(prompt: string): 'not-full' | 'correct' | 'wrong'
  {
    const plainPrompt = prompt.toPlainLetters();
    if (plainPrompt.length < this.wordToGuess.getLetterCount())
      return 'not-full'
    else if (this.wordToGuess.isEqual(plainPrompt))
      return 'correct'
    else
      return 'wrong'
  }

  guessWord(prompt: string): 'empty' | 'already-guessed' | 'not-found' | 'ok'
  { 
    let plainPrompt = prompt.toPlainLetters()

    if (!plainPrompt)
      return 'empty'

    if (this.guessedWords.includes(plainPrompt))
      return 'already-guessed'

    this.guessedWords.push(plainPrompt)

    const wordsInDef = this.getAllWordsInDefinitions()
    const wordFound = wordsInDef.includes(plainPrompt)

    if (!wordFound) {
      this.failedWords.push(plainPrompt)
      return 'not-found'
    }

    this.definitions.forEach(def => def.guessWord(plainPrompt))
    return 'ok'
  }

  guessLetter(prompt: string): 'empty' | 'invalid-letter' | 'already-revealed' | 'no-letters-left' | 'ok'
  {
    let plainPrompt = prompt.toPlainLetters()

    if (!plainPrompt)
      return 'empty'

    if (!isValidLetter(plainPrompt))
      return 'invalid-letter'

    if (this.revealedLetters.includes(plainPrompt))
      return 'already-revealed'

    if (this.revealedLetters.length >= 3)
      return 'no-letters-left'

    this.definitions.forEach(def => def.guessLetter(plainPrompt))
    this.wordToGuess.guessLetter(plainPrompt)
    this.revealedLetters.push(plainPrompt)

    return 'ok'
  }

  revealWord(position: number[]): 'empty' | 'invalid-position' | 'already-revealed' | 'no-reveals-left' | 'ok'
  {
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
