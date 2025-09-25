import { useState } from "react";
import { Layout } from "@/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Lock, Save, Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Profile form state
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; email: string }) => {
      const response = await apiRequest("PATCH", "/api/user/profile", data);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditingProfile(false);
    },
    onError: (error: any) => {
      toast({
        title: "Cập nhật thất bại",
        description: error.message || "Có lỗi xảy ra khi cập nhật thông tin.",
        variant: "destructive",
      });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await apiRequest("PATCH", "/api/user/password", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Đổi mật khẩu thành công",
        description: "Mật khẩu của bạn đã được thay đổi.",
      });
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: any) => {
      toast({
        title: "Đổi mật khẩu thất bại",
        description: error.message || "Có lỗi xảy ra khi đổi mật khẩu.",
        variant: "destructive",
      });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ họ và tên.",
        variant: "destructive",
      });
      return;
    }

    updateProfileMutation.mutate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ tất cả các trường.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Mật khẩu không khớp",
        description: "Mật khẩu mới và xác nhận mật khẩu không giống nhau.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Mật khẩu quá ngắn",
        description: "Mật khẩu mới phải có ít nhất 6 ký tự.",
        variant: "destructive",
      });
      return;
    }

    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
    });
  };

  const handleCancelEdit = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setEmail(user?.email || "");
    setIsEditingProfile(false);
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
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="space-y-4">
        {/* User Info Card */}
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.profileImageUrl} alt="" />
                <AvatarFallback className="text-sm">
                  {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-bold text-lg" data-testid="text-user-display-name">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.email}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {user.isAdmin ? "Quản trị viên" : "Thành viên"}
                </p>
                <p className="text-sm font-semibold text-emerald-600" data-testid="text-user-balance-profile">
                  Số dư: {Number(user.balance || 0).toLocaleString('vi-VN')}₫
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Menu */}
        <Card className="w-full">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              <Link href="/profile" className="flex items-center space-x-3 px-4 py-4 hover:bg-accent transition-colors" data-testid="link-profile">
                <User className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Thông tin cá nhân</span>
              </Link>
              <Link href="/purchased-tools" className="flex items-center space-x-3 px-4 py-4 hover:bg-accent transition-colors" data-testid="link-purchased-tools">
                <div className="h-5 w-5 text-orange-500 flex items-center justify-center">📦</div>
                <span className="font-medium">Công cụ đã mua</span>
              </Link>
              <Link href="/deposit" className="flex items-center space-x-3 px-4 py-4 hover:bg-accent transition-colors" data-testid="link-deposit">
                <div className="h-5 w-5 text-gray-600 flex items-center justify-center">💳</div>
                <span className="font-medium">Nạp tiền</span>
              </Link>
              <Link href="/history" className="flex items-center space-x-3 px-4 py-4 hover:bg-accent transition-colors" data-testid="link-history">
                <div className="h-5 w-5 text-gray-600 flex items-center justify-center">🕒</div>
                <span className="font-medium">Lịch sử</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Button */}
        <Card className="w-full">
          <CardContent className="pt-6">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setIsEditingProfile(true)}
              data-testid="button-edit-profile"
            >
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa thông tin
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Modal/Overlay */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Chỉnh sửa thông tin</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Họ</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Nhập họ của bạn"
                    data-testid="input-first-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Tên</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nhập tên của bạn"
                    data-testid="input-last-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    data-testid="input-email"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={updateProfileMutation.isPending}
                    className="flex-1"
                    data-testid="button-save-profile"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateProfileMutation.isPending ? "Đang lưu..." : "Lưu"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancelEdit}
                    className="flex-1"
                    data-testid="button-cancel-profile"
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </Layout>
  );
}
