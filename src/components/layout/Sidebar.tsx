'use client'

import Link from "next/link"
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ShoppingBag,
  CreditCard,
  History,
  Users,
  Settings,
  PlusCircle,
  User2,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const navigation = [
    {
      name: "Thông tin cá nhân",
      href: "/profile",
      icon: User2,
    },
    {
      name: "Công cụ đã mua",
      href: "/purchased-tools",
      icon: ShoppingBag,
    },
    {
      name: "Nạp tiền",
      href: "/deposit",
      icon: CreditCard,
    },
    {
      name: "Lịch sử",
      href: "/history",
      icon: History,
    },
  ];

  const adminNavigation = user?.isAdmin
    ? [
        {
          name: "Admin Panel",
          href: "/admin",
          icon: Settings,
        },
        {
          name: "Quản lý người dùng",
          href: "/admin/users",
          icon: Users,
        },
        {
          name: "Thêm công cụ",
          href: "/admin/tools/new",
          icon: PlusCircle,
        },
      ]
    : [];

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border overflow-hidden">
      {/* User Info */}
      <div className="flex items-center space-x-3 p-6 border-b border-border">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user?.profileImageUrl} alt="" />
          <AvatarFallback className="text-lg font-medium">
            {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0"> {/* Added min-w-0 to allow text truncation */}
          <p 
            className="font-semibold text-base truncate" 
            data-testid="text-user-name"
            title={user?.fullname
              ? `${user.fullname}`
              : user?.email || "User"}
          >
            {user?.fullname 
              ? `${user.fullname}`
              : user?.email || "User"}
          </p>
          <p className="text-sm text-muted-foreground truncate" title={user?.email}>
            {user?.email ? (
              <span className="truncate">{user.email}</span>
            ) : user?.role === 1 ? "Quản trị viên" : "Thành viên"}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
            data-testid={`link-sidebar-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">{item.name}</span>
          </Link>
        ))}

        {/* Logout Button - placed right after History */}
        <Button
          variant="ghost"
          className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium w-full justify-start hover:bg-accent hover:text-accent-foreground"
          onClick={handleLogout}
          data-testid="button-sidebar-logout"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Đăng xuất</span>
        </Button>

        {/* Admin Section */}
        {adminNavigation.length > 0 && (
          <>
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Quản trị
              </div>
            </div>
            {adminNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
                data-testid={`link-sidebar-admin-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            ))}
          </>
        )}
      </nav>
    </div>
  );
}
