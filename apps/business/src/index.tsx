import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import router from './router'

const root = createRoot(document.getElementById('root') as HTMLElement)
const queryClient = new QueryClient()

root.render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
)
