'use client'

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Layout } from "@/components";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
;
import { useToast } from "@/hooks/use-toast";
import type { User, Tool, KeyValidation } from "@shared/schema";

interface AdminStats {
  totalUsers: number;
  totalTools: number;
  monthlyRevenue: string;
  totalRevenue: string;
  keyValidation: {
    totalToday: number;
    successToday: number;
    failedToday: number;
  };
}

interface UserWithStats extends User {
  purchaseCount: number;
  totalSpent: string;
}

export default function AdminPanel() {
  const { section } = useParams<{ section?: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if user is admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      toast({
        title: "Không có quyền truy cập",
        description: "Bạn cần quyền quản trị viên để truy cập trang này",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  }, [user, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: !!user?.isAdmin,
    retry: false,
  });

  const { data: users, isLoading: usersLoading } = useQuery<UserWithStats[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user?.isAdmin && section === 'users',
    retry: false,
  });

  const { data: tools, isLoading: toolsLoading } = useQuery<Tool[]>({
    queryKey: ["/api/tools"],
    enabled: !!user?.isAdmin && section === 'tools',
  });

  const { data: keyValidations, isLoading: validationsLoading } = useQuery<(KeyValidation & { user?: User; tool?: Tool })[]>({
    queryKey: ["/api/admin/key-validations"],
    enabled: !!user?.isAdmin && section === 'validations',
    retry: false,
  });

  if (!user?.isAdmin) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Không có quyền truy cập</h1>
            <p className="text-muted-foreground mb-4">Bạn cần quyền quản trị viên để truy cập trang này</p>
            <Link href="/">
              <Button>Về trang chủ</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const activeTab = section || "overview";

  const statsCards = [
    {
      title: "Tổng người dùng",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900"
    },
    {
      title: "Tổng công cụ",
      value: stats?.totalTools || 0,
      icon: ShoppingBag,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900"
    },
    {
      title: "Doanh thu tháng",
      value: stats ? `${Number(stats.monthlyRevenue).toLocaleString('vi-VN')}₫` : '0₫',
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900"
    },
    {
      title: "Tổng doanh thu",
      value: stats ? `${Number(stats.totalRevenue).toLocaleString('vi-VN')}₫` : '0₫',
      icon: DollarSign,
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
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">Quản lý hệ thống và người dùng</p>
          </div>

          <Tabs value={activeTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" asChild>
                <Link href="/admin" data-testid="tab-overview">Tổng quan</Link>
              </TabsTrigger>
              <TabsTrigger value="users" asChild>
                <Link href="/admin/users" data-testid="tab-users">Người dùng</Link>
              </TabsTrigger>
              <TabsTrigger value="tools" asChild>
                <Link href="/admin/tools" data-testid="tab-tools">Công cụ</Link>
              </TabsTrigger>
              <TabsTrigger value="validations" asChild>
                <Link href="/admin/validations" data-testid="tab-validations">Key Validation</Link>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
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

              {/* Key Validation Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Thống kê API Key Validation hôm nay</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                      <div className="grid grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="text-center">
                            <Skeleton className="h-8 w-16 mx-auto mb-2" />
                            <Skeleton className="h-4 w-20 mx-auto" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-3xl font-bold text-blue-600 mb-1" data-testid="text-total-api-calls">
                            {stats?.keyValidation.totalToday || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Tổng API calls</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-emerald-600 mb-1" data-testid="text-successful-api-calls">
                            {stats?.keyValidation.successToday || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Thành công</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-red-600 mb-1" data-testid="text-failed-api-calls">
                            {stats?.keyValidation.failedToday || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Thất bại</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Quản lý người dùng</CardTitle>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
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
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : users?.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Chưa có người dùng</h3>
                      <p className="text-muted-foreground">Hệ thống chưa có người dùng nào đăng ký</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {users?.map((user, index) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-primary-foreground font-semibold text-sm">
                                {user.firstName?.[0] || user.email?.[0] || "U"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium" data-testid={`text-user-name-${user.id}`}>
                                {user.firstName && user.lastName 
                                  ? `${user.firstName} ${user.lastName}`
                                  : user.email}
                              </p>
                              <div className="flex items-center space-x-2">
                                <p className="text-sm text-muted-foreground">
                                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                </p>
                                <Badge variant={user.isAdmin ? "default" : "secondary"}>
                                  {user.isAdmin ? "Admin" : "User"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-emerald-600" data-testid={`text-user-balance-${user.id}`}>
                              {Number(user.balance).toLocaleString('vi-VN')}₫
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.purchaseCount} công cụ | {Number(user.totalSpent).toLocaleString('vi-VN')}₫
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Quản lý công cụ</CardTitle>
                    <Button data-testid="button-add-tool">Thêm công cụ mới</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {toolsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                          <Skeleton className="w-full h-48" />
                          <CardContent className="p-4">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-3 w-full mb-4" />
                            <div className="flex justify-between">
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : tools?.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Chưa có công cụ</h3>
                      <p className="text-muted-foreground">Hệ thống chưa có công cụ nào</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tools?.map((tool, index) => (
                        <motion.div
                          key={tool.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                            <Image 
                              src={tool.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"} 
                              alt={tool.name}
                              width={800}
                              height={400}
                              className="w-full h-48 object-cover"
                            />
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-1" data-testid={`text-admin-tool-name-${tool.id}`}>{tool.name}</h3>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {tool.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Eye className="w-4 h-4" />
                                  <span data-testid={`text-admin-tool-views-${tool.id}`}>{tool.views}</span>
                                </div>
                                <div className="font-bold text-primary" data-testid={`text-admin-tool-price-${tool.id}`}>
                                  {Number(tool.price).toLocaleString('vi-VN')}₫
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <Badge variant={tool.isActive ? "default" : "secondary"}>
                                  {tool.isActive ? "Hoạt động" : "Tạm dừng"}
                                </Badge>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" data-testid={`button-edit-tool-${tool.id}`}>
                                    Sửa
                                  </Button>
                                  <Button variant="outline" size="sm" data-testid={`button-delete-tool-${tool.id}`}>
                                    Xóa
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Key Validations Tab */}
            <TabsContent value="validations">
              <Card>
                <CardHeader>
                  <CardTitle>Log Key Validation</CardTitle>
                </CardHeader>
                <CardContent>
                  {validationsLoading ? (
                    <div className="space-y-4">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border-b">
                          <div className="flex items-center space-x-3">
                            <Skeleton className="w-6 h-6 rounded-full" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                          <Skeleton className="h-4 w-20" />
                        </div>
                      ))}
                    </div>
                  ) : keyValidations?.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Chưa có log</h3>
                      <p className="text-muted-foreground">Chưa có API key validation nào được ghi log</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {keyValidations?.map((validation, index) => (
                        <motion.div
                          key={validation.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.02 }}
                          className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              validation.isValid 
                                ? 'bg-emerald-100 dark:bg-emerald-900' 
                                : 'bg-red-100 dark:bg-red-900'
                            }`}>
                              {validation.isValid ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium font-mono" data-testid={`text-validation-key-${validation.id}`}>
                                {validation.keyValue || "N/A"}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                {validation.user && (
                                  <span>{validation.user.email}</span>
                                )}
                                {validation.tool && (
                                  <span>• {validation.tool.name}</span>
                                )}
                                <span>• {validation.ipAddress}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={validation.isValid ? "default" : "destructive"}>
                              {validation.isValid ? "Hợp lệ" : "Không hợp lệ"}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(validation.createdAt).toLocaleString('vi-VN')}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
}
