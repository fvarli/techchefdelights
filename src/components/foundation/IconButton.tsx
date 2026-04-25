import clsx from 'clsx'
import { forwardRef } from 'react'
import styles from './IconButton.module.css'

type IconButtonVariant = 'default' | 'terra'
type IconButtonSize = 'sm' | 'md'

type IconButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> & {
  label: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  children: React.ReactNode
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = 'default', size = 'md', className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={clsx(styles.button, styles[variant], styles[`size-${size}`], className)}
      {...rest}
    >
      {children}
    </button>
  )
})
