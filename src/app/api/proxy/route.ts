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
      },
      {
        id: "proxy-3",
        name: "Proxy Mobifone xoay",
        createdAt: "2025-10-22T14:05:30.123Z",
        updatedAt: "2025-10-22T14:05:30.123Z",
        description: "Proxy dân cư xoay tốc độ cao",
        soldQuantity: 5,
        viewCount: 10,
        status: 1,
        inventory: 45,
        price: 11000000
      },
      {
        id: "proxy-4",
        name: "Proxy Vietnamnet tĩnh",
        createdAt: "2025-10-21T12:00:45.456Z",
        updatedAt: "2025-10-21T12:00:45.456Z",
        description: "Proxy tĩnh tốc độ ổn định",
        soldQuantity: 12,
        viewCount: 25,
        status: 1,
        inventory: 67,
        price: 15000000
      },
      {
        id: "proxy-5",
        name: "Proxy cáp quang",
        createdAt: "2025-10-20T10:30:15.789Z",
        updatedAt: "2025-10-20T10:30:15.789Z",
        description: "Proxy cáp quang tốc độ siêu cao",
        soldQuantity: 8,
        viewCount: 18,
        status: 1,
        inventory: 34,
        price: 20000000
      },
      {
        id: "proxy-6",
        name: "Proxy quốc tế",
        createdAt: "2025-10-19T08:15:30.123Z",
        updatedAt: "2025-10-19T08:15:30.123Z",
        description: "Proxy quốc tế đa quốc gia",
        soldQuantity: 15,
        viewCount: 32,
        status: 1,
        inventory: 23,
        price: 25000000
      },
      {
        id: "proxy-7",
        name: "Proxy datacenter",
        createdAt: "2025-10-18T06:45:20.456Z",
        updatedAt: "2025-10-18T06:45:20.456Z",
        description: "Proxy datacenter hiệu suất cao",
        soldQuantity: 20,
        viewCount: 40,
        status: 1,
        inventory: 12,
        price: 30000000
      },
      {
        id: "proxy-8",
        name: "Proxy residential",
        createdAt: "2025-10-17T04:20:10.789Z",
        updatedAt: "2025-10-17T04:20:10.789Z",
        description: "Proxy residential địa phương",
        soldQuantity: 25,
        viewCount: 50,
        status: 1,
        inventory: 8,
        price: 35000000
      },
      {
        id: "proxy-9",
        name: "Proxy mobile",
        createdAt: "2025-10-16T02:10:05.123Z",
        updatedAt: "2025-10-16T02:10:05.123Z",
        description: "Proxy mobile thiết bị di động",
        soldQuantity: 30,
        viewCount: 60,
        status: 1,
        inventory: 5,
        price: 40000000
      },
      {
        id: "proxy-10",
        name: "Proxy ISP",
        createdAt: "2025-10-15T00:05:55.456Z",
        updatedAt: "2025-10-15T00:05:55.456Z",
        description: "Proxy ISP nhà cung cấp internet",
        soldQuantity: 35,
        viewCount: 70,
        status: 1,
        inventory: 3,
        price: 45000000
      },
      {
        id: "proxy-11",
        name: "Proxy 4G",
        createdAt: "2025-10-14T22:00:40.789Z",
        updatedAt: "2025-10-14T22:00:40.789Z",
        description: "Proxy 4G tốc độ cao",
        soldQuantity: 40,
        viewCount: 80,
        status: 1,
        inventory: 2,
        price: 50000000
      },
      {
        id: "proxy-12",
        name: "Proxy 5G",
        createdAt: "2025-10-13T20:15:25.123Z",
        updatedAt: "2025-10-13T20:15:25.123Z",
        description: "Proxy 5G thế hệ mới",
        soldQuantity: 45,
        viewCount: 90,
        status: 1,
        inventory: 1,
        price: 55000000
      }
    ],
    meta: {
      total: 12,
      page: 1,
      limit: 10
    }
  },
  message: "Thành công"
};

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Paginate the data
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = mockProxyData.data.items.slice(startIndex, endIndex);
    
    // Update the response with paginated data
    const response = {
      ...mockProxyData,
      data: {
        ...mockProxyData.data,
        items: paginatedItems,
        meta: {
          ...mockProxyData.data.meta,
          page,
          limit,
          totalPages: Math.ceil(mockProxyData.data.meta.total / limit)
        }
      }
    };
    
    // Return the paginated mock data
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch proxies',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
