'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function ErrorTestPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)

  // Check if we're running in the browser
  useEffect(() => {
    setIsClient(true)
  }, [])

  const addResult = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setTestResults(prev => [...prev, { message, type, timestamp: new Date().toISOString() }])
  }

  const simulatePhoneError = () => {
    if (!isClient) return
    
    const errorResponse = {
      statusCode: 400,
      message: "property.phone có ít nhất 10 ký tự",
      error: "Bad Request"
    }
    
    addResult(`Simulated API error: ${JSON.stringify(errorResponse)}`, 'error')
    addResult(`Extracted message: ${errorResponse.message}`, 'info')
  }

  const simulateDetailedValidationError = () => {
    if (!isClient) return
    
    const errorResponse = {
      statusCode: 422,
      message: "Validation failed",
      error: "Unprocessable Entity",
      details: {
        phone: ["Số điện thoại phải có ít nhất 10 ký tự"],
        fullname: ["Họ tên phải có ít nhất 2 ký tự"]
      }
    }
    
    addResult(`Simulated validation error: ${JSON.stringify(errorResponse)}`, 'error')
    
    // Extract detailed error message
    let errorMessage = errorResponse.message;
    if (errorResponse.details && typeof errorResponse.details === 'object') {
      const validationErrors = errorResponse.details as Record<string, string[]>;
      if (validationErrors.phone && validationErrors.phone.length > 0) {
        errorMessage = validationErrors.phone[0]; // Use the first phone validation error
      } else if (Object.keys(validationErrors).length > 0) {
        // Use the first available validation error
        const firstKey = Object.keys(validationErrors)[0];
        if (validationErrors[firstKey] && validationErrors[firstKey].length > 0) {
          errorMessage = validationErrors[firstKey][0];
        }
      }
    }
    
    addResult(`Extracted detailed message: ${errorMessage}`, 'info')
  }

  // Don't render anything on the server
  if (!isClient) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Error Handling Test</h1>
      
      <div className="mb-6 flex gap-2 flex-wrap">
        <Button 
          onClick={simulatePhoneError}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Simulate Phone Error
        </Button>
        
        <Button 
          onClick={simulateDetailedValidationError}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Simulate Detailed Validation Error
        </Button>
        
        <Button 
          onClick={() => setTestResults([])}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Clear Results
        </Button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Test Results</h2>
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
        <h3 className="font-bold mb-2">Error Handling Improvements:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Added detailed error message extraction from API responses</li>
          <li>Enhanced client-side phone number validation (min 10 characters)</li>
          <li>Improved error display in the profile update form</li>
          <li>Added specific validation error messages for phone field</li>
        </ul>
      </div>
    </div>
  )
}
