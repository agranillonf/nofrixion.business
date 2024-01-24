import { PayrunCreate } from '../types/ApiRequests'
import { ApiResponse, Payrun, PayrunPageResponse } from '../types/ApiResponses'
import { HttpMethod } from '../types/Enums'
import { ApiProps, PayrunProps } from '../types/props'
import { BaseApiClient } from './BaseApiClient'

/**
 * The PayrunClient provides access to the methods available
 * on the MoneyMoov Payrun api.
 */
export class PayrunClient extends BaseApiClient {
  apiUrl: string

  /**
   * Production: https://api.nofrixion.com/api/v1
   * Sandbox: https://api-sandbox.nofrixion.com/api/v1
   * @param apiUrl The base api url.
   * @param authToken The OAUTH token used to authenticate with the api.
   */
  constructor({ ...props }: ApiProps) {
    super(props.authToken, true)
    this.apiUrl = `${props.apiUrl}/payruns`
  }

  /**
   * Get a single Payrun
   * @param payrunId The Payrun Id
   * @returns A Payrun if successful. An ApiError if not successful.
   */
  async get({ payrunId }: PayrunProps): Promise<ApiResponse<Payrun>> {
    return await this.httpRequest<Payrun>(`${this.apiUrl}/${payrunId}`, HttpMethod.GET)
  }

  /**
   * Get all Payruns
   * @returns List of all Payruns if successful. An ApiError if not successful.
   */
  async getAll({ merchantId }: { merchantId: string }): Promise<ApiResponse<PayrunPageResponse>> {
    return await this.getPagedResponse<PayrunPageResponse>(
      {
        merchantId,
      },
      this.apiUrl,
    )
  }

  /**
   * Creates a Payrun
   * @param payrunCreate The payrun to create
   * @returns The newly created Parun if successful. An ApiError if not successful.
   */
  async create(payrunCreate: PayrunCreate): Promise<ApiResponse<Payrun>> {
    return await this.httpRequest<Payrun>(
      `${this.apiUrl}/${payrunCreate.merchantID}`,
      HttpMethod.POST,
      payrunCreate,
      'application/json',
    )
  }
}
