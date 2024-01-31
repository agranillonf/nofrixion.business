import { forwardRef, InputHTMLAttributes, useEffect, useId, useState } from 'react'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import InputAutoCompleteField from '../InputAutoCompleteField/InputAutoCompleteField'
import { ValidationMessage } from '../ValidationMessage/ValidationMessage'

export interface InputTextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  variant?: 'default' | 'numeric'
  label: string
  required?: boolean
  warningValidation?: (value: string) => string | undefined
  error?: string
  formSubmitted?: boolean
  subText?: string
  autoSuggestions?: string[]
  onChange?: (value: string) => void
}

const InputTextField = forwardRef<HTMLInputElement, InputTextFieldProps>(
  (
    {
      variant = 'default',
      label,
      required,
      maxLength,
      value,
      placeholder,
      formSubmitted,
      subText,
      onChange,
      onBlur,
      warningValidation,
      autoSuggestions,
      ...props
    },
    ref,
  ) => {
    const textId = useId()

    const [warning, setWarning] = useState<string>()
    const [requiredErrorPrompt, setRequiredErrorPrompt] = useState<boolean>(false)

    useEffect(() => {
      if (!formSubmitted) {
        return
      }

      if (formSubmitted && value && maxLength && value.toString().length > maxLength) {
        setWarning(`${label} is too long`)
      }

      if (formSubmitted && required && !value) {
        setRequiredErrorPrompt(true)
      } else {
        setRequiredErrorPrompt(false)
      }
    }, [formSubmitted])

    const handleOnChange = (value: string) => {
      onChange && onChange(value)
      validateInputOnChange(value)
    }

    const validateInputOnChange = (value: string) => {
      if (required && value) {
        setRequiredErrorPrompt(false)
      }

      if (!warningValidation || !warning) {
        return
      }

      setWarning(warningValidation(value))
    }

    const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur && onBlur(e)

      const value = e.target.value

      // If there is a value and the trimmed value is empty, set the value to empty
      if (value && value != value.trim()) {
        // If there is a value and the trimmed value at the end is not the same as the value, trim the end
        onChange && onChange(e.target.value.trim())
      }

      if (!warningValidation) {
        return
      }

      setWarning(warningValidation(e.target.value))
    }

    const maskOptions = {
      prefix: '',
      suffix: '',
      includeThousandsSeparator: false,
      allowDecimal: false,
      integerLimit: maxLength,
      allowNegative: false,
      allowLeadingZeroes: true,
    }

    const numberMask = createNumberMask({
      ...maskOptions,
    })

    return (
      <div>
        <div className="flex flex-col">
          <div className="py-2 flex justify-between">
            <label htmlFor={textId} className="text-default-text font-semibold text-sm leading-4">
              {label}
            </label>

            {requiredErrorPrompt && (
              <div className="text-[#F32448] font-normal text-xs leading-4">REQUIRED</div>
            )}
            {!required && (
              <div className="text-grey-text font-normal text-xs leading-4">OPTIONAL</div>
            )}
          </div>
          {variant === 'numeric' && (
            <MaskedInput
              className="pl-3 border border-border-grey rounded-[0.25rem] h-12 w-full inline-block font-normal text-sm/6 text-default-text disabled:bg-[#F6F8F9]"
              placeholder={placeholder}
              mask={numberMask}
              inputMode="numeric"
              onBlur={handleOnBlur}
              value={value}
              onChange={(e) => {
                const masked = e.target.value
                // eslint-disable-next-line no-useless-escape
                e.target.value = e.target.value.replace(/[^\d\.\-]/g, '')
                handleOnChange && handleOnChange(e.target.value)
                e.target.value = masked
              }}
              {...props}
            />
          )}
          {variant === 'default' && !autoSuggestions && (
            <input
              ref={ref}
              id={textId}
              maxLength={maxLength}
              type="text"
              value={value}
              onChange={(e) => handleOnChange(e.target.value)}
              onBlur={handleOnBlur}
              placeholder={placeholder}
              className="pl-3 border border-border-grey rounded-[0.25rem] h-12 w-full inline-block font-normal text-sm/6 text-default-text disabled:bg-[#F6F8F9]"
              {...props}
            />
          )}
          {variant === 'default' && autoSuggestions && (
            <InputAutoCompleteField
              ref={ref}
              id={textId}
              maxLength={maxLength}
              type="text"
              value={value}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              placeholder={placeholder}
              autoSuggestions={autoSuggestions}
              {...props}
            />
          )}
          {(maxLength || subText) && (
            <div className="mt-2 text-grey-text font-normal text-[0.813rem] leading-5 flex justify-between">
              {subText && <span>{subText}</span>}

              {maxLength && (
                <div className="ml-auto">
                  {value?.toString().length}/{maxLength}
                </div>
              )}
            </div>
          )}
        </div>
        <ValidationMessage variant="warning" message={warning} label={label} />
      </div>
    )
  },
)

InputTextField.displayName = 'InputTextField'

export default InputTextField
