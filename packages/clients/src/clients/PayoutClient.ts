import { PayoutCreate } from '../types/ApiRequests'
import { ApiResponse, Payout, PayoutMetrics, PayoutPageResponse } from '../types/ApiResponses'
import { HttpMethod } from '../types/Enums'
import { ApiProps, MetricsProps, PayoutPageProps } from '../types/props'
import { BaseApiClient } from './BaseApiClient'

/**
 * The PayoutClient provides access to the methods available
 * on the MoneyMoov Payouts api.
 */
export class PayoutClient extends BaseApiClient {
  apiUrl: string

  /**
   * Production: https://api.nofrixion.com/api/v1
   * Sandbox: https://api-sandbox.nofrixion.com/api/v1
   * @param apiUrl The base api url.
   * @param authToken The OAUTH token used to authenticate with the api.
   */
  constructor({ ...props }: ApiProps) {
    super(props.authToken)
    this.apiUrl = `${props.apiUrl}/payouts`
  }

  /**
   * Creates a Payout
   * @param payoutCreate The payout to create
   * @returns The newly created Payout if successful. An ApiError if not successful.
   */
  async create(payoutCreate: PayoutCreate): Promise<ApiResponse<Payout>> {
    return await this.httpRequest<Payout>(this.apiUrl, HttpMethod.POST, payoutCreate)
  }

  /**
   * Gets the metrics for Payouts
   * @param fromDate Optional. The date filter to apply to retrieve payout metrics after this date.
   * @param toDate Optional. The date filter to apply to retrieve payout metrics up until this date.
   * @param search Optional. The search filter to apply to retrieve payout metrics with this search text in the description, title, merchant name, contact mail or contact names.
   * @param currency Optional. The currency filter to apply to retrieve payout metrics with this currency.
   * @param minAmount Optional. The minimum amount filter to apply to retrieve payout metrics with this minimum amount.
   * @param maxAmount Optional. The maximum amount filter to apply to retrieve payout metrics with this maximum amount.
   * @param tags Optional. The tags filter to apply to retrieve payout metrics with these tags.
   * @returns A PayoutMetrics response if successful. An ApiError if not successful.
   */
  async metrics({
    fromDate,
    toDate,
    search,
    currency,
    minAmount,
    maxAmount,
    tags,
    merchantId,
  }: MetricsProps): Promise<ApiResponse<PayoutMetrics>> {
    let url = `${this.apiUrl}/metrics`

    const filterParams = new URLSearchParams()

    if (merchantId) {
      filterParams.append('merchantID', merchantId)
    }

    if (fromDate) {
      filterParams.append('fromDate', fromDate.toUTCString())
    }

    if (toDate) {
      filterParams.append('toDate', toDate.toUTCString())
    }

    if (search) {
      filterParams.append('search', search)
    }

    if (currency) {
      filterParams.append('currency', currency)
    }

    if (minAmount) {
      filterParams.append('minAmount', minAmount.toString())
    }

    if (maxAmount) {
      filterParams.append('maxAmount', maxAmount.toString())
    }

    if (tags) {
      tags.forEach((tag) => filterParams.append('tags', tag))
    }

    url = `${url}?${filterParams.toString()}`

    return await this.httpRequest<PayoutMetrics>(url, HttpMethod.GET)
  }

  /**
   * Gets a paged list of Payouts
   * @param pageNumber The first page to fetch for the paged response. Default is 1
   * @param pageSize The page size. Default is 20
   * @param sort Optional expression to sort the order of the payouts. Example "Amount desc,Inserted asc".
   * @param fromDate Optional. The date filter to apply to retrieve payouts created after this date.
   * @param toDate Optional. The date filter to apply to retrieve payouts created up until this date.
   * @param status Optional. The status filter to apply to retrieve records with this status.
   * @param search Optional. The search filter to apply to retrieve records with this search text in the description, title, merchant name or contact name.
   * @param currency Optional. The currency filter to apply to retrieve records with this currency.
   * @param minAmount Optional. The minimum amount filter to apply to retrieve records with this minimum amount.
   * @param maxAmount Optional. The maximum amount filter to apply to retrieve records with this maximum amount.
   * @param tags Optional. The tags filter to apply to retrieve records with these tags.
   * @returns A PayoutPageResponse if successful. An ApiError if not successful.
   */
  async getAll({
    pageNumber = 1,
    pageSize = 20,
    sort,
    fromDate,
    toDate,
    status,
    search,
    currency,
    minAmount,
    maxAmount,
    tags,
    merchantId,
  }: PayoutPageProps): Promise<ApiResponse<PayoutPageResponse>> {
    return await this.getPagedResponse<PayoutPageResponse>(
      {
        merchantId: merchantId,
        pageNumber: pageNumber,
        pageSize: pageSize,
        sort: sort,
        fromDate: fromDate,
        toDate: toDate,
        status: status,
        search: search,
        currency: currency,
        minAmount: minAmount,
        maxAmount: maxAmount,
        tags: tags,
      },
      this.apiUrl,
    )
  }
}