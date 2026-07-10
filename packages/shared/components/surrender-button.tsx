import { FlagIcon } from '@heroicons/react/24/outline'

export default function SurrenderButton({
  onSurrender,
  disabled,
}: {
  onSurrender: () => void
  disabled?: boolean
}) {
  return (
    <div>
      <button
        onClick={onSurrender}
        disabled={disabled}
        className='flex items-center justify-center p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200 hover:shadow-md transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-transparent'
      >
        <FlagIcon width={24} height={24} />
      </button>
    </div>
  )
}
