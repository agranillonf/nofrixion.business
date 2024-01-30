import { useCallback, useEffect } from 'react'
import { useStore } from 'zustand'

import { LocalTableIds } from '../../types/LocalEnums'
import { setPageSizeForTable } from '../../utils/utils'
import usePageSizesStore from '../stores/usePageSizesStore'

interface GetPageSizeProps {
  tableId: LocalTableIds
  setPageSize: (pageSize: number) => void
}

export const usePageSize = ({
  tableId,
  setPageSize,
}: GetPageSizeProps): { onPageSizeChange: (pageSize: number) => void } => {
  const { pageSizes, setPageSizes } = useStore(usePageSizesStore, (state) => state) ?? {
    pageSizes: undefined,
  }

  useEffect(() => {
    if (pageSizes) {
      const foundPageSize = pageSizes.find((c) => c.tableId === tableId)
      if (foundPageSize) {
        setPageSize(foundPageSize.pageSize)
      }
    }
  }, [pageSizes])

  const onPageSizeChange = useCallback(
    (pageSize: number) => {
      setPageSize(pageSize)
      const newPageSizes = setPageSizeForTable({ tableId: tableId, pageSize: pageSize }, pageSizes)
      setPageSizes(newPageSizes)
    },
    [pageSizes, setPageSizes],
  )

  return { onPageSizeChange }
}
