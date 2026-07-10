import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

export default function GuessWordInput({
  guessWordHandler,
  errorMsg,
}: {
  guessWordHandler: (value: string) => void
  errorMsg: string
}) {
  const [word, setWord] = useState('')

  const clickHandler = (w: string) => {
    if (!w) return
    guessWordHandler(w)
    setWord('')
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-3'>
        <input
          className='grow border-2 border-gray-300 rounded-full text-center h-12 uppercase font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md'
          value={word}
          onChange={e => setWord(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && clickHandler(word)}
          placeholder='Ingresa una palabra...'
        />
        <button
          className='flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white w-12 h-12 shadow-md hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 active:scale-95'
          onClick={() => clickHandler(word)}
        >
          <ArrowRightIcon width={24} height={24} />
        </button>
      </div>
      <div className='min-h-[20px]'>
        {errorMsg && (
          <span className='text-red-600 text-sm font-medium flex items-center gap-1 animate-pulse'>
            <span>⚠</span> {errorMsg}
          </span>
        )}
      </div>
    </div>
  )
}
