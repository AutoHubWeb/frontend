'use client'

import { useState, useMemo } from "react"
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
  Search
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
import type { Tool, OrderItem } from "@/lib/api/types";
import { ORDER_STATUS_ENUM } from "@/lib/api/types";
import { useUserOrders, useChangeOrderKey } from "@/lib/api/hooks/useOrders";

export default function PurchasedTools() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [changeKeyDialogOpen, setChangeKeyDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [searchKeyword, setSearchKeyword] = useState("");

  const { data: orders, isLoading } = useUserOrders(searchKeyword || undefined);
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

  // Function to filter expired/inactive orders
  const getExpiredOrders = () => {
    if (!orders) return [];
    
    return orders.filter(order => 
      order.status === ORDER_STATUS_ENUM.OVERDUE || 
      order.status === ORDER_STATUS_ENUM.CANCEL || 
      order.status === ORDER_STATUS_ENUM.FAIL
    );
  };

  const expiredOrders = getExpiredOrders();

  // Function to handle change key button click
  const handleChangeKeyClick = (order: OrderItem) => {
    setSelectedOrder(order);
    setApiKey("");
    setChangeKeyDialogOpen(true);
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

  // Filter orders based on search keyword
  const filteredOrders = useMemo(() => {
    if (!orders || !searchKeyword) return orders || [];
    
    const keyword = searchKeyword.toLowerCase();
    return orders.filter(order => {
      // Search in order code
      if (order.code.toLowerCase().includes(keyword)) return true;
      
      // Search in product name
      const productName = getProductName(order).toLowerCase();
      if (productName.includes(keyword)) return true;
      
      // Search in tool plan name
      const toolPlanName = getToolPlanName(order)?.toLowerCase();
      if (toolPlanName && toolPlanName.includes(keyword)) return true;
      
      // Search in order note
      if (order.note && order.note.toLowerCase().includes(keyword)) return true;
      
      return false;
    });
  }, [orders, searchKeyword, getProductName, getToolPlanName]);

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
          ) : filteredOrders?.length === 0 ? (
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
              {/* Expired Tools */}
              {expiredOrders.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h2 className="text-2xl font-bold mb-6 text-red-600">Đã hết hạn ({expiredOrders.length})</h2>
                  <div className="space-y-4">
                    {expiredOrders.map((order, index) => {
                      const statusInfo = getStatusInfo(order.status);
                      const toolPlanName = getToolPlanName(order);
                      
                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <Card className="opacity-75">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-16 h-16 bg-gray-400 rounded-lg flex items-center justify-center">
                                    <ShoppingBag className="w-8 h-8 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-bold mb-1 text-muted-foreground" data-testid={`text-expired-tool-name-${order.id}`}>
                                      {getProductName(order)}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      Mua ngày {getOrderDate(order)}
                                    </p>
                                    {toolPlanName && (
                                      <p className="text-sm text-muted-foreground mb-2">
                                        Gói: {toolPlanName}
                                      </p>
                                    )}
                                    <Badge variant="destructive" className={statusInfo.className}>
                                      <Clock className="w-3 h-3 mr-1" />
                                      {statusInfo.text}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">Đã mua với giá</p>
                                  <p className="text-lg font-bold text-muted-foreground">
                                    {Number(order.totalPrice).toLocaleString('vi-VN')}₫
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

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
                <Card>
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="p-6">
                        <Skeleton className="w-full h-10 mb-2" />
                        <Skeleton className="w-full h-10 mb-2" />
                        <Skeleton className="w-full h-10" />
                      </div>
                    ) : filteredOrders && filteredOrders.length > 0 ? (
                      <UITable>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mã đơn hàng</TableHead>
                            <TableHead>Sản phẩm</TableHead>
                            <TableHead>Gói</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Tổng tiền</TableHead>
                            <TableHead>API Key</TableHead>
                            <TableHead>Hành động</TableHead>
                            <TableHead>Ghi chú</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.map((order, index) => {
                            const statusInfo = getStatusInfo(order.status);
                            const toolPlanName = getToolPlanName(order);
                            const isToolOrder = order.type === 'tool';
                            const apiKey = order.toolOrder?.apiKey || '';
                            
                            return (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.code}</TableCell>
                                <TableCell>{getProductName(order)}</TableCell>
                                <TableCell>{toolPlanName || 'N/A'}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {order.type === 'tool' ? 'Công cụ' : order.type === 'vps' ? 'VPS' : 'Proxy'}
                                  </Badge>
                                </TableCell>
                                <TableCell>{getOrderDate(order)}</TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={statusInfo.variant as any}
                                    className={statusInfo.className}
                                  >
                                    {statusInfo.text}
                                  </Badge>
                                </TableCell>
                                <TableCell>{Number(order.totalPrice).toLocaleString('vi-VN')}₫</TableCell>
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
                                <TableCell>
                                  {isToolOrder && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleChangeKeyClick(order)}
                                    >
                                      <Key className="w-4 h-4 mr-1" />
                                      Đổi Key
                                    </Button>
                                  )}
                                </TableCell>
                                <TableCell>{order.note || 'Không có ghi chú'}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </UITable>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        <Table className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Chưa có đơn hàng nào</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
      </div>
    </Layout>
  );
}
