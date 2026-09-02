import { formatSignedWeight, formatWeight } from '../../../utils/format.ts'
import styles from './StatsCard.module.css'

type StatsCardProps = {
  current: number | null
  change7d: number | null
  weeklyAverage: number | null
  previousWeek: number | null
}

function Stat({
  label,
  value,
}: {
  label: string
  value: string | null
}) {
  return (
    <div className={styles.stat}>
      <p className={styles.label}>{label}</p>
      <p className={value === null ? styles.muted : styles.value}>
        {value ?? 'Not enough data'}
      </p>
    </div>
  )
}

export function StatsCard({
  current,
  change7d,
  weeklyAverage,
  previousWeek,
}: StatsCardProps) {
  return (
    <div className={styles.grid}>
      <Stat
        label="Current weight"
        value={current === null ? null : `${formatWeight(current)} kg`}
      />
      <Stat
        label="7 day change"
        value={change7d === null ? null : formatSignedWeight(change7d)}
      />
      <Stat
        label="This week"
        value={weeklyAverage === null ? null : `${formatWeight(weeklyAverage)} kg`}
      />
      <Stat
        label="Previous week"
        value={previousWeek === null ? null : `${formatWeight(previousWeek)} kg`}
      />
    </div>
  )
}
