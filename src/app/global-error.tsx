'use client'

import React from 'react'
import { Button } from '@ui/button'
import { AlertOctagon } from 'lucide-react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Root Catcher Global Error Page.
 * Mandatory elements: includes <html> and <body> tags since it replaces root layout.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  React.useEffect(() => {
    console.error('Critical Root Layout Crash:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-bg-primary min-h-screen flex items-center justify-center font-sans antialiased p-sm">
        <div className="max-w-md w-full p-lg bg-bg-secondary border border-border-subtle rounded-symmetric shadow-sm text-center flex flex-col gap-sm items-center">
          <div className="h-12 w-12 bg-status-error/10 text-status-error rounded-pill flex items-center justify-center mb-xxs">
            <AlertOctagon size={24} />
          </div>
          <h2 className="text-[20px] font-semibold text-text-primary">System Crash Detected</h2>
          <p className="text-[13px] text-text-muted leading-relaxed">
            A critical server-side initialization mismatch occurred. All diagnostics have been
            transmitted to the monitoring provider.
          </p>
          <div className="flex gap-xs w-full mt-xs">
            <Button onClick={() => reset()} variant="primary" className="flex-1">
              Reset Application
            </Button>
            <Button
              onClick={() => (window.location.href = '/')}
              variant="outline"
              className="flex-1"
            >
              Return Home
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
