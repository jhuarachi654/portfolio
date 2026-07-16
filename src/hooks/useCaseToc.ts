import { useEffect } from 'react'
import { useToc, type TocSection } from '../contexts/CaseStudyTocContext'

export function useCaseToc(sections: TocSection[], title?: string) {
  const { register } = useToc()
  useEffect(() => {
    register(sections, title)
    return () => register([])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
