'use client';

import { useState, useRef, useEffect } from 'react';
import { produce } from 'immer';
import clsx from 'clsx';

import Header from '../ui/header';
import SurrenderButton from '../ui/surrender-button';
import RiskFinalButton from '../ui/risk-final-button';
import FinalWord from '../ui/final-word';
import Definitions from '../ui/definitions';
import Progress from '../ui/progress';
import GuessWordInput from '../ui/guess-word-input';
import RevealLetterInput from '../ui/reveal-letter';
import RevealWordInput from '../ui/reveal-word';
import { Game } from '../lib/defs';
import { getWordOfTheDay } from '../lib/dictionary';

const errorMessages = {
  'empty': 'Por favor, ingrese una palabra.',
  'not-found': 'La palabra ingresada no es correcta.',
  'not-full': 'Complete la palabra.',
  'already-guessed': 'La palabra ya fue adivinada.',
  'invalid-letter': 'Por favor, ingrese una letra.',
  'already-revealed': 'La letra ya fue revelada.',
  'invalid-position': 'Posición inválida.',
  'no-reveals-left': 'Ya has usado todas tus pistas.',
  'no-letters-left': 'Ya has usado todas tus pistas.',
  'wrong': 'Incorrecto.',
  'ok': '',
}

export default function Page() 
{
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const [finalWord, setFinalWord] = useState<string>('')
  const [guessedWordError, setGuessedWordError] = useState<string>('')
  const [revealingWord, setRevealingWord] = useState<boolean>(false)
  const [gameEnded, setGameEnded] = useState<boolean>(false)
  const [gameWon, setGameWon] = useState<boolean>(false)
  const definitionsBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function initializeGame() {
      const wordData = await getWordOfTheDay();
      setGame(new Game(wordData.word, wordData.definitions));
      setLoading(false);
    }
    
    initializeGame();
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (revealingWord && definitionsBoxRef.current && !definitionsBoxRef.current.contains(event.target as Node)) {
        setRevealingWord(false)
        setGuessedWordError('')
      }
    }

    if (revealingWord) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [revealingWord])

  const riskWordToGuess = () => {
    if (gameEnded || !game) return

    setGame(produce(game, draft => {
      if (!draft) return
      const response = draft.riskWordToGuess(finalWord)
      if (response === 'not-full') {
        setGuessedWordError(errorMessages[response]);
        return;
      }
      if (response === 'correct') {
        setGameWon(true)
        setGameEnded(true)
      } else if (response === 'wrong') {
        setGameWon(false)
        setGameEnded(true)
      } else {
        setGuessedWordError(errorMessages[response] || 'Error desconocido.')
      }
    }))
  }
  
  const guessWord = (prompt: string) => {
    if (gameEnded || !game) return
    setGame(produce(game, draft => {
      if (!draft) return
      const response = draft.guessWord(prompt)
      setGuessedWordError(errorMessages[response])
    }))
  }

  const revealLetter = (letter: string) => {
    if (gameEnded || !game) return
    setGame(produce(game, draft => {
      if (!draft) return
      const response = draft.guessLetter(letter)
      setGuessedWordError(errorMessages[response])
    }))
  }

  const startRevealWord = () => {
    if (gameEnded || !game) return
    if (game.revealedWords.length >= 3) {
      setGuessedWordError(errorMessages['no-reveals-left'])
      return
    }
    
    setRevealingWord(!revealingWord)
    setGuessedWordError('')
  }

  const revealWord = (position: number[]) => {
    if (gameEnded || !revealingWord || !game) return
    
    setGame(produce(game, draft => {
      if (!draft) return
      const response = draft.revealWord(position)
      if (response === 'ok')
        setRevealingWord(false)
      else
        setGuessedWordError(errorMessages[response] || 'Error desconocido.')
    }))
  }

  if (loading || !game) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <div className='text-lg text-gray-600'>Cargando...</div>
      </div>
    )
  }

  const progress = Math.floor(100 * game.getRevealedLetterCount() / game.getLetterCount())
  return (
    <div className='flex flex-col items-center relative min-h-screen py-8 px-4'>
      {revealingWord && (
        <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-0 transition-all duration-300' />
      )}
      <div className='flex flex-col gap-4 unselectable pt-3 w-full max-w-2xl relative z-10'>
        <div className={clsx({
          'blur-sm opacity-50 pointer-events-none transition-all duration-300': revealingWord
        })}>
          <Header />
          <hr className='border-gray-300 my-4' />
          <div className='relative mt-6 mb-4'>
            <div className='flex justify-center items-center gap-3'>
              <SurrenderButton onSurrender={() => { if (confirm('¿Estás seguro de que quieres rendirte?')) { setGameWon(false); setGameEnded(true); } }} disabled={gameEnded} />
              <FinalWord wordToGuess={game.wordToGuess} onFinalWordChange={setFinalWord} riskFinalWord={riskWordToGuess}/>
              <RiskFinalButton riskWordToGuessHandler={riskWordToGuess} disabled={gameEnded} />
            </div>
          </div>
          {gameEnded && (
            <div className={clsx(
              'mt-4 p-4 border-2 rounded-xl text-center shadow-lg transition-all duration-300',
              gameWon 
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
                : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
            )}>
              <div className={clsx(
                'text-2xl font-bold mb-2',
                gameWon ? 'text-green-600' : 'text-red-600'
              )}>
                {gameWon ? '🎉 ¡Has adivinado la palabra!' : '😔 Más suerte la próxima vez...'}
              </div>
              <div className='text-base text-gray-700'>
                La palabra era: <span className='font-bold text-gray-900'>{game.wordToGuess.content.toUpperCase()}</span>
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
          <Definitions 
          definitions={game.definitions}
          revealingWord={revealingWord}
          revealedWords={game.getFullyRevealedWordPositions()}
          onWordClick={revealWord}
        />
        </div>
        <div className={clsx({
          'blur-sm opacity-50 pointer-events-none transition-all duration-300': revealingWord,
          'flex flex-col gap-4': true,
        })}>
          <Progress progress={progress}/>
          <div className='flex flex-col gap-4'>
            <div className='flex-1'>
              <GuessWordInput 
                guessWordHandler={guessWord} 
                errorMsg={guessedWordError}
              />
            </div>
            {game.failedWords.length > 0 && (
              <div className='flex-shrink-0 w-full bg-red-50 border-2 border-red-200 rounded-lg p-4 shadow-sm'>
                <div className='text-sm font-semibold text-red-700 mb-2 flex items-center gap-2'>
                  <span className='text-red-500'>✗</span>
                  Fallos ({game.failedWords.length})
                </div>
                <ul className='text-xs text-red-600 flex flex-wrap gap-2 items-center'>
                  {game.failedWords.length > 6 ? (
                    <>
                      {game.failedWords.slice(0, 2).map((word, i) => (
                        <li key={i} className='font-mono'>{word.toUpperCase()}</li>
                      ))}
                      <li className='text-gray-400'>...</li>
                      {game.failedWords.slice(-3).map((word, i) => (
                        <li key={game.failedWords.length - 3 + i} className='font-mono'>{word.toUpperCase()}</li>
                      ))}
                    </>
                  ) : (
                    game.failedWords.map((word, i) => (
                      <li key={i} className='font-mono'>{word.toUpperCase()}</li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className='flex justify-center gap-4 mt-2'>
            <RevealLetterInput
              revealedLetters={game.revealedLetters}
              revealLetterHandler={revealLetter}
            />
            <RevealWordInput 
              revealedWords={game.revealedWords}
              revealWordHandler={startRevealWord}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
