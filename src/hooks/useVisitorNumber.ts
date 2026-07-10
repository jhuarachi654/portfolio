import { useEffect, useState } from "react"

const SUPABASE_URL = "https://jwjpnwxzpjtjigquuism.supabase.co"
const SUPABASE_KEY = "sb_publishable_HIcPdHfVH7_58p5skQFVNg_DNqCKa7R"

const UUID_KEY = "visitor_uuid"
const NUMBER_KEY = "visitor_number"

function getOrCreateVisitorUuid(): string {
  let id = localStorage.getItem(UUID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(UUID_KEY, id)
  }
  return id
}

// Module-level (not per-hook-instance) so that multiple components calling
// this hook on the same page load — e.g. Layout's Sidebar and a page like
// DrawPage — share a single in-flight registration instead of racing each
// other into inserting two rows for one visit.
let sharedRegisterPromise: Promise<number | null> | null = null

function registerVisitor(): Promise<number | null> {
  const cached = localStorage.getItem(NUMBER_KEY)
  if (cached) return Promise.resolve(parseInt(cached, 10))
  if (sharedRegisterPromise) return sharedRegisterPromise

  sharedRegisterPromise = (async () => {
    const uuid = getOrCreateVisitorUuid()
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/site_visitors`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ visitor_uuid: uuid }),
      })
      if (!res.ok) return null
      const [row] = await res.json()
      if (!row) return null
      localStorage.setItem(NUMBER_KEY, String(row.id))
      return row.id as number
    } catch {
      return null // Decorative feature, not critical path — fail silently.
    }
  })()

  return sharedRegisterPromise
}

async function fetchVisitorTotal(): Promise<number | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_visitors?select=id`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "count=exact",
        Range: "0-0",
      },
    })
    const range = res.headers.get("content-range") // e.g. "0-0/284"
    const total = range?.split("/")[1]
    return total ? parseInt(total, 10) : null
  } catch {
    return null
  }
}

// Registers this browser as a visitor exactly once (cached locally after the
// first successful insert, deduped across components via the module-level
// promise above), and returns both this visitor's assigned number and the
// running total — safe to call from multiple components on the same page.
export function useVisitorNumber() {
  const [myNumber, setMyNumber] = useState<number | null>(() => {
    const cached = localStorage.getItem(NUMBER_KEY)
    return cached ? parseInt(cached, 10) : null
  })
  const [totalCount, setTotalCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    if (myNumber == null) {
      registerVisitor().then(n => { if (!cancelled && n != null) setMyNumber(n) })
    }
    fetchVisitorTotal().then(n => { if (!cancelled) setTotalCount(n) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { myNumber, totalCount }
}
