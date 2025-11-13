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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20"> {/* Increased from h-16 to h-20 */}
          {/* Logo - Left */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3" data-testid="link-logo">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">TM</span>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent hidden sm:block">
                ToolMarket
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Center (hidden on mobile) */}
          <nav className="hidden md:flex items-center justify-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-lg font-semibold transition-all duration-200 hover:text-primary hover:scale-105 ${
                  pathname === item.href
                    ? "text-primary text-xl"
                    : "text-muted-foreground"
                }`}
                data-testid={`link-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions - Right */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="default"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              data-testid="button-theme-toggle"
              className="rounded-full hover:bg-accent"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Mobile Menu and Profile Handling */}
            {!isAuthenticated ? (
              // Not authenticated - show login/register buttons
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="default"
                    className="hidden sm:inline-flex text-base font-medium rounded-full hover:bg-accent"
                    data-testid="button-login"
                  >
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="default"
                    className="hidden sm:inline-flex text-base font-medium rounded-full px-6"
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
                      size="default"
                      className="px-3 rounded-full hover:bg-accent"
                      data-testid="button-login-mobile"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              // Authenticated - show menu and profile appropriately
              <>
                {/* Mobile Menu Button - only shown on mobile */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="default" 
                      className="md:hidden rounded-full hover:bg-accent" 
                      data-testid="button-mobile-menu"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 p-0">
                    <Sidebar />
                  </SheetContent>
                </Sheet>
                
                {/* Profile Menu - shown on desktop, and as icon on mobile */}
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-accent" data-testid="button-user-menu">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={(user as any)?.profileImageUrl} alt="" />
                          <AvatarFallback className="text-sm font-medium">
                            {(user as any)?.firstName?.[0]?.toUpperCase() || (user as any)?.email?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="end" forceMount>
                      <div className="flex flex-col space-y-2 p-3">
                        <p className="text-base font-semibold">{(user as any)?.firstName} {(user as any)?.lastName}</p>
                        <p className="text-sm text-muted-foreground">{(user as any)?.email}</p>
                        {(user as any)?.isAdmin && (
                          <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full w-fit">
                            Admin
                          </span>
                        )}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center py-2">
                          <User className="mr-3 h-5 w-5 text-blue-500" />
                          <span className="text-base">Thông tin tài khoản</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/deposit" className="flex items-center py-2">
                          <Send className="mr-3 h-5 w-5 text-pink-500" />
                          <span className="text-base">Chuyển Tiền</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/purchased-tools" className="flex items-center py-2">
                          <Wrench className="mr-3 h-5 w-5 text-orange-500" />
                          <span className="text-base">Quản Lý Công Cụ</span>
                        </Link>
                      </DropdownMenuItem>
                      {(user as any)?.isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center py-2">
                            <Server className="mr-3 h-5 w-5 text-purple-500" />
                            <span className="text-base">Quản Lý VPS</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        data-testid="button-logout"
                        className="flex items-center py-2"
                      >
                        <LogOut className="mr-3 h-5 w-5 text-red-500" />
                        <span className="text-base">Đăng Xuất</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
