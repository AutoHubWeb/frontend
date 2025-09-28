'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Form validation schemas
const profileUpdateSchema = z.object({
  fullname: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z.string().optional(),
});

type ProfileUpdateData = z.infer<typeof profileUpdateSchema> & {
  phone?: string;
};

export default function PhoneTestPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isTesting, setIsTesting] = useState(false)

  const form = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullname: "Test User",
      phone: undefined,
    },
  });

  const addResult = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setTestResults(prev => [...prev, { message, type, timestamp: new Date().toISOString() }])
  }

  const testValidation = async (data: ProfileUpdateData) => {
    setIsTesting(true)
    setTestResults([])
    
    try {
      addResult(`Testing with data: ${JSON.stringify(data)}`, 'info')
      
      // Test the validation
      const result = await form.trigger()
      addResult(`Validation result: ${result}`, result ? 'success' : 'error')
      
      // Check for errors
      const errors = form.formState.errors
      if (Object.keys(errors).length > 0) {
        addResult(`Validation errors: ${JSON.stringify(errors)}`, 'error')
      } else {
        addResult('No validation errors', 'success')
      }
      
      // Test the data processing
      const processedData = {
        ...data,
        phone: data.phone === "" ? undefined : data.phone
      }
      addResult(`Processed data: ${JSON.stringify(processedData)}`, 'info')
      
    } catch (error: any) {
      addResult(`Test error: ${error.message}`, 'error')
    } finally {
      setIsTesting(false)
    }
  }

  const testEmptyPhone = async () => {
    await testValidation({ fullname: "Test User", phone: "" })
  }

  const testValidPhone = async () => {
    await testValidation({ fullname: "Test User", phone: "123456789" })
  }

  const testUndefinedPhone = async () => {
    await testValidation({ fullname: "Test User", phone: undefined })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Phone Number Validation Test</h1>
      
      <div className="mb-6 flex gap-2 flex-wrap">
        <Button 
          onClick={testEmptyPhone}
          disabled={isTesting}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Test Empty Phone'}
        </Button>
        
        <Button 
          onClick={testValidPhone}
          disabled={isTesting}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Test Valid Phone'}
        </Button>
        
        <Button 
          onClick={testUndefinedPhone}
          disabled={isTesting}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Test Undefined Phone'}
        </Button>
        
        <Button 
          onClick={() => setTestResults([])}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Clear Results
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Form Test</h2>
          <form onSubmit={form.handleSubmit((data) => testValidation(data))} className="space-y-4">
            <div>
              <Label htmlFor="fullname" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </Label>
              <Input
                id="fullname"
                {...form.register("fullname")}
                placeholder="Enter full name"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {form.formState.errors.fullname && (
                <p className="text-sm text-red-500">{form.formState.errors.fullname.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </Label>
              <Input
                id="phone"
                {...form.register("phone")}
                placeholder="Enter phone number"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isTesting}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isTesting ? 'Testing...' : 'Test Form Data'}
            </Button>
          </form>
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
      </div>
      
      <div className="bg-yellow-100 p-4 rounded">
        <h3 className="font-bold mb-2">Phone Number Fix Summary:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Phone field is defined as optional in the Zod schema</li>
          <li>Empty phone values are converted to undefined before sending to API</li>
          <li>Form correctly handles undefined phone values</li>
          <li>No validation errors should occur when phone is empty</li>
        </ul>
      </div>
    </div>
  )
}
