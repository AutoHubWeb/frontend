'use client'

import { useState, useEffect } from 'react'
import { toolService } from '@/lib/api/services/tool.service'

export default function FetchTestPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Check if we're running in the browser
  useEffect(() => {
    setIsClient(true)
  }, [])

  const testApiCall = async () => {
    if (!isClient) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await toolService.getTools()
      setTestResult(response)
    } catch (err: any) {
      setError(err.message || 'Unknown error')
      console.error('API Test Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Don't render anything on the server
  if (!isClient) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fetch API Test Page</h1>
      
      <div className="mb-6">
        <button 
          onClick={testApiCall}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API Call'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {testResult && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h2 className="font-bold mb-2">API Response:</h2>
          <pre className="bg-white p-2 rounded overflow-auto max-h-60">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
