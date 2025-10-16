'use client'

import { Layout } from "@/components";
import { motion } from "framer-motion";
import { useAuth } from "@/features/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle, Calendar } from "lucide-react";
import { useState, useMemo } from "react";
import { useUserTransactions } from "@/lib/api/hooks/useTransactions";
import type { TransactionItem } from "@/lib/api/services";

export default function History() {
  const { isAuthenticated } = useAuth();
  const { data: userTransactionsResponse, isLoading, error } = useUserTransactions();
  const [searchQuery, setSearchQuery] = useState("");
  
  const userTransactions = userTransactionsResponse?.items || [];
  
  // Filter transactions based on search query
  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return userTransactions;
    
    return userTransactions.filter((transaction: TransactionItem) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        transaction.code?.toLowerCase().includes(searchLower) ||
        transaction.note?.toLowerCase().includes(searchLower) ||
        transaction.amount.toString().includes(searchQuery)
      );
    });
  }, [userTransactions, searchQuery]);

  return (
    <Layout showSidebar={isAuthenticated}>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Lịch sử giao dịch</h1>
            <p className="text-muted-foreground">Xem lại tất cả các giao dịch của bạn</p>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm mã giao dịch, ghi chú..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Transaction List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Danh sách giao dịch</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Lỗi tải dữ liệu</h3>
                    <p className="text-muted-foreground">Không thể tải lịch sử giao dịch. Vui lòng thử lại sau.</p>
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {searchQuery ? "Không tìm thấy giao dịch" : "Chưa có giao dịch"}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery 
                        ? `Không tìm thấy giao dịch nào phù hợp với "${searchQuery}"` 
                        : "Bạn chưa thực hiện giao dịch nào"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTransactions.map((transaction: TransactionItem, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {transaction.action === 'deposit' ? '+' : '-'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {transaction.note?.split('[')[0]?.trim() || 'Giao dịch'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString('vi-VN') : 'N/A'}
                            </p>
                            {/* Display the transaction code */}
                            {transaction.code && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Mã: {transaction.code}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-lg ${
                            transaction.action === 'deposit' ? 'text-emerald-600' : 'text-orange-600'
                          }`}>
                            {transaction.action === 'deposit' ? '+' : '-'}
                            {Number(transaction.amount).toLocaleString('vi-VN')}₫
                          </p>
                          <Badge variant="default" className="mt-1">
                            {transaction.action === 'deposit' ? 'Nạp tiền' : 'Chi tiêu'}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}
