import { useQuery } from '@tanstack/react-query'

import { PayrunClient } from '../clients'
import { ApiResponse, Payrun } from '../types/ApiResponses'
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

export const usePayrun = ({ payrunId }: PayrunProps, { apiUrl, authToken }: ApiProps) => {
  const SINGLE_PAYRUN_QUERY_KEY = ['Payrun', payrunId, apiUrl, authToken]

  return useQuery<ApiResponse<Payrun>, Error>({
    queryKey: SINGLE_PAYRUN_QUERY_KEY,
    queryFn: () => fetchPayrun(apiUrl, payrunId, authToken),
    enabled: !!payrunId,
  })
}
