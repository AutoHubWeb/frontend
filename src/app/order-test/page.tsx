'use client'

import { useState } from "react";
import { Layout } from "@/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateOrder } from "@/lib/api/hooks/useOrders";
import { useToast } from "@/hooks/use-toast";

export default function OrderTestPage() {
  const { toast } = useToast();
  const [toolId, setToolId] = useState("68fb9ff0fc48161fbb262c03");
  const [duration, setDuration] = useState("3");
  
  const createOrderMutation = useCreateOrder({
    onSuccess: (data) => {
      toast({
        title: "Đặt hàng thành công",
        description: `Mã đơn hàng: ${data.code}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi đặt hàng",
        description: error.message || "Không thể tạo đơn hàng",
        variant: "destructive",
      });
      console.error("Order error:", error);
    },
  });

  const handleCreateOrder = () => {
    createOrderMutation.mutate({
      type: "tool",
      toolId: toolId,
      duration: parseInt(duration),
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Test Đặt hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="toolId">Tool ID</Label>
              <Input
                id="toolId"
                value={toolId}
                onChange={(e) => setToolId(e.target.value)}
                placeholder="Nhập Tool ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="1">1 tháng</option>
                <option value="2">3 tháng</option>
                <option value="3">Vĩnh viễn</option>
              </select>
            </div>
            
            <Button 
              onClick={handleCreateOrder} 
              disabled={createOrderMutation.isPending}
              className="w-full"
            >
              {createOrderMutation.isPending ? "Đang xử lý..." : "Tạo đơn hàng"}
            </Button>
            
            {createOrderMutation.data && (
              <div className="mt-4 p-4 bg-green-100 rounded">
                <h3 className="font-bold">Kết quả:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(createOrderMutation.data, null, 2)}
                </pre>
              </div>
            )}
            
            {createOrderMutation.error && (
              <div className="mt-4 p-4 bg-red-100 rounded">
                <h3 className="font-bold">Lỗi:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(createOrderMutation.error, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
