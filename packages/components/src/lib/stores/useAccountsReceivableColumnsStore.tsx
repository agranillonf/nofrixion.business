import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Column } from '../../types/LocalTypes'

type AccountsReceivableColumnsStore = {
  accountsReceivableColumns?: Column[]
  setAccountsReceivableColumns: (accountsReceivableColumns: Column[]) => void
}

// This is a store that persists the selected columns in the local storage
const useAccountsReceivableColumnsStore = create<AccountsReceivableColumnsStore>()(
  persist(
    (set) => ({
      accountsReceivableColumns: undefined,
      setAccountsReceivableColumns: (accountsReceivableColumns: Column[]) =>
        set(() => ({ accountsReceivableColumns: accountsReceivableColumns })),
    }),
    {
      name: 'mm4b-accountsreceivablecolumns-storage',
    },
  ),
)

export default useAccountsReceivableColumnsStore
