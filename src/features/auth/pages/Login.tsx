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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <LoginForm />
        </motion.div>
      </div>
    </Layout>
  );
}
