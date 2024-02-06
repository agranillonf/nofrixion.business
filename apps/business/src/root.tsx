import './index.css'

import { useOutlet } from 'react-router-dom'

import GoogleTagManagerInjection from './components/GoogleTagManagerInjection'
import HotjarInjection from './components/HotjarInjection'
import { AuthProvider } from './lib/auth/AuthProvider'

const Root = () => {
  const outlet = useOutlet()

  return (
    <>
      <GoogleTagManagerInjection script="noscript" />

      <AuthProvider>
        <div className="font-inter h-full">{outlet}</div>
      </AuthProvider>

      <HotjarInjection />
      <GoogleTagManagerInjection script="script" />
    </>
  )
}

export default Root
