import { Dialog, Transition } from '@headlessui/react'
import { parse, ParseResult } from 'papaparse'
import { Fragment, useEffect, useState } from 'react'

import { LocalInvoicePayment, ValidationResult } from '../../../../types/LocalTypes'
import { validateInvoices } from '../../../../utils/validation'
import FileInput from '../../atoms/FileInput/FileInput'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../atoms/Tabs/Tabs'
import BackArrow from '../../utils/BackArrow'

export interface ImportInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
}

const ImportInvoiceModal = ({ isOpen, onClose }: ImportInvoiceModalProps) => {
  const [validationResults, setValidationResults] = useState<ValidationResult[] | null>(null)
  const [json, setJson] = useState<any>(null)
  const [isError, setIsError] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'upload' | 'review'>('upload')

  useEffect(() => {
    if (!validationResults) {
      return
    }

    // Temporay for displaying validation results
    setJson(JSON.stringify(validationResults, null, 2))
    console.log('-------------------------------')
    console.log('Valid results')
    console.log('-------------------------------')
    console.log(JSON.stringify(validationResults?.filter((result) => result.valid)))

    console.log('-------------------------------')
    console.log('Invalid results')
    console.log('-------------------------------')
    console.error(validationResults?.filter((result) => !result.valid))

    setSelectedTab('review')
  }, [validationResults])

  const handleFileAdded = (file: File) => {
    if (file && file.type != 'text/csv') {
      console.log('File is not a csv') // TODO: Handle this error
      setIsError(true)
      return
    }

    if (file) {
      const headers = [
        'InvoiceNumber',
        'PaymentTerms',
        'InvoiceDate',
        'DueDate',
        'Contact',
        'DestinationIban',
        'DestinationAccountNumber',
        'DestinationSortCode',
        'Currency',
        'Subtotal',
        'Discounts',
        'Taxes',
        'TotalAmount',
        'OutstandingAmount',
        'InvoiceStatus',
        'Reference',
        'RemittanceEmail',
      ]
      // const parsedInvoices: LocalInvoicePayment[] = []
      const reader = new FileReader()

      reader.readAsText(file)

      reader.onload = async () => {
        parse(reader.result as string, {
          header: true,
          skipEmptyLines: true,
          complete: (results: ParseResult<LocalInvoicePayment>) => {
            console.log('results complete', results)

            // TODO: Validate headers
            headers.forEach((header) => {
              if (!results.meta.fields?.includes(header)) {
                console.log(`Header ${header} are missing`)
              }
            })

            if (headers.some((header) => !results.meta.fields?.includes(header))) {
              console.log('Some headers are missing')
              setIsError(true)
              return
            }

            const validationResults = validateInvoices(results.data as LocalInvoicePayment[])

            setValidationResults(validationResults)
          },
          error: (err: any) => {
            console.error('PARSE ERROR', err)
            setIsError(true)
          },
        })
      }
    }
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative font-inter text-default-text z-50" onClose={() => {}}>
          <Dialog.Panel className="w-full transform bg-white text-left align-middle transition-all min-h-screen lg:px-0 lg:flex">
            <div className="flex flex-row mt-[80px] w-full">
              <BackArrow
                intent="close"
                onClick={() => {
                  onClose()
                }}
              />
              <div className="flex flex-col w-full -mt-2 pr-[122px]">
                <Dialog.Title
                  as="h3"
                  className="text-[28px] font-semibold inline-block text-clip md:whitespace-nowrap -mr-6 ml-11 h-fit flex-nowrap"
                >
                  Import invoices
                </Dialog.Title>

                <Tabs value={selectedTab} defaultValue="upload" className="w-full ml-11 mt-14">
                  <TabsList>
                    <TabsTrigger
                      value="upload"
                      className="first:rounded-l-md last:rounded-r-md text-grey-text font-medium bg-main-grey transition-all focus-visible:outline-none disabled:pointer-events-none data-[state=active]:bg-information-bg  data-[state=active]:text-default-text"
                      onClick={() => setSelectedTab('upload')}
                    >
                      <div className="pr-4">1</div>
                      <div>Upload file</div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="review"
                      className="first:rounded-l-md last:rounded-r-md text-grey-text font-medium bg-main-grey transition-all focus-visible:outline-none disabled:pointer-events-none data-[state=active]:bg-information-bg  data-[state=active]:text-default-text"
                      onClick={() => setSelectedTab('review')}
                      disabled={true}
                    >
                      <div className="pr-4">2</div>
                      <div>Review and import</div>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="w-full">
                    <div className="ml-1 pt-12 pr-10">
                      <FileInput
                        onFileAdded={handleFileAdded}
                        isError={isError}
                        setIsError={setIsError}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="review">
                    <div className="text-xs bg-black text-blue-300 max-h-screen overflow-y-auto">
                      <pre>{json}</pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </Transition>
    </>
  )
}

export default ImportInvoiceModal
