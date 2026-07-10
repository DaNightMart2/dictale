import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

const tutorialLinkClassName =
  'flex items-center justify-center p-2 rounded-lg hover:bg-green-50 text-gray-600 hover:text-green-600 transition-all duration-200 hover:shadow-md transform hover:scale-110 active:scale-95'

export default function Header({ tutorialHref, onTutorialClick }: {
  tutorialHref?: string
  onTutorialClick?: () => void
}) {
  return (
    <header className='flex items-center py-4'>
      <div className='w-10' />
      <h2 className='text-4xl text-center font-bold grow bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm'>
        DICTALE
      </h2>
      {tutorialHref ? (
        <a href={tutorialHref} className={tutorialLinkClassName}>
          <QuestionMarkCircleIcon width={24} height={24} />
        </a>
      ) : onTutorialClick ? (
        <button onClick={onTutorialClick} className={tutorialLinkClassName}>
          <QuestionMarkCircleIcon width={24} height={24} />
        </button>
      ) : (
        <div className='w-10' />
      )}
    </header>
  )
}
