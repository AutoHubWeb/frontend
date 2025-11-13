'use client'

import { useState, useEffect, useMemo } from "react"
import { Layout } from "@/components";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth";
import { isUnauthorizedError } from "@/lib/api";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Download, 
  RefreshCw, 
  Clock, 
  ShoppingBag,
  ArrowRight,
  Key,
  Copy,
  ExternalLink,
  Table,
  Eye,
  EyeOff,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Info
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import type { Tool, OrderItem, PaginatedResponse } from "@/lib/api/types";
import { ORDER_STATUS_ENUM } from "@/lib/api/types";
import { useUserOrders, useChangeOrderKey } from "@/lib/api/hooks/useOrders";

export default function PurchasedTools() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [changeKeyDialogOpen, setChangeKeyDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: ordersData, isLoading } = useUserOrders(searchKeyword || undefined, currentPage, itemsPerPage);
  
  // Debug: Log ordersData and currentPage to see what we're getting
  useEffect(() => {
    if (ordersData) {
      console.log('Orders Data:', ordersData);
    }
    console.log('Current Page:', currentPage);
  }, [ordersData, currentPage]);

  const changeKeyMutation = useChangeOrderKey();

  // Function to get product name based on order type
  const getProductName = (order: OrderItem) => {
    if (order.type === 'tool' && order.tool) {
      return order.tool.name;
    } else if (order.type === 'vps' && order.vps) {
      return order.vps.name;
    } else if (order.type === 'proxy' && order.proxy) {
      return order.proxy.name || 'Proxy không xác định';
    }
    return 'Không xác định';
  };

  // Function to get order date
  const getOrderDate = (order: OrderItem) => {
    return new Date(order.createdAt).toLocaleDateString('vi-VN');
  };

  // Function to get tool plan name for tool orders
  const getToolPlanName = (order: OrderItem) => {
    if (order.type === 'tool' && order.toolOrder) {
      return order.toolOrder.name;
    }
    return null;
  };

  // Function to get status badge variant and text
  const getStatusInfo = (status: string) => {
    switch (status) {
      case ORDER_STATUS_ENUM.SUCCESS:
        return { variant: 'default', text: 'Thành công', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' };
      case ORDER_STATUS_ENUM.SETUP:
        return { variant: 'secondary', text: 'Đang thiết lập', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
      case ORDER_STATUS_ENUM.OVERDUE:
        return { variant: 'destructive', text: 'Quá hạn', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
      case ORDER_STATUS_ENUM.CANCEL:
        return { variant: 'destructive', text: 'Đã hủy', className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' };
      case ORDER_STATUS_ENUM.FAIL:
        return { variant: 'destructive', text: 'Thất bại', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
      default:
        return { variant: 'secondary', text: status, className: '' };
    }
  };

  // Function to check if an order has expired based on expiration date
  const isOrderExpired = (order: OrderItem) => {
    // If the order is already marked as overdue, cancel, or fail, it's considered expired
    if (order.status === ORDER_STATUS_ENUM.OVERDUE || 
        order.status === ORDER_STATUS_ENUM.CANCEL || 
        order.status === ORDER_STATUS_ENUM.FAIL) {
      return true;
    }
    
    // Check expiration date if available
    let expirationDate: Date | null = null;
    if (order.type === 'tool' && order.toolOrder?.expiredAt) {
      expirationDate = new Date(order.toolOrder.expiredAt);
    } else if (order.type === 'vps' && order.vpsOrder?.expiredAt) {
      expirationDate = new Date(order.vpsOrder.expiredAt);
    } else if (order.type === 'proxy' && order.proxyOrder?.expiredAt) {
      expirationDate = new Date(order.proxyOrder.expiredAt);
    }
    
    // If we have an expiration date, check if it's in the past
    if (expirationDate) {
      return expirationDate < new Date();
    }
    
    // If no expiration date, rely on status only
    return false;
  };

  // Function to filter expired/inactive orders
  const getExpiredOrders = () => {
    return []; // Return empty array since we're hiding expired orders completely
  };

  // Function to filter active orders (not expired)
  const getActiveOrders = () => {
    if (!ordersData?.data) return [];
    
    return ordersData.data.filter((order: OrderItem) => {
      // If the order is marked as overdue, cancel, or fail, it's considered expired
      if (order.status === ORDER_STATUS_ENUM.OVERDUE || 
          order.status === ORDER_STATUS_ENUM.CANCEL || 
          order.status === ORDER_STATUS_ENUM.FAIL) {
        return false;
      }
      
      // Check expiration date if available
      let expirationDate: Date | null = null;
      if (order.type === 'tool' && order.toolOrder?.expiredAt) {
        expirationDate = new Date(order.toolOrder.expiredAt);
      } else if (order.type === 'vps' && order.vpsOrder?.expiredAt) {
        expirationDate = new Date(order.vpsOrder.expiredAt);
      } else if (order.type === 'proxy' && order.proxyOrder?.expiredAt) {
        expirationDate = new Date(order.proxyOrder.expiredAt);
      }
      
      // If we have an expiration date, check if it's in the past
      if (expirationDate && expirationDate < new Date()) {
        return false;
      }
      
      // If we reach here, the order is active
      return true;
    });
  };

  const expiredOrders = getExpiredOrders();
  const activeOrders = getActiveOrders();

  // Function to handle change key button click
  const handleChangeKeyClick = (order: OrderItem) => {
    setSelectedOrder(order);
    setApiKey("");
    setChangeKeyDialogOpen(true);
  };

  // Function to handle detail button click
  const handleDetailClick = (order: OrderItem) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  // Function to handle key change submission
  const handleKeyChange = async () => {
    if (!selectedOrder || !apiKey.trim()) return;

    try {
      await changeKeyMutation.mutateAsync({ 
        orderId: selectedOrder.id, 
        apiKey: apiKey.trim() 
      });
      
      toast({
        title: "Thành công",
        description: "Key đã được cập nhật thành công",
      });
      
      setChangeKeyDialogOpen(false);
      setSelectedOrder(null);
      setApiKey("");
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật key",
        variant: "destructive",
      });
    }
  };

  // Function to handle download tool
  const handleDownloadTool = async (order: OrderItem) => {
    // Check if the order is a tool order and has a tool with linkDownload
    if (order.type === 'tool' && order.tool && (order.tool as any).linkDownload) {
      // Directly open the linkDownload URL
      const linkDownload = (order.tool as any).linkDownload;
      if (typeof linkDownload === 'string' && linkDownload.length > 0) {
        window.open(linkDownload, '_blank');
        return;
      }
    }

  };

  // Function to toggle API key visibility
  const toggleApiKeyVisibility = (orderId: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Function to copy API key to clipboard
  const copyApiKeyToClipboard = (apiKey: string, orderId: string) => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "Đã sao chép",
      description: "Key đã được sao chép vào clipboard",
    });
  };

  // Pagination functions
  const goToFirstPage = () => {
    console.log('Going to first page');
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    console.log('Going to previous page, current page:', currentPage);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    console.log('Going to next page, current page:', currentPage, 'total pages:', ordersData?.meta?.totalPages);
    if (ordersData?.meta && currentPage < ordersData.meta.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToLastPage = () => {
    console.log('Going to last page, total pages:', ordersData?.meta?.totalPages);
    if (ordersData?.meta) {
      setCurrentPage(ordersData.meta.totalPages);
    }
  };

  // Get expiration date based on order type
  const getExpirationDate = (order: OrderItem) => {
    if (order.type === 'tool' && order.toolOrder?.expiredAt) {
      return new Date(order.toolOrder.expiredAt).toLocaleDateString('vi-VN');
    } else if (order.type === 'vps' && order.vpsOrder?.expiredAt) {
      return new Date(order.vpsOrder.expiredAt).toLocaleDateString('vi-VN');
    } else if (order.type === 'proxy' && order.proxyOrder?.expiredAt) {
      return new Date(order.proxyOrder.expiredAt).toLocaleDateString('vi-VN');
    }
    return 'N/A';
  };

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      console.error('Error formatting date:', error, 'Date string:', dateString);
      return 'Invalid Date';
    }
  };

  return (
    <Layout showSidebar={isAuthenticated}>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Công cụ đã mua</h1>
            <p className="text-muted-foreground">Quản lý các công cụ bạn đã mua và key license</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm đơn hàng..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="w-16 h-16 rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : activeOrders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">
                {searchKeyword ? 'Không tìm thấy đơn hàng' : 'Chưa có công cụ nào'}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {searchKeyword 
                  ? `Không tìm thấy đơn hàng nào phù hợp với từ khóa "${searchKeyword}"` 
                  : 'Bạn chưa mua công cụ nào. Khám phá thị trường để tìm những công cụ phù hợp với nhu cầu của bạn.'}
              </p>
              {!searchKeyword && (
                <Link href="/tools">
                  <Button size="lg" data-testid="button-browse-tools">
                    Duyệt công cụ
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Orders Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Table className="w-6 h-6 mr-2" />
                  Lịch sử đơn hàng
                </h2>
                <div className="w-[400px] md:w-full overflow-x-auto">
                  <Card>
                    <CardContent className="p-0">
                      {isLoading ? (
                        <div className="p-6">
                          <Skeleton className="w-full h-10 mb-2" />
                          <Skeleton className="w-full h-10 mb-2" />
                          <Skeleton className="w-full h-10" />
                        </div>
                      ) : activeOrders.length > 0 ? (
                        <>
                          <UITable>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="whitespace-nowrap">Mã đơn hàng</TableHead>
                                <TableHead className="whitespace-nowrap">Sản phẩm</TableHead>
                                <TableHead className="whitespace-nowrap">Gói</TableHead>
                                <TableHead className="whitespace-nowrap">Loại</TableHead>
                                <TableHead className="whitespace-nowrap">Ngày tạo</TableHead>
                                <TableHead className="whitespace-nowrap">Ngày hết hạn</TableHead>
                                <TableHead className="whitespace-nowrap">Trạng thái</TableHead>
                                <TableHead className="whitespace-nowrap">Tổng tiền</TableHead>
                                <TableHead className="whitespace-nowrap">API Key</TableHead>
                                <TableHead className="whitespace-nowrap">Hành động</TableHead>
                                <TableHead className="whitespace-nowrap">Ghi chú</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {activeOrders.map((order: OrderItem, index: number) => {
                                const statusInfo = getStatusInfo(order.status);
                                const toolPlanName = getToolPlanName(order);
                                const isToolOrder = order.type === 'tool';
                                const apiKey = order.toolOrder?.apiKey || '';
                                
                                return (
                                  <TableRow key={order.id} className="align-top min-h-[73px]">
                                    <TableCell className="font-medium whitespace-nowrap">{order.code}</TableCell>
                                    <TableCell className="whitespace-nowrap">{getProductName(order)}</TableCell>
                                    <TableCell className="whitespace-nowrap">{toolPlanName || 'N/A'}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline">
                                        {order.type === 'tool' ? 'Công cụ' : order.type === 'vps' ? 'VPS' : 'Proxy'}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">{getOrderDate(order)}</TableCell>
                                    <TableCell className="whitespace-nowrap">{getExpirationDate(order)}</TableCell>
                                    <TableCell>
                                      <Badge 
                                        variant={statusInfo.variant as any}
                                        className={statusInfo.className}
                                      >
                                        {statusInfo.text}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">{Number(order.totalPrice).toLocaleString('vi-VN')}₫</TableCell>
                                    <TableCell>
                                      {isToolOrder && apiKey ? (
                                        <div className="flex items-center space-x-2">
                                          <span className="font-mono text-sm">
                                            {showApiKey[order.id] ? apiKey : '••••••••'}
                                          </span>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => toggleApiKeyVisibility(order.id)}
                                          >
                                            {showApiKey[order.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => copyApiKeyToClipboard(apiKey, order.id)}
                                          >
                                            <Copy className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      ) : isToolOrder ? (
                                        <span className="text-muted-foreground">Chưa có key</span>
                                      ) : (
                                        <span className="text-muted-foreground">N/A</span>
                                      )}
                                    </TableCell>
                                    <TableCell className="space-y-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDetailClick(order)}
                                        className="w-full mb-2"
                                      >
                                        <Info className="w-4 h-4 mr-1" />
                                        Chi tiết
                                      </Button>
                                      {isToolOrder && (
                                        <div className="flex flex-col gap-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleChangeKeyClick(order)}
                                            className="w-full"
                                          >
                                            <Key className="w-4 h-4 mr-1" />
                                            Đổi Key
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="default"
                                            onClick={() => handleDownloadTool(order)}
                                            // disabled={order?.linkDownload === ""}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                          >
                                            <Download className="w-4 h-4 mr-1" />
                                            Tải Xuống
                                          </Button>
                                        </div>
                                      )}
                                    </TableCell>
                                    <TableCell className="max-w-xs">{order.note || 'Không có ghi chú'}</TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </UITable>
                          
                          {/* Pagination */}
                          {ordersData?.meta && activeOrders && activeOrders.length > 0 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t">
                              <div className="text-sm text-muted-foreground">
                                Tổng cộng {activeOrders.length} đơn hàng
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={goToFirstPage}
                                  disabled={currentPage === 1}
                                >
                                  <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={goToPreviousPage}
                                  disabled={currentPage === 1}
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="text-sm font-medium">
                                  Trang {currentPage} / {ordersData?.meta?.totalPages}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={goToNextPage}
                                  disabled={currentPage === ordersData?.meta?.totalPages}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={goToLastPage}
                                  disabled={currentPage === ordersData?.meta?.totalPages}
                                >
                                  <ChevronsRight className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">Hiển thị:</span>
                                <select
                                  value={itemsPerPage}
                                  onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1); // Reset to first page when changing items per page
                                  }}
                                  className="h-8 rounded border text-sm"
                                >
                                  <option value="5">5</option>
                                  <option value="10">10</option>
                                  <option value="20">20</option>
                                  <option value="50">50</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          <Table className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Chưa có đơn hàng nào</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Change Key Dialog */}
        <Dialog open={changeKeyDialogOpen} onOpenChange={setChangeKeyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Đổi API Key</DialogTitle>
              <DialogDescription>
                Nhập key mới cho công cụ {selectedOrder ? getProductName(selectedOrder) : ''}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key mới</Label>
                <Input
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Nhập API key mới"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setChangeKeyDialogOpen(false)}
                disabled={changeKeyMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                onClick={handleKeyChange}
                disabled={changeKeyMutation.isPending || !apiKey.trim()}
              >
                {changeKeyMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  'Cập nhật Key'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết đơn hàng</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết về đơn hàng {selectedOrder?.code}
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Thông tin chung</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                      <p className="font-medium">{selectedOrder.code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Loại đơn hàng</p>
                      <p className="font-medium">
                        {selectedOrder.type === 'tool' ? 'Công cụ' : selectedOrder.type === 'vps' ? 'VPS' : 'Proxy'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày tạo</p>
                      <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Trạng thái</p>
                      <Badge variant={getStatusInfo(selectedOrder.status).variant as any} className={getStatusInfo(selectedOrder.status).className}>
                        {getStatusInfo(selectedOrder.status).text}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng tiền</p>
                      <p className="font-medium">{Number(selectedOrder.totalPrice).toLocaleString('vi-VN')}₫</p>
                    </div>
                  </div>
                </div>

                {selectedOrder.type === 'tool' && selectedOrder.toolOrder && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Thông tin công cụ</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Tên gói</p>
                        <p className="font-medium">{selectedOrder.toolOrder.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Giá</p>
                        <p className="font-medium">{Number(selectedOrder.toolOrder.price).toLocaleString('vi-VN')}₫</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Thời hạn</p>
                        <p className="font-medium">
                          {selectedOrder.toolOrder.duration === -1 ? 'Vĩnh viễn' : `${selectedOrder.toolOrder.duration} tháng`}
                        </p>
                      </div>
                      {selectedOrder.toolOrder.expiredAt && (
                        <div>
                          <p className="text-sm text-muted-foreground">Ngày hết hạn</p>
                          <p className="font-medium">{formatDate(selectedOrder.toolOrder.expiredAt)}</p>
                        </div>
                      )}
                      {selectedOrder.toolOrder.changeApiKeyAt && (
                        <div>
                          <p className="text-sm text-muted-foreground">Lần cập nhật key cuối</p>
                          <p className="font-medium">{formatDate(selectedOrder.toolOrder.changeApiKeyAt)}</p>
                        </div>
                      )}
                      {selectedOrder.toolOrder.apiKey && (
                        <div className="col-span-2">
                          <p className="text-sm text-muted-foreground">API Key</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input
                              type="text"
                              value={selectedOrder.toolOrder.apiKey}
                              readOnly
                              className="font-mono"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyApiKeyToClipboard(selectedOrder.toolOrder!.apiKey!, selectedOrder.id)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedOrder.type === 'vps' && selectedOrder.vpsOrder && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Thông tin VPS</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">IP</p>
                        <p className="font-medium">{selectedOrder.vpsOrder.ip}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Username</p>
                        <p className="font-medium">{selectedOrder.vpsOrder.username}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Password</p>
                        <p className="font-medium">{selectedOrder.vpsOrder.password}</p>
                      </div>
                      {selectedOrder.vpsOrder.expiredAt && (
                        <div>
                          <p className="text-sm text-muted-foreground">Ngày hết hạn</p>
                          <p className="font-medium">{formatDate(selectedOrder.vpsOrder.expiredAt)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedOrder.type === 'proxy' && selectedOrder.proxyOrder && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Thông tin Proxy</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Proxy</p>
                        <p className="font-medium">{selectedOrder.proxyOrder.proxies}</p>
                      </div>
                      {selectedOrder.proxyOrder.expiredAt && (
                        <div>
                          <p className="text-sm text-muted-foreground">Ngày hết hạn</p>
                          <p className="font-medium">{formatDate(selectedOrder.proxyOrder.expiredAt)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedOrder.note && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Ghi chú</h3>
                    <p className="text-muted-foreground">{selectedOrder.note}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
