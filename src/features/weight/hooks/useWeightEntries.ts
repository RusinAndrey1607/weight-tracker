import { useCallback, useEffect, useState } from 'react'
import {
  addEntry as addStoredEntry,
  clearAll as clearStoredEntries,
  deleteEntry as deleteStoredEntry,
  DuplicateDateError,
  getEntries,
  StorageError,
  subscribeWeightEntries,
  updateEntry as updateStoredEntry,
} from '../services/weightStorageService.ts'
import type { NewWeightEntry, WeightEntry } from '../types.ts'

type UseWeightEntriesResult = {
  entries: WeightEntry[]
  loading: boolean
  error: string | null
  addEntry: (input: NewWeightEntry) => Promise<WeightEntry>
  updateEntry: (id: string, patch: Partial<NewWeightEntry>) => Promise<WeightEntry>
  deleteEntry: (id: string) => Promise<void>
  clearAll: () => Promise<void>
}

function toUserMessage(caught: unknown, fallback: string): string {
  if (caught instanceof DuplicateDateError || caught instanceof StorageError) {
    return caught.message
  }
  if (caught instanceof Error && caught.message) {
    return caught.message
  }
  return fallback
}

export function useWeightEntries(): UseWeightEntriesResult {
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setEntries(getEntries())
      setError(null)
    } catch (caught) {
      setError(toUserMessage(caught, 'Could not read saved data.'))
    } finally {
      setLoading(false)
    }

    return subscribeWeightEntries(() => {
      try {
        setEntries(getEntries())
        setError(null)
      } catch (caught) {
        setError(toUserMessage(caught, 'Could not read saved data.'))
      }
    })
  }, [])

  const addEntry = useCallback(async (input: NewWeightEntry) => {
    try {
      return addStoredEntry(input)
    } catch (caught) {
      if (caught instanceof DuplicateDateError) throw caught
      throw new Error(toUserMessage(caught, 'Could not save weight.'))
    }
  }, [])

  const updateEntry = useCallback(
    async (id: string, patch: Partial<NewWeightEntry>) => {
      try {
        return updateStoredEntry(id, patch)
      } catch (caught) {
        if (caught instanceof DuplicateDateError) throw caught
        throw new Error(toUserMessage(caught, 'Could not update entry.'))
      }
    },
    [],
  )

  const deleteEntry = useCallback(async (id: string) => {
    try {
      deleteStoredEntry(id)
    } catch (caught) {
      throw new Error(toUserMessage(caught, 'Could not delete entry.'))
    }
  }, [])

  const clearAll = useCallback(async () => {
    try {
      clearStoredEntries()
    } catch (caught) {
      throw new Error(toUserMessage(caught, 'Could not clear data.'))
    }
  }, [])

  return {
    entries,
    loading,
    error,
    addEntry,
    updateEntry,
    deleteEntry,
    clearAll,
  }
}
