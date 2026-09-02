import { readJson, writeJson } from '../../../lib/storage.ts'
import { isValidISODate } from '../../../utils/date.ts'
import { roundWeight } from '../../../utils/format.ts'
import {
  DATA_VERSION,
  MAX_WEIGHT,
  STORAGE_KEY,
  type NewWeightEntry,
  type WeightEntry,
  type WeightExport,
  type WeightStore,
} from '../types.ts'
import { findEntryByDate, sortEntriesByDate } from '../utils/calculations.ts'

const listeners = new Set<() => void>()

let cache: WeightEntry[] | null = null
let loadError: string | null = null

export class DuplicateDateError extends Error {
  existing: WeightEntry

  constructor(existing: WeightEntry) {
    super(
      existing.date
        ? 'Weight for this day is already recorded.'
        : 'Weight for today is already recorded.',
    )
    this.name = 'DuplicateDateError'
    this.existing = existing
  }
}

export class StorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StorageError'
  }
}

function emit(): void {
  for (const listener of listeners) {
    listener()
  }
}

export function subscribeWeightEntries(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isValidWeight(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= MAX_WEIGHT
}

function parseEntry(value: unknown): WeightEntry {
  if (!isRecord(value)) {
    throw new StorageError('Invalid data file.')
  }

  const { id, weight, date, createdAt, updatedAt } = value

  if (
    typeof id !== 'string' ||
    id.length === 0 ||
    !isValidWeight(weight) ||
    typeof date !== 'string' ||
    !isValidISODate(date) ||
    typeof createdAt !== 'string' ||
    typeof updatedAt !== 'string'
  ) {
    throw new StorageError('Invalid data file.')
  }

  return {
    id,
    weight: roundWeight(weight),
    date,
    createdAt,
    updatedAt,
  }
}

function parseStore(value: unknown): WeightStore {
  if (value === null) {
    return { version: DATA_VERSION, entries: [] }
  }

  if (!isRecord(value)) {
    throw new StorageError('Saved data is corrupted.')
  }

  if (typeof value.version !== 'number') {
    throw new StorageError('Saved data is corrupted.')
  }

  if (value.version !== DATA_VERSION) {
    throw new StorageError('Saved data version is not supported.')
  }

  if (!Array.isArray(value.entries)) {
    throw new StorageError('Saved data is corrupted.')
  }

  const entries = value.entries.map(parseEntry)
  const dates = new Set<string>()

  for (const entry of entries) {
    if (dates.has(entry.date)) {
      throw new StorageError('Saved data contains duplicate dates.')
    }
    dates.add(entry.date)
  }

  return { version: DATA_VERSION, entries }
}

function persist(entries: WeightEntry[]): void {
  cache = entries
  loadError = null
  writeJson(STORAGE_KEY, { version: DATA_VERSION, entries } satisfies WeightStore)
  emit()
}

function ensureLoaded(): WeightEntry[] {
  if (loadError) {
    throw new StorageError(loadError)
  }

  if (cache) {
    return cache
  }

  try {
    const store = parseStore(readJson(STORAGE_KEY))
    cache = store.entries
    return cache
  } catch (caught) {
    const message =
      caught instanceof StorageError ? caught.message : 'Saved data is corrupted.'
    loadError = message
    throw new StorageError(message)
  }
}

export function getEntries(): WeightEntry[] {
  return sortEntriesByDate(ensureLoaded(), 'desc')
}

export function addEntry(input: NewWeightEntry): WeightEntry {
  const entries = ensureLoaded()
  const existing = findEntryByDate(entries, input.date)

  if (existing) {
    throw new DuplicateDateError(existing)
  }

  const now = new Date().toISOString()
  const entry: WeightEntry = {
    id: crypto.randomUUID(),
    weight: roundWeight(input.weight),
    date: input.date,
    createdAt: now,
    updatedAt: now,
  }

  persist([...entries, entry])
  return entry
}

export function updateEntry(id: string, patch: Partial<NewWeightEntry>): WeightEntry {
  const entries = ensureLoaded()
  const current = entries.find((entry) => entry.id === id)

  if (!current) {
    throw new StorageError('Entry not found.')
  }

  if (patch.date && patch.date !== current.date) {
    const clash = findEntryByDate(entries, patch.date)
    if (clash) {
      throw new DuplicateDateError(clash)
    }
  }

  const updated: WeightEntry = {
    ...current,
    ...patch,
    weight: patch.weight === undefined ? current.weight : roundWeight(patch.weight),
    updatedAt: new Date().toISOString(),
  }

  persist(entries.map((entry) => (entry.id === id ? updated : entry)))
  return updated
}

export function deleteEntry(id: string): void {
  persist(ensureLoaded().filter((entry) => entry.id !== id))
}

export function clearAll(): void {
  persist([])
}

export function exportData(): WeightExport {
  return {
    version: DATA_VERSION,
    exportedAt: new Date().toISOString(),
    entries: sortEntriesByDate(ensureLoaded(), 'desc'),
  }
}

export function importData(payload: unknown): void {
  try {
    const store = parseStore(payload)
    persist(store.entries)
  } catch {
    throw new StorageError('Invalid data file.')
  }
}
