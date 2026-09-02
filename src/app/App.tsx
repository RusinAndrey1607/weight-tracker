import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '../lib/theme.tsx'
import { AppRouter } from './router.tsx'

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  )
}
