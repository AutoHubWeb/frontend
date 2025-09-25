'use client'

import { useState } from "react";
import { Layout } from "@/components";
import { ToolCard } from "@/features/tools";
import { motion } from "framer-motion";
import { useAuth } from "@/features/auth";
import { useToast } from "@/hooks/use-toast";
import { mockTools, mockCategories } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Filter, 
  ShoppingCart,
  AlertCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Tools() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<typeof mockTools[0] | null>(null);

  // Use mock data instead of API calls
  const tools = mockTools;
  const categories = mockCategories;
  const toolsLoading = false;
  const categoriesLoading = false;

  // Mock purchase function - no actual payment processing
  const handlePurchaseSuccess = () => {
    toast({
      title: "Demo: Mua thành công",
      description: "Đây là demo - không có giao dịch thật sự được thực hiện",
    });
    setPurchaseDialogOpen(false);
    setSelectedTool(null);
  };

  // Mock discount validation - demo only  
  const handleValidateDiscount = () => {
    toast({
      title: "Demo: Mã giảm giá",
      description: "Đây là chức năng demo - không có mã giảm giá thật",
      variant: "default",
    });
  };

  // Filter tools based on search only
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handlePurchase = (toolId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để xem demo mua hàng",
        variant: "default",
      });
      return;
    }

    const tool = tools.find(t => t.id === toolId);
    if (tool) {
      setSelectedTool(tool);
      setPurchaseDialogOpen(true);
    }
  };

  const handleConfirmPurchase = () => {
    if (!selectedTool) return;
    handlePurchaseSuccess();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        {/* Enhanced Header */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 mb-6">
                <ShoppingCart className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                <span className="text-gray-900 dark:text-white">Thị trường </span>
                <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  công cụ
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Khám phá bộ sưu tập công cụ chuyên nghiệp được tuyển chọn kỹ lưỡng
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full border border-cyan-200 dark:border-cyan-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {filteredTools.length} công cụ có sẵn
                  </span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full border border-cyan-200 dark:border-cyan-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Chất lượng cao
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Enhanced Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="max-w-2xl mx-auto">
              {/* Search */}
              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  placeholder="Tìm kiếm công cụ chuyên nghiệp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white/90 dark:bg-gray-800/90 border-2 border-cyan-200 dark:border-cyan-800 rounded-2xl focus:border-cyan-500 dark:focus:border-cyan-400 shadow-lg backdrop-blur-sm transition-all duration-300"
                  data-testid="input-search-tools"
                />
              </div>

              {/* Results count */}
              {!toolsLoading && (
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-300" data-testid="text-results-count">
                    {searchQuery ? (
                      <>
                        Tìm thấy <span className="font-semibold text-cyan-600 dark:text-cyan-400">{filteredTools.length}</span> kết quả cho 
                        <span className="font-semibold"> &ldquo;{searchQuery}&rdquo;</span>
                      </>
                    ) : (
                      <>
                        Hiển thị <span className="font-semibold text-cyan-600 dark:text-cyan-400">{filteredTools.length}</span> công cụ chuyên nghiệp
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Tools Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {toolsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="h-10 flex-1" />
                          <Skeleton className="h-10 w-10" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.1 * index,
                      type: "spring",
                      stiffness: 100 
                    }}
                    className="group"
                  >
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-cyan-200/50 dark:border-cyan-800/50 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 group-hover:scale-105 group-hover:bg-white dark:group-hover:bg-gray-800">
                      <ToolCard tool={tool} onPurchase={handlePurchase} />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-12 w-12 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Không tìm thấy công cụ
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {searchQuery
                      ? `Không có công cụ nào phù hợp với "${searchQuery}". Hãy thử từ khóa khác.`
                      : "Chưa có công cụ nào được thêm vào hệ thống. Vui lòng quay lại sau."}
                  </p>
                  {searchQuery && (
                    <Button 
                      onClick={() => setSearchQuery("")}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      data-testid="button-clear-search"
                    >
                      Xóa tìm kiếm
                    </Button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
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
            
            {selectedTool && (
              <div className="py-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold" data-testid="text-purchase-tool-name">{selectedTool.name}</h4>
                    <p className="text-2xl font-bold text-primary" data-testid="text-purchase-tool-price">
                      {Number(selectedTool.price).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>
                
                {/* Demo - Discount Code (disabled) */}
                <div className="space-y-2">
                  <Label htmlFor="discount-code">Mã giảm giá (demo)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="discount-code"
                      placeholder="Chức năng demo - không thực tế"
                      disabled
                      data-testid="input-discount-code"
                    />
                    <Button
                      variant="outline"
                      onClick={handleValidateDiscount}
                      data-testid="button-validate-discount"
                    >
                      Demo
                    </Button>
                  </div>
                </div>
              </div>
            )}

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
                data-testid="button-confirm-purchase"
              >
                Xác nhận mua (Demo)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
