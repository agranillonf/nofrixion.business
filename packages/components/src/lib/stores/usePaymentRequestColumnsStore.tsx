import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Column } from '../../types/LocalTypes'

type PaymentRequestColumnsStore = {
  paymentRequestColumns?: Column[]
  setPaymentRequestColumns: (paymentRequestColumns: Column[]) => void
}

// This is a store that persists the selected columns in the local storage
const usePaymentRequestColumnsStore = create<PaymentRequestColumnsStore>()(
  persist(
    (set) => ({
      paymentRequestColumns: undefined,
      setPaymentRequestColumns: (paymentRequestColumns: Column[]) =>
        set(() => ({ paymentRequestColumns: paymentRequestColumns })),
    }),
    {
      name: 'mm4b-paymentrequestcolumns-storage',
    },
  ),
)

export default usePaymentRequestColumnsStore
