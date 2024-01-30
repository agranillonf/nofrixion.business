import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { TablePageSize } from '../../types/LocalTypes'

type PageSizesStore = {
  pageSizes?: TablePageSize[]
  setPageSizes: (pageSizes: TablePageSize[]) => void
}

// This is a store that persists the selected page size in the local storage
const usePageSizesStore = create<PageSizesStore>()(
  persist(
    (set) => ({
      pageSizes: undefined,
      setPageSizes: (pageSizes: TablePageSize[]) => set(() => ({ pageSizes: pageSizes })),
    }),
    {
      name: 'mm4b-pagesizes-storage',
    },
  ),
)

export default usePageSizesStore
