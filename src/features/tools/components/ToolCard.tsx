import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    description: string;
    price: string;
    prices?: Array<{ name: string; duration: string; amount: string }>;
    imageUrl?: string;
    views: number;
    purchases: number;
    [key: string]: any;
  };
  onPurchase?: (toolId: string) => void;
}

export function ToolCard({ tool, onPurchase }: ToolCardProps) {
  const handlePurchase = (e: React.MouseEvent) => {
    e.preventDefault();
    onPurchase?.(tool.id);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 h-[320px] flex flex-col" data-testid={`card-tool-${tool.id}`}>
      {/* Tool Image - Orange Dragon Ball style */}
      <div className="relative bg-gradient-to-br from-orange-400 to-orange-600 h-24 flex items-center justify-center flex-shrink-0">
        <div className="text-center">
          <div className="text-4xl mb-2">🐉</div>
          <div className="text-white font-bold text-xs bg-black/20 px-2 py-1 rounded">NGỌC RỒNG</div>
        </div>
      </div>

      <CardContent className="p-3 flex flex-col flex-grow">
        <div className="flex flex-col h-full">
          {/* Tool Name */}
          <h3 className="font-bold text-sm text-center text-gray-800 dark:text-white mb-2 line-clamp-2 min-h-[2rem]" data-testid={`text-tool-name-${tool.id}`}>
            {tool.name}
          </h3>
          
          {/* Pricing Options */}
          <div className="space-y-1 mb-2 min-h-[3rem]">
            {tool.prices?.map((priceOption, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="text-red-500 font-semibold">
                  {Number(priceOption.amount).toLocaleString('vi-VN')} ₫
                </span>
                <span className="text-red-400 dark:text-red-300">/ {priceOption.name}</span>
              </div>
            ))}
            {!tool.prices && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-red-500 font-semibold">
                  {Number(tool.price).toLocaleString('vi-VN')} ₫
                </span>
                <span className="text-red-400 dark:text-red-300">/ Vĩnh viễn</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-2 min-h-[1rem]">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span data-testid={`text-tool-views-${tool.id}`}>
                Lượt xem: {tool.views?.toLocaleString('vi-VN') || 0}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <ShoppingCart className="w-3 h-3" />
              <span data-testid={`text-tool-purchases-${tool.id}`}>
                Lượt mua: {tool.purchases?.toLocaleString('vi-VN') || 0}
              </span>
            </div>
          </div>
          
          {/* View Details Button */}
          <div className="mt-auto">
            <Link href={`/tools/${tool.id}`}>
              <Button 
                variant="outline"
                className="w-full text-blue-500 dark:text-blue-400 border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 text-xs font-medium focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                data-testid={`button-view-details-${tool.id}`}
              >
                XEM CHI TIẾT
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
