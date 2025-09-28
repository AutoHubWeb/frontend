'use client'

import { useState, useEffect } from 'react'
import { toolService } from '@/lib/api/services'
import { useTools } from '@/lib/api/hooks/useTools'

export default function ApiTestPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detailedLogs, setDetailedLogs] = useState<string[]>([])
  const [isClient, setIsClient] = useState(false)
  
  const { data: toolsData, isLoading: toolsLoading, error: toolsError } = useTools()

  // Check if we're running in the browser
  useEffect(() => {
    setIsClient(true)
  }, [])

  const addLog = (message: string) => {
    setDetailedLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`])
  }

  const testApiCall = async () => {
    if (!isClient) return
    
    setLoading(true)
    setError(null)
    setDetailedLogs([])
    addLog('Starting API test...')
    
    try {
      addLog('Calling toolService.getTools()')
      const response = await toolService.getTools()
      addLog(`API call successful. Response status: ${response.success ? 'Success' : 'Failure'}`)
      setTestResult(response)
    } catch (err: any) {
      addLog(`API call failed. Error: ${err.message || 'Unknown error'}`)
      setError(err.message || 'Unknown error')
      console.error('API Test Error:', err)
      
      // Log more details about the error
      if (err.response) {
        addLog(`Response status: ${err.response.status}`)
        addLog(`Response data: ${JSON.stringify(err.response.data)}`)
      }
    } finally {
      setLoading(false)
      addLog('API test completed')
    }
  }

  // Test direct fetch as well
  const testDirectFetch = async () => {
    if (!isClient) return
    
    setLoading(true)
    setError(null)
    setDetailedLogs([])
    addLog('Starting direct fetch test...')
    
    try {
      addLog('Making direct fetch to /api/v1/tools')
      const response = await fetch('https://shopnro.hitly.click/api/v1/tools')
      addLog(`Direct fetch completed. Status: ${response.status}`)
      
      if (response.ok) {
        const data = await response.json()
        addLog(`Direct fetch successful. Data keys: ${Object.keys(data)}`)
        setTestResult(data)
      } else {
        const errorText = await response.text()
        addLog(`Direct fetch failed. Status: ${response.status}, Body: ${errorText}`)
        setError(`HTTP ${response.status}: ${errorText}`)
      }
    } catch (err: any) {
      addLog(`Direct fetch failed. Error: ${err.message || 'Unknown error'}`)
      setError(err.message || 'Unknown error')
      console.error('Direct Fetch Error:', err)
    } finally {
      setLoading(false)
      addLog('Direct fetch test completed')
    }
  }

  // Don't render anything on the server
  if (!isClient) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="mb-6 flex gap-2">
        <button 
          onClick={testApiCall}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API Call (Service)'}
        </button>
        
        <button 
          onClick={testDirectFetch}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Direct Fetch'}
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
      
      {detailedLogs.length > 0 && (
        <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded mb-4">
          <h2 className="font-bold mb-2">Detailed Logs:</h2>
          <pre className="bg-white p-2 rounded overflow-auto max-h-60 text-xs">
            {detailedLogs.join('\n')}
          </pre>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Tools Data (React Query):</h2>
        {toolsLoading && <p>Loading tools...</p>}
        {toolsError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Tools Error:</strong> {toolsError.message}
            {toolsError.stack && (
              <pre className="mt-2 text-xs overflow-auto max-h-40">
                {toolsError.stack}
              </pre>
            )}
          </div>
        )}
        {toolsData && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            <p>Successfully loaded {toolsData.data?.length || 0} tools</p>
            <pre className="bg-white p-2 rounded overflow-auto max-h-60 mt-2">
              {JSON.stringify(toolsData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
