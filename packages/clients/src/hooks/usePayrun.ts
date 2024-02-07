import { useQuery, useQueryClient } from '@tanstack/react-query'

import { PayrunClient } from '../clients'
import { ApiResponse, Payrun, PayrunPageResponse } from '../types/ApiResponses'
import { ApiProps, PayrunProps } from '../types/props'

const fetchPayrun = async (
  apiUrl: string,
  payrunId?: string,
  authToken?: string,
): Promise<ApiResponse<Payrun>> => {
  const client = new PayrunClient({ apiUrl, authToken })

  const response = await client.get({ payrunId: payrunId })

  return response
}

export const usePayrun = (
  { payrunId, merchantId }: PayrunProps,
  { apiUrl, authToken }: ApiProps,
) => {
  const queryClient = useQueryClient()
  const SINGLE_PAYRUN_QUERY_KEY = ['Payrun', payrunId, apiUrl, authToken]
  const PAYRUNS_QUERY_KEY = ['Payruns', apiUrl, authToken, merchantId]

  return useQuery<ApiResponse<Payrun>, Error>({
    queryKey: SINGLE_PAYRUN_QUERY_KEY,
    queryFn: () => fetchPayrun(apiUrl, payrunId, authToken),
    enabled: !!payrunId,
    placeholderData: () => {
      if (payrunId) {
        const result: ApiResponse<PayrunPageResponse> | undefined =
          queryClient.getQueryData<ApiResponse<PayrunPageResponse>>(PAYRUNS_QUERY_KEY)
        if (result?.status === 'success') {
          const payout: Payrun | undefined = result.data.content.find((x) => x.id === payrunId)
          if (payout) {
            const apiresponse: ApiResponse<Payrun> = {
              data: payout,
              status: 'success',
              timestamp: new Date(),
            }
            return apiresponse
          }
        }
      }
    },
  })
}
