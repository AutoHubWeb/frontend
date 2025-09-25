'use client'

import { useState } from "react"
import { Layout } from "@/components";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/api";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Wallet, 
  QrCode,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";
;
import type { Payment } from "@/lib/api/types";

export default function Deposit() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const { data: payments, isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
    retry: false,
  });

  const depositMutation = useMutation({
    mutationFn: async ({ amount, description }: { amount: string; description: string }) => {
      const response = await apiRequest("POST", "/api/deposit", { 
        amount: Number(amount) * 100, // Convert to cents
        description 
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Nạp tiền thành công",
        description: "Số dư của bạn đã được cập nhật",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      setAmount("");
      setDescription("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "https://shopnro.hitly.click/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Lỗi",
        description: error.message || "Không thể nạp tiền",
        variant: "destructive",
      });
    },
  });

  const handleDeposit = () => {
    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số tiền hợp lệ",
        variant: "destructive",
      });
      return;
    }

    depositMutation.mutate({
      amount,
      description: description || "Nạp tiền vào tài khoản",
    });
  };

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

  const recentDeposits = payments?.filter(p => p.type === "deposit").slice(0, 5) || [];

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
                    <CreditCard className="mr-2 h-5 w-5" />
                    Nạp tiền vào tài khoản
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Balance */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wallet className="h-5 w-5 text-emerald-600" />
                        <span className="font-medium">Số dư hiện tại:</span>
                      </div>
                      <span className="text-2xl font-bold text-emerald-600" data-testid="text-current-balance">
                        {Number(user?.balance || 0).toLocaleString('vi-VN')}₫
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

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Ghi chú (tùy chọn)</Label>
                    <Textarea
                      id="description"
                      placeholder="Nhập ghi chú cho giao dịch này"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      data-testid="input-description"
                    />
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
                    <QrCode className="mr-2 h-5 w-5" />
                    Hướng dẫn nạp tiền
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Chuyển khoản ngân hàng</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Ngân hàng:</strong> Vietcombank</p>
                        <p><strong>Số tài khoản:</strong> 1234567890</p>
                        <p><strong>Chủ tài khoản:</strong> CONG TY TOOLMARKET</p>
                        <p><strong>Nội dung:</strong> NAPIEN [email của bạn]</p>
                      </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Ví điện tử MoMo</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Số điện thoại:</strong> 0901234567</p>
                        <p><strong>Chủ tài khoản:</strong> TOOLMARKET</p>
                        <p><strong>Nội dung:</strong> NAPIEN [email của bạn]</p>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                      <p className="font-medium mb-2">Lưu ý quan trọng:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Vui lòng ghi đúng nội dung chuyển khoản để hệ thống tự động cộng tiền</li>
                        <li>Số dư sẽ được cập nhật trong vòng 5-10 phút sau khi chuyển khoản thành công</li>
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
                      {Number(user?.balance || 0).toLocaleString('vi-VN')}₫
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
                  <CardTitle>Lịch sử nạp tiền gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentsLoading ? (
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
                            <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                              <DollarSign className="w-3 h-3 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                +{Number(payment.amount).toLocaleString('vi-VN')}₫
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
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Thành công
                              </>
                            ) : payment.status === 'pending' ? (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
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
                      <p className="text-sm text-muted-foreground">Chưa có giao dịch nạp tiền nào</p>
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
