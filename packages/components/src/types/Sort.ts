import { SortDirection } from '@nofrixion/moneymoov'

export interface Sort<T> {
  name: T
  direction: SortDirection
}

export interface DoubleSort<T> {
  primary: Sort<T>
  secondary?: Sort<T>
}

export type SortByTransactions = Sort<SortByTransactionsOptions>
type SortByTransactionsOptions = 'created' | 'amount'
export type DoubleSortByTransactions = DoubleSort<SortByTransactionsOptions>

type SortByPayoutsOptions = 'created' | 'status' | 'amount' | 'counterPartyName' | 'scheduleDate'
export type SortByPayouts = Sort<SortByPayoutsOptions>
export type DoubleSortByPayouts = DoubleSort<SortByPayoutsOptions>

type SortByPaymentRequestsOptions = 'created' | 'amount' | 'title'
export type SortByPaymentRequests = Sort<SortByPaymentRequestsOptions>
export type DoubleSortByPaymentRequests = DoubleSort<SortByPaymentRequestsOptions>

type SortByUsersAndInvitesOptions = 'status' | 'lastModified' | 'name' | 'role'
export type SortByUsersAndInvites = Sort<SortByUsersAndInvitesOptions>
export type DoubleSortByUsersAndInvites = DoubleSort<SortByUsersAndInvitesOptions>
