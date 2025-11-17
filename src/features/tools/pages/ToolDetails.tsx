'use client'

import { useParams } from "next/navigation"
import Link from "next/link";
import { Layout } from "@/components";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { useToast } from "@/hooks/use-toast";
import { useToolById } from "@/lib/api/hooks/useTools";
import { useCreateOrder } from "@/lib/api/hooks/useOrders";
import { isUnauthorizedError } from "@/lib/api";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Eye,
  Star,
  ShoppingCart,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function ToolDetails() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<{duration: number, amount: string, name: string, rawDuration?: number} | null>(null);

  // Use real API call with proper endpoint
  const { data: toolResponse, isLoading, error } = useToolById(id || "");
  
  // Transform API tool to format expected by component
  const transformTool = (apiTool: any) => {
    if (!apiTool) return null;
    
    // Map the plans correctly
    const plans = apiTool.plans?.map((plan: any) => ({
      name: plan.name,
      duration: plan.duration === -1 ? "Vĩnh viễn" : `${plan.duration} ngày`,
      amount: plan.price?.toString() || "0",
      durationValue: plan.duration === -1 ? 3 : plan.duration <= 1 ? 1 : 2, // Map to 1, 2, 3
      rawDuration: plan.duration // Keep the raw duration value for API calls
    })) || [];
    
    // Map all images
    const imageUrls = apiTool.images?.map((image: any) => 
      `https://shopnro.hitly.click/api/v1/files${image.fileUrl}`
    ) || [];
    
    return {
      id: apiTool.id,
      name: apiTool.name,
      description: apiTool.description,
      price: plans[0]?.amount || "0",
      prices: plans,
      // Keep the first image for backward compatibility
      imageUrl: imageUrls[0] || "/static/tool/default.jpg",
      // Add all images
      imageUrls: imageUrls,
      videoUrl: apiTool.demo || "",
      instructions: "Hướng dẫn sử dụng công cụ sẽ được cung cấp sau khi mua.",
      views: apiTool.viewCount || 0,
      purchases: apiTool.soldQuantity || 0,
      reviewCount: 0, // Default review count
      categoryId: apiTool.categoryId,
      category: apiTool.category
    };
  };
  
  const tool: any = toolResponse ? transformTool(toolResponse) : null;

  const createOrderMutation = useCreateOrder({
    onSuccess: (data) => {
      toast({
        title: "Đặt hàng thành công",
        description: data?.note || "Đơn hàng của bạn đã được tạo thành công",
      });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      setPurchaseDialogOpen(false);
      setDiscountCode("");
      setSelectedPlan(null);
    },
    onError: (error: any) => {
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
      
      // Handle insufficient balance error
      if (error.message === "Số dư không đủ") {
        toast({
          title: "Số dư không đủ",
          description: "Vui lòng nạp thêm tiền để tiếp tục mua hàng",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Lỗi",
          description: error.message || "Không thể tạo đơn hàng",
          variant: "destructive",
        });
      }
    },
  });

  const validateDiscountMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/discount-codes/validate", { code });
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Mã giảm giá hợp lệ",
        description: `Giảm ${data.discountType === 'percentage' ? data.discountValue + '%' : Number(data.discountValue).toLocaleString('vi-VN') + '₫'}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Mã giảm giá không hợp lệ",
        description: error.message || "Mã giảm giá không tồn tại hoặc đã hết hạn",
        variant: "destructive",
      });
    },
  });

  const handlePurchase = (plan: any) => {
    if (!isAuthenticated) {
      toast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để mua công cụ",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    setSelectedPlan(plan);
    setPurchaseDialogOpen(true);
  };

  const handleConfirmPurchase = () => {
    if (!tool || !selectedPlan) return;
    
    // Use rawDuration if available, otherwise use duration
    const durationValue = selectedPlan.rawDuration !== undefined ? 
      (selectedPlan.rawDuration === -1 ? 3 : selectedPlan.rawDuration) : 
      selectedPlan.duration;
    
    createOrderMutation.mutate({
      type: "tool",
      toolId: tool.id,
      duration: durationValue,
    });
  };

  const handleValidateDiscount = () => {
    if (discountCode.trim()) {
      validateDiscountMutation.mutate(discountCode.trim());
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="w-full h-64 mb-6" />
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-6" />
              <Skeleton className="w-full h-48" />
            </div>
            <div>
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-24 mb-4" />
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Lỗi tải dữ liệu</h1>
            <p className="text-muted-foreground mb-6">Không thể tải thông tin công cụ. Vui lòng thử lại sau.</p>
            <Link href="/">
              <Button data-testid="button-back-to-home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại trang chủ
              </Button>
            </Link>
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
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy công cụ</h1>
            <p className="text-muted-foreground mb-6">Công cụ bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link href="/">
              <Button data-testid="button-back-to-home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link href="/">
              <Button variant="ghost" className="mb-8" data-testid="button-back-to-home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại trang chủ
              </Button>
            </Link>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Tool Info Section - Left Side */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Tool Banner Image */}
                  <div className="relative bg-gradient-to-br from-orange-400 to-orange-600 h-48 md:h-full flex items-center justify-center">
                    <div className="text-center">
                      {/* Enhanced custom image with better styling */}
                      <div className="mb-4 flex justify-center">
                        <div className="relative">
                          <div className="absolute -inset-2 bg-white/30 rounded-full blur-sm"></div>
                          <img 
                            src="https://shopnro.hitly.click/api/v1/files/static/tool/48AMZRE4aMxNwF.jpg" 
                            alt="Tool Icon" 
                            className="relative w-20 h-20 mx-auto object-contain rounded-full border-2 border-white shadow-lg"
                          />
                        </div>
                      </div>
                      <div className="text-white font-bold text-sm bg-black/20 px-3 py-1 rounded-full">NGỌC RỒNG ONLINE</div>
                      <div className="text-white text-xs mt-2 opacity-80">.com</div>
                    </div>
                  </div>

                  {/* Tool Details */}
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-2" data-testid="text-tool-name">
                      {tool.name}
                    </h1>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      Người bán: <span className="text-blue-600 font-medium">Admin</span>
                    </div>

                    {/* Pricing Options */}
                    <div className="space-y-3">
                      {(tool.prices && Array.isArray(tool.prices) && tool.prices.length > 0) ? tool.prices.map((priceOption: any, index: number) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full h-12 justify-between bg-primary text-primary-foreground hover:shadow-md transition-all duration-200 border-gray-300 dark:border-gray-600"
                          onClick={() => handlePurchase(priceOption)}
                          data-testid={`button-purchase-${priceOption.duration.replace(' ', '-').toLowerCase()}`}
                        >
                          <span>Mua {priceOption.name}</span>
                          <span className="font-bold">
                            {Number(priceOption.amount).toLocaleString('vi-VN')}₫
                          </span>
                        </Button>
                      )) : (
                        <Button
                          variant="outline"
                          className="w-full h-12 justify-between bg-primary text-primary-foreground hover:shadow-md transition-all duration-200 border-gray-300 dark:border-gray-600"
                          onClick={() => handlePurchase({name: "Vĩnh viễn", duration: "Vĩnh viễn", amount: tool.price, durationValue: 3, rawDuration: -1})}
                          data-testid="button-purchase-permanent"
                        >
                          <span>Mua Vĩnh Viễn</span>
                          <span className="font-bold">
                            {Number(tool.price).toLocaleString('vi-VN')}₫
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Product Information Section */}
              <div className="mt-8">
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg">
                      THÔNG TIN SẢN PHẨM
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Eye className="w-4 h-4 mr-1" />
                          <span data-testid="text-tool-views">{(tool.views || 0).toLocaleString('vi-VN')} lượt xem</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          <span>{(tool.purchases || 0).toLocaleString('vi-VN')} lượt mua</span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-semibold mb-2">Mô tả sản phẩm:</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed" data-testid="text-tool-description">
                          {tool.description}
                        </p>
                      </div>

                      {/* Media Section - Images and Videos */}
                      {(tool.imageUrls?.length > 0 || tool.videoUrl) && (
                        <div>
                          <h3 className="font-semibold mb-3">Hình ảnh demo</h3>
                          <div className="space-y-4">
                            {/* Display all images */}
                            {tool.imageUrls && tool.imageUrls.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {tool.imageUrls.map((imageUrl: string, index: number) => (
                                  <div 
                                    key={index} 
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800"
                                  >
                                    <img 
                                      src={imageUrl} 
                                      alt={`Demo ${tool.name} ${index + 1}`}
                                      className="w-full h-auto max-h-96 object-contain"
                                      data-testid={`img-tool-demo-${index}`}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {tool.videoUrl && (
                              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                                {getYouTubeVideoId(tool.videoUrl) ? (
                                  // YouTube video embed
                                  <div className="relative pb-[56.25%] h-0"> {/* 16:9 Aspect Ratio */}
                                    <iframe
                                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(tool.videoUrl)}`}
                                      className="absolute top-0 left-0 w-full h-full"
                                      title={`Demo video for ${tool.name}`}
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      data-testid="youtube-video-demo"
                                    />
                                  </div>
                                ) : (
                                  // Regular video file
                                  <video 
                                    controls 
                                    className="w-full h-auto max-h-96"
                                    data-testid="video-tool-demo"
                                  >
                                    <source src={tool.videoUrl} type="video/mp4" />
                                    Trình duyệt của bạn không hỗ trợ video.
                                  </video>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {tool.instructions && (
                        <div>
                          <h3 className="font-semibold mb-2">Hướng dẫn sử dụng:</h3>
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700" data-testid="content-tool-instructions">
                            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                              {tool.instructions}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Purchase Information Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="sticky top-24 bg-gray-50 dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Bạn có thể thanh toán sản phẩm ngay</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Thanh toán một lúc</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        <strong>Nếu có lỗi xảy ra hãy liên hệ với admin</strong><br/>
                        Phương pháp liên hệ ở trang chủ
                      </p>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Purchase Confirmation Dialog */}
        <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
          <DialogContent data-testid="dialog-purchase-confirmation">
            <DialogHeader>
              <DialogTitle>Xác nhận mua hàng</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn mua công cụ này không?
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="size-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold" data-testid="text-purchase-tool-name">{tool.name}</h4>
                  {selectedPlan && (
                    <>
                      <p className="text-2xl font-bold text-primary" data-testid="text-purchase-tool-price">
                        {Number(selectedPlan.amount).toLocaleString('vi-VN')}₫
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedPlan.name}
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              {/* Discount Code Input */}
              {/* <div className="space-y-2">
                <Label htmlFor="discount-code">Mã giảm giá (tùy chọn)</Label>
                <div className="flex gap-2">
                  <Input
                    id="discount-code"
                    placeholder="Nhập mã giảm giá"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    data-testid="input-discount-code"
                  />
                  <Button
                    variant="outline"
                    onClick={handleValidateDiscount}
                    disabled={!discountCode.trim() || validateDiscountMutation.isPending}
                    data-testid="button-validate-discount"
                  >
                    Kiểm tra
                  </Button>
                </div>
              </div> */}
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setPurchaseDialogOpen(false)}
                data-testid="button-cancel-purchase"
              >
                Hủy
              </Button>
              <Button 
                onClick={handleConfirmPurchase}
                disabled={createOrderMutation.isPending}
                data-testid="button-confirm-purchase"
              >
                {createOrderMutation.isPending ? "Đang xử lý..." : "Xác nhận mua"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
