import { BankSettings } from '@nofrixion/moneymoov/src/types/ApiResponses'
import { PaymentProcessor } from '@nofrixion/moneymoov/src/types/Enums'

import { ChartPoint } from '../components/ui/molecules/Chart/ChartSkeleton/ChartSkeleton'
import { FieldID, LocalTableIds } from '../types/LocalEnums'
import { AutoSuggestionAdd, AutoSuggestions, TablePageSize } from '../types/LocalTypes'

export const getRoute = (route: string) => {
  const pullRequestId = import.meta.env.VITE_NOFRIXION_PULL_REQUEST_ID

  return pullRequestId ? `/${pullRequestId}${route}` : route
}

export const setPageSizeForTable = (
  newPageSize: TablePageSize,
  existingPageSizes?: TablePageSize[],
): TablePageSize[] => {
  const updatedPageSizes = existingPageSizes ?? getDefaultPageSizes()
  const pageSizeIndex = updatedPageSizes.findIndex(
    (pageSize) => pageSize.tableId === newPageSize.tableId,
  )

  if (pageSizeIndex !== -1) {
    updatedPageSizes[pageSizeIndex] = newPageSize
  } else {
    updatedPageSizes.push(newPageSize)
  }

  return updatedPageSizes
}

export const getDefaultPageSizes = (): TablePageSize[] => {
  return [
    { tableId: LocalTableIds.PaymentRequestsTable, pageSize: 20 },
    { tableId: LocalTableIds.PayoutsTable, pageSize: 20 },
    { tableId: LocalTableIds.TransactionsTable, pageSize: 20 },
    { tableId: LocalTableIds.UsersTable, pageSize: 20 },
  ]
}
export const addAutoSuggestion = (
  fieldValue: string,
  existingSuggestions: AutoSuggestions[] | undefined,
  fieldId: FieldID,
): AutoSuggestions[] => {
  const autosuggestions: AutoSuggestions[] = existingSuggestions ?? []

  const fieldAutoSuggestions = autosuggestions.find(
    (autoSuggestion) => autoSuggestion.fieldId === fieldId,
  )

  if (
    fieldAutoSuggestions &&
    !fieldAutoSuggestions.values.find((value) => value.value === fieldValue)
  ) {
    const last5Values = fieldAutoSuggestions.values ?? []
    if (last5Values.length === 5) {
      last5Values.shift()
    }

    last5Values.push({
      value: fieldValue,
      inserted: new Date(),
    })

    fieldAutoSuggestions.values = last5Values

    const fieldSuggestionIndex = autosuggestions.findIndex(
      (autoSuggestion) => autoSuggestion.fieldId === fieldId,
    )

    if (fieldSuggestionIndex !== -1) {
      autosuggestions[fieldSuggestionIndex] = fieldAutoSuggestions!
    }
  } else if (!fieldAutoSuggestions) {
    autosuggestions.push({
      fieldId: fieldId,
      values: [{ value: fieldValue, inserted: new Date() }],
    })
  }

  return autosuggestions
}

export const addAutoSuggestions = (
  autoSuggestionsToAdd: AutoSuggestionAdd[],
  existingSuggestions: AutoSuggestions[] | undefined,
): AutoSuggestions[] => {
  let newSuggestions = existingSuggestions ?? []
  autoSuggestionsToAdd.forEach((autoSuggestionToAdd) => {
    newSuggestions = addAutoSuggestion(
      autoSuggestionToAdd.value,
      newSuggestions,
      autoSuggestionToAdd.fieldId,
    )
  })

  return newSuggestions
}

/**
 * Takes the banks list from the api response and creates
 * a new list with a separate record for business banks.
 */
export const addConnectedBanks = (banks: BankSettings[]): BankSettings[] => {
  const connectedBanks: BankSettings[] = []

  banks
    .filter((b) => b.processor == PaymentProcessor.Yapily)
    .forEach((bank, index) => {
      if (bank.businessInstitutionID) {
        connectedBanks.push({
          bankID: bank.bankID,
          bankName: `${bank.bankName} Business`,
          order: index,
          logo: bank.logo,
          currency: bank.currency,
          processor: bank.processor,
          personalInstitutionID: bank.businessInstitutionID,
          businessInstitutionID: bank.businessInstitutionID,
          message: bank.message,
          messageImageUrl: bank.messageImageUrl,
        })
      }
      if (bank.personalInstitutionID) {
        connectedBanks.push(bank)
      }
    })

  return connectedBanks.sort((a, b) => (a.bankName > b.bankName ? 1 : -1))
}

export const ChartSkeletonData: ChartPoint[] = [
  {
    x: 2,
    y: 24267,
  },
  {
    x: 3,
    y: 52150,
  },
  {
    x: 4,
    y: 28000,
  },
  {
    x: 5,
    y: 70000,
  },
  {
    x: 6,
    y: 40000,
  },
  {
    x: 7,
    y: 65000,
  },
  {
    x: 8,
    y: 60000,
  },
  {
    x: 9,
    y: 63000,
  },
  {
    x: 10,
    y: 58000,
  },
  {
    x: 11,
    y: 50000,
  },
  {
    x: 12,
    y: 70000,
  },
  {
    x: 13,
    y: 65000,
  },
]
