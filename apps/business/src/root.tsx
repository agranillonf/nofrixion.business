import './index.css'

import { useOutlet } from 'react-router-dom'

import GoogleTagManagerInjection from './components/GoogleTagManagerInjection'
import HotjarInjection from './components/HotjarInjection'

const Root = () => {
  const outlet = useOutlet()

  return (
    <>
      <GoogleTagManagerInjection script="noscript" />

      <div className="font-inter h-full">{outlet}</div>

      <HotjarInjection />
      <GoogleTagManagerInjection script="script" />
    </>
  )
}

export default Root
