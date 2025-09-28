'use client'

import { useEffect, useState } from 'react'

export default function TestPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    // Client-side environment variables (NEXT_PUBLIC_*)
    const clientEnvVars: Record<string, string> = {}
    if (typeof window !== 'undefined') {
      clientEnvVars['NEXT_PUBLIC_API_BASE_URL'] = process.env.NEXT_PUBLIC_API_BASE_URL || 'Not set'
      clientEnvVars['NEXT_PUBLIC_AUTH_SERVICE_URL'] = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'Not set'
      clientEnvVars['NODE_ENV'] = process.env.NODE_ENV || 'Not set'
    }
    setEnvVars(clientEnvVars)
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Client-side Environment Variables:</h2>
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="mb-2">
            <span className="font-mono font-bold">{key}:</span> 
            <span className="ml-2 font-mono">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
