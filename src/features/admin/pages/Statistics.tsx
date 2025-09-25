import { useAuth } from "@/features/auth";
import { Layout } from "@/components";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useEffect } from "react";

export default function Statistics() {
  const { isAuthenticated } = useAuth();

  // Set page title
  useEffect(() => {
    document.title = "Thống kê | TOOL NRO";
  }, []);

  // Mock data for Top Nạp
  const topRechargeUsers = [
    { rank: 1, username: "tung***", amount: "14.465.000" },
    { rank: 2, username: "appu***", amount: "8.575.000" },
    { rank: 3, username: "szhi***", amount: "6.380.000" },
    { rank: 4, username: "tiep***", amount: "6.112.950" },
    { rank: 5, username: "keyf***", amount: "6.000.000" },
    { rank: 6, username: "gian***", amount: "5.834.000" },
    { rank: 7, username: "stya***", amount: "5.349.000" },
    { rank: 8, username: "minh***", amount: "4.290.000" },
    { rank: 9, username: "taip***", amount: "3.901.000" },
    { rank: 10, username: "Duck***", amount: "3.600.000" },
  ];

  // Mock data for Lịch Sử Giao Dịch
  const transactionHistory = [
    { username: "buia***", product: "MUA (Tool Up Capsule Kỉ B)", time: "2025-09-19 12:40:11" },
    { username: "gian***", product: "MUA (Auto Bán Đồ Kho Báu)", time: "2025-09-18 19:41:34" },
    { username: "Nguy***", product: "MUA (Nhặt Thưởng Ngọc Rồng Đen)", time: "2025-09-17 20:56:32" },
    { username: "bach***", product: "MUA (Tự Động Đánh Quái)", time: "2025-09-17 12:50:43" },
    { username: "hibo***", product: "MUA (Tool Up Capsule Kỉ B)", time: "2025-09-17 12:21:59" },
    { username: "minh***", product: "MUA (Bot Bán Item)", time: "2025-09-17 07:00:53" },
    { username: "cayz***", product: "MUA (Tool Auto Up Đệ Ver1)", time: "2025-09-16 23:27:24" },
    { username: "0337***", product: "MUA (Nhặt Thưởng Ngọc Rồng Đen)", time: "2025-09-16 18:51:49" },
    { username: "ninh***", product: "MUA (Tự Động Đánh Quái)", time: "2025-09-15 17:00:53" },
    { username: "that***", product: "MUA (Tự Động Đánh Quái)", time: "2025-09-15 10:51:47" },
  ];

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Vui lòng đăng nhập</h2>
              <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem thống kê</p>
              <Link href="/login">
                <Button className="w-full">Đăng nhập</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">THỐNG KÊ</h1>
            <div className="w-16 h-1 bg-green-500 mx-auto"></div>
          </div>

          {/* Statistics Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Nạp */}
            <Card className="shadow-lg">
              <CardHeader className="bg-blue-500 text-white text-center py-3">
                <h2 className="text-lg font-bold">TOP NẠP</h2>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {topRechargeUsers.map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      data-testid={`top-user-${user.rank}`}
                    >
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={user.rank <= 3 ? "destructive" : "secondary"}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        >
                          {user.rank}
                        </Badge>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {user.username}
                        </span>
                      </div>
                      <span className="bg-green-500 text-white px-3 py-1 rounded text-sm font-bold">
                        {user.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lịch Sử Giao Dịch */}
            <Card className="shadow-lg">
              <CardHeader className="bg-blue-500 text-white text-center py-3">
                <h2 className="text-lg font-bold">LỊCH SỬ GIAO DỊCH</h2>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {transactionHistory.map((transaction, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      data-testid={`transaction-${index}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-red-500 font-bold text-sm">
                              {transaction.username}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {transaction.product}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-500 text-xs">
                            {transaction.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}