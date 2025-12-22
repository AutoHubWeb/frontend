'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  CreditCard, 
  Tag, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Wallet
} from "lucide-react";
import type { Tool, DiscountCode } from "@/lib/api/types";

export default function Checkout() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedToolId, setSelectedToolId] = useState<string>("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get tool ID from URL params or localStorage
  useEffect(() => {
    const toolId = searchParams.get('tool')
    if (toolId) {
      setSelectedToolId(toolId)
    } else {
      // If no tool specified, redirect back to tools page
      router.push('/tools')
    }
  }, [router, searchParams]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để tiếp tục mua hàng",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "https://api.shoptoolnro.com.vn/api/login";
      }, 500);
    }
  }, [isAuthenticated, toast]);

  const { data: tool, isLoading: toolLoading } = useQuery<Tool>({
    queryKey: ["/api/tools", selectedToolId],
    enabled: !!selectedToolId,
  });

  const validateDiscountMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/discount-codes/validate", { code });
      return await response.json();
    },
    onSuccess: (data) => {
      setAppliedDiscount(data);
      toast({
        title: "Mã giảm giá hợp lệ",
        description: `Giảm ${data.discountType === 'percentage' ? data.discountValue + '%' : Number(data.discountValue).toLocaleString('vi-VN') + '₫'}`,
      });
    },
    onError: (error) => {
      setAppliedDiscount(null);
      toast({
        title: "Mã giảm giá không hợp lệ",
        description: error.message || "Mã giảm giá không tồn tại hoặc đã hết hạn",
        variant: "destructive",
      });
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async ({ toolId, discountCodeId }: { toolId: string; discountCodeId?: string }) => {
      setIsProcessing(true);
      return await apiRequest("POST", "/api/purchases", { toolId, discountCodeId });
    },
    onSuccess: () => {
      toast({
        title: "Mua thành công!",
        description: "Công cụ đã được thêm vào danh sách đã mua",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/purchases"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Redirect to purchased tools page
      setTimeout(() => {
        router.push('/purchased-tools');
      }, 1500);
    },
    onError: (error) => {
      setIsProcessing(false);
      
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
        title: "Lỗi thanh toán",
        description: error.message || "Không thể hoàn tất giao dịch",
        variant: "destructive",
      });
    },
  });

  const handleApplyDiscount = () => {
    if (discountCode.trim()) {
      validateDiscountMutation.mutate(discountCode.trim());
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
  };

  const handleCompletePurchase = () => {
    if (!tool) return;
    
    purchaseMutation.mutate({
      toolId: tool.id,
      discountCodeId: appliedDiscount?.code,
    });
  };

  // Calculate pricing
  const originalPrice = tool ? Number(tool.price) : 0;
  let discountAmount = 0;
  
  if (appliedDiscount && tool) {
    if (appliedDiscount.discountType === 'percentage') {
      discountAmount = Math.floor(originalPrice * Number(appliedDiscount.discountValue) / 100);
    } else {
      discountAmount = Number(appliedDiscount.discountValue) * 100; // Convert to cents
    }
  }
  
  const finalPrice = originalPrice - discountAmount;
  const hasInsufficientBalance = user ? Number(user.balance) < finalPrice : true;

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Cần đăng nhập</h1>
            <p className="text-muted-foreground mb-4">Vui lòng đăng nhập để tiếp tục</p>
            <Button onClick={() => window.location.href = "https://api.shoptoolnro.com.vn/api/login"} data-testid="button-login-checkout">
              Đăng nhập
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (toolLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-32"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="h-64 bg-muted rounded-lg"></div>
                </div>
                <div>
                  <div className="h-96 bg-muted rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!tool) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Không tìm thấy công cụ</h1>
            <p className="text-muted-foreground mb-6">Công cụ bạn muốn mua không tồn tại hoặc đã bị xóa.</p>
            <Link href="/tools">
              <Button data-testid="button-back-to-tools">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Back Button */}
            <Link href="/tools">
              <Button variant="ghost" className="mb-8" data-testid="button-back-to-tools">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách
              </Button>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Product Details */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Chi tiết đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Product Info */}
                    <div className="flex items-center space-x-4">
                      <Image 
                        src={tool.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"} 
                        alt={tool.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold" data-testid="text-checkout-tool-name">{tool.name}</h3>
                        <p className="text-muted-foreground line-clamp-2" data-testid="text-checkout-tool-description">
                          {tool.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary">Công cụ phần mềm</Badge>
                          <Badge variant="outline">30 ngày sử dụng</Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Discount Code Section */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Mã giảm giá</h4>
                      
                      {appliedDiscount ? (
                        <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                            <div>
                              <p className="font-medium text-emerald-800 dark:text-emerald-200">
                                Mã &ldquo;{appliedDiscount.code}&rdquo; đã được áp dụng
                              </p>
                              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                Giảm {appliedDiscount.discountType === 'percentage' 
                                  ? `${appliedDiscount.discountValue}%` 
                                  : `${Number(appliedDiscount.discountValue).toLocaleString('vi-VN')}₫`}
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleRemoveDiscount}
                            data-testid="button-remove-discount"
                          >
                            Xóa
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Nhập mã giảm giá"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            data-testid="input-discount-code"
                          />
                          <Button
                            variant="outline"
                            onClick={handleApplyDiscount}
                            disabled={!discountCode.trim() || validateDiscountMutation.isPending}
                            data-testid="button-apply-discount"
                          >
                            <Tag className="w-4 h-4 mr-1" />
                            Áp dụng
                          </Button>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Account Balance */}
                    <div className="space-y-2">
                      <h4 className="font-semibold">Số dư tài khoản</h4>
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Wallet className="h-5 w-5 text-emerald-600" />
                          <span>Số dư hiện tại:</span>
                        </div>
                        <span className="font-bold text-emerald-600" data-testid="text-checkout-balance">
                          {Number(user?.accountBalance || 0).toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                      
                      {hasInsufficientBalance && (
                        <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <p className="text-sm text-red-800 dark:text-red-200">
                            Số dư không đủ để thực hiện giao dịch này. 
                            <Link href="/deposit" className="underline ml-1">Nạp thêm tiền</Link>
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Tóm tắt đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Pricing Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Giá gốc:</span>
                        <span data-testid="text-original-price">{originalPrice.toLocaleString('vi-VN')}₫</span>
                      </div>
                      
                      {appliedDiscount && discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Giảm giá:</span>
                          <span data-testid="text-discount-amount">-{discountAmount.toLocaleString('vi-VN')}₫</span>
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div className="flex justify-between text-lg font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-primary" data-testid="text-final-price">
                          {finalPrice.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>

                    <Separator />

                    {/* Purchase Button */}
                    <div className="space-y-3">
                      <Button 
                        className="w-full" 
                        onClick={handleCompletePurchase}
                        disabled={hasInsufficientBalance || isProcessing || purchaseMutation.isPending}
                        data-testid="button-complete-purchase"
                      >
                        {isProcessing || purchaseMutation.isPending ? (
                          "Đang xử lý..."
                        ) : hasInsufficientBalance ? (
                          "Số dư không đủ"
                        ) : (
                          `Thanh toán ${finalPrice.toLocaleString('vi-VN')}₫`
                        )}
                      </Button>

                      {hasInsufficientBalance && (
                        <Link href="/deposit">
                          <Button variant="outline" className="w-full" data-testid="button-deposit-more">
                            <Wallet className="w-4 h-4 mr-2" />
                            Nạp thêm tiền
                          </Button>
                        </Link>
                      )}
                    </div>

                    <Separator />

                    {/* Purchase Terms */}
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Công cụ sẽ có hiệu lực trong 30 ngày kể từ khi mua</p>
                      <p>• Bạn có thể đổi license key bất cứ lúc nào</p>
                      <p>• Hỗ trợ kỹ thuật 24/7 qua Telegram, Zalo, Email</p>
                      <p>• Không hoàn tiền sau khi mua thành công</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Success Modal Effect */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-card border border-border rounded-xl p-8 text-center max-w-md mx-4"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                  ></motion.div>
                  <h3 className="text-xl font-bold mb-2">Đang xử lý thanh toán</h3>
                  <p className="text-muted-foreground">Vui lòng đợi trong giây lát...</p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
