'use client'

import React from 'react'

/**
 * Client-side infinite scroll windowing.
 * The full result set is already loaded (filtering is server-driven via URL),
 * so this only controls how many items render at once. An IntersectionObserver
 * on `sentinelRef` grows the window by `pageSize` as the user scrolls. The
 * window resets whenever the input length changes (new filter results).
 */
export function useInfiniteList<T>(items: T[], pageSize = 12) {
  const [count, setCount] = React.useState(pageSize)
  const sentinelRef = React.useRef<HTMLDivElement | null>(null)

  // Reset the window when the underlying result set changes — done during
  // render (React's documented adjust-on-prop-change pattern), not an effect.
  const [prevLength, setPrevLength] = React.useState(items.length)
  if (prevLength !== items.length) {
    setPrevLength(items.length)
    setCount(pageSize)
  }

  const hasMore = count < items.length

  React.useEffect(() => {
    if (!hasMore) return
    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setCount((c) => Math.min(c + pageSize, items.length))
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, pageSize, items.length])

  const visible = items.slice(0, count)
  return { visible, hasMore, sentinelRef }
}
