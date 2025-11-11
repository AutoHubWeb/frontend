'use client'

import { useAuth } from "@/features/auth"
import { Layout } from "@/components"
import { LoginForm } from "@/features/auth"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Login() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user && !isLoading) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // Set page title
  useEffect(() => {
    document.title = "Đăng nhập | TOOL NRO";
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
          </div>
          <LoginForm />
          <div className="text-center mt-6 text-sm text-gray-600">
            <p>Chưa có tài khoản? <a href="/register" className="text-blue-600 hover:underline font-medium">Đăng ký ngay</a></p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
