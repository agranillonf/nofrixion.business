import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { useCallback } from 'react'

import { PayrunClient } from '../clients'
import { ApiResponse, Payrun, PayrunCreate } from '../types'
import { ApiProps } from '../types/props'

const createPayrunAsync = async (
  payrunCreate: PayrunCreate,
  apiUrl: string,
  authToken?: string,
): Promise<ApiResponse<Payrun>> => {
  const payrunClient = new PayrunClient({ apiUrl, authToken })
  const payrunCreateResponse = await payrunClient.create(payrunCreate)

  return payrunCreateResponse
}

export const useCreatePayrun = ({
  apiUrl,
  authToken,
}: ApiProps): {
  createPayrun: (payrunCreate: PayrunCreate) => Promise<ApiResponse<Payrun>>
} => {
  const mutation: UseMutationResult<ApiResponse<Payrun>, Error, PayrunCreate> = useMutation({
    mutationFn: (variables: PayrunCreate) => createPayrunAsync(variables, apiUrl, authToken),
  })

  const createPayrun = useCallback(
    async (payrunCreate: PayrunCreate) => {
      const result = await mutation.mutateAsync(payrunCreate)

      return result
    },
    [mutation],
  )

  return { createPayrun }
}
