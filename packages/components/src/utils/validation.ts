import { coerce, literal, nativeEnum, object, string } from 'zod'

import { LocalInvoice, ValidationResult } from '../types/LocalTypes'

enum Currency {
  GBP = 'GBP',
  EUR = 'EUR',
}

const InvoiceSchema = object({
  InvoiceNumber: string().optional(),
  PaymentTerms: string().optional(),
  DestinationIban: string().optional(),
  InvoiceStatus: string().optional(),
  Reference: string().optional(),
  RemittanceEmail: string()
    .email('Remittance email address has a wrong format.')
    .optional()
    .or(literal('')),
  DestinationAccountNumber: coerce
    .number({
      invalid_type_error: 'Destination account number must be a number.',
    })
    .optional(),
  DestinationSortCode: coerce
    .number({
      invalid_type_error: 'Destination sort code must be a number.',
    })
    .optional(),
  Subtotal: coerce
    .number({
      invalid_type_error: 'Subtotal must be a number.',
    })
    .optional(),
  Discounts: coerce
    .number({
      invalid_type_error: 'Discounts must be a number.',
    })
    .optional(),
  Taxes: coerce
    .number({
      invalid_type_error: 'Taxes must be a number.',
    })
    .optional(),
  InvoiceDate: string({
    required_error: 'Invoice date missing.',
  }).pipe(
    coerce.date({
      errorMap: (issue, { defaultError }) => ({
        message: issue.code === 'invalid_date' ? 'Invoice date has a wrong format.' : defaultError,
      }),
    }),
  ),
  DueDate: string({
    required_error: 'Due date missing.',
  }).pipe(
    coerce.date({
      errorMap: (issue, { defaultError }) => ({
        message: issue.code === 'invalid_date' ? 'Due date has a wrong format.' : defaultError,
      }),
    }),
  ),
  Contact: string({
    required_error: 'Contact missing.',
  }),
  Currency: nativeEnum(Currency, {
    errorMap: (issue, { defaultError }) => {
      if (issue.code === 'invalid_enum_value') {
        return {
          message: 'Invalid currency. Must be GBP or EUR.',
        }
      } else if (issue.code === 'invalid_type' && issue.received === 'undefined') {
        return {
          message: 'Currency missing.',
        }
      }

      return {
        message: defaultError,
      }
    },
  }),
  TotalAmount: string({
    required_error: 'Total amount missing.',
  }).pipe(
    coerce
      .number({
        invalid_type_error: 'Total amount must be a number.',
      })
      .min(1, 'Total amount must be greater than 0.'),
  ),
  OutstandingAmount: string({
    required_error: 'Outstanding amount missing.',
  }).pipe(
    coerce
      .number({
        required_error: 'Outstanding amount missing.',
        invalid_type_error: 'Outstanding amount must be a number.',
      })
      .min(0, 'Outstanding amount must be greater than 0.'),
  ),
})
  .refine((data) => {
    if (data.Currency === 'EUR' && validateIBAN(data.DestinationIban as string) === false) {
      return false
    }
    return true
  }, 'Destination iban has a wrong format.')
  .refine((data) => {
    if (data.Currency === 'GBP' && !data.DestinationAccountNumber) {
      return false
    }
    return true
  }, 'Destination account number has a wrong format.')
  .refine((data) => {
    if (data.Currency === 'GBP' && !data.DestinationSortCode) {
      return false
    }
    return true
  }, 'Destination sort code has a wrong format.')

const validateEmail = (email: string) => {
  const re = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
  return re.test(email)
}

const validateIBAN = (iban: string): boolean => {
  if (!iban || iban.length === 0) {
    return false
  }

  const ibanReplaceRegex = /^[a-zA-Z]{2}[0-9]{2}([a-zA-Z0-9]){11,30}$/g

  if (iban.length > 0 && !ibanReplaceRegex.test(iban)) {
    return false
  }

  const bank = iban.slice(4) + iban.slice(0, 4)
  const asciiShift = 55
  const sb = []

  for (const c of bank) {
    let v
    if (/[A-Z]/.test(c)) {
      v = c.charCodeAt(0) - asciiShift
    } else {
      v = parseInt(c, 10)
    }
    sb.push(v)
  }

  const checkSumString = sb.join('')
  let checksum = parseInt(checkSumString[0], 10)

  for (let i = 1; i < checkSumString.length; i++) {
    const v = parseInt(checkSumString.charAt(i), 10)
    checksum = (checksum * 10 + v) % 97
  }

  if (checksum !== 1) {
    return false
  }

  return true
}

const validateInvoices = (invoicePayments: LocalInvoice[]): ValidationResult[] => {
  const results: ValidationResult[] = []

  invoicePayments.map((invoicePayment, index) => {
    const result = InvoiceSchema.safeParse(invoicePayment)

    if (result.success) {
      results.push({
        lineNumber: index + 1,
        valid: true,
        result: result.data as LocalInvoice,
      })
    } else {
      results.push({
        lineNumber: index + 1,
        valid: false,
        errors: result.error.issues,
        result: invoicePayment,
      })
    }
  })

  return results
}

export { validateEmail, validateIBAN, validateInvoices }
