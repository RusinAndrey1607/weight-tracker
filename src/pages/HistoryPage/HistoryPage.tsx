import { useState } from 'react'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.tsx'
import { EmptyState } from '../../components/ui/EmptyState.tsx'
import { ScreenStatus } from '../../components/ui/ScreenStatus.tsx'
import { AddWeightSheet } from '../../features/weight/components/AddWeightSheet.tsx'
import { WeightList } from '../../features/weight/components/WeightList.tsx'
import { useWeightEntries } from '../../features/weight/hooks/useWeightEntries.ts'
import type { WeightEntry } from '../../features/weight/types.ts'
import styles from './HistoryPage.module.css'

export function HistoryPage() {
  const { entries, loading, error, addEntry, updateEntry, deleteEntry } = useWeightEntries()
  const [editing, setEditing] = useState<WeightEntry | null>(null)
  const [pendingDelete, setPendingDelete] = useState<WeightEntry | null>(null)

  if (loading) {
    return <ScreenStatus message="Loading…" />
  }

  if (error) {
    return <ScreenStatus tone="error" message={error} />
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    try {
      await deleteEntry(pendingDelete.id)
      setPendingDelete(null)
    } catch (caught) {
      window.alert(caught instanceof Error ? caught.message : 'Could not delete entry.')
    }
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        title="No measurements yet"
        text="When you add a weight, it will show up here."
      />
    )
  }

  return (
    <div>
      <h1 className={styles.title}>History</h1>
      <WeightList entries={entries} onEdit={setEditing} onDelete={setPendingDelete} />
      {editing ? (
        <AddWeightSheet
          entries={entries}
          initial={editing}
          onClose={() => setEditing(null)}
          onAdd={addEntry}
          onUpdate={updateEntry}
        />
      ) : null}
      {pendingDelete ? (
        <ConfirmDialog
          title="Delete this measurement?"
          message="This cannot be undone."
          confirmLabel="Delete"
          danger
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      ) : null}
    </div>
  )
}
