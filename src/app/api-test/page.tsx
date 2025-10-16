'use client'

import Link from 'next/link'

export default function ApiTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      <p className="mb-4">
        This is a test page to verify navigation vs reload behavior.
      </p>
      
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
