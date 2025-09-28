'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api/client'

export default function CorsFixTestPage() {
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

  const testApiCall = async () => {
    if (!isClient) return
    
    setLoading(true)
    setTestResults([])
    
    try {
      addResult('Starting API test with updated CORS settings...', 'info')
      
      // Test a simple GET request using the apiClient
      addResult('Making API request to /api/v1/tools...', 'info')
      const response = await apiClient.get('/api/v1/tools')
      
      addResult(`API call successful!`, 'success')
      addResult(`Response: ${JSON.stringify(response, null, 2)}`, 'info')
    } catch (error: any) {
      addResult(`API error: ${error.message}`, 'error')
      console.error('API error:', error)
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
      <h1 className="text-2xl font-bold mb-4">CORS Fix Test Page</h1>
      
      <div className="mb-6">
        <button 
          onClick={testApiCall}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API Call'}
        </button>
        
        <button 
          onClick={() => setTestResults([])}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
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
        <h3 className="font-bold mb-2">CORS Fix Applied:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Changed credentials from &#39;include&#39; to &#39;same-origin&#39; to avoid CORS issues</li>
          <li>Maintained all other CORS settings (mode: &#39;cors&#39;)</li>
          <li>Preserved authentication token handling</li>
        </ul>
      </div>
    </div>
  )
}
