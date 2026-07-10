import { useState, useEffect, useRef } from 'react'
import type { WordView } from '../types/game-state'

export default function FinalWord({
  wordToGuess,
  onFinalWordChange,
  riskFinalWord,
}: {
  wordToGuess: WordView
  onFinalWordChange: (value: string) => void
  riskFinalWord: () => void
}) {
  const letterCount = wordToGuess.letters.length
  const [finalWord, setFinalWord] = useState('_'.repeat(letterCount))
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const letterChangeHandler = (index: number, value: string) => {
    setFinalWord(finalWord
      .split('')
      .map((c: string, i: number) => i === index ? value : c)
      .join(''))
  }

  useEffect(() => {
    onFinalWordChange(finalWord)
  }, [finalWord])

  return (
    <span className='flex grow justify-center gap-1'>
      {wordToGuess.letters.map((_, i) => (
        <LetterField
          key={i}
          focused={focusedIndex === i}
          onChange={(value: string) => letterChangeHandler(i, value)}
          onFull={() => setFocusedIndex(i + 1)}
          onEmpty={() => setFocusedIndex(i - 1)}
          onEnter={riskFinalWord}
        />
      ))}
    </span>
  )
}

export function LetterField({
  focused,
  onChange,
  onFull,
  onEmpty,
  onEnter,
}: {
  focused: boolean
  onChange: (value: string) => void
  onFull: () => void
  onEmpty: () => void
  onEnter: () => void
}) {
  const [value, setValue] = useState('')
  const [valueAfter, setValueAfter] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(value.length, value.length)
    }
  }, [focused, value])

  const changeHandler = (letter: string) => {
    setValue(letter)
    onChange(letter || '_')
    if (letter !== '') {
      setValueAfter(letter)
      onFull()
    }
  }

  return (
    <input
      ref={inputRef}
      className='text-2xl font-bold font-mono w-8 border-b-2 border-gray-400 text-center uppercase focus:outline-none focus:border-indigo-500 transition-colors duration-200 bg-transparent text-gray-700'
      value={value}
      maxLength={1}
      onChange={e => changeHandler(e.target.value)}
      onKeyUp={e => {
        if (e.key === 'Backspace' && valueAfter === '')
          onEmpty()
        else if (e.key === 'ArrowLeft')
          onEmpty()
        else if (e.key === 'ArrowRight')
          onFull()
        else if (e.key === 'Enter')
          onEnter()
        else if (value !== '')
          onFull()
        setValueAfter(value)
      }}
    />
  )
}
