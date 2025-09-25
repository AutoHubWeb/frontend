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
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

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
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      {/* User Info */}
      <div className="flex items-center space-x-3 p-6 border-b border-border">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.profileImageUrl} alt="" />
          <AvatarFallback>
            {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm" data-testid="text-user-name">
            {user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user?.email || "User"}
          </p>
          <p className="text-xs text-muted-foreground">
            {user?.isAdmin ? "Quản trị viên" : "Thành viên"}
          </p>
          <p className="text-xs font-medium text-emerald-600" data-testid="text-user-balance">
            Số dư: {Number(user?.balance || 0).toLocaleString('vi-VN')}₫
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
            data-testid={`link-sidebar-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}

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
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
                data-testid={`link-sidebar-admin-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </>
        )}
      </nav>
    </div>
  );
}
