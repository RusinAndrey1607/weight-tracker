import { formatUpdatedLabel, formatWeight } from '../../../utils/format.ts'
import { Button } from '../../../components/ui/Button.tsx'
import styles from './CurrentWeight.module.css'

type CurrentWeightProps = {
  weight: number | null
  updatedDate: string | null
  today: string
  onAddFirst?: () => void
}

export function CurrentWeight({
  weight,
  updatedDate,
  today,
  onAddFirst,
}: CurrentWeightProps) {
  if (weight === null) {
    return (
      <div>
        <p className={styles.label}>Current weight</p>
        <p className={styles.empty}>No data yet</p>
        {onAddFirst ? (
          <Button fullWidth onClick={onAddFirst}>
            Add your first weight
          </Button>
        ) : null}
      </div>
    )
  }

  return (
    <div>
      <p className={styles.label}>Current weight</p>
      <p className={styles.value}>
        {formatWeight(weight)}
        <span className={styles.unit}> kg</span>
      </p>
      <p className={styles.meta}>
        {updatedDate ? formatUpdatedLabel(updatedDate, today) : null}
      </p>
    </div>
  )
}
