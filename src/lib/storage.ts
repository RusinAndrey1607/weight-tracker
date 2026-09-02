const canUseStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

export function readJson(key: string): unknown | null {
  if (!canUseStorage) return null

  const raw = window.localStorage.getItem(key)
  if (raw === null) return null

  try {
    return JSON.parse(raw) as unknown
  } catch {
    throw new Error('Saved data is corrupted.')
  }
}

export function writeJson(key: string, value: unknown): void {
  if (!canUseStorage) return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeItem(key: string): void {
  if (!canUseStorage) return
  window.localStorage.removeItem(key)
}
