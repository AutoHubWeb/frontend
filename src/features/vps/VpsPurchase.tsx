'use client'

import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth";
import { useCreateOrder } from "@/lib/api/hooks/useOrders";
import { useVpsPlans } from "@/lib/api/hooks/useVps";
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Eye,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { motion } from "framer-motion";

interface VPSPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  ram: number;
  disk: number;
  cpu: number;
  bandwidth: number;
  location?: string;
  os?: string;
  tags?: string[];
  soldQuantity: number;
  viewCount: number;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function VpsPurchase() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedVps, setSelectedVps] = useState<VPSPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: vpsResponse, isLoading, error } = useVpsPlans({ page: currentPage, limit: itemsPerPage });
  const vpsPlans = (vpsResponse?.data || []).filter(vps => vps.status === 1);

  const createOrderMutation = useCreateOrder({
    onSuccess: (data) => {
      toast({
        title: "Đặt hàng VPS thành công",
        description: data.note || "Đơn hàng VPS của bạn đã được tạo thành công",
      });
      setIsDialogOpen(false);
      setSelectedVps(null);
    },
    onError: (error: any) => {
      // Handle insufficient balance error
      if (error.message === "Số dư không đủ") {
        toast({
          title: "Số dư không đủ",
          description: "Vui lòng nạp thêm tiền để tiếp tục mua VPS",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Lỗi đặt hàng VPS",
          description: error.message || "Không thể tạo đơn hàng VPS",
          variant: "destructive",
        });
      }
    },
  });

  const handleSelectVps = (vps: VPSPlan) => {
    if (!isAuthenticated) {
      toast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để mua VPS",
        variant: "destructive",
      });
      return;
    }

    setSelectedVps(vps);
    setIsDialogOpen(true);
  };

  const handleConfirmPurchase = () => {
    if (!selectedVps) return;
    
    createOrderMutation.mutate({
      type: "vps",
      vpsId: selectedVps.id,
    });
  };

  // Pagination functions
  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (vpsResponse?.meta && currentPage < vpsResponse.meta.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToLastPage = () => {
    if (vpsResponse?.meta) {
      setCurrentPage(vpsResponse.meta.totalPages);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                DỊCH VỤ VPS
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Chọn gói VPS phù hợp với nhu cầu của bạn và bắt đầu trải nghiệm ngay hôm nay
            </p>
          </motion.div>

          {/* VPS Plans */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <Skeleton className="w-16 h-16 rounded-lg mx-auto mb-3" />
                      <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                      <Skeleton className="h-8 w-1/2 mx-auto mb-1" />
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4 mx-auto" />
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4 text-sm mb-4">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Lỗi tải dữ liệu</h1>
              <p className="text-muted-foreground mb-6">Không thể tải danh sách VPS. Vui lòng thử lại sau.</p>
              <Button onClick={() => window.location.reload()}>Tải lại trang</Button>
            </div>
          ) : vpsPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vpsPlans.map((vps, index) => (
                  <motion.div
                    key={vps.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card className="overflow-hidden border-2 hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                      <CardContent className="p-6 flex-grow">
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-800 dark:to-purple-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Server className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{vps.name}</h3>
                          <p className="text-2xl font-bold text-red-500 mb-1">
                            {Number(vps.price).toLocaleString('vi-VN')} ₫
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> / 30 ngày</span>
                          </p>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                            <Cpu className="w-4 h-4" />
                            <span className="font-medium">{vps.cpu} CPU</span>
                          </div>
                          <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                            <HardDrive className="w-4 h-4" />
                            <span className="font-medium">{vps.ram} GB RAM</span>
                          </div>
                          <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                            <HardDrive className="w-4 h-4" />
                            <span className="font-medium">{vps.disk} GB SSD</span>
                          </div>
                          {vps.location && (
                            <div className="text-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                              {vps.location}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>Đã bán: {vps.soldQuantity}</span>
                          </div>
                          <div>
                            <span>Lượt xem: {vps.viewCount}</span>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium mt-auto"
                          onClick={() => handleSelectVps(vps)}
                        >
                          MUA NGAY
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
          ) : (
            <div className="text-center py-16">
              <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Không có VPS nào</h3>
              <p className="text-muted-foreground">Hiện tại không có gói VPS nào khả dụng.</p>
            </div>
          )}
          
          {/* Pagination Controls */}
          {vpsResponse?.meta && vpsResponse.meta.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Tổng cộng {vpsResponse.meta.total} VPS
              </div>
              
              <div className="flex items-center space-x-1">
                {/* First Page Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="px-3 hidden sm:inline-flex"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                
                {/* Previous Page Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-3"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Trước</span>
                </Button>
                
                {/* Page Numbers */}
                <div className="flex items-center mx-2">
                  <span className="text-sm font-medium px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-md">
                    {currentPage} / {vpsResponse.meta.totalPages}
                  </span>
                </div>
                
                {/* Next Page Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage >= vpsResponse.meta.totalPages}
                  className="px-3"
                >
                  <span className="mr-1 hidden sm:inline">Sau</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                {/* Last Page Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToLastPage}
                  disabled={currentPage >= vpsResponse.meta.totalPages}
                  className="px-3 hidden sm:inline-flex"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">Hiển thị:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="h-8 rounded border text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 px-2"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Purchase Confirmation Dialog */}
        {isDialogOpen && selectedVps && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Xác nhận mua VPS</h3>
                  <button 
                    onClick={() => setIsDialogOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{selectedVps.name}</h4>
                    <p className="text-2xl font-bold text-primary">
                      {Number(selectedVps.price).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2">Thông tin gói</h4>
                  <ul className="text-sm space-y-1">
                    <li>• {selectedVps.cpu} CPU</li>
                    <li>• {selectedVps.ram} GB RAM</li>
                    <li>• {selectedVps.disk} GB SSD</li>
                    {selectedVps.location && <li>• Vị trí: {selectedVps.location}</li>}
                    {selectedVps.os && <li>• Hệ điều hành: {selectedVps.os}</li>}
                  </ul>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                  <Button 
                    onClick={handleConfirmPurchase}
                    disabled={createOrderMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {createOrderMutation.isPending ? "Đang xử lý..." : "Xác nhận mua"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
}
