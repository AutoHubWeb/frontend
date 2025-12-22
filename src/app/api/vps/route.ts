import { NextResponse } from 'next/server';

// Mock VPS data based on the existing mock data structure
const mockVPSData = {
  statusCode: 200,
  data: {
    items: [
      {
        id: "vps-1",
        name: "VN HTTP PRIVATE",
        price: 30000,
        duration: "30 ngày",
        cpu: 1,
        ram: 1,
        disk: 20,
        bandwidth: 1000,
        location: "Vietnam",
        os: "Windows",
        soldQuantity: 99,
        viewCount: 901,
        status: 1,
        createdAt: "2025-10-24T15:56:06.959Z",
        updatedAt: "2025-10-24T15:56:16.712Z"
      },
      {
        id: "vps-2", 
        name: "VPS VN + TOOL NRO",
        price: 90000,
        duration: "30 ngày",
        cpu: 1,
        ram: 1,
        disk: 50,
        bandwidth: 2000,
        location: "Vietnam",
        os: "Windows",
        soldQuantity: 191,
        viewCount: 999,
        status: 1,
        createdAt: "2025-10-23T16:08:38.206Z",
        updatedAt: "2025-10-23T16:08:38.206Z"
      },
      {
        id: "vps-3",
        name: "VPS VN PREMIUM",
        price: 150000,
        duration: "30 ngày",
        cpu: 2,
        ram: 2,
        disk: 100,
        bandwidth: 5000,
        location: "Vietnam",
        os: "Windows",
        soldQuantity: 344,
        viewCount: 456,
        status: 1,
        createdAt: "2025-10-22T14:15:22.123Z",
        updatedAt: "2025-10-22T14:15:22.123Z"
      },
      {
        id: "vps-4",
        name: "VPS CAO CẤP",
        price: 200000,
        duration: "30 ngày",
        cpu: 4,
        ram: 4,
        disk: 200,
        bandwidth: 10000,
        location: "Vietnam",
        os: "Windows",
        soldQuantity: 123,
        viewCount: 456,
        status: 1,
        createdAt: "2025-10-21T12:10:15.456Z",
        updatedAt: "2025-10-21T12:10:15.456Z"
      },
      {
        id: "vps-5",
        name: "VPS CƠ BẢN",
        price: 50000,
        duration: "30 ngày",
        cpu: 1,
        ram: 512,
        disk: 10,
        bandwidth: 500,
        location: "Vietnam",
        os: "Windows",
        soldQuantity: 321,
        viewCount: 654,
        status: 1,
        createdAt: "2025-10-20T10:05:10.789Z",
        updatedAt: "2025-10-20T10:05:10.789Z"
      },
      {
        id: "vps-6",
        name: "VPS TRUNG BÌNH",
        price: 100000,
        duration: "30 ngày",
        cpu: 2,
        ram: 2,
        disk: 50,
        bandwidth: 2000,
        location: "Vietnam",
        os: "Windows",
        soldQuantity: 234,
        viewCount: 567,
        status: 1,
        createdAt: "2025-10-19T08:00:05.123Z",
        updatedAt: "2025-10-19T08:00:05.123Z"
      },
      {
        id: "vps-7",
        name: "VPS CHUYÊN DỤNG",
        price: 250000,
        duration: "30 ngày",
        cpu: 8,
        ram: 8,
        disk: 500,
        bandwidth: 20000,
        location: "Vietnam",
        os: "Windows",
        soldQuantity: 89,
        viewCount: 234,
        status: 1,
        createdAt: "2025-10-18T06:30:00.456Z",
        updatedAt: "2025-10-18T06:30:00.456Z"
      },
      {
        id: "vps-8",
        name: "VPS ĐẶC BIỆT",
        price: 500000,
        duration: "30 ngày",
        cpu: 16,
        ram: 16,
        disk: 1000,
        bandwidth: 50000,
        location: "Vietnam",
        os: "Windows",
        soldQuantity: 45,
        viewCount: 123,
        status: 1,
        createdAt: "2025-10-17T04:15:30.789Z",
        updatedAt: "2025-10-17T04:15:30.789Z"
      },
      {
        id: "vps-9",
        name: "VPS SIÊU CAO CẤP",
        price: 1000000,
        duration: "30 ngày",
        cpu: 32,
        ram: 32,
        disk: 2000,
        bandwidth: 100000,
        location: "Vietnam",
        os: "Windows",
        soldQuantity: 23,
        viewCount: 67,
        status: 1,
        createdAt: "2025-10-16T02:10:15.123Z",
        updatedAt: "2025-10-16T02:10:15.123Z"
      },
      {
        id: "vps-10",
        name: "VPS TIÊU CHUẨN",
        price: 75000,
        duration: "30 ngày",
        cpu: 2,
        ram: 1,
        disk: 30,
        bandwidth: 1000,
        location: "Vietnam",
        os: "Windows",
        soldQuantity: 156,
        viewCount: 345,
        status: 1,
        createdAt: "2025-10-15T00:05:45.456Z",
        updatedAt: "2025-10-15T00:05:45.456Z"
      },
      {
        id: "vps-11",
        name: "VPS NHỎ",
        price: 25000,
        duration: "30 ngày",
        cpu: 1,
        ram: 512,
        disk: 5,
        bandwidth: 250,
        location: "Vietnam",
        os: "Windows",
        soldQuantity: 234,
        viewCount: 567,
        status: 1,
        createdAt: "2025-10-14T22:00:30.789Z",
        updatedAt: "2025-10-14T22:00:30.789Z"
      },
      {
        id: "vps-12",
        name: "VPS LỚN",
        price: 300000,
        duration: "30 ngày",
        cpu: 8,
        ram: 8,
        disk: 500,
        bandwidth: 25000,
        location: "Vietnam",
        os: "Windows",
        soldQuantity: 67,
        viewCount: 189,
        status: 1,
        createdAt: "2025-10-13T20:15:15.123Z",
        updatedAt: "2025-10-13T20:15:15.123Z"
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
    const paginatedItems = mockVPSData.data.items.slice(startIndex, endIndex);
    
    // Update the response with paginated data
    const response = {
      ...mockVPSData,
      data: {
        ...mockVPSData.data,
        items: paginatedItems,
        meta: {
          ...mockVPSData.data.meta,
          page,
          limit,
          totalPages: Math.ceil(mockVPSData.data.meta.total / limit)
        }
      }
    };
    
    // Return the paginated mock data
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch VPS plans',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}