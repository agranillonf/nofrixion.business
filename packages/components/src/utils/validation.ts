import { coerce, literal, object, string, z } from 'zod'

import { InvoicePayment } from '../types/LocalTypes'

const CURRENCIES = ['GBP', 'EUR'] as const

export interface ValidationResult {
  lineNumber: number
  valid: boolean
  errors?: string[]
  result: InvoicePayment
}

const InvoiceSchema = object({
  // InvoiceNumber: string({
  //   required_error: 'InvoiceNumber is required',
  //   invalid_type_error: 'InvoiceNumber must be a string',
  // })
  //   .optional()
  //   .or(literal('')),
  // PaymentTerms: string({
  //   invalid_type_error: 'PaymentTerms must be a string',
  // }),
  InvoiceDate: string().min(1, 'InvoiceDate is required'), // TODO: Support proper date format
  DueDate: string().min(1, 'DueDate is required'),
  Contact: string().min(1, 'Contact is required'),
  // DestinationAccount: string({
  //   required_error: 'DestinationAccount is required',
  //   invalid_type_error: 'DestinationAccount must be a string',
  // })
  //   .optional()
  //   //.min(1, 'DestinationAccount is required')
  //   .refine((data) => validateIBAN(data as string), 'DestinationAccount is not a valid IBAN'),
  DestinationIban: string(),
  DestinationAccountNumber: string(),
  DestinationSortCode: string(),
  Currency: z.enum(CURRENCIES),
  // Currency: string({
  //   required_error: 'Currency is required',
  //   invalid_type_error: 'Currency must be a string',
  // }).length(3, 'Currency is required'), // TODO: Validate enum
  // Subtotal: coerce.number({
  //   invalid_type_error: 'Subtotal must be a number',
  // }),
  // Discounts: coerce.number({
  //   invalid_type_error: 'Discounts must be a number',
  // }),
  // Taxes: coerce.number({
  //   invalid_type_error: 'Taxes must be a number',
  // }),
  TotalAmount: coerce
    .number({
      required_error: 'TotalAmount is required',
      invalid_type_error: 'TotalAmount must be a number',
    })
    .min(1, 'TotalAmount must be greater than 0'),
  OutstandingAmount: coerce
    .number({
      required_error: 'OutstandingAmount is required',
      invalid_type_error: 'OutstandingAmount must be a number',
    })
    .min(0, 'OutstandingAmount must be greater than 0'),
  // InvoiceStatus: string({
  //   required_error: 'InvoiceStatus is required',
  //   invalid_type_error: 'InvoiceStatus must be a string',
  // }).min(1, 'InvoiceStatus is required'),
  // Reference: string({
  //   required_error: 'Reference is required',
  //   invalid_type_error: 'Reference must be a string',
  // }).min(1, 'Reference is required'),
  RemittanceEmail: string()
    .email('RemittanceEmail is not a valid email')
    .optional()
    .or(literal('')),
})
  .refine((data) => {
    if (data.Currency === 'EUR' && validateIBAN(data.DestinationIban as string) === false) {
      return false
    }
    return true
  }, 'DestinationIban is not a valid iban.')
  .refine((data) => {
    if (data.Currency === 'GBP' && !data.DestinationAccountNumber) {
      return false
    }
    return true
  }, 'DestinationAccountNumber is invalid.')
  .refine((data) => {
    if (data.Currency === 'GBP' && !data.DestinationSortCode) {
      return false
    }
    return true
  }, 'DestinationSortCode is invalid.')

const validateEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}

const validateIBAN = (iban: string): boolean => {
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

const validateInvoices = (invoicePayments: InvoicePayment[]): ValidationResult[] => {
  const results: ValidationResult[] = []

  console.log('invoicePayments', invoicePayments)
  invoicePayments.map((invoicePayment, index) => {
    const result = InvoiceSchema.safeParse(invoicePayment)

    if (result.success) {
      results.push({
        lineNumber: index + 1,
        valid: true,
        result: invoicePayment,
      })
    } else {
      results.push({
        lineNumber: index + 1,
        valid: false,
        errors: result.error.issues.map((issue) => issue.message),
        result: invoicePayment,
      })
    }
  })

  return results
}

export { validateEmail, validateIBAN, validateInvoices }
