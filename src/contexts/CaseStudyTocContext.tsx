import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface TocSection {
  id: string
  label: string
}

interface TocContextValue {
  sections: TocSection[]
  register: (sections: TocSection[]) => void
}

const TocContext = createContext<TocContextValue>({
  sections: [],
  register: () => {},
})

export function TocProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<TocSection[]>([])
  const register = useCallback((s: TocSection[]) => setSections(s), [])
  return <TocContext.Provider value={{ sections, register }}>{children}</TocContext.Provider>
}

export const useToc = () => useContext(TocContext)
