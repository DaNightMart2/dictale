import clsx from 'clsx'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function RiskFinalButton({
  riskWordToGuessHandler,
  disabled,
}: {
  riskWordToGuessHandler: () => void
  disabled?: boolean
}) {
  return (
    <div>
      <button
        className={clsx(
          'flex items-center justify-center p-2 rounded-lg transition-all duration-200',
          disabled
            ? 'opacity-50 cursor-not-allowed text-gray-400'
            : 'hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 hover:shadow-md transform hover:scale-110 active:scale-95'
        )}
        onClick={riskWordToGuessHandler}
        disabled={disabled}
      >
        <ArrowRightIcon width={24} height={24} />
      </button>
    </div>
  )
}
