import RealEstateViewerWrapper from './components/3d/RealEstateViewerWrapper';

function App() {
  return (
    <div className="w-full h-screen bg-zinc-950">
      {/* 3D viewer is designed to take the height of its container (calc(100vh-64px) originally, we can make it full screen) */}
      <RealEstateViewerWrapper />
    </div>
  )
}

export default App
