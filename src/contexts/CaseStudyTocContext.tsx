import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface TocSection {
  id: string
  label: string
}

interface TocContextValue {
  sections: TocSection[]
  title: string
  register: (sections: TocSection[], title?: string) => void
}

const TocContext = createContext<TocContextValue>({
  sections: [],
  title: '',
  register: () => {},
})

export function TocProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<TocSection[]>([])
  const [title, setTitle] = useState('')
  const register = useCallback((s: TocSection[], t?: string) => {
    setSections(s)
    setTitle(t ?? '')
  }, [])
  return <TocContext.Provider value={{ sections, title, register }}>{children}</TocContext.Provider>
}

export const useToc = () => useContext(TocContext)
