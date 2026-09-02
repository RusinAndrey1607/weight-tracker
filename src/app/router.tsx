import { Navigate, Route, Routes } from 'react-router-dom'
import { HistoryPage } from '../pages/HistoryPage/HistoryPage.tsx'
import { HomePage } from '../pages/HomePage/HomePage.tsx'
import { SettingsPage } from '../pages/SettingsPage/SettingsPage.tsx'
import { AppShell } from './AppShell.tsx'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
