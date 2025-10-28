'use client'

import Link from "next/link"
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/app/providers";
import { useAuth, useLogout } from "@/features/auth";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, Menu, User, Send, Wrench, Server, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "./Sidebar";

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "Đăng xuất thành công",
          description: "Hẹn gặp lại bạn!",
        });
        // Redirect to home page after logout
        window.location.href = "/";
      },
      onError: (error) => {
        console.error("Logout error:", error);
        toast({
          title: "Lỗi đăng xuất",
          description: "Có lỗi xảy ra khi đăng xuất",
          variant: "destructive",
        });
      }
    });
  };

  const navigation = [
    { name: "Trang chủ", href: "/" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2" data-testid="link-logo">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">TM</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent hidden sm:block">
                ToolMarket
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Center (hidden on mobile) */}
          <nav className="hidden md:flex items-center justify-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                data-testid={`link-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions - Right */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              data-testid="button-theme-toggle"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Mobile Menu Button (always visible for authenticated users) */}
            {isAuthenticated && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden" data-testid="button-mobile-menu">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <Sidebar />
                </SheetContent>
              </Sheet>
            )}

            {/* Auth Buttons or User Menu */}
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:inline-flex"
                    data-testid="button-login"
                  >
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="hidden sm:inline-flex"
                    data-testid="button-register"
                  >
                    Đăng ký
                  </Button>
                </Link>
                {/* Mobile auth buttons as icons only */}
                <div className="sm:hidden flex items-center space-x-1">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-2"
                      data-testid="button-login-mobile"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="button-user-menu">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={(user as any)?.profileImageUrl} alt="" />
                        <AvatarFallback className="text-xs">
                          {(user as any)?.firstName?.[0]?.toUpperCase() || (user as any)?.email?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium">{(user as any)?.firstName} {(user as any)?.lastName}</p>
                      <p className="text-xs text-muted-foreground">{(user as any)?.email}</p>
                      {(user as any)?.isAdmin && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Thông tin tài khoản</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/deposit" className="flex items-center">
                        <Send className="mr-2 h-4 w-4 text-pink-500" />
                        <span>Chuyển Tiền</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/purchased-tools" className="flex items-center">
                        <Wrench className="mr-2 h-4 w-4 text-orange-500" />
                        <span>Quản Lý Tool</span>
                      </Link>
                    </DropdownMenuItem>
                    {(user as any)?.isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center">
                          <Server className="mr-2 h-4 w-4 text-purple-500" />
                          <span>Quản Lý VPS</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      data-testid="button-logout"
                      className="flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4 text-red-500" />
                      <span>Đăng Xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}