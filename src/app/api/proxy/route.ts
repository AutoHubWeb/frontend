import { NextResponse } from 'next/server';

// Mock proxy data based on the API response you provided
const mockProxyData = {
  statusCode: 200,
  data: {
    items: [
      {
        id: "68fba196011ddceccd541f9d",
        name: "Proxy Viettel xoay",
        createdAt: "2025-10-24T15:56:06.959Z",
        updatedAt: "2025-10-24T15:56:16.712Z",
        description: "Proxy dân cư xoay tốc độ cực nhanh",
        soldQuantity: 0,
        viewCount: 0,
        status: 1,
        inventory: 123,
        price: 10000000
      },
      {
        id: "68fa53064dcb8b184d5cd7fa",
        name: "Proxy Vinaphone xoay",
        createdAt: "2025-10-23T16:08:38.206Z",
        updatedAt: "2025-10-23T16:08:38.206Z",
        description: "Proxy dân cư xoay tốc độ cực nhanh",
        soldQuantity: 0,
        viewCount: 0,
        status: 1,
        inventory: 89,
        price: 12000000
      }
    ],
    meta: {
      total: 2,
      page: 1
    }
  },
  message: "Thành công"
};

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json(mockProxyData);
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch proxies',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
