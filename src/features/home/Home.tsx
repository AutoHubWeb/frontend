'use client'

import { useState, useEffect } from "react";
import { Layout } from "@/components";
import { ToolCard } from "@/features/tools";
import { motion } from "framer-motion";
import { useAuth } from "@/features/auth";
import { useToast } from "@/hooks/use-toast";
import { useTools } from "@/lib/api/hooks/useTools";
import { useTopUpUsers, useUserTransactions } from "@/lib/api/hooks/useTransactions";
import { mockVPS } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Filter, 
  ShoppingCart,
  AlertCircle,
  Server,
  Cpu,
  HardDrive,
  Eye,
  ChevronUp,
  X,
  ChevronDown
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tool, Category } from "@/lib/api/types";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedMonths, setSelectedMonths] = useState<string>("1");

  // Use real API calls for tools, keep mock data for VPS
  const { data: toolsResponse, isLoading: toolsLoading, error: toolsError } = useTools();
  
  // Transform API tools to format expected by ToolCard component
  const transformTool = (apiTool: Tool) => {
    const transformedTool = {
      id: apiTool.id,
      name: apiTool.name,
      description: apiTool.description,
      price: apiTool.plans?.[0]?.price?.toString() || "0",
      prices: apiTool.plans?.map(plan => ({
        duration: plan.duration === -1 ? "Vĩnh viễn" : `${plan.duration} tháng`,
        amount: plan.price.toString()
      })) || [],
      imageUrl: apiTool.images?.[0]?.fileUrl 
        ? `/static/tool/${apiTool.images[0].fileUrl.split('/').pop()}` 
        : "/static/tool/default.jpg",
      views: apiTool.viewCount || 0,
      purchases: apiTool.soldQuantity || 0,
      categoryId: apiTool.categoryId
    };
    return transformedTool;
  };
  
  // Extract and transform tools from API response
  // Hook returns response.data which should be { items: [...], meta: {...} }
  const rawTools: Tool[] = (toolsResponse as any)?.items || [];
  const tools = rawTools.map(transformTool);
  const categories: any[] = []; // Categories will be handled separately
  const categoriesLoading = false;

  // Handle scroll to show/hide back to top button and calculate progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollY / documentHeight) * 100, 100);
      
      setShowBackToTop(scrollY > 400);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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

  // Filter tools and VPS based on search
  const filteredTools = tools.filter((tool: any) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredVPS = mockVPS.filter((vps: any) => {
    const matchesSearch = vps.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vps.specs.feature.toLowerCase().includes(searchQuery.toLowerCase());
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

    const tool = tools.find((t: any) => t.id === toolId);
    if (tool) {
      setSelectedTool(tool);
      setPurchaseDialogOpen(true);
    }
  };

  const handleConfirmPurchase = () => {
    if (!selectedTool) return;
    handlePurchaseSuccess();
  };

  // Add this new hook for fetching top-up users
  const { data: topUpUsersResponse, isLoading: topUpUsersLoading, error: topUpUsersError } = useTopUpUsers();
  
  // Add this new hook for fetching user transactions
  const { data: userTransactionsResponse, isLoading: userTransactionsLoading, error: userTransactionsError } = useUserTransactions();
  
  // Transform API response to match UI requirements
  const topUpUsers = topUpUsersResponse?.map((user: any, index: number) => ({
    id: index.toString(),
    username: user.fullname,
    amount: user.totalRecharge,
    rank: index + 1
  })) || [];
  
  // Transform transaction data for display
  const userTransactions = userTransactionsResponse?.items || [];

  console.log('Transformed top up users:', topUpUsers);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Global Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm tools và VPS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-12 h-12 text-lg border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  data-testid="input-global-search"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500 hover:text-red-700 transition-colors"
                    data-testid="button-clear-search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Tìm thấy {filteredTools.length} tools và {filteredVPS.length} VPS cho &ldquo;{searchQuery}&rdquo;
                </p>
              )}
            </div>
          </motion.div>

          {/* TOOL NRO Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                TOOL NRO
              </span>
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-emerald-600 mx-auto rounded-full"></div>
          </motion.div>


          {/* Tools Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            {toolsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
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
            ) : (searchQuery ? filteredTools : tools).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(searchQuery ? filteredTools : tools).map((tool: any, index: number) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <ToolCard tool={tool} onPurchase={handlePurchase} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {searchQuery ? `Không tìm thấy tool nào cho "${searchQuery}"` : "Không có tool nào"}
                </p>
              </div>
            )}
          </motion.div>

          {/* VPS Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  VPS VIỆT
                </span>
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full"></div>
            </div>
            
            {(searchQuery ? filteredVPS : mockVPS).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(searchQuery ? filteredVPS : mockVPS).map((vps, index) => (
                  <motion.div
                    key={vps.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card className="overflow-hidden border-2 hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-800 dark:to-purple-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Server className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{vps.name}</h3>
                          <p className="text-2xl font-bold text-red-500 mb-1">
                            {Number(vps.price).toLocaleString('vi-VN')} ₫
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> / {vps.duration}</span>
                          </p>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                            <Cpu className="w-4 h-4" />
                            <span className="font-medium">{vps.specs.cores}</span>
                          </div>
                          <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                            <HardDrive className="w-4 h-4" />
                            <span className="font-medium">{vps.specs.ram}</span>
                          </div>
                          <div className="text-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                            {vps.specs.feature}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>Còn lại: {vps.availability.inStock}</span>
                          </div>
                          <div>
                            <span>Lượt mua: {vps.availability.purchased}</span>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
                          onClick={() => {
                            if (!isAuthenticated) {
                              toast({
                                title: "Cần đăng nhập",
                                description: "Vui lòng đăng nhập để xem demo mua VPS",
                                variant: "default",
                              });
                              return;
                            }
                            toast({
                              title: "Demo: Mua VPS",
                              description: "Đây là demo - không có giao dịch thật sự được thực hiện",
                            });
                          }}
                        >
                          ĐĂNG KÝ
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {searchQuery ? `Không tìm thấy VPS nào cho "${searchQuery}"` : "Không có VPS nào"}
                </p>
              </div>
            )}
          </motion.div>

          {/* PROXY VIỆT Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                  PROXY VIỆT
                </span>
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-red-600 to-yellow-600 mx-auto rounded-full"></div>
            </div>
            
            {/* Single Proxy Display */}
            {(() => {
              const proxyTool = tools.find((tool: any) => tool.categoryId === "5");
              
              if (!proxyTool) {
                return (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Không có proxy nào</p>
                  </div>
                );
              }

              // Calculate price based on selected months
              const baseMonthlyPrice = 50000; // 50k per month
              const months = parseInt(selectedMonths);
              const calculatedPrice = baseMonthlyPrice * months;
              
              return (
                <div className="max-w-md mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Card className="overflow-hidden border-2 hover:border-red-200 dark:hover:border-red-700 transition-all duration-300 hover:shadow-lg">
                      <CardContent className="p-8">
                        {/* Proxy Image */}
                        <div className="text-center mb-6">
                          <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden">
                            <img 
                              src={proxyTool.imageUrl} 
                              alt={proxyTool.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {proxyTool.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {proxyTool.description}
                          </p>
                        </div>

                        {/* Price Display */}
                        <div className="text-center mb-6">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Giá / tháng
                          </div>
                          <div className="text-3xl font-bold text-red-500 mb-2">
                            {baseMonthlyPrice.toLocaleString('vi-VN')} ₫
                          </div>
                          <div className="text-lg text-gray-600 dark:text-gray-300">
                            {months > 1 && (
                              <span>
                                Tổng {months} tháng: <span className="font-bold text-primary">
                                  {calculatedPrice.toLocaleString('vi-VN')} ₫
                                </span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Month Selection */}
                        <div className="mb-6">
                          <Label htmlFor="months" className="text-sm font-medium mb-2 block">
                            Chọn số tháng
                          </Label>
                          <Select value={selectedMonths} onValueChange={setSelectedMonths}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn tháng" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 tháng</SelectItem>
                              <SelectItem value="2">2 tháng</SelectItem>
                              <SelectItem value="3">3 tháng</SelectItem>
                              <SelectItem value="6">6 tháng</SelectItem>
                              <SelectItem value="12">12 tháng</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Purchase Button */}
                        <Button 
                          className="w-full bg-gradient-to-r from-red-500 to-yellow-600 hover:from-red-600 hover:to-yellow-700 text-white font-medium text-lg py-3"
                          onClick={() => {
                            if (!isAuthenticated) {
                              toast({
                                title: "Cần đăng nhập",
                                description: "Vui lòng đăng nhập để xem demo mua proxy",
                                variant: "default",
                              });
                              return;
                            }
                            toast({
                              title: "Demo: Mua Proxy",
                              description: `Mua ${proxyTool.name} ${months} tháng - ${calculatedPrice.toLocaleString('vi-VN')}₫`,
                            });
                          }}
                          data-testid="button-purchase-proxy"
                        >
                          MUA ({calculatedPrice.toLocaleString('vi-VN')}₫)
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              );
            })()}
          </motion.div>

          {/* Statistics Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  THỐNG KÊ
                </span>
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-600 to-cyan-600 mx-auto rounded-full"></div>
            </div>
            
            {/* Statistics Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Nạp */}
              <Card className="shadow-lg">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 rounded-t-lg">
                  <h3 className="text-lg font-bold">TOP NẠP</h3>
                </div>
                <CardContent className="p-0">
                  {topUpUsersLoading ? (
                    // Loading skeleton
                    <div className="space-y-0">
                      {[...Array(10)].map((_, index) => (
                        <div key={index} className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-3">
                            <Skeleton className="w-6 h-6 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                          <Skeleton className="h-6 w-24" />
                        </div>
                      ))}
                    </div>
                  ) : topUpUsersError ? (
                    // Error state
                    <div className="text-center py-4 text-red-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      <p>Lỗi tải dữ liệu top nạp</p>
                      <p className="text-sm mt-1">Vui lòng thử lại sau</p>
                    </div>
                  ) : topUpUsers.length === 0 ? (
                    // Empty state
                    <div className="text-center py-4 text-gray-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      <p>Chưa có dữ liệu top nạp</p>
                    </div>
                  ) : (
                    // Data display
                    <div className="space-y-0">
                      {topUpUsers.map((user: any, index: number) => (
                        <div
                          key={user.id || index}
                          className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <div className="flex items-center space-x-3">
                            <Badge 
                              variant={user.rank <= 3 ? "destructive" : "secondary"}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            >
                              {user.rank}
                            </Badge>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {user.username}
                            </span>
                          </div>
                          <span className="bg-emerald-500 text-white px-3 py-1 rounded text-sm font-bold">
                            {Number(user.amount).toLocaleString('vi-VN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lịch Sử Giao Dịch */}
              <Card className="shadow-lg">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 rounded-t-lg">
                  <h3 className="text-lg font-bold">LỊCH SỬ GIAO DỊCH</h3>
                </div>
                <CardContent className="p-0">
                  {userTransactionsLoading ? (
                    // Loading skeleton
                    <div className="space-y-0">
                      {[...Array(10)].map((_, index) => (
                        <div key={index} className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Skeleton className="h-4 w-16" />
                              </div>
                              <Skeleton className="h-4 w-32" />
                              {/* Skeleton for the code line */}
                              <Skeleton className="h-3 w-24 mt-1" />
                            </div>
                            <div className="text-right">
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : userTransactionsError ? (
                    // Error state
                    <div className="text-center py-4 text-red-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      <p>Lỗi tải dữ liệu giao dịch</p>
                      <p className="text-sm mt-1">Vui lòng thử lại sau</p>
                    </div>
                  ) : userTransactions.length === 0 ? (
                    // Empty state
                    <div className="text-center py-4 text-gray-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      <p>Chưa có giao dịch nào</p>
                    </div>
                  ) : (
                    // Data display
                    <div className="space-y-0">
                      {userTransactions.map((transaction: any, index: number) => (
                        <div
                          key={transaction.id || index}
                          className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-red-500 font-bold text-sm">
                                  {transaction.note?.split('[')[0]?.trim() || 'Giao dịch'}
                                </span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">
                                {transaction.note || `+${transaction.amount?.toLocaleString('vi-VN')}₫`}
                              </p>
                              {/* Display the transaction code */}
                              {transaction.code && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Mã giao dịch: {transaction.code}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-gray-500 text-xs">
                                {new Date(transaction.createdAt).toLocaleString('vi-VN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="relative">
              {/* Progress Circle */}
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                {/* Background circle */}
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="4"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - scrollProgress / 100)}`}
                  className="transition-all duration-300"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Button */}
              <button
                onClick={scrollToTop}
                className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                data-testid="button-back-to-top"
              >
                <ChevronUp className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          </motion.div>
        )}

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
