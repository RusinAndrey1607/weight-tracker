import { Pencil, Trash2 } from 'lucide-react'
import { formatDisplayDate } from '../../../utils/date.ts'
import { formatWeight } from '../../../utils/format.ts'
import type { WeightEntry } from '../types.ts'
import styles from './WeightList.module.css'

type WeightListProps = {
  entries: WeightEntry[]
  onEdit: (entry: WeightEntry) => void
  onDelete: (entry: WeightEntry) => void
}

export function WeightList({ entries, onEdit, onDelete }: WeightListProps) {
  return (
    <div>
      {entries.map((entry) => (
        <article key={entry.id} className={styles.item}>
          <div>
            <div className={styles.date}>{formatDisplayDate(entry.date)}</div>
            <div className={styles.weight}>{formatWeight(entry.weight)} kg</div>
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.action}
              onClick={() => onEdit(entry)}
              aria-label={`Edit ${entry.date}`}
            >
              <Pencil size={16} />
              Edit
            </button>
            <button
              type="button"
              className={`${styles.action} ${styles.danger}`}
              onClick={() => onDelete(entry)}
              aria-label={`Delete ${entry.date}`}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
