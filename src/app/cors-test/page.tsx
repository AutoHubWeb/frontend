'use client'

import { useState, useEffect } from 'react'

export default function CorsTestPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Check if we're running in the browser
  useEffect(() => {
    setIsClient(true)
  }, [])

  const addResult = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setTestResults(prev => [...prev, { message, type, timestamp: new Date().toISOString() }])
  }

  const testDirectFetch = async () => {
    if (!isClient) return
    
    setLoading(true)
    setTestResults([])
    
    try {
      addResult('Starting CORS test...', 'info')
      addResult(`Frontend origin: ${window.location.origin}`, 'info')
      addResult(`API Base URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}`, 'info')
      
      // Test a simple GET request
      addResult('Making direct fetch request to /api/v1/tools...', 'info')
      const response = await fetch('https://shopnro.hitly.click/api/v1/tools', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      addResult(`Response status: ${response.status}`, 'info')
      addResult(`Response OK: ${response.ok}`, 'info')
      
      // Log response headers
      const headers: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        headers[key] = value
      })
      addResult(`Response headers: ${JSON.stringify(headers, null, 2)}`, 'info')
      
      if (response.ok) {
        const data = await response.json()
        addResult(`Success! Received ${data.data?.length || 0} tools`, 'success')
      } else {
        const errorText = await response.text()
        addResult(`Error response: ${errorText}`, 'error')
      }
    } catch (error: any) {
      addResult(`Fetch error: ${error.message}`, 'error')
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const testPreflight = async () => {
    if (!isClient) return
    
    setLoading(true)
    setTestResults([])
    
    try {
      addResult('Starting preflight OPTIONS test...', 'info')
      
      // Test OPTIONS request (preflight)
      const response = await fetch('https://shopnro.hitly.click/api/v1/tools', {
        method: 'OPTIONS',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type, Authorization',
          'Origin': window.location.origin
        }
      })
      
      addResult(`OPTIONS response status: ${response.status}`, 'info')
      addResult(`OPTIONS response OK: ${response.ok}`, 'info')
      
      // Log response headers
      const headers: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        headers[key] = value
      })
      addResult(`OPTIONS response headers: ${JSON.stringify(headers, null, 2)}`, 'info')
      
      if (response.ok) {
        addResult('Preflight request successful', 'success')
      } else {
        const errorText = await response.text()
        addResult(`Preflight error: ${errorText}`, 'error')
      }
    } catch (error: any) {
      addResult(`Preflight error: ${error.message}`, 'error')
      console.error('Preflight error:', error)
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
      <h1 className="text-2xl font-bold mb-4">CORS Test Page</h1>
      
      <div className="mb-6 flex gap-2">
        <button 
          onClick={testDirectFetch}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Direct Fetch'}
        </button>
        
        <button 
          onClick={testPreflight}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Preflight'}
        </button>
        
        <button 
          onClick={() => setTestResults([])}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Clear Results
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Test Results:</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {testResults.map((result, index) => (
            <div 
              key={index} 
              className={`p-2 rounded ${
                result.type === 'success' ? 'bg-green-200' : 
                result.type === 'error' ? 'bg-red-200' : 'bg-blue-200'
              }`}
            >
              <span className="font-mono text-sm">[{result.timestamp}]</span> {result.message}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 bg-yellow-100 p-4 rounded">
        <h3 className="font-bold mb-2">CORS Troubleshooting Guide:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Check that the server is configured to allow requests from {window.location.origin}</li>
          <li>Verify that the server includes proper CORS headers in responses</li>
          <li>Ensure the server handles preflight OPTIONS requests correctly</li>
          <li>Check that authentication tokens are being sent correctly</li>
        </ul>
      </div>
    </div>
  )
}
