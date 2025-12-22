'use client'

import { useState } from "react"
import { Layout } from "@/components";
import Image from "next/image";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/api";
import { tokenManager } from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard as CreditCardIcon,
  Wallet as WalletIcon, 
  QrCode as QrCodeIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  DollarSign as DollarSignIcon,
  Server as ServerIcon,
  ArrowDownToLine as DepositIcon,
  ArrowUpFromLine as WithdrawIcon
} from "lucide-react";
import type { Payment } from "@/lib/api/types";
import { useProxies } from "@/lib/api/hooks";
import { useUserTransactions } from "@/lib/api/hooks/useTransactions";
import type { TransactionItem } from "@/lib/api/services/transaction.service";

interface ConvertedTransaction {
  id: string;
  userId: string;
  amount: number;
  description?: string;
  status: string;
  type: string;
  createdAt: string;
}

export default function Deposit() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState("");
  const [userCode, setUserCode] = useState("");

  // Fetch proxies
  const { data: proxiesResponse, isLoading: proxiesLoading } = useProxies();
  
  // Extract proxy items from the response
  const proxyItems = proxiesResponse?.items || [];

  // Fetch user transactions
  const { data: userTransactionsResponse, isLoading: transactionsLoading } = useUserTransactions();
  
  // Convert TransactionItem to Payment type
  const payments = (userTransactionsResponse?.items || []).map((item: TransactionItem) => ({
    id: item.id,
    userId: typeof item.user?.id === 'string' ? item.user.id : item.user?.id?.type || '',
    amount: item.amount,
    description: item.description,
    status: 'completed', // Default to completed for transaction history
    type: item.action === 'deposit' ? 'deposit' : 'payment', // Use the action field to determine type
    createdAt: item.createdAt
  })) || [];

  const depositMutation = useMutation({
    mutationFn: async () => {
      if (!amount || Number(amount) <= 0) {
        throw new Error("Vui lòng nhập số tiền hợp lệ");
      }

      // Get user code from API me endpoint using GET method
      const tokens = tokenManager.getTokens();
      const meResponse = await fetch("https://api.shoptoolnro.com.vn/api/v1/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add auth token if available
          ...(tokens?.accessToken && {
            "Authorization": `Bearer ${tokens.accessToken}`
          })
        }
      });
      
      const userData = await meResponse.json();
      const code = userData?.data?.code || userData?.code || user?.email?.split('@')[0] || 'olsy2wHd';
      setUserCode(code);
      
      // Create QR code URL
      const qrUrl = `https://qr.sepay.vn/img?bank=TPBank&acc=36102903380&amount=${amount}&des=${code}`;
      
      // Open QR code in new tab
      window.open(qrUrl, '_blank');
      
      return { code, amount, userData };
    },
    onSuccess: (data) => {
      toast({
        title: "Mở trang thanh toán",
        description: "Trang thanh toán đã được mở trong tab mới. Vui lòng hoàn tất thanh toán.",
      });
      
      // Recall API me to update user balance
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      }, 90000); // Wait 90 seconds (1.5 minutes) before refreshing data
      
      // Reset amount
      setAmount("");
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "https://api.shoptoolnro.com.vn/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo mã thanh toán",
        variant: "destructive",
      });
    },
  });

  const handleDeposit = () => {
    depositMutation.mutate();
  };

  const quickAmounts = [10000, 30000, 50000, 100000, 200000, 500000];

  const recentDeposits = payments?.slice(0, 5) || [];

  return (
    <Layout showSidebar={isAuthenticated}>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Nạp tiền</h1>
            <p className="text-muted-foreground">Nạp tiền vào tài khoản để mua các công cụ</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Deposit Form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCardIcon className="mr-2 h-5 w-5" />
                    Nạp tiền vào tài khoản
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Balance */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <WalletIcon className="h-5 w-5 text-emerald-600" />
                        <span className="font-medium">Số dư hiện tại:</span>
                      </div>
                      <span className="text-2xl font-bold text-emerald-600" data-testid="text-current-balance">
                        {Number(user?.accountBalance || 0).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>

                  {/* Quick Amount Selection */}
                  <div className="space-y-3">
                    <Label>Chọn nhanh số tiền</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {quickAmounts.map((quickAmount) => (
                        <Button
                          key={quickAmount}
                          variant={amount === quickAmount.toString() ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAmount(quickAmount.toString())}
                          data-testid={`button-quick-amount-${quickAmount}`}
                        >
                          {quickAmount.toLocaleString('vi-VN')}₫
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Hoặc nhập số tiền tùy chỉnh (₫)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Nhập số tiền muốn nạp"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="10000"
                      step="10000"
                      data-testid="input-custom-amount"
                    />
                    <p className="text-sm text-muted-foreground">
                      Số tiền tối thiểu: 10,000₫
                    </p>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handleDeposit}
                    disabled={!amount || Number(amount) <= 0 || depositMutation.isPending}
                    data-testid="button-deposit"
                  >
                    {depositMutation.isPending ? "Đang xử lý..." : `Nạp ${amount ? Number(amount).toLocaleString('vi-VN') + '₫' : 'tiền'}`}
                  </Button>
                </CardContent>
              </Card>

              {/* Payment Instructions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCodeIcon className="mr-2 h-5 w-5" />
                    Hướng dẫn nạp tiền
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Chuyển khoản ngân hàng</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Image 
                            src="https://cdn.vietqr.io/img/TPB.png" 
                            alt="TPBank" 
                            width={100}
                            height={96}
                            className="w-25 h-24"
                          />
                        </div>
                          <span><strong>Ngân hàng:</strong> TPBank</span>
                        <p><strong>Số tài khoản:</strong> 36102903380</p>
                        <p><strong>Chủ tài khoản:</strong> NGUYEN QUY LINH CONG</p>
                        <p><strong>Nội dung:</strong> 
                          <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded ml-2">
                            {userCode || (user ? user.code?.split('@')[0] || 'Đang tải...' : 'Đang tải...')}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                      <p className="font-medium mb-2">Lưu ý quan trọng:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Vui lòng ghi đúng nội dung chuyển khoản để hệ thống tự động cộng tiền</li>
                        <li>Số dư sẽ được cập nhật trong vòng 1-2 phút sau khi chuyển khoản thành công</li>
                        <li className="text-red-600 dark:text-red-400 font-medium">Nếu nạp sai nội dung thì liên hệ admin - 20%</li>
                        <li>Nếu có vấn đề, vui lòng liên hệ bộ phận hỗ trợ</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Account Summary */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Thông tin tài khoản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Số dư hiện tại</span>
                    <span className="font-bold text-emerald-600" data-testid="text-sidebar-balance">
                      {Number(user?.accountBalance || 0).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Loại tài khoản</span>
                    <Badge variant={user?.isAdmin ? "default" : "secondary"}>
                      {user?.isAdmin ? "Quản trị viên" : "Thành viên"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ngày tham gia</span>
                    <span className="text-sm font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Deposits */}
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử giao dịch gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-2">
                          <div className="space-y-1">
                            <div className="h-4 bg-muted rounded w-24"></div>
                            <div className="h-3 bg-muted rounded w-16"></div>
                          </div>
                          <div className="h-4 bg-muted rounded w-20"></div>
                        </div>
                      ))}
                    </div>
                  ) : recentDeposits.length > 0 ? (
                    <div className="space-y-3">
                      {recentDeposits.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              payment.type === 'deposit' 
                                ? 'bg-emerald-100 dark:bg-emerald-900' 
                                : 'bg-orange-100 dark:bg-orange-900'
                            }`}>
                              {payment.type === 'deposit' ? (
                                <DepositIcon className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <WithdrawIcon className="w-3 h-3 text-orange-600" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {payment.description || 'Giao dịch'}
                              </p>
                              <p className={`text-xs ${
                                payment.type === 'deposit' ? 'text-emerald-600' : 'text-orange-600'
                              }`}>
                                {payment.type === 'deposit' ? '+' : '-'}
                                {Number(payment.amount).toLocaleString('vi-VN')}₫
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(payment.createdAt).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant={payment.status === 'completed' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {payment.status === 'completed' ? (
                              <>
                                <CheckCircleIcon className="w-3 h-3 mr-1" />
                                {payment.type === 'deposit' ? 'Nạp tiền' : 'Thanh toán'}
                              </>
                            ) : payment.status === 'pending' ? (
                              <>
                                <ClockIcon className="w-3 h-3 mr-1" />
                                Đang xử lý
                              </>
                            ) : (
                              'Thất bại'
                            )}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">Chưa có giao dịch nào</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
