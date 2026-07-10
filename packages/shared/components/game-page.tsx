import { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'

import Header from './header'
import Tutorial from './tutorial'
import SurrenderButton from './surrender-button'
import RiskFinalButton from './risk-final-button'
import FinalWord from './final-word'
import Definitions from './definitions'
import Progress from './progress'
import GuessWordInput from './guess-word-input'
import RevealLetterInput from './reveal-letter'
import RevealWordInput from './reveal-word'
import type { GameStateView } from '../types/game-state'

const errorMessages: Record<string, string> = {
  empty: 'Por favor, ingrese una palabra.',
  'not-found': 'La palabra ingresada no es correcta.',
  'not-full': 'Complete la palabra.',
  'already-guessed': 'La palabra ya fue adivinada.',
  'invalid-letter': 'Por favor, ingrese una letra.',
  'already-revealed': 'La letra ya fue revelada.',
  'invalid-position': 'Posición inválida.',
  'no-reveals-left': 'Ya has usado todas tus pistas.',
  'no-letters-left': 'Ya has usado todas tus pistas.',
  wrong: 'Incorrecto.',
  ok: '',
}

export default function GamePage({ apiBase = '', tutorialHref }: {
  /** Prefix for API requests, e.g. 'http://localhost:8000'. Empty = same origin. */
  apiBase?: string
  /** Route of the tutorial page. When absent, the tutorial is toggled in place. */
  tutorialHref?: string
}) {
  const [gameId, setGameId] = useState<string | null>(null)
  const [state, setState] = useState<GameStateView | null>(null)
  const [loading, setLoading] = useState(true)

  const [finalWord, setFinalWord] = useState('')
  const [guessedWordError, setGuessedWordError] = useState('')
  const [revealingWord, setRevealingWord] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const definitionsBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function init() {
      const res = await fetch(`${apiBase}/api/game`, { method: 'POST' })
      const { gameId: id, state: s } = await res.json()
      setGameId(id)
      setState(s)
      setLoading(false)
    }
    init()
  }, [apiBase])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (revealingWord && definitionsBoxRef.current && !definitionsBoxRef.current.contains(event.target as Node)) {
        setRevealingWord(false)
        setGuessedWordError('')
      }
    }
    if (revealingWord) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [revealingWord])

  const apiCall = async (path: string, body: object) => {
    if (!gameId) return null
    const res = await fetch(`${apiBase}/api/game/${gameId}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.json()
  }

  const riskWordToGuess = async () => {
    if (!state?.gameEnded) {
      const data = await apiCall('/guess-final', { word: finalWord })
      if (data) {
        setState(data.state)
        if (data.result === 'not-full') setGuessedWordError(errorMessages['not-full'])
      }
    }
  }

  const guessWord = async (word: string) => {
    const data = await apiCall('/guess-word', { word })
    if (data) {
      setState(data.state)
      setGuessedWordError(errorMessages[data.result] || '')
    }
  }

  const revealLetter = async (letter: string) => {
    const data = await apiCall('/guess-letter', { letter })
    if (data) {
      setState(data.state)
      setGuessedWordError(errorMessages[data.result] || '')
    }
  }

  const startRevealWord = () => {
    if (state && state.revealedWords.length >= 3) {
      setGuessedWordError(errorMessages['no-reveals-left'])
      return
    }
    setRevealingWord(!revealingWord)
    setGuessedWordError('')
  }

  const revealWord = async (position: number[]) => {
    const data = await apiCall('/reveal-word', { defIndex: position[0], wordIndex: position[1] })
    if (data) {
      setState(data.state)
      if (data.result === 'ok') setRevealingWord(false)
      else setGuessedWordError(errorMessages[data.result] || '')
    }
  }

  const surrender = async () => {
    if (confirm('¿Estás seguro de que quieres rendirte?')) {
      const data = await apiCall('/surrender', {})
      if (data) setState(data.state)
    }
  }

  if (showTutorial) {
    return <Tutorial onPlay={() => setShowTutorial(false)} />
  }

  if (loading || !state) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <div className='text-lg text-gray-600'>Cargando...</div>
      </div>
    )
  }

  const wordContent = state.answer ?? state.wordToGuess.letters.map(l => l.revealed ? l.char : '_').join('')

  return (
    <div className='flex flex-col items-center relative min-h-screen py-8 px-4'>
      {revealingWord && (
        <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-0 transition-all duration-300' />
      )}
      <div className='flex flex-col gap-4 unselectable pt-3 w-full max-w-2xl relative z-10'>
        <div className={clsx({ 'blur-sm opacity-50 pointer-events-none transition-all duration-300': revealingWord })}>
          <Header
            tutorialHref={tutorialHref}
            onTutorialClick={tutorialHref ? undefined : () => setShowTutorial(true)}
          />
          <hr className='border-gray-300 my-4' />
          <div className='relative mt-6 mb-4'>
            <div className='flex justify-center items-center gap-3'>
              <SurrenderButton onSurrender={surrender} disabled={state.gameEnded} />
              <FinalWord
                wordToGuess={state.wordToGuess}
                onFinalWordChange={setFinalWord}
                riskFinalWord={riskWordToGuess}
              />
              <RiskFinalButton riskWordToGuessHandler={riskWordToGuess} disabled={state.gameEnded} />
            </div>
          </div>
          {(state.gameWon || state.gameEnded) && (
            <div
              className={clsx(
                'mt-4 p-4 border-2 rounded-xl text-center shadow-lg transition-all duration-300',
                state.gameWon
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                  : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
              )}
            >
              <div className={clsx('text-2xl font-bold mb-2', state.gameWon ? 'text-green-600' : 'text-red-600')}>
                {state.gameWon
                  ? state.progress === 100
                    ? '¡Perfecto! Has adivinado la palabra y todas las definiciones.'
                    : '¡Has adivinado la palabra!'
                  : 'Más suerte la próxima vez...'}
              </div>
              <div className='text-base text-gray-700 mb-3'>
                La palabra era: <span className='font-bold text-gray-900'>{wordContent.toUpperCase()}</span>
              </div>
            </div>
          )}
        </div>
        <div
          ref={definitionsBoxRef}
          className={clsx(
            'bg-white/90 backdrop-blur-sm border-2 rounded-xl p-6 relative z-20 shadow-lg transition-all duration-300',
            revealingWord ? 'ring-4 ring-yellow-400 ring-opacity-60 shadow-2xl scale-105' : 'border-gray-200 hover:shadow-xl'
          )}
        >
          <Definitions state={state} revealingWord={revealingWord} onWordClick={revealWord} />
        </div>
        <div className={clsx({ 'blur-sm opacity-50 pointer-events-none transition-all duration-300': revealingWord, 'flex flex-col gap-4': true })}>
          <Progress progress={state.progress} />
          <div className='flex flex-col gap-4'>
            <GuessWordInput guessWordHandler={guessWord} errorMsg={guessedWordError} />
            {state.failedWords.length > 0 && (
              <div className='flex-shrink-0 w-full bg-red-50 border-2 border-red-200 rounded-lg p-4 shadow-sm'>
                <div className='text-sm font-semibold text-red-700 mb-2 flex items-center gap-2'>
                  <span className='text-red-500'>✗</span>
                  Fallos ({state.failedWords.length})
                </div>
                <ul className='text-xs text-red-600 flex flex-wrap gap-2 items-center'>
                  {state.failedWords.slice(0, 6).map((word, i) => (
                    <li key={i} className='font-mono'>{word.toUpperCase()}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className='flex justify-center gap-4 mt-2'>
            <RevealLetterInput revealedLetters={state.revealedLetters} revealLetterHandler={revealLetter} />
            <RevealWordInput revealedWords={state.revealedWords} revealWordHandler={startRevealWord} />
          </div>
        </div>
      </div>
    </div>
  )
}
