import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import { Link, type LinkProps } from 'react-router-dom'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md border font-medium focus:outline-none disabled:pointer-events-none disabled:opacity-50 duration-300 transition-colors',
  {
    variants: {
      intent: {
        primary: 'bg-primary text-white hover:bg-primary-hover hover:border-primary-hover',
        secondary: 'bg-secondary text-gray-900 hover:bg-secondary-hover',
        dark: 'bg-dark text-white hover:bg-dark-hover hover:border-dark-hover',
        danger: 'bg-error text-white hover:bg-error-hover hover:border-error-hover',
        outline: 'bg-transparent text-white hover:bg-dark-hover hover:border-transparent',
      },
      size: {
        sm: 'py-2 px-3',
        md: 'py-3 px-5 text-base',
        lg: 'py-3 px-6 text-lg',
      },
      isIconOnly: {
        true: '!rounded-full',
        false: '',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      isIconOnly: false,
    },
  },
)

type ButtonAs = 'button' | typeof Link

interface ButtonBaseProps extends VariantProps<typeof buttonVariants> {
  as?: ButtonAs
  className?: string
  isLoading?: boolean
  icon?: React.ReactNode
  isIconOnly?: boolean
}

type ButtonProps<T extends ButtonAs> = (T extends 'button'
  ? React.ButtonHTMLAttributes<HTMLButtonElement>
  : LinkProps) &
  ButtonBaseProps

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps<ButtonAs>>(
  (
    {
      className,
      intent,
      size,
      as: Component = 'button',
      isLoading = false,
      isIconOnly = false,
      icon,
      children,
      ...props
    },
    ref,
  ) => {
    const content = (
      <>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {icon && <span className={children ? 'mr-2' : ''}>{icon}</span>}
            {children}
          </>
        )}
      </>
    )

    const commonProps = {
      className: clsx(
        buttonVariants({ intent, size, isIconOnly }),
        className,
        isLoading && 'pointer-events-none',
      ),
      ...props,
    }

    return (
      <>
        {Component === 'button' ? (
          <button
            {...(commonProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
            ref={ref as React.ForwardedRef<HTMLButtonElement>}>
            {content}
          </button>
        ) : (
          <Link {...(commonProps as LinkProps)} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
            {content}
          </Link>
        )}
      </>
    )
  },
) as React.ForwardRefExoticComponent<
  ButtonProps<ButtonAs> & React.RefAttributes<HTMLButtonElement | HTMLAnchorElement>
> & { displayName?: string }

Button.displayName = 'Button'

export default Button
