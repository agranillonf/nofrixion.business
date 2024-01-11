export enum LocalPaymentMethodTypes {
  None = 'None',
  Card = 'card',
  Pisp = 'pisp',
  ApplePay = 'applepay',
  GooglePay = 'googlepay',
  Lightning = 'lightning',
}

export enum LocalAddressType {
  Unknown = 'Unknown',
  Shipping = 'Shipping',
  Billing = 'Billing',
}

export enum LocalWallets {
  ApplePay = 'Apple Pay',
  GooglePay = 'Google Pay',
}

export enum LocalPartialPaymentMethods {
  None = 'None',
  Partial = 'Partial',
}

export enum LocalCardPaymentResponseStatus {
  PaymentAuthorized = 'PAYMENT_AUTHORIZED',
  CardAuthorizedSuccess = 'AUTHORIZED',
  PendingAuthentication = 'PENDING_AUTHENTICATION',
  CardCaptureSuccess = 'PENDING',
  CardPaymentSoftDecline = '202',
  CardVoidedSuccess = 'VOIDED',
  CardCheckoutCaptured = 'CAPTURED',
  CardCheckoutAuthorized = 'Authorized',
  CardCheckoutVerified = 'CardVerified',
}

export enum SubTransactionType {
  Refund = 'Refund',
  Capture = 'Capture',
  Void = 'Void',
}

export enum LocalAccountIdentifierType {
  Unknown = 'Unknown',
  SCAN = 'SCAN',
  IBAN = 'IBAN',
  DD = 'DD',
}

export enum FieldID {
  PaymentRequestProductOrService = 'PaymentRequestProductOrService',
  PaymentRequestFirstName = 'PaymentRequestFirstName',
  PaymentRequestLastName = 'PaymentRequestLastName',
  PaymentRequestEmail = 'PaymentRequestEmail',
}

export enum LocalTimeFrequencyEnum {
  None = 'None',
  Daily = 'Daily',
}

export enum LocalPaymentAttemptEventType {
  AuthenticationSetupStarted = 'Authentication setup started',
  AuthenticationFailure = 'Authentication failure',
  Authorised = 'Authorised',
  AuthorisationFailed = 'Authorisation failed',
  Received = 'Received',
  SettlementFailed = 'Settlement failed',
  PartiallyRefunded = 'Partially refunded',
  Refunded = 'Refunded',
  RefundFailed = 'Refund failed',
  Captured = 'Captured',
  PartiallyCaptured = 'Partially captured',
  CaptureFailed = 'Capture failed',
  Voided = 'Voided',
  RefundAwaitingAuthorisation = 'refund awaiting authorisation',
  BankPaymentInitiated = 'Bank payment initiated',
}

export enum LocalPaymentAttemptStatus {
  Received = 'Received',
  InProgress = 'In progress',
  Authorised = 'Authorised',
  Voided = 'Voided',
  Failed = 'Failed',
  Refunded = 'Refunded',
  PartiallyRefunded = 'Partially refunded',
}

export enum LocalPaymentRequestTableColumns {
  Created = 'Created',
  For = 'For',
  Requested = 'Requested',
  Paid = 'Paid',
  PaymentAttempts = 'PaymentAttempts',
  PaymentRequestId = 'PaymentRequestId',
  OrderId = 'OrderId',
  Tags = 'Tags',
}
