import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useState } from 'react'

export default function RevealLetterInput({
  revealedLetters,
  revealLetterHandler,
}: {
  revealedLetters: string[]
  revealLetterHandler: (value: string) => void
}) {
  const inputRef = React.createRef<HTMLInputElement>()
  const divRef = React.createRef<HTMLDivElement>()

  const [inputValue, setInputValue] = useState<string>('')
  const [inputHidden, setInputHidden] = useState<boolean>(true)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(e.target as Node))
        setInputHidden(true)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [divRef])

  useEffect(() => {
    if (!inputHidden)
      inputRef.current?.focus()
  }, [inputHidden, inputRef])

  const clickHandler = () => {
    if (inputHidden && revealedLetters.length < 3) {
      setInputHidden(false)
      return
    }
    if (!inputValue) {
      setInputHidden(true)
      return
    }
    setInputValue('')
    revealLetterHandler(inputValue)
    setInputHidden(true)
  }

  return (
    <div ref={divRef} className='relative flex flex-col w-full'>
      <button
        className={clsx({
          'w-full text-white pb-3 pt-3 rounded-xl font-semibold shadow-lg transition-all duration-200': true,
          'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl transform hover:scale-105 active:scale-95': revealedLetters.length < 3,
          'bg-gray-300 cursor-not-allowed': revealedLetters.length === 3
        })}
        onClick={clickHandler}
      >
        <span className='text-lg font-mono tracking-wide'> LETRA </span>
        <div className='flex gap-2 justify-center mt-1'>
          <div className={clsx({
            'w-2 h-2 rounded-full transition-all duration-200': true,
            'bg-white shadow-sm': revealedLetters.length === 0,
            'bg-gray-300': revealedLetters.length > 0
          })} />
          <div className={clsx({
            'w-2 h-2 rounded-full transition-all duration-200': true,
            'bg-white shadow-sm': revealedLetters.length <= 1,
            'bg-gray-300': revealedLetters.length > 1
          })} />
          <div className={clsx({
            'w-2 h-2 rounded-full transition-all duration-200': true,
            'bg-white shadow-sm': revealedLetters.length <= 2,
            'bg-gray-300': revealedLetters.length > 2
          })} />
        </div>
      </button>
      <div className={clsx({
        'absolute top-full left-2/3 w-14 h-14 rounded-b-lg border-2 border-gray-300 bg-white p-1 shadow-xl z-50': true,
        'hidden': inputHidden
      })}>
        <input
          ref={inputRef}
          value={inputValue}
          type='text'
          className='w-full h-full text-center text-3xl uppercase border-b-2 border-indigo-500 focus:outline-none focus:border-indigo-600 font-bold'
          maxLength={1}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') clickHandler() }}
        />
      </div>
    </div>
  )
}
