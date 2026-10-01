import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@/pages/home/HomePage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'

export const router = createBrowserRouter([
  { path: '/', Component: HomePage },
  { path: '*', Component: NotFoundPage },
])
