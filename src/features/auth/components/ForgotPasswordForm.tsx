'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Mail, ArrowLeft, Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordRequestSchema, type ForgotPasswordRequest } from "@/shared/authTypes"
import { useRequestPasswordReset } from "@/lib/api/hooks/useAuth"

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form setup with validation
  const form = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useRequestPasswordReset({
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Email đã được gửi",
        description: "Vui lòng kiểm tra email để đặt lại mật khẩu.",
      });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: "Gửi email thất bại",
        description: error.message || "Có lỗi xảy ra khi gửi email đặt lại mật khẩu",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (data: ForgotPasswordRequest) => {
    forgotPasswordMutation.mutate(data.email);
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card className="overflow-hidden border-0 shadow-2xl bg-gray-800 text-white">
          {/* Success Header */}
          <CardHeader className="bg-green-600 text-center py-6">
            <CardTitle className="text-2xl font-bold text-white">
              Email Đã Gửi
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-white font-medium">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
              </p>
              <p className="text-gray-300 text-sm">
                Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn để đặt lại mật khẩu.
              </p>
              <p className="text-gray-400 text-xs">
                Nếu không thấy email, hãy kiểm tra thư mục spam.
              </p>
            </div>

            <Button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 mt-6"
              onClick={handleBackToLogin}
              data-testid="back-to-login-button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Forgot Password Form */}
      <div className="flex-1 max-w-md">
        <Card className="overflow-hidden border-0 shadow-2xl bg-gray-800 text-white">
          {/* Purple Header */}
          <CardHeader className="bg-purple-600 text-center py-6">
            <CardTitle className="text-2xl font-bold text-white">
              Quên Mật Khẩu
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-4">
            <div className="text-center mb-4">
              <p className="text-gray-300 text-sm">
                Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
              </p>
            </div>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" data-testid="forgot-password-form">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  Địa Chỉ Email (*)
                </Label>
                <Input
                  id="email"
                  data-testid="email-input"
                  type="email"
                  placeholder="Nhập email của bạn"
                  {...form.register("email")}
                  className="bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500"
                  disabled={forgotPasswordMutation.isPending}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
                disabled={forgotPasswordMutation.isPending}
                data-testid="send-email-button"
              >
                <Send className="w-4 h-4 mr-2" />
                {forgotPasswordMutation.isPending ? "Đang gửi..." : "Gửi Email Đặt Lại"}
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
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Instructions Section */}
      <div className="w-80">
        <Card className="overflow-hidden border-0 shadow-2xl bg-gray-800 text-white">
          {/* Purple Header */}
          <CardHeader className="bg-purple-600 text-center py-4">
            <CardTitle className="text-xl font-bold text-white">
              Hướng Dẫn
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-4">
            <div className="text-sm text-gray-300 space-y-3">
              <p>
                <strong>- Nhập đúng địa chỉ email bạn đã đăng ký!</strong>
              </p>
              
              <p>
                <strong>- Kiểm tra hộp thư đến sau khi gửi yêu cầu!</strong>
              </p>
              
              <p>
                <strong>- Nếu không thấy email, hãy kiểm tra thư mục spam!</strong>
              </p>
              
              <p>
                <strong>- Link đặt lại mật khẩu sẽ có thời hạn sử dụng!</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
