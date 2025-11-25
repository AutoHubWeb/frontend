import { Layout } from "@/components";
import { motion } from "framer-motion";
import { useAuth } from "@/features/auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  ShoppingBag, 
  Calendar, 
  TrendingUp,
  ArrowRight,
  Clock
} from "lucide-react";
import Link from "next/link";
import type { Purchase, Tool, Payment } from "@/lib/api/types";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: purchases, isLoading: purchasesLoading } = useQuery<(Purchase & { tool: Tool })[]>({
    queryKey: ["/api/purchases"],
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const totalSpent = payments?.reduce((sum, payment) => {
    return payment.type === "purchase" ? sum + Math.abs(Number(payment.amount)) : sum;
  }, 0) || 0;

  const recentPurchases = purchases?.slice(0, 3) || [];

  const statsCards = [
    {
      title: "Số dư",
      value: `${Number(user?.balance || 0).toLocaleString('vi-VN')}₫`,
      icon: CreditCard,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900"
    },
    {
      title: "Công cụ đã mua",
      value: purchases?.length || 0,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900"
    },
    {
      title: "Ngày tham gia",
      value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A',
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900"
    },
    {
      title: "Đã chi tiêu",
      value: `${totalSpent.toLocaleString('vi-VN')}₫`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900"
    }
  ];

  return (
    <Layout showSidebar>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Quản lý tài khoản và công cụ của bạn</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className={`text-2xl font-bold ${stat.color}`} data-testid={`text-stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Purchases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Công cụ gần đây</CardTitle>
                  <Link href="/purchased-tools">
                    <Button variant="outline" size="sm" data-testid="link-view-all-purchases">
                      Xem tất cả
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {purchasesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="w-12 h-12 rounded-lg" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentPurchases.length > 0 ? (
                  <div className="space-y-4">
                    {recentPurchases.map((purchase) => {
                      const daysLeft = purchase.expiresAt ? Math.ceil((new Date(purchase.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
                      const isExpiringSoon = daysLeft <= 7;
                      const isExpired = daysLeft < 0;
                      
                      return (
                        <div key={purchase.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold" data-testid={`text-purchase-tool-name-${purchase.id}`}>
                                {purchase.tool.name}
                              </p>
                              <p className="text-sm text-muted-foreground" data-testid={`text-purchase-date-${purchase.id}`}>
                                Mua ngày {purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold" data-testid={`text-purchase-price-${purchase.id}`}>
                              {Number(purchase.finalPrice).toLocaleString('vi-VN')}₫
                            </p>
                            <Badge 
                              variant={isExpired ? "destructive" : isExpiringSoon ? "secondary" : "default"}
                              className={isExpired ? "" : isExpiringSoon ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"}
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {isExpired ? "Đã hết hạn" : `Còn ${daysLeft} ngày`}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có công cụ nào</h3>
                    <p className="text-muted-foreground mb-4">
                      Bắt đầu khám phá và mua các công cụ chất lượng
                    </p>
                    <Link href="/">
                      <Button data-testid="button-browse-tools-from-dashboard">
                        Duyệt công cụ
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}
