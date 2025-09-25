import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { UserPlus, LogIn } from "lucide-react";
import { useAuth } from "@/features/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerRequestSchema, type RegisterRequest } from "@/shared/authTypes";

interface RegisterFormProps {
  onRegisterSuccess?: () => void;
}

export function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
  const [, setLocation] = useLocation();
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
      setLocation("/login");
      
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Đăng ký thất bại",
        description: error.message || "Có lỗi xảy ra khi đăng ký",
        variant: "destructive",
      });
    }
  };

  const handleBackToLogin = () => {
    setLocation("/login");
  };


  return (
    <div className="flex gap-6">
      {/* Register Form */}
      <div className="flex-1 max-w-md">
        <Card className="overflow-hidden border-0 shadow-2xl bg-gray-800 text-white">
          {/* Green Header */}
          <CardHeader className="bg-green-600 text-center py-6">
            <CardTitle className="text-2xl font-bold text-white">
              Đăng Ký
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-4">
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" data-testid="register-form">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  Địa Chỉ E-Mail (*)
                </Label>
                <Input
                  id="email"
                  data-testid="email-input"
                  type="email"
                  placeholder=""
                  {...form.register("email")}
                  className="bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500"
                  disabled={isLoading}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>

              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white font-medium">
                  Họ và Tên (*)
                </Label>
                <Input
                  id="fullName"
                  data-testid="fullname-input"
                  type="text"
                  placeholder=""
                  {...form.register("fullname")}
                  className="bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500"
                  disabled={isLoading}
                />
                {form.formState.errors.fullname && (
                  <p className="text-sm text-red-500">{form.formState.errors.fullname.message}</p>
                )}
              </div>


              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">
                  Mật Khẩu (*)
                </Label>
                <Input
                  id="password"
                  data-testid="password-input"
                  type="password"
                  placeholder=""
                  {...form.register("password")}
                  className="bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500"
                  disabled={isLoading}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                )}
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
                disabled={isLoading}
                data-testid="register-button"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {isLoading ? "Đang đăng ký..." : "Đăng Ký"}
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

            {/* Back to Login Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600 text-white font-medium"
              onClick={handleBackToLogin}
              data-testid="back-to-login-button"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Đăng Nhập
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Rules Section */}
      <div className="w-80">
        <Card className="overflow-hidden border-0 shadow-2xl bg-gray-800 text-white">
          {/* Green Header */}
          <CardHeader className="bg-green-600 text-center py-4">
            <CardTitle className="text-xl font-bold text-white">
              Quy Tắc
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-4">
            <div className="text-sm text-gray-300 space-y-3">
              <p>
                <strong>- Nhập đúng địa chỉ Email thật để lấy lại Password khi quên!</strong>
              </p>
              
              <p>
                <strong>- Họ và tên phải có ít nhất 2 ký tự!</strong>
              </p>
              
              <p>
                <strong>- Mật khẩu tối thiểu 6 ký tự, phải bao gồm chữ và số!</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
