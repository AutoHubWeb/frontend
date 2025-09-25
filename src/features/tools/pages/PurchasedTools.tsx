'use client'

import { useState } from "react"
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
  ExternalLink
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
;
import Link from "next/link";
import type { Purchase, Tool } from "@/lib/api/types";

export default function PurchasedTools() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [changeKeyDialogOpen, setChangeKeyDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [newKey, setNewKey] = useState("");

  const { data: purchases, isLoading } = useQuery<(Purchase & { tool: Tool })[]>({
    queryKey: ["/api/purchases"],
    retry: false,
  });

  const changeKeyMutation = useMutation({
    mutationFn: async ({ purchaseId, newKey }: { purchaseId: string; newKey: string }) => {
      const response = await apiRequest("PUT", `/api/purchases/${purchaseId}/key`, { newKey });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Đổi key thành công",
        description: "Key mới đã được cập nhật",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/purchases"] });
      setChangeKeyDialogOpen(false);
      setSelectedPurchase(null);
      setNewKey("");
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
        description: error.message || "Không thể đổi key",
        variant: "destructive",
      });
    },
  });

  const handleChangeKey = (purchase: Purchase & { tool: Tool }) => {
    setSelectedPurchase(purchase);
    setNewKey("");
    setChangeKeyDialogOpen(true);
  };

  const handleConfirmChangeKey = () => {
    if (!selectedPurchase || !newKey.trim()) return;
    
    changeKeyMutation.mutate({
      purchaseId: selectedPurchase.id,
      newKey: newKey.trim(),
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép",
      description: "Key đã được sao chép vào clipboard",
    });
  };

  const activePurchases = purchases?.filter(p => {
    if (!p.expiresAt) return false;
    const now = new Date();
    const expiry = new Date(p.expiresAt);
    return expiry > now && p.isActive;
  }) || [];

  const expiredPurchases = purchases?.filter(p => {
    if (!p.expiresAt) return true; // No expiry date means expired
    const now = new Date();
    const expiry = new Date(p.expiresAt);
    return expiry <= now || !p.isActive;
  }) || [];

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
          ) : purchases?.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">Chưa có công cụ nào</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Bạn chưa mua công cụ nào. Khám phá thị trường để tìm những công cụ phù hợp với nhu cầu của bạn.
              </p>
              <Link href="/tools">
                <Button size="lg" data-testid="button-browse-tools">
                  Duyệt công cụ
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Active Tools */}
              {activePurchases.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold mb-6 text-emerald-600">Đang hoạt động ({activePurchases.length})</h2>
                  <div className="space-y-4">
                    {activePurchases.map((purchase, index) => {
                      const daysLeft = purchase.expiresAt ? 
                        Math.ceil((new Date(purchase.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) :
                        0;
                      const isExpiringSoon = daysLeft <= 7;
                      
                      return (
                        <motion.div
                          key={purchase.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-lg transition-all duration-200">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <ShoppingBag className="w-8 h-8 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-bold mb-1" data-testid={`text-tool-name-${purchase.id}`}>
                                      {purchase.tool.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-2" data-testid={`text-purchase-date-${purchase.id}`}>
                                      Mua ngày {purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                      <Badge 
                                        variant={isExpiringSoon ? "secondary" : "default"}
                                        className={isExpiringSoon ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"}
                                      >
                                        <Clock className="w-3 h-3 mr-1" />
                                        Còn {daysLeft} ngày
                                      </Badge>
                                      <div className="flex items-center space-x-2 text-sm font-mono bg-muted px-2 py-1 rounded">
                                        <Key className="w-3 h-3" />
                                        <span data-testid={`text-license-key-${purchase.id}`}>{purchase.keyValue || 'Không có key'}</span>
                                        {purchase.keyValue && (
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-6 w-6 p-0"
                                            onClick={() => copyToClipboard(purchase.keyValue!)}
                                            data-testid={`button-copy-key-${purchase.id}`}
                                          >
                                            <Copy className="w-3 h-3" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Giá mua</p>
                                    <p className="text-lg font-bold" data-testid={`text-purchase-price-${purchase.id}`}>
                                      {Number(purchase.finalPrice).toLocaleString('vi-VN')}₫
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    {purchase.tool.downloadUrl && (
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        asChild
                                        data-testid={`button-download-${purchase.id}`}
                                      >
                                        <a href={purchase.tool.downloadUrl} target="_blank" rel="noopener noreferrer">
                                          <Download className="w-4 h-4 mr-1" />
                                          Tải
                                        </a>
                                      </Button>
                                    )}
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleChangeKey(purchase)}
                                      data-testid={`button-change-key-${purchase.id}`}
                                    >
                                      <RefreshCw className="w-4 h-4 mr-1" />
                                      Đổi key
                                    </Button>
                                    <Link href={`/tools/${purchase.tool.id}`}>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        data-testid={`button-view-details-${purchase.id}`}
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                      </Button>
                                    </Link>
                                  </div>
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

              {/* Expired Tools */}
              {expiredPurchases.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h2 className="text-2xl font-bold mb-6 text-red-600">Đã hết hạn ({expiredPurchases.length})</h2>
                  <div className="space-y-4">
                    {expiredPurchases.map((purchase, index) => (
                      <motion.div
                        key={purchase.id}
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
                                  <h3 className="text-xl font-bold mb-1 text-muted-foreground" data-testid={`text-expired-tool-name-${purchase.id}`}>
                                    {purchase.tool.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Hết hạn ngày {purchase.expiresAt ? new Date(purchase.expiresAt).toLocaleDateString('vi-VN') : 'Không rõ'}
                                  </p>
                                  <Badge variant="destructive">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Đã hết hạn
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Đã mua với giá</p>
                                <p className="text-lg font-bold text-muted-foreground">
                                  {Number(purchase.finalPrice).toLocaleString('vi-VN')}₫
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>

        {/* Change Key Dialog */}
        <Dialog open={changeKeyDialogOpen} onOpenChange={setChangeKeyDialogOpen}>
          <DialogContent data-testid="dialog-change-key">
            <DialogHeader>
              <DialogTitle>Đổi License Key</DialogTitle>
              <DialogDescription>
                Nhập key mới cho công cụ {selectedPurchase?.toolId}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-2">
                <Label htmlFor="new-key">Key mới</Label>
                <Input
                  id="new-key"
                  placeholder="Nhập license key mới"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  data-testid="input-new-key"
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setChangeKeyDialogOpen(false)}
                data-testid="button-cancel-change-key"
              >
                Hủy
              </Button>
              <Button 
                onClick={handleConfirmChangeKey}
                disabled={!newKey.trim() || changeKeyMutation.isPending}
                data-testid="button-confirm-change-key"
              >
                {changeKeyMutation.isPending ? "Đang xử lý..." : "Đổi key"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
