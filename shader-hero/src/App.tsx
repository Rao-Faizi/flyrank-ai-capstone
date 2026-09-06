import { ShaderHero } from './ShaderHero'

function App() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      <ShaderHero />
      
      {/* Real content rendered on top of the fullscreen shader */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl drop-shadow-lg">
          Central Qualification AI
        </h1>
        <p className="max-w-2xl text-lg font-medium text-slate-200 sm:text-xl drop-shadow-md">
          A truly interactive, immersive environment powered by raw WebGL shaders. 
          Move your mouse to control the digital aurora.
        </p>
      </div>
    </main>
  )
}

export default App
