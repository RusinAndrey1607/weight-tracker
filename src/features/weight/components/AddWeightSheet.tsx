import { useState, type FormEvent } from 'react'
import { BottomSheet } from '../../../components/ui/BottomSheet.tsx'
import { Button } from '../../../components/ui/Button.tsx'
import { getToday } from '../../../utils/date.ts'
import { DuplicateDateError } from '../services/weightStorageService.ts'
import { MAX_WEIGHT, type WeightEntry } from '../types.ts'
import { findEntryByDate } from '../utils/calculations.ts'
import styles from './AddWeightSheet.module.css'

type AddWeightSheetProps = {
  entries: WeightEntry[]
  initial?: WeightEntry | null
  onClose: () => void
  onAdd: (input: { weight: number; date: string }) => Promise<WeightEntry>
  onUpdate: (id: string, patch: { weight: number; date: string }) => Promise<WeightEntry>
}

export function AddWeightSheet({
  entries,
  initial = null,
  onClose,
  onAdd,
  onUpdate,
}: AddWeightSheetProps) {
  const [weight, setWeight] = useState(initial ? String(initial.weight) : '')
  const [date, setDate] = useState(initial?.date ?? getToday())
  const [error, setError] = useState<string | null>(null)
  const [pendingOverwrite, setPendingOverwrite] = useState<WeightEntry | null>(null)
  const [saving, setSaving] = useState(false)

  const title = initial ? 'Edit weight' : 'Add weight'
  const today = getToday()

  async function save(targetId?: string) {
    const parsed = Number(weight.replace(',', '.'))

    if (!weight.trim() || Number.isNaN(parsed)) {
      setError('Enter a weight')
      return
    }
    if (parsed <= 0) {
      setError('Weight must be greater than 0')
      return
    }
    if (parsed > MAX_WEIGHT) {
      setError('Weight must be 500 kg or less')
      return
    }

    setSaving(true)
    setError(null)

    try {
      if (targetId) {
        await onUpdate(targetId, { weight: parsed, date })
      } else {
        await onAdd({ weight: parsed, date })
      }
      onClose()
    } catch (caught) {
      if (caught instanceof DuplicateDateError) {
        setPendingOverwrite(caught.existing)
      } else {
        setError(caught instanceof Error ? caught.message : 'Could not save weight.')
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (initial) {
      await save(initial.id)
      return
    }

    const existing = findEntryByDate(entries, date)
    if (existing) {
      setPendingOverwrite(existing)
      return
    }

    await save()
  }

  const alreadyToday = date === today

  if (pendingOverwrite) {
    return (
      <BottomSheet title="Already recorded" onClose={onClose}>
        <p className={styles.confirm}>
          {alreadyToday
            ? 'Weight for today is already recorded. Change the existing value?'
            : 'Weight for this day is already recorded. Change the existing value?'}
        </p>
        <div className={styles.actions}>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" disabled={saving} onClick={() => save(pendingOverwrite.id)}>
            Change
          </Button>
        </div>
      </BottomSheet>
    )
  }

  return (
    <BottomSheet title={title} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="weight">
          Weight
        </label>
        <div className={styles.field}>
          <input
            id="weight"
            className={styles.input}
            inputMode="decimal"
            enterKeyHint="done"
            autoComplete="off"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            placeholder="78.4"
            autoFocus
          />
          <span className={styles.unit}>kg</span>
        </div>

        <label className={styles.label} htmlFor="date">
          Date
        </label>
        <div className={styles.field}>
          <input
            id="date"
            className={styles.input}
            type="date"
            value={date}
            max={today}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        {date === today ? <p className={styles.hint}>Today</p> : null}

        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.actions}>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            Save
          </Button>
        </div>
      </form>
    </BottomSheet>
  )
}
