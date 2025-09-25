import { Layout } from "@/components";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  ShoppingBag, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign
} from "lucide-react";
import type { Payment, Purchase, Tool } from "@shared/schema";

export default function History() {
  const { isAuthenticated } = useAuth();
  const { data: payments, isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
    retry: false,
  });

  const { data: purchases, isLoading: purchasesLoading } = useQuery<(Purchase & { tool: Tool })[]>({
    queryKey: ["/api/purchases"],
    retry: false,
  });

  const depositHistory = payments?.filter(p => p.type === "deposit") || [];
  const purchaseHistoryFromPayments = payments?.filter(p => p.type === "purchase") || [];

  const totalDeposited = depositHistory.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const totalSpent = purchaseHistoryFromPayments.reduce((sum, payment) => sum + Math.abs(Number(payment.amount)), 0);
  const totalTransactions = (payments?.length || 0) + (purchases?.length || 0);

  const stats = [
    {
      title: "Tổng số giao dịch",
      value: totalTransactions,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900"
    },
    {
      title: "Tổng tiền đã nạp",
      value: `${totalDeposited.toLocaleString('vi-VN')}₫`,
      icon: CreditCard,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900"
    },
    {
      title: "Tổng tiền đã chi",
      value: `${totalSpent.toLocaleString('vi-VN')}₫`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900"
    },
    {
      title: "Công cụ đã mua",
      value: purchases?.length || 0,
      icon: ShoppingBag,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Thành công';
      case 'pending':
        return 'Đang xử lý';
      case 'failed':
        return 'Thất bại';
      default:
        return 'Không xác định';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
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
            <h1 className="text-3xl font-bold mb-2">Lịch sử giao dịch</h1>
            <p className="text-muted-foreground">Xem lại tất cả các giao dịch của bạn</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
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

          {/* History Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" data-testid="tab-all-history">Tất cả</TabsTrigger>
                <TabsTrigger value="deposits" data-testid="tab-deposits">Nạp tiền</TabsTrigger>
                <TabsTrigger value="purchases" data-testid="tab-purchases">Mua hàng</TabsTrigger>
              </TabsList>

              {/* All Transactions */}
              <TabsContent value="all">
                <Card>
                  <CardHeader>
                    <CardTitle>Tất cả giao dịch</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {paymentsLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center space-x-4">
                              <Skeleton className="w-10 h-10 rounded-full" />
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
                    ) : payments?.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Chưa có giao dịch</h3>
                        <p className="text-muted-foreground">Bạn chưa thực hiện giao dịch nào</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {payments?.slice().reverse().map((payment, index) => (
                          <motion.div
                            key={payment.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                payment.type === 'deposit' 
                                  ? 'bg-emerald-100 dark:bg-emerald-900' 
                                  : 'bg-blue-100 dark:bg-blue-900'
                              }`}>
                                {payment.type === 'deposit' ? (
                                  <CreditCard className="w-5 h-5 text-emerald-600" />
                                ) : (
                                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium" data-testid={`text-transaction-description-${payment.id}`}>
                                  {payment.description || (payment.type === 'deposit' ? 'Nạp tiền' : 'Mua công cụ')}
                                </p>
                                <p className="text-sm text-muted-foreground" data-testid={`text-transaction-date-${payment.id}`}>
                                  {payment.createdAt ? new Date(payment.createdAt).toLocaleString('vi-VN') : 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold text-lg ${
                                payment.type === 'deposit' ? 'text-emerald-600' : 'text-orange-600'
                              }`} data-testid={`text-transaction-amount-${payment.id}`}>
                                {payment.type === 'deposit' ? '+' : ''}
                                {Number(payment.amount).toLocaleString('vi-VN')}₫
                              </p>
                              <Badge variant={getStatusVariant(payment.status)} className="mt-1">
                                {getStatusIcon(payment.status)}
                                <span className="ml-1">{getStatusText(payment.status)}</span>
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Deposit History */}
              <TabsContent value="deposits">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-emerald-600" />
                      Lịch sử nạp tiền
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {paymentsLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center space-x-4">
                              <Skeleton className="w-10 h-10 rounded-full" />
                              <div className="space-y-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                              </div>
                            </div>
                            <Skeleton className="h-4 w-20" />
                          </div>
                        ))}
                      </div>
                    ) : depositHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Chưa có giao dịch nạp tiền</h3>
                        <p className="text-muted-foreground">Bạn chưa nạp tiền vào tài khoản</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {depositHistory.slice().reverse().map((payment, index) => (
                          <motion.div
                            key={payment.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div>
                                <p className="font-medium" data-testid={`text-deposit-description-${payment.id}`}>
                                  {payment.description || 'Nạp tiền vào tài khoản'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {payment.createdAt ? new Date(payment.createdAt).toLocaleString('vi-VN') : 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-emerald-600" data-testid={`text-deposit-amount-${payment.id}`}>
                                +{Number(payment.amount).toLocaleString('vi-VN')}₫
                              </p>
                              <Badge variant={getStatusVariant(payment.status)} className="mt-1">
                                {getStatusIcon(payment.status)}
                                <span className="ml-1">{getStatusText(payment.status)}</span>
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Purchase History */}
              <TabsContent value="purchases">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShoppingBag className="mr-2 h-5 w-5 text-blue-600" />
                      Lịch sử mua hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {purchasesLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center space-x-4">
                              <Skeleton className="w-10 h-10 rounded-lg" />
                              <div className="space-y-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                              </div>
                            </div>
                            <Skeleton className="h-4 w-20" />
                          </div>
                        ))}
                      </div>
                    ) : purchases?.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Chưa mua công cụ nào</h3>
                        <p className="text-muted-foreground">Bạn chưa mua công cụ nào từ thị trường</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {purchases?.slice().reverse().map((purchase, index) => {
                          const isExpired = new Date(purchase.expiresAt) < new Date();
                          
                          return (
                            <motion.div
                              key={purchase.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.05 }}
                              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                  <ShoppingBag className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="font-medium" data-testid={`text-purchase-tool-name-${purchase.id}`}>
                                    {purchase.tool.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Mua ngày {purchase.createdAt ? new Date(purchase.createdAt).toLocaleString('vi-VN') : 'N/A'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg" data-testid={`text-purchase-final-price-${purchase.id}`}>
                                  {Number(purchase.finalPrice).toLocaleString('vi-VN')}₫
                                </p>
                                <Badge variant={isExpired ? "destructive" : "default"} className="mt-1">
                                  {isExpired ? "Đã hết hạn" : "Đang hoạt động"}
                                </Badge>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}
