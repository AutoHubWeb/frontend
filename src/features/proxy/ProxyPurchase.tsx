'use client'

import { useState } from "react"
import { Layout } from "@/components"
import { motion } from "framer-motion"
import { useAuth } from "@/features/auth"
import { useToast } from "@/hooks/use-toast"
import { useProxies } from "@/lib/api/hooks/useProxy"
import { useCreateOrder } from "@/lib/api/hooks/useOrders"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AlertCircle, Server } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export function ProxyPurchase() {
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  
  // Fetch proxies
  const { 
    data: proxyResponse, 
    isLoading: proxyLoading, 
    error: proxyError 
  } = useProxies()
  
  // Create order mutation
  const createProxyOrderMutation = useCreateOrder()
  
  const [selectedProxy, setSelectedProxy] = useState<any>(null)
  const [proxyConfirmDialogOpen, setProxyConfirmDialogOpen] = useState(false)
  
  const handlePurchaseProxy = (proxy: any) => {
    if (!isAuthenticated) {
      toast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để mua proxy",
        variant: "destructive",
      })
      return
    }

    // Set selected proxy and open confirmation dialog
    setSelectedProxy(proxy)
    setProxyConfirmDialogOpen(true)
  }

  const handleConfirmProxyPurchase = () => {
    if (!selectedProxy) return
    
    createProxyOrderMutation.mutate({
      type: "proxy",
      proxyId: selectedProxy.id,
    })
    
    // Close the dialog
    setProxyConfirmDialogOpen(false)
    setSelectedProxy(null)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                DỊCH VỤ PROXY
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cung cấp các gói proxy chất lượng cao với nhiều lựa chọn phù hợp cho nhu cầu của bạn
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-red-600 to-yellow-600 mx-auto rounded-full mt-4"></div>
          </motion.div>

          {/* Proxy Display */}
          {proxyLoading ? (
            // Loading state
            <div className="max-w-md mx-auto">
              <Card className="overflow-hidden border-2">
                <CardContent className="p-8">
                  <div className="text-center">
                    <Skeleton className="w-20 h-20 mx-auto mb-4 rounded-lg" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-full mx-auto mb-6" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : proxyError ? (
            // Error state
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Lỗi tải dữ liệu proxy</p>
            </div>
          ) : proxyResponse && proxyResponse.items && proxyResponse.items.length > 0 ? (
            // Data display - show all active proxy items (status = 1)
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proxyResponse.items.filter((proxy: any) => proxy.status === 1).map((proxy: any, index: number) => (
                <motion.div
                  key={proxy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="flex" // Add flex to make cards equal height
                >
                  <Card className="flex flex-col overflow-hidden border-2 hover:border-red-200 dark:hover:border-red-700 transition-all duration-300 hover:shadow-lg w-full">
                    <CardContent className="flex flex-col flex-1 p-6">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-yellow-100 dark:from-red-800 dark:to-yellow-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Server className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                          {proxy.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {proxy.description}
                        </p>
                      </div>

                      {/* Price Display */}
                      <div className="text-center mb-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Giá
                        </div>
                        <div className="text-2xl font-bold text-red-500 mb-2">
                          {proxy.price.toLocaleString('vi-VN')} ₫
                        </div>
                      </div>

                      {/* Inventory */}
                      <div className="text-center mb-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Còn lại
                        </div>
                        <div className="text-lg font-bold text-green-500">
                          {proxy.inventory} tài khoản
                        </div>
                      </div>

                      {/* Purchase Button - Push to bottom */}
                      <div className="mt-auto">
                        <Button 
                          className="w-full bg-gradient-to-r from-red-500 to-yellow-600 hover:from-red-600 hover:to-yellow-700 text-white font-medium py-2 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          onClick={() => handlePurchaseProxy(proxy)}
                          disabled={createProxyOrderMutation.isPending}
                          data-testid="button-purchase-proxy"
                        >
                          {createProxyOrderMutation.isPending && createProxyOrderMutation.variables?.proxyId === proxy.id
                            ? "Đang xử lý..."
                            : `MUA (${proxy.price.toLocaleString('vi-VN')}₫)`}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Không có proxy nào</p>
            </div>
          )}
        </div>

        {/* Proxy Purchase Confirmation Dialog */}
        <Dialog open={proxyConfirmDialogOpen} onOpenChange={setProxyConfirmDialogOpen}>
          <DialogContent data-testid="dialog-proxy-purchase-confirmation">
            <DialogHeader>
              <DialogTitle>Xác nhận mua Proxy</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn mua proxy này không?
              </DialogDescription>
            </DialogHeader>
            
            {selectedProxy && (
              <div className="py-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-yellow-600 rounded-lg flex items-center justify-center">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold" data-testid="text-purchase-proxy-name">{selectedProxy.name}</h4>
                    <p className="text-2xl font-bold text-primary" data-testid="text-purchase-proxy-price">
                      {Number(selectedProxy.price).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Thông tin proxy</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedProxy.description}
                  </p>
                  <div className="mt-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-500">Còn lại:</span>
                      <span className="font-semibold">{selectedProxy.inventory} tài khoản</span>
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Sau khi xác nhận, hệ thống sẽ trừ tiền từ tài khoản của bạn và cung cấp thông tin truy cập proxy.
                </p>
              </div>
            )}

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setProxyConfirmDialogOpen(false)
                  setSelectedProxy(null)
                }}
                data-testid="button-cancel-proxy-purchase"
              >
                Hủy
              </Button>
              <Button 
                onClick={handleConfirmProxyPurchase}
                disabled={createProxyOrderMutation.isPending}
                data-testid="button-confirm-proxy-purchase"
              >
                {createProxyOrderMutation.isPending ? "Đang xử lý..." : "Xác nhận mua"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}

export default ProxyPurchase