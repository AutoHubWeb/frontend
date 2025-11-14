'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Lock, User, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/features/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginRequestSchema, type LoginRequest } from "@/shared/authTypes";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberAccount, setRememberAccount] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login, isLoading } = useAuth();

  // Form setup with validation
  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("remembered-email");
    if (rememberedEmail) {
      form.setValue("email", rememberedEmail);
      setRememberAccount(true);
    }
  }, [form]);

  const handleSubmit = async (data: LoginRequest) => {
    try {
      await login(data);

      // Handle remember account
      if (rememberAccount) {
        localStorage.setItem("remembered-email", data.email);
      } else {
        localStorage.removeItem("remembered-email");
      }

      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn đã quay trở lại!",
      });

      router.push("/");
      
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error: any) {
      // Extract error message from API response
      const errorMessage = error?.response?.data?.message || error?.message || "Thông tin đăng nhập không chính xác";
      
      toast({
        title: "Đăng nhập thất bại",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleRegister = () => {
    router.push("/register")
  };

  return (
    <Card className="overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-lg">
      <CardHeader className="text-center py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Đăng Nhập</h2>
        <p className="text-white/80 text-sm mt-1">Chào mừng bạn trở lại</p>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                data-testid="email-input"
                type="email"
                placeholder="Nhập email của bạn"
                {...form.register("email")}
                className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Mật Khẩu
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                data-testid="password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu của bạn"
                {...form.register("password")}
                className="pl-10 pr-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-pressed={showPassword}
                data-testid="password-toggle"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </Button>
            </div>
            {form.formState.errors.password && (
              <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
            )}
          </div>

          {/* Remember Account & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                data-testid="remember-checkbox"
                checked={rememberAccount}
                onCheckedChange={(checked) => setRememberAccount(checked as boolean)}
                className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-sm"
              />
              <Label
                htmlFor="remember"
                className="text-sm text-gray-700 cursor-pointer"
              >
                Nhớ Tài Khoản
              </Label>
            </div>
            
            <Button
              type="button"
              variant="link"
              className="text-blue-600 hover:text-blue-800 p-0 h-auto font-normal text-sm"
              onClick={handleForgotPassword}
              data-testid="forgot-password-link"
            >
              Quên Mật Khẩu?
            </Button>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            disabled={isLoading}
            data-testid="login-button"
          >
            <LogIn className="w-5 h-5 mr-2" />
            {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </Button>
        </form>

        {/* Register Button - Full Width */}
        <div className="pt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full bg-white border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors py-2.5"
            onClick={handleRegister}
            data-testid="register-button"
          >
            <User className="w-5 h-5 mr-2" />
            Đăng Ký Tài Khoản
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
