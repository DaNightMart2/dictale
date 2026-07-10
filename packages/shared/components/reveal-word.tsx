import clsx from 'clsx'

export default function RevealWordInput({
  revealedWords,
  revealWordHandler,
}: {
  revealedWords: number[][]
  revealWordHandler: () => void
}) {
  const totalReveals = revealedWords.length
  const isDisabled = totalReveals >= 3

  return (
    <button
      className={clsx({
        'w-full text-white pb-3 pt-3 rounded-xl font-semibold shadow-lg transition-all duration-200': true,
        'bg-gradient-to-l from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl transform hover:scale-105 active:scale-95': revealedWords.length < 3,
        'bg-gray-300 cursor-not-allowed': revealedWords.length === 3
      })}
      onClick={() => revealWordHandler()}
      disabled={isDisabled}
    >
      <span className='text-xl font-mono'> PALABRA </span>
      <div className='flex gap-2 justify-center mt-1'>
        <div className={clsx({
          'w-2 h-2 rounded-full transition-all duration-200': true,
          'bg-white shadow-sm': revealedWords.length === 0,
          'bg-gray-300': revealedWords.length > 0
        })} />
        <div className={clsx({
          'w-2 h-2 rounded-full transition-all duration-200': true,
          'bg-white shadow-sm': revealedWords.length <= 1,
          'bg-gray-300': revealedWords.length > 1
        })} />
        <div className={clsx({
          'w-2 h-2 rounded-full transition-all duration-200': true,
          'bg-white shadow-sm': revealedWords.length <= 2,
          'bg-gray-300': revealedWords.length > 2
        })} />
      </div>
    </button>
  )
}
