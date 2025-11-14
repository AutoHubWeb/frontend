'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { UserPlus, User, Mail, Lock } from "lucide-react";
import { useAuth } from "@/features/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerRequestSchema, type RegisterRequest } from "@/shared/authTypes";

interface RegisterFormProps {
  onRegisterSuccess?: () => void;
}

export function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { register, isLoading } = useAuth();

  // Form setup with validation
  const form = useForm<RegisterRequest>({
    resolver: zodResolver(registerRequestSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  });


  const handleSubmit = async (data: RegisterRequest) => {
    try {
      await register(data);
      
      toast({
        title: "Đăng ký thành công",
        description: "Tài khoản của bạn đã được tạo thành công!",
      });

      // Redirect to login page
      router.push("/login")
      
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (error: any) {
      // Extract error message from API response
      const errorMessage = error?.response?.data?.message || error?.message || "Có lỗi xảy ra khi đăng ký";
      
      toast({
        title: "Đăng ký thất bại",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleBackToLogin = () => {
    router.push("/login")
  };


  return (
    <Card className="overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-lg">
      <CardHeader className="text-center py-6 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <UserPlus className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Đăng Ký</h2>
        <p className="text-white/80 text-sm mt-1">Tạo tài khoản mới</p>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Địa Chỉ E-Mail <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                data-testid="email-input"
                type="email"
                placeholder="Nhập email của bạn"
                {...form.register("email")}
                className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                disabled={isLoading}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
            )}
          </div>

          {/* Full Name Field */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-700 font-medium">
              Họ và Tên <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="fullName"
                data-testid="fullname-input"
                type="text"
                placeholder="Nhập họ và tên của bạn"
                {...form.register("fullname")}
                className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                disabled={isLoading}
              />
            </div>
            {form.formState.errors.fullname && (
              <p className="text-red-500 text-sm">{form.formState.errors.fullname.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Mật Khẩu <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                data-testid="password-input"
                type="password"
                placeholder="Nhập mật khẩu của bạn"
                {...form.register("password")}
                className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                disabled={isLoading}
              />
            </div>
            {form.formState.errors.password && (
              <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
            )}
          </div>

          {/* Register Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            disabled={isLoading}
            data-testid="register-button"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            {isLoading ? "Đang đăng ký..." : "Đăng Ký"}
          </Button>
        </form>

        {/* Back to Login Button */}
        <div className="pt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full bg-white border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors py-2.5"
            onClick={handleBackToLogin}
            data-testid="back-to-login-button"
          >
            <Lock className="w-5 h-5 mr-2" />
            Đăng Nhập
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
