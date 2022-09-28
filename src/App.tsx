import Canvas from './components/Canvas'
import { ReactComponent as Icon } from './assets/icon.svg'

function App() {
  return (
    <>
      <a
        href="https://ivc17.github.io/gallery/white_noise"
        className="icon"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon />
      </a>

      <div className="title">WHITE_NOISE</div>
      <Canvas></Canvas>
    </>
  )
}

export default App
