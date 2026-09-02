import { BottomSheet } from './BottomSheet.tsx'
import { Button } from './Button.tsx'
import styles from './ConfirmDialog.module.css'

type ConfirmDialogProps = {
  title: string
  message: string
  confirmLabel: string
  danger?: boolean
  pending?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  danger = false,
  pending = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <BottomSheet title={title} onClose={onCancel}>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          variant={danger ? 'danger' : 'primary'}
          disabled={pending}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </BottomSheet>
  )
}
