import {
  Account,
  BankSettings,
  OpenBankingClient,
  useAccounts,
  useBanks,
  useDeleteConnectedAccount,
} from '@nofrixion/moneymoov'
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  ErrorType,
  useErrorsStore,
} from '../../../../../../apps/business/src/lib/stores/useErrorsStore'
import { useUserSettings } from '../../../lib/stores/useUserSettingsStore'
import { SystemError } from '../../../types/LocalTypes'
import { addConnectedBanks, getRoute } from '../../../utils/utils'
import CurrentAcountsList from '../../ui/Account/CurrentAccountsList/CurrentAcountsList'
import { Loader } from '../../ui/Loader/Loader'
import { makeToast } from '../../ui/Toast/Toast'

const queryClient = new QueryClient()

export interface CurrentAccountsListProps {
  merchantId: string
  apiUrl?: string // Example: "https://api.nofrixion.com/api/v1"
  token?: string // Example: "eyJhbGciOiJIUz..."
  onUnauthorized?: () => void
  onAccountClick?: (account: Account) => void
  isWebComponent?: boolean
}

const CurrentAccountsList = ({
  token,
  apiUrl = 'https://api.nofrixion.com/api/v1',
  merchantId,
  onUnauthorized,
  onAccountClick,
  isWebComponent,
}: CurrentAccountsListProps) => {
  const queryClientToUse = isWebComponent ? queryClient : useQueryClient()

  return (
    <QueryClientProvider client={queryClientToUse}>
      <CurrentAccountsMain
        token={token}
        merchantId={merchantId}
        apiUrl={apiUrl}
        onUnauthorized={onUnauthorized}
        onAccountClick={onAccountClick}
        isWebComponent={isWebComponent}
      />
    </QueryClientProvider>
  )
}

