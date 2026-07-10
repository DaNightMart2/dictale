import Header from './header'

export default function Tutorial({ playHref, onPlay }: {
  playHref?: string
  onPlay?: () => void
}) {
  const playButtonClassName =
    'px-8 py-4 bg-blue-400 hover:bg-blue-500 text-white font-bold rounded-full transition-all duration-200 hover:shadow-lg transform hover:scale-105 active:scale-95'

  return (
    <div className='flex flex-col items-center relative min-h-screen py-8 px-4'>
      <div className='flex flex-col gap-4 unselectable pt-3 w-full max-w-2xl relative z-10'>
        <Header />
        <hr className='border-gray-300 my-4' />
        <div className='bg-white/90 backdrop-blur-sm border-2 rounded-xl p-6 shadow-lg mt-2 max-w-3xl mx-auto'>
          <p className='mb-4 text-gray-700'>
            ¡Bienvenido al Dictale! Este pequeño juego apelará a tus conocimientos lingüísticos y de
            habilidad de razonamiento.
          </p>
          <p className='mb-4 text-gray-700'>
            El objetivo principal del Dictale es descubrir la palabra en la parte superior del juego:
          </p>
          <div className='text-2xl tracking-widest text-center mb-6 font-mono'>
            _____
          </div>
          <div className='mt-6 mb-4 text-gray-700'>
            Como ayuda, debajo de la palabra principal, habrá una lista con una o más
            definiciones de la palabra a descubrir:
          </div>
          <p className='text-lg tracking-wide italic mb-2 text-gray-600'>
            <b>1.</b> _____ ____ ___ _______ ___ __ ___ __ ____________,
            __________ _ ___________ ____________ ___________.
          </p>
          <p className='text-lg tracking-wide italic mb-4 text-gray-600'>
            <b>2.</b> ____________, __________ _______ _____ __ ___ __ ___
            ______ _________ _ ______, _____ _ __ __ __ _______.
          </p>
          <p className='mb-4 text-gray-700'>
            Sin embargo, tanto la palabra como cada definición están ocultas. Para poder descubrir
            las definiciones, y con ellas descubrir la palabra final, habrá pistas semejantes a las
            del famoso juego del Ahorcado.
          </p>
          <div className='mt-4 mb-4'>
            <div className='flex gap-2 justify-center'>
              <input
                className='px-4 py-2 border border-gray-300 rounded-lg uppercase text-center bg-gray-100 cursor-not-allowed'
                value="HACER"
                disabled
                readOnly
              />
              <button
                className='px-6 py-2 bg-green-500 text-white font-bold rounded-lg cursor-not-allowed opacity-50'
                disabled
              >
                ENVIAR
              </button>
            </div>
          </div>
          <p className='mb-4 text-gray-700'>
            Al enviar una palabra por este campo, se descubrirán todas las instancias de esta palabra
            (escrita tal cual) en cada definición. Si la palabra no está presente en la definición se
            contará como un fallo. El objetivo es minimizar la cantidad de fallos.
          </p>
          <p className='mb-4 text-gray-700'>
            Para finalizar, deberás enviar cuál crees que es la palabra final por un campo similar,
            pero cuidado, pues solo tendrás un intento. No se contará como victoria si la palabra correcta
            es enviada por el otro campo.
          </p>
          <div className='flex justify-center gap-2 mb-4'>
            <input
              className='w-10 h-10 border border-gray-300 rounded-lg text-center uppercase bg-gray-100 cursor-not-allowed'
              value="B"
              maxLength={1}
              disabled
              readOnly
            />
            <input
              className='w-10 h-10 border border-gray-300 rounded-lg text-center uppercase bg-gray-100 cursor-not-allowed'
              value="-"
              maxLength={1}
              disabled
              readOnly
            />
            <input
              className='w-10 h-10 border border-gray-300 rounded-lg text-center uppercase bg-gray-100 cursor-not-allowed'
              value="Z"
              maxLength={1}
              disabled
              readOnly
            />
            <button
              className='px-6 py-2 bg-green-500 text-white font-bold rounded-lg cursor-not-allowed opacity-50'
              disabled
            >
              ENVIAR
            </button>
          </div>
          <p className='mb-4 text-gray-700'>
            Como empezar a adivinar palabras en la(s) definición(es) puede ser casi imposible, hay dos tipos
            de pistas más que podrás utilizar. La primera de ellas: enviando letras a través de este campo
            podrás descubrir todas las apariciones de esa letra tanto en la palabra final como en la(s)
            definición(es). Sin embargo, solo podrás usar esta herramienta tres veces, así que piensa bien
            cuando vayas a usarla.
          </p>
          <p className='mb-4 text-gray-700'>
            En segundo lugar, puedes clicar sobre una palabra oculta en la definición y descubrirla por
            completo. Esta herramienta NO te dirá si esa palabra aparece más veces en la definición y
            gastará una de las oportunidades para descubrir letras, cambiándola por un -, así que úsala cuando
            sientas importante conocer una palabra.
          </p>
          <p className='mb-6 text-gray-700'>
            ¡Y esto es todo, ya estás listo para jugar!
          </p>
          <div className='flex justify-center'>
            {playHref ? (
              <a href={playHref} className={playButtonClassName}>
                JUGAR
              </a>
            ) : (
              <button onClick={onPlay} className={playButtonClassName}>
                JUGAR
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
