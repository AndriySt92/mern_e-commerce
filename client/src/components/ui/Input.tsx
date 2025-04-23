import clsx from 'clsx'
import { UseFormRegister, RegisterOptions, FieldValues, Path } from 'react-hook-form'
import { Error } from '.'
import { LucideIcon } from 'lucide-react'

interface InputProps<T extends FieldValues> {
  name: Path<T>
  label?: string
  type?: string
  placeholder?: string
  error?: string
  register: UseFormRegister<T>
  validation?: RegisterOptions<T, Path<T>>
  inputClassNames?: string
  labelClassNames?: string
  wrapperClassNames?: string
  multiple?: boolean // For file input
  accept?: string // For file input
  min?: number
  max?: number
  readOnly?: boolean
  disabled?: boolean
  icon?: LucideIcon
}

const Input = <T extends FieldValues>({
  name,
  label,
  type = 'text',
  error,
  register,
  validation,
  inputClassNames,
  labelClassNames,
  wrapperClassNames,
  multiple,
  accept,
  icon: Icon,
  ...rest
}: InputProps<T>) => {
  const isTypeFile = type === 'file'

  return (
    <div className={clsx(wrapperClassNames, isTypeFile && 'flex flex-col gap-2')}>
      {label && (
        <label
          htmlFor={name}
          className={clsx(labelClassNames, 'text-secondary sm:text-lg font-bold mb-1')}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon
              className={clsx('h-5 w-5', error ? 'text-error-600' : 'text-secondary-500')}
              aria-hidden="true"
            />
          </div>
        )}
        <input
          id={name}
          type={type}
          className={clsx(
            'w-full px-3 py-2 pl-10 bg-dark rounded-md shadow-sm placeholder-secondary-400 focus:outline-none sm:text-sm',
            inputClassNames,
            error
              ? 'border-2 border-error-600  shadow-md focus:ring-0'
              : 'border focus:ring-primary-500 focus:border-primary-500',
          )}
          {...register(name, validation)}
          {...(isTypeFile && { multiple: multiple, accept: accept })}
          {...rest}
        />
      </div>
      {error && <Error message={error} size="sm" />}
    </div>
  )
}

export default Input
