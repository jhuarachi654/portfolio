import { useEffect } from 'react'
import { useToc, type TocSection } from '../contexts/CaseStudyTocContext'

export function useCaseToc(sections: TocSection[]) {
  const { register } = useToc()
  useEffect(() => {
    register(sections)
    return () => register([])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
