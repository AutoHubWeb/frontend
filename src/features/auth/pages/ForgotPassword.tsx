'use client'

import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
