import { useAuth } from "@/features/auth";
import { Layout } from "@/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Cart() {
  const { isAuthenticated } = useAuth();

  // Set page title
  useEffect(() => {
    document.title = "Giỏ hàng | TOOL NRO";
  }, []);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Vui lòng đăng nhập</h2>
              <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem giỏ hàng</p>
              <Link href="/login">
                <Button className="w-full">Đăng nhập</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">GIỎ HÀNG</h1>
          </div>

          {/* Empty Cart State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center text-center py-16"
          >
            <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-12">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-8"
                >
                  {/* Shopping Bag Illustration */}
                  <div className="relative mx-auto w-48 h-48 mb-6">
                    {/* Background clouds */}
                    <div className="absolute top-4 left-8 w-16 h-10 opacity-20">
                      <div className="w-4 h-4 bg-gray-300 rounded-full absolute top-0 left-0"></div>
                      <div className="w-6 h-6 bg-gray-300 rounded-full absolute top-2 left-3"></div>
                      <div className="w-5 h-5 bg-gray-300 rounded-full absolute top-0 left-8"></div>
                      <div className="w-12 h-4 bg-gray-300 rounded-full absolute top-4 left-2"></div>
                    </div>
                    
                    <div className="absolute top-8 right-4 w-20 h-12 opacity-20">
                      <div className="w-5 h-5 bg-gray-300 rounded-full absolute top-0 left-0"></div>
                      <div className="w-7 h-7 bg-gray-300 rounded-full absolute top-1 left-4"></div>
                      <div className="w-6 h-6 bg-gray-300 rounded-full absolute top-0 left-11"></div>
                      <div className="w-16 h-5 bg-gray-300 rounded-full absolute top-5 left-2"></div>
                    </div>

                    {/* Main shopping bag */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <motion.div
                        animate={{ 
                          rotate: [-2, 2, -2],
                          y: [0, -5, 0]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="relative"
                      >
                        {/* Bag body */}
                        <div className="w-24 h-28 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-lg border-4 border-gray-700">
                          {/* Sad face */}
                          <div className="flex items-center justify-center h-full">
                            <div className="text-gray-700">
                              <div className="flex space-x-2 mb-2">
                                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                              </div>
                              <div className="w-6 h-2 border-b-2 border-gray-700 rounded-full transform rotate-180"></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Bag handles */}
                        <div className="absolute -top-4 left-2 w-4 h-6 border-4 border-gray-700 rounded-t-full border-b-0"></div>
                        <div className="absolute -top-4 right-2 w-4 h-6 border-4 border-gray-700 rounded-t-full border-b-0"></div>
                        
                        {/* Arms */}
                        <div className="absolute top-8 -left-8 w-6 h-1 bg-gray-700 rounded-full transform -rotate-12"></div>
                        <div className="absolute top-8 -right-8 w-6 h-1 bg-gray-700 rounded-full transform rotate-12"></div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Decorative text */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-4xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text mb-4"
                    style={{ 
                      textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                      fontFamily: "Comic Sans MS, cursive"
                    }}
                  >
                    Giỏ Hàng Trống
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                    Giỏ hàng trống, hãy đi mua sắm đi rồi quay lại nhé! 🛍️
                  </p>

                  <div className="flex justify-center">
                    <Link href="/">
                      <Button variant="outline" size="lg" data-testid="button-go-home">
                        Về trang chủ
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
