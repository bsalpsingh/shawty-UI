import { createContext, useContext } from 'react'

export const RouterContext = createContext(null)

export function useRouter() {
  const context = useContext(RouterContext)
  if (!context) throw new Error('useRouter must be used inside a RouterProvider')
  return context
}

export function useNavigate() {
  return useRouter().navigate
}
