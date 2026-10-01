import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { StoreLayout } from '@/shared/components/layout/StoreLayout'

export function StoreRoute() {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)

  useEffect(() => {
    if (previousPath.current !== pathname) {
      document.getElementById('main-content')?.focus()
      previousPath.current = pathname
    }
  }, [pathname])

  return <StoreLayout />
}
