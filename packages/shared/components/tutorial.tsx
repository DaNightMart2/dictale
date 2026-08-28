import Header from './header'

export default function Tutorial({ playHref, onPlay }: {
  playHref?: string
  onPlay?: () => void
}) {
  const playButtonClassName =
    'px-8 py-4 bg-green-400 hover:bg-green-500 text-white font-bold rounded-full transition-all duration-200 hover:shadow-lg transform hover:scale-105 active:scale-95'

  return (
    <div className='flex flex-col items-center relative min-h-screen py-8 px-4'>
      <div className='flex flex-col gap-4 unselectable pt-3 w-full max-w-2xl relative z-10'>
        <Header />
        <hr className='border-gray-300 my-4' />
        <div className='bg-white/90 backdrop-blur-sm border-2 rounded-xl p-6 shadow-lg mt-2 max-w-3xl mx-auto'>
          <h1 className='text-[25px] mb-4 text-gray-700 font-bold'>
            Breve argumento
          </h1>
          <p className='mb-4 text-gray-700'>
            ¡Bienvenido a Dictale! Este juego apelará a tus conocimientos lingüísticos y a tu habilidad de razonamiento.
          </p>
          <h1 className='text-[25px] mb-4 text-gray-700 font-bold'>
            Objetivo
          </h1>
          <p className='mb-4 text-gray-700'>
            El objetivo principal de Dictale es descubrir la palabra en la parte superior del juego:
          </p>
          <div className='text-2xl tracking-widest text-center mb-6 font-mono'>
            _____
          </div>
          <div className='mt-6 mb-4 text-gray-700'>
            <h1 className='text-[20px] mb-4 text-gray-700 font-bold'>
              Definiciones
            </h1>
            Como ayuda, debajo de la palabra principal, habrá una lista con una o más definiciones de la palabra a descubrir:
          </div>
          <p className='font-bold font-mono mb-4 text-gray-800 text-xl tracking-[0.3em]'>
            <b className='text-indigo-700'>1.</b> ___________, _______ ___, ___________ _ ______________, ________ _ _______ __ ___________, _ __ ________ __________ _ ___________.,
            __________ _ ___________ ____________ ___________.
          </p>
          <p className='font-bold font-mono mb-4 text-gray-800 text-xl tracking-[0.3em]'>
            <b className='text-indigo-700'>2.</b> _______ ___ _______ __ _________.
          </p>
          <h1 className='text-[20px] mb-4 text-gray-700 font-bold'>
            Palabra
          </h1>
          <p className='mb-4 text-gray-700'>
            Sin embargo, tanto la palabra como cada definición están ocultas. Para poder descubrir
            las definiciones, y con ellas descubrir la palabra final, se usa la herramienta que se encuentra debajo del progreso:
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
          <h1 className='text-[20px] mb-4 text-gray-700 font-bold'>
            Palabra final
          </h1>
          <p className='mb-4 text-gray-700'>
            Para finalizar, deberás enviar cuál crees que es la palabra final por un campo similar,
            pero cuidado, pues solo tendrás un intento. No se contará como victoria si la palabra correcta
            es enviada por el otro campo.
          </p>
          <h1 className='text-[20px] mb-4 text-gray-700 font-bold'>
            Revelar palabra
          </h1>
          <p className='mb-4 text-gray-700'>
            Como empezar a adivinar palabras en la(s) definición(es) puede ser casi imposible, hay una herramienta que te permite clicar sobre una palabra oculta en la definición para revelarla por completo. Esta herramienta NO te dirá si esa palabra aparece más veces en la definición. Solo puedes usar este recurso tres veces, así que úsalo cuando sientas importante conocer una palabra.
          </p>
          <h1 className='text-[20px] mb-4 text-gray-700 font-bold'>
            Revelar letra
          </h1>
          <div className='items-center flex gap-2 justify-center mt-4 mb-4'>
            <input
              className='w-10 h-10 border border-gray-300 rounded-lg text-center uppercase bg-gray-100 cursor-not-allowed'
              value="B"
              maxLength={1}
              disabled
              readOnly
            />
            <input
              className='w-10 h-10 border border-gray-300 rounded-lg text-center uppercase bg-gray-100 cursor-not-allowed'
              value="M"
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
          <p>Otra herramienta útil para comenzar te permite enviar letras a través de este campo, revelando todas las apariciones de esa letra en la(s) definición(es). Sin embargo, al igual que con la primera herramienta, solo se puede usar tres veces, así piensa bien cuando vayas a usarla.
          </p>

          <h1 className='text-[25px] mb-4 text-gray-700 font-bold'>
            ¡A jugar!
          </h1>
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
