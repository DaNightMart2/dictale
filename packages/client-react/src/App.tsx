import { GamePage } from '@shared/components'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function App() {
  return <GamePage apiBase={API_URL} />
}
