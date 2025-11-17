'use client'

import { useState, useEffect } from "react"
import { usePageReload } from "@/hooks/usePageReload"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  X, 
  Megaphone, 
  ShieldAlert, 
  Users, 
  MessageSquare, 
  Sparkles,
  Star,
  Zap,
  Crown
} from "lucide-react";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const isReload = usePageReload();

  useEffect(() => {
    // Reset session flag when component mounts (new page load)
    sessionStorage.removeItem('welcome-modal-shown-session');
    
    // Only show modal on reload
    if (isReload) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Mark as shown in this session to prevent multiple displays
        sessionStorage.setItem('welcome-modal-shown-session', 'true');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isReload]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-md w-full rounded-2xl p-0 overflow-hidden shadow-xl border-0 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-red-900/20 animate-in zoom-in-95 duration-500 [&>button]:hidden backdrop-blur-sm" 
        data-testid="modal-welcome"
      >
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-pink-400 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-12 left-8 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-20 right-12 w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-700"></div>
        </div>

        {/* Premium Close Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:from-red-600 hover:to-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-all duration-300 z-50 group"
              data-testid="button-close-modal"
              aria-label="Đóng thông báo"
            >
              <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Đóng thông báo</p>
          </TooltipContent>
        </Tooltip>

        {/* Stunning Header with animated gradient */}
        <DialogHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white p-4 relative overflow-hidden">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 via-pink-600/80 to-red-600/80 animate-pulse"></div>
          
          {/* Sparkle effects */}
          <div className="absolute top-2 left-4">
            <Sparkles className="h-4 w-4 text-yellow-300 animate-spin" />
          </div>
          <div className="absolute top-4 right-6">
            <Star className="h-3 w-3 text-yellow-200 animate-pulse" />
          </div>
          <div className="absolute bottom-2 left-8">
            <Zap className="h-3 w-3 text-yellow-400 animate-bounce" />
          </div>
          
          <DialogTitle className="text-center text-2xl font-bold tracking-tight flex items-center justify-center gap-3 relative z-10">
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
              <Megaphone className="h-6 w-6 animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
              THÔNG BÁO ĐẶC BIỆT
            </span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Thông báo chào mừng về shop tool/VPS ngọc rồng online
          </DialogDescription>
        </DialogHeader>

        {/* Enhanced Content */}
        <div className="p-4 space-y-3 relative" id="welcome-modal-description">
          {/* Premium Title Section */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              SHOP TOOL/VPS NGỌC RỒNG ONLINE
            </h2>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 text-xs font-semibold">
              <Crown className="h-3 w-3 mr-1" />
              SHOPTOOLNRO
            </Badge>
          </div>

          {/* Description */}
          <div className="bg-gradient-to-br from-white/80 to-purple-50/80 dark:from-gray-800/80 dark:to-purple-900/40 rounded-lg p-3">
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
              🚀 Shop đã tích hợp <span className="font-bold text-purple-600">nạp tự động 24/7</span>
            </p>
          </div>

          {/* License Info */}
          <Alert className="border-0 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30">
            <ShieldAlert className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-300 text-sm">
              ⚡ Đổi license <Badge className="mx-1 bg-green-500 text-white px-2 py-0.5 text-xs">không giới hạn</Badge>
            </AlertDescription>
          </Alert>

          {/* Action Links */}
          <div className="grid gap-2">
            <Button
              size="sm"
              className="justify-center gap-2 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              onClick={() => window.open('https://zalo.me/0877655624', '_blank', 'noopener,noreferrer')}
              data-testid="link-group-chat"
            >
              <Users className="h-4 w-4" />
              GROUP GIAO LƯU
            </Button>
            
            <Button
              size="sm"
              className="justify-center gap-2 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              onClick={() => window.open('https://zalo.me/0877655624', '_blank', 'noopener,noreferrer')}
              data-testid="link-zalo-chat"
            >
              <MessageSquare className="h-4 w-4" />
              ZALO CSKH 0877655624
            </Button>
          </div>

          {/* Close Button */}
          <Button 
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-bold py-3"
            data-testid="button-close-welcome"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Đã hiểu rồi!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
