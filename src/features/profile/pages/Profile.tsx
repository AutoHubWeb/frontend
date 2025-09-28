'use client'

import { useState, useEffect } from "react";
import { Layout } from "@/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUpdateProfile, useChangePassword, useCurrentUser } from "@/features/auth";
import { User, Calendar, Mail, Phone, Wallet, Edit2, Save, X, Shield, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

// Form validation schemas
const profileUpdateSchema = z.object({
  fullname: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z.string().optional(),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Mật khẩu cũ là bắt buộc"),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export default function Profile() {
  const { isAuthenticated } = useAuth();
  const { data: user, refetch: refetchUser } = useCurrentUser({ enabled: true });
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Form setup
  const form = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullname: user?.fullname || "",
      phone: user?.phone || "",
    },
  });

  const passwordForm = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const updateProfileMutation = useUpdateProfile({
    onSuccess: (updatedUser) => {
      // Reset form with updated user data
      form.reset({
        fullname: updatedUser.fullname || "",
        phone: updatedUser.phone || "",
      });
      // Manually refetch user data to ensure UI updates
      refetchUser();
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Cập nhật thất bại",
        description: error.message || "Có lỗi xảy ra khi cập nhật thông tin.",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useChangePassword({
    onSuccess: () => {
      passwordForm.reset();
      toast({
        title: "Đổi mật khẩu thành công",
        description: "Mật khẩu của bạn đã được cập nhật.",
      });
      setIsChangingPassword(false);
    },
    onError: (error) => {
      toast({
        title: "Đổi mật khẩu thất bại",
        description: error.message || "Có lỗi xảy ra khi đổi mật khẩu.",
        variant: "destructive",
      });
    },
  });

  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        fullname: user.fullname || "",
        phone: user.phone || "",
      });
    }
  }, [user, form]);

  // Force re-render with updated user data after profile update
  useEffect(() => {
    if (updateProfileMutation.isSuccess && updateProfileMutation.data) {
      // The useAuth hook should automatically update with the new user data
      // but we can force a reset here to ensure form sync
      const updatedUser = updateProfileMutation.data;
      form.reset({
        fullname: updatedUser.fullname || "",
        phone: updatedUser.phone || "",
      });
    }
  }, [updateProfileMutation.isSuccess, updateProfileMutation.data, form]);

  const handleSubmit = (data: ProfileUpdateData) => {
    updateProfileMutation.mutate(data);
  };

  const handlePasswordSubmit = (data: ChangePasswordData) => {
    changePasswordMutation.mutate({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  const handleCancel = () => {
    form.reset({
      fullname: user?.fullname || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  const handlePasswordCancel = () => {
    passwordForm.reset();
    setIsChangingPassword(false);
  };

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Không có thông tin";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to format currency
  const formatCurrency = (amount?: number) => {
    const balance = amount || user?.accountBalance || user?.balance || 0;
    return balance.toLocaleString("vi-VN") + "₫";
  };

  if (!user) {
    return (
      <Layout showSidebar={isAuthenticated}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Vui lòng đăng nhập để xem thông tin cá nhân.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={isAuthenticated}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Thông Tin Cá Nhân
            </h1>
            <p className="text-muted-foreground text-lg">Quản lý thông tin tài khoản của bạn</p>
          </div>

          {/* User Info Overview Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                    <AvatarImage src={""} alt={user.fullname} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {user.fullname?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                {/* User Details */}
                <div className="flex-1 text-center md:text-left space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.fullname}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {user.role === 1 ? (
                      <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
                        <Shield className="h-3 w-3 mr-1" />
                        Quản trị viên
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800">
                        Thành viên
                      </Badge>
                    )}
                    {user.isLocked === 0 ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400">
                        Hoạt động
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        Bị khóa
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Account Balance */}
                <div className="flex-shrink-0">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border">
                    <div className="text-center space-y-2">
                      <Wallet className="h-8 w-8 mx-auto text-blue-600" />
                      <p className="text-sm text-muted-foreground">Số dư tài khoản</p>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Profile Information Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5" />
                  Thông Tin Cơ Bản
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isEditing ? (
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullname" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Họ và tên
                      </Label>
                      <Input
                        id="fullname"
                        {...form.register("fullname")}
                        placeholder="Nhập họ và tên"
                        disabled={updateProfileMutation.isPending}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                      {form.formState.errors.fullname && (
                        <p className="text-sm text-red-500">{form.formState.errors.fullname.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Số điện thoại
                      </Label>
                      <Input
                        id="phone"
                        {...form.register("phone")}
                        placeholder="Nhập số điện thoại"
                        disabled={updateProfileMutation.isPending}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {updateProfileMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={updateProfileMutation.isPending}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <User className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">Họ và tên</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">{user.fullname}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <Mail className="h-5 w-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">Email</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <Phone className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {user.phone || "Chưa cập nhật"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">Ngày tham gia</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">{formatDate(user.createdAt)}</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Chỉnh sửa thông tin
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Lock className="h-5 w-5" />
                  Bảo Mật Tài Khoản
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!isChangingPassword ? (
                  <div className="text-center space-y-6">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                      <Lock className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Bảo vệ tài khoản
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Đổi mật khẩu thường xuyên để bảo vệ tài khoản của bạn khỏi các nguy cơ bảo mật
                      </p>
                      <Button
                        onClick={() => setIsChangingPassword(true)}
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Đổi mật khẩu
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="oldPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Mật khẩu hiện tại
                      </Label>
                      <Input
                        id="oldPassword"
                        type="password"
                        {...passwordForm.register("oldPassword")}
                        placeholder="Nhập mật khẩu hiện tại"
                        disabled={changePasswordMutation.isPending}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                      {passwordForm.formState.errors.oldPassword && (
                        <p className="text-sm text-red-500">{passwordForm.formState.errors.oldPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Mật khẩu mới
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...passwordForm.register("newPassword")}
                        placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                        disabled={changePasswordMutation.isPending}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-sm text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Xác nhận mật khẩu
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...passwordForm.register("confirmPassword")}
                        placeholder="Nhập lại mật khẩu mới"
                        disabled={changePasswordMutation.isPending}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={changePasswordMutation.isPending}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {changePasswordMutation.isPending ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePasswordCancel}
                        disabled={changePasswordMutation.isPending}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </Layout>
  );
}