const CurrentAccountsMain = ({
  token,
  apiUrl = 'https://api.nofrixion.com/api/v1',
  merchantId,
  onUnauthorized,
  onAccountClick,
  isWebComponent,
}: CurrentAccountsListProps) => {
  const [isConnectingToBank, setIsConnectingToBank] = useState(false)

  const [banks, setBanks] = useState<BankSettings[] | undefined>(undefined)
  const { userSettings, updateUserSettings } = useUserSettings()

  const [systemError, setSystemError] = useState<SystemError | undefined>(undefined)
  const [isSystemErrorOpen, setIsSystemErrorOpen] = useState<boolean>(false)

  const { data: accounts, isLoading: isAccountsLoading } = useAccounts(
    { connectedAccounts: true, merchantId: merchantId },
    { apiUrl, authToken: token },
  )

  const { data: banksResponse } = useBanks(
    { merchantId: merchantId },
    { apiUrl: apiUrl, authToken: token },
  )

  const { deleteConnectedAccount } = useDeleteConnectedAccount({ apiUrl: apiUrl, authToken: token })

  const businessBaseUrl = () => {
    // Defaults to local dev if it's not set
    return import.meta.env.VITE_PUBLIC_APP_BASE_URL ?? 'https://localhost:3001' // Local development
  }

  const { bankId } = useParams()
  const { errors, removeError } = useErrorsStore()

  useEffect(() => {
    if (banksResponse?.status === 'success') {
      setBanks(addConnectedBanks(banksResponse.data.payByBankSettings))
    } else if (banksResponse?.status === 'error') {
      console.warn(banksResponse.error)
    }
  }, [banksResponse])

  if (accounts?.status == 'error') {
    if (accounts?.error && accounts?.error.status === 401) {
      onUnauthorized && onUnauthorized()
    }
  }

  useEffect(() => {
    const errorID = 'ca-error'

    const error = errors.find(
      (caError) => caError.type === ErrorType.CONNECTEDACCOUNT && caError.id === errorID,
    )?.error

    if (error) {
      handleSystemErrorMessage({
        title: 'Open banking consent authorisation failed',
        message: error.detail,
      })
    }

    if (errorID && error) {
      removeError(errorID)
    }
  }, [])

  useEffect(() => {
    if (!isWebComponent && bankId) {
      const bank = banks?.find((bank) => bank.bankID === bankId)
      if (bank) {
        makeToast('success', `Your ${bank.bankName} connection is ready!`)
        window.location.href = getRoute('/home/current-accounts')
      }
    }
  }, [bankId, banks])

  const onConnectBank = async (bank: BankSettings) => {
    // Hack: Personal and Business banks have separate records and the institution ID
    // is set on the personalInstitutionID field for both personal and business.
    if (bank.personalInstitutionID) {
      setIsConnectingToBank(true)

      const client = new OpenBankingClient({ apiUrl, authToken: token })

      const response = await client.createConsent({
        institutionID: bank.personalInstitutionID,
        merchantID: merchantId,
        IsConnectedAccounts: true,
        callbackUrl: `${businessBaseUrl()}${getRoute('/home/current-accounts/connected/{bankId}')}`,
        failureCallbackUrl: `${businessBaseUrl()}${getRoute('/home/current-accounts')}`,
      })

      if (response.status === 'error') {
        handleSystemErrorMessage({
          title: `Could not connect to ${bank.bankName}`,
          message: response.error.detail,
        })
      } else if (response.data.authorisationUrl) {
        // Redirect to the banks authorisation url
        window.location.href = response.data.authorisationUrl
      }

      setIsConnectingToBank(false)
    }
  }

  const onMaybeLater = () => {
    if (userSettings) {
      userSettings.connectMaybeLater = true
      updateUserSettings(userSettings)
    } else {
      updateUserSettings({ connectMaybeLater: true })
    }
  }

  const onCloseSystemErrorModal = () => {
    setIsSystemErrorOpen(false)
  }

  const handleSystemErrorMessage = (systemError: SystemError) => {
    setSystemError(systemError)
    setIsSystemErrorOpen(true)
  }

  const handleOnRenewConnection = async (account: Account) => {
    if (account && account.consentID) {
      setIsConnectingToBank(true)
      const client = new OpenBankingClient({ apiUrl, authToken: token })

      const response = await client.reAuthoriseConsent({
        consentId: account.consentID,
      })

      if (response.status === 'error') {
        handleSystemErrorMessage({
          title: `Renew connected account has failed`,
          message: response.error.detail,
        })
      } else if (response.data.authorisationUrl) {
        window.location.href = response.data.authorisationUrl
      }

      setIsConnectingToBank(false)
    }
  }

  const handleOnRevokeConnection = async (account: Account, revokeOnlyThisAccount: boolean) => {
    if (revokeOnlyThisAccount) {
      const response = await deleteConnectedAccount(account.id)

      if (response.error) {
        handleSystemErrorMessage({
          title: 'Revoking connected account connection has failed',
          message: response.error.detail,
        })

        return
      }

      makeToast('success', 'Account connection successfully revoked.')
    } else {
      if (accounts?.status !== 'success') return

      // Revoke all accounts with the same consentID
      // If any of the promises fail, the toast will not be shown
      const promises = accounts.data
        .filter((a) => a.consentID === account.consentID)
        .map((a) => deleteConnectedAccount(a.id))

      const responses = await Promise.all(promises)

      if (responses.some((r) => r.error)) {
        handleSystemErrorMessage({
          title: 'Revoking connected account connections has failed',
          message: 'Some connections may not have been revoked.',
        })

        return
      }

      makeToast('success', 'All account connections successfully revoked.')
    }
  }

  if (isAccountsLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="flex items-center justify-center p-24 min-h-screen" />
      </div>
    )
  }

  return (
    <>
      {accounts?.status === 'success' && accounts.data && (
        <CurrentAcountsList
          accounts={accounts.data}
          onAccountClick={onAccountClick}
          onConnectToBank={onConnectBank}
          onMaybeLater={onMaybeLater}
          banks={banks}
          onRenewConnection={handleOnRenewConnection}
          isConnectingToBank={isConnectingToBank}
          onRevokeConnection={handleOnRevokeConnection}
          // Disable connected accounts if it's a web component
          areConnectedAccountsEnabled={!isWebComponent}
          systemError={systemError}
          isSystemErrorOpen={isSystemErrorOpen}
          onCloseSystemError={onCloseSystemErrorModal}
        />
      )}
    </>
  )
}

export default CurrentAccountsList
