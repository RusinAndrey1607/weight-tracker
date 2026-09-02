import { useRef, useState } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.tsx'
import { ScreenStatus } from '../../components/ui/ScreenStatus.tsx'
import { useWeightEntries } from '../../features/weight/hooks/useWeightEntries.ts'
import { exportData, importData } from '../../features/weight/services/weightStorageService.ts'
import { useTheme, type Theme } from '../../lib/theme.tsx'
import styles from './SettingsPage.module.css'

const APP_VERSION = '0.1.0'

export function SettingsPage() {
  const { loading, error, clearAll } = useWeightEntries()
  const { theme, setTheme } = useTheme()
  const fileInput = useRef<HTMLInputElement>(null)
  const [pendingImport, setPendingImport] = useState<unknown | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleExport() {
    try {
      const payload = exportData()
      const json = JSON.stringify(payload, null, 2)
      const file = new File([json], 'weight-tracker.json', { type: 'application/json' })

      const canShareFiles =
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })

      if (canShareFiles) {
        await navigator.share({ files: [file], title: 'Weight Tracker' })
        return
      }

      if (typeof navigator.share === 'function') {
        await navigator.share({ title: 'Weight Tracker', text: json })
        return
      }

      const url = URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name
      link.click()
      URL.revokeObjectURL(url)
    } catch (caught) {
      if (caught instanceof Error && caught.name === 'AbortError') return
      setMessage(caught instanceof Error ? caught.message : 'Could not export data.')
    }
  }

  async function handleFile(file: File) {
    try {
      const text = await file.text()
      const parsed: unknown = JSON.parse(text)
      setPendingImport(parsed)
      setMessage(null)
    } catch {
      setMessage('Invalid data file.')
    }
  }

  async function confirmImport() {
    if (pendingImport === null) return
    setBusy(true)
    try {
      importData(pendingImport)
      setPendingImport(null)
      setMessage('Data imported.')
    } catch (caught) {
      setPendingImport(null)
      setMessage(caught instanceof Error ? caught.message : 'Invalid data file.')
    } finally {
      setBusy(false)
    }
  }

  async function confirmClearAll() {
    setBusy(true)
    try {
      await clearAll()
      setConfirmClear(false)
      setMessage('All data deleted.')
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : 'Could not clear data.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return <ScreenStatus message="Loading…" />
  }

  if (error) {
    return <ScreenStatus tone="error" message={error} />
  }

  return (
    <div>
      <h1 className={styles.title}>Settings</h1>

      <h2 className={styles.section}>Data</h2>
      <Card>
        <div className={styles.stack}>
          <Button variant="secondary" fullWidth onClick={handleExport}>
            Export data
          </Button>
          <Button variant="secondary" fullWidth onClick={() => fileInput.current?.click()}>
            Import data
          </Button>
          <Button variant="danger" fullWidth onClick={() => setConfirmClear(true)}>
            Clear all data
          </Button>
        </div>
      </Card>

      <h2 className={styles.section}>Appearance</h2>
      <Card>
        <div className={styles.themes} role="group" aria-label="Theme">
          {(['dark', 'light'] as Theme[]).map((option) => (
            <button
              key={option}
              type="button"
              className={[styles.theme, theme === option ? styles.themeActive : ''].join(' ')}
              onClick={() => setTheme(option)}
            >
              {option === 'dark' ? 'Dark' : 'Light'}
            </button>
          ))}
        </div>
      </Card>

      <h2 className={styles.section}>About</h2>
      <Card>
        <div className={styles.row}>
          <span className={styles.label}>Version</span>
          <span className={styles.value}>{APP_VERSION}</span>
        </div>
      </Card>

      {message ? <p className={styles.message}>{message}</p> : null}

      <input
        ref={fileInput}
        className={styles.hidden}
        type="file"
        accept="application/json,.json"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void handleFile(file)
          event.target.value = ''
        }}
      />

      {pendingImport !== null ? (
        <ConfirmDialog
          title="Replace current data?"
          message="Imported measurements will replace everything saved on this device."
          confirmLabel="Import"
          pending={busy}
          onCancel={() => setPendingImport(null)}
          onConfirm={confirmImport}
        />
      ) : null}

      {confirmClear ? (
        <ConfirmDialog
          title="Delete all weight data?"
          message="This will remove every measurement stored on this device."
          confirmLabel="Delete"
          danger
          pending={busy}
          onCancel={() => setConfirmClear(false)}
          onConfirm={confirmClearAll}
        />
      ) : null}
    </div>
  )
}
