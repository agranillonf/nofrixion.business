import { useQuery } from '@tanstack/react-query'

import { PayrunClient } from '../clients'
import { ApiResponse, PayrunPageResponse } from '../types/ApiResponses'
import { ApiProps, PayrunsProps } from '../types/props'

const fetchPayruns = async (
  apiUrl: string,
  merchantId: string,
  authToken?: string,
): Promise<ApiResponse<PayrunPageResponse>> => {
  const client = new PayrunClient({ apiUrl, authToken })

  const response = await client.getAll({ merchantId })

  return response
}

export const usePayruns = ({ merchantId }: PayrunsProps, { apiUrl, authToken }: ApiProps) => {
  const QUERY_KEY = ['Payruns', apiUrl, authToken]

  return useQuery<ApiResponse<PayrunPageResponse>, Error>({
    queryKey: QUERY_KEY,
    queryFn: () => fetchPayruns(apiUrl, merchantId, authToken),
  })
}
