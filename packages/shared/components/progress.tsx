import clsx from 'clsx'

export default function Progress({ progress }: { progress: number }) {
  return (
    <div className='relative border-2 border-gray-200 rounded-full h-8 bg-gray-50 shadow-inner overflow-hidden'>
      <div
        className='bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full h-full transition-all duration-500 ease-out shadow-md'
        style={{ width: `${progress}%` }}
      />
      <div className='absolute inset-0 flex items-center justify-center'>
        <span className={clsx({
          'text-sm font-bold drop-shadow-sm': true,
          'text-gray-700': progress < 50,
          'text-white': progress >= 50
        })}>
          {progress}%
        </span>
      </div>
    </div>
  )
}
