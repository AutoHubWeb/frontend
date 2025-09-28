'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Lock, User, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
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
      toast({
        title: "Đăng nhập thất bại",
        description: error.message || "Thông tin đăng nhập không chính xác",
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

  const handleGoogleLogin = () => {
    toast({
      title: "Tính năng sắp ra mắt",
      description: "Đăng nhập Google đang được phát triển",
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="overflow-hidden border-0 shadow-2xl bg-gray-800 text-white">
        {/* Blue Header */}
        <CardHeader className="bg-blue-600 text-center py-6">
          <CardTitle className="text-2xl font-bold text-white">
            Đăng Nhập
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" data-testid="login-form">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                Email
              </Label>
              <Input
                id="email"
                data-testid="email-input"
                type="email"
                placeholder="Nhập email của bạn"
                {...form.register("email")}
                className="bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500"
                disabled={isLoading}
              />
              {form.formState.errors.email && (
                <p className="text-red-400 text-sm">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">
                Mật Khẩu
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  data-testid="password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu của bạn"
                  {...form.register("password")}
                  className="bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500 pr-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-pressed={showPassword}
                  data-testid="password-toggle"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Remember Account & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  data-testid="remember-checkbox"
                  checked={rememberAccount}
                  onCheckedChange={(checked) => setRememberAccount(checked as boolean)}
                  className="border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-white cursor-pointer"
                >
                  Nhớ Tài Khoản
                </Label>
              </div>
              
              <Button
                type="button"
                variant="link"
                className="text-blue-400 hover:text-blue-300 p-0 h-auto font-normal text-sm"
                onClick={handleForgotPassword}
                data-testid="forgot-password-link"
              >
                Quên Mật Khẩu?
              </Button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
              disabled={isLoading}
              data-testid="login-button"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-800 text-gray-400 font-medium">
                - HOẶC -
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="bg-green-600 hover:bg-green-700 border-green-600 text-white font-medium"
              onClick={handleRegister}
              data-testid="register-button"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Đăng Kí
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="bg-red-600 hover:bg-red-700 border-red-600 text-white font-medium"
              onClick={handleGoogleLogin}
              data-testid="google-button"
            >
              <FcGoogle className="w-4 h-4 mr-2" />
              Google
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
