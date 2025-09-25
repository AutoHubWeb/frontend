// Mock data for tools and categories
// Using placeholder image URL instead of imported asset to avoid module resolution issues
const proxyLogo = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200";
export const mockCategories = [
  {
    id: "1",
    name: "Công cụ SEO",
    slug: "seo-tools",
    createdAt: new Date(),
  },
  {
    id: "2", 
    name: "Marketing",
    slug: "marketing",
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Thiết kế",
    slug: "design", 
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "Phân tích dữ liệu",
    slug: "analytics",
    createdAt: new Date(),
  },
  {
    id: "5",
    name: "PROXY VIỆT",
    slug: "proxy-viet",
    createdAt: new Date(),
  }
];

export const mockTools = [
  {
    id: "1",
    name: "NHẶT NGỌC HÀNG NGÀY",
    description: "Công cụ tự động nhặt ngọc hàng ngày trong game",
    price: "299000",
    prices: [
      { duration: "7 ngày", amount: "15000" },
      { duration: "30 ngày", amount: "50000" }, 
      { duration: "Vĩnh viễn", amount: "250000" }
    ],
    categoryId: "1",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    videoUrl: null,
    instructions: null,
    downloadUrl: "https://example.com/download/nhat-ngoc",
    views: 3005,
    purchases: 233,
    rating: "4.8",
    reviewCount: 89,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[0]
  },
  {
    id: "2", 
    name: "NHẬN THƯỞNG NGỌC RỒNG ĐEN",
    description: "Tự động nhận thưởng ngọc rồng đen",
    price: "199000",
    prices: [
      { duration: "7 ngày", amount: "15000" },
      { duration: "30 ngày", amount: "50000" },
      { duration: "Vĩnh viễn", amount: "200000" }
    ],
    categoryId: "2", 
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    videoUrl: null,
    instructions: null,
    downloadUrl: "https://example.com/download/nhan-thuong",
    views: 3010,
    purchases: 724,
    rating: "4.6", 
    reviewCount: 42,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[1]
  },
  {
    id: "3",
    name: "BOT BÁN ITEM", 
    description: "Tự động bán item trong game",
    price: "399000",
    prices: [
      { duration: "7 ngày", amount: "15000" },
      { duration: "30 ngày", amount: "50000" },
      { duration: "Vĩnh viễn", amount: "300000" }
    ],
    categoryId: "3",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    videoUrl: null,
    instructions: null, 
    downloadUrl: "https://example.com/download/bot-ban-item",
    views: 7267,
    purchases: 354,
    rating: "4.9",
    reviewCount: 156,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[2]
  },
  {
    id: "4",
    name: "AUTO BÁN ĐỒ KHO BẢU",
    description: "Tự động bán đồ kho báu trong game",
    price: "599000", 
    prices: [
      { duration: "7 ngày", amount: "35000" },
      { duration: "30 ngày", amount: "100000" },
      { duration: "Vĩnh viễn", amount: "500000" }
    ],
    categoryId: "4",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    videoUrl: null,
    instructions: null,
    downloadUrl: "https://example.com/download/auto-ban-do",
    views: 12063,
    purchases: 608,
    rating: "4.7",
    reviewCount: 38,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[3]
  },
  {
    id: "5",
    name: "TỰ ĐỘNG ĐÁNH QUÁI",
    description: "Tool tự động đánh quái và train level",
    price: "450000",
    prices: [
      { duration: "7 ngày", amount: "35000" },
      { duration: "30 ngày", amount: "100000" },
      { duration: "Vĩnh viễn", amount: "600000" }
    ],
    categoryId: "2",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    videoUrl: null,
    instructions: null,
    downloadUrl: "https://example.com/download/auto-danh-quai",
    views: 8543,
    purchases: 421,
    rating: "4.5",
    reviewCount: 73,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[1]
  },
  {
    id: "6", 
    name: "TOOL UP ĐỂ VERT",
    description: "Tool tự động up để vert trong game",
    price: "349000",
    prices: [
      { duration: "7 ngày", amount: "15000" },
      { duration: "30 ngày", amount: "40000" },
      { duration: "Vĩnh viễn", amount: "250000" }
    ],
    categoryId: "2",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    videoUrl: null,
    instructions: null,
    downloadUrl: "https://example.com/download/tool-up-vert",
    views: 5621,
    purchases: 298,
    rating: "4.4",
    reviewCount: 56,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[1]
  },
  {
    id: "7",
    name: "TOOL AUTO UP ĐỂ VERT",
    description: "Phiên bản nâng cao của tool up để vert", 
    price: "499000",
    prices: [
      { duration: "7 ngày", amount: "35000" },
      { duration: "30 ngày", amount: "100000" },
      { duration: "Vĩnh viễn", amount: "600000" }
    ],
    categoryId: "2",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    videoUrl: null,
    instructions: null,
    downloadUrl: "https://example.com/download/tool-auto-up-vert",
    views: 4532,
    purchases: 187,
    rating: "4.6",
    reviewCount: 34,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[1]
  },
  {
    id: "8",
    name: "TOOL UP CAPSULE XI BỊ",
    description: "Tool tự động up capsule xi bị",
    price: "399000",
    prices: [
      { duration: "7 ngày", amount: "35000" },
      { duration: "30 ngày", amount: "100000" },
      { duration: "Vĩnh viễn", amount: "600000" }
    ],
    categoryId: "3",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    videoUrl: null,
    instructions: null,
    downloadUrl: "https://example.com/download/tool-capsule",
    views: 3245,
    purchases: 156,
    rating: "4.3",
    reviewCount: 28,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[2]
  },
  {
    id: "9",
    name: "PROXY VIỆT NAM",
    description: "Proxy Việt Nam chất lượng cao, tốc độ nhanh, ổn định cho mọi nhu cầu",
    price: "50000", // Base price per month
    baseMonthlyPrice: "50000", // 50k per month
    categoryId: "5",
    imageUrl: proxyLogo,
    videoUrl: null,
    instructions: "Hướng dẫn sử dụng proxy:\n1. Sao chép IP và port\n2. Nhập vào trình duyệt hoặc ứng dụng\n3. Sử dụng username/password được cung cấp",
    downloadUrl: "https://example.com/download/proxy-vn",
    views: 2845,
    purchases: 456,
    rating: "4.8",
    reviewCount: 123,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[4]
  }
];

// Mock user data
export const mockUser = {
  id: "user-1",
  email: "demo@example.com", 
  firstName: "Demo",
  lastName: "User",
  profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  balance: "1000000", // 1,000,000 VND
  isAdmin: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockAdminUser = {
  id: "admin-1", 
  email: "admin@example.com",
  firstName: "Admin",
  lastName: "User",
  profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150", 
  balance: "5000000", // 5,000,000 VND
  isAdmin: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock payments data for history
export const mockPayments = [
  {
    id: "payment-1",
    userId: "user-1",
    type: "deposit",
    amount: "500000",
    status: "completed",
    description: "Nạp tiền vào tài khoản",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: "payment-2", 
    userId: "user-1",
    type: "purchase",
    amount: "-15000",
    status: "completed",
    description: "Mua NHẶT NGỌC HÀNG NGÀY (7 ngày)",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: "payment-3",
    userId: "user-1", 
    type: "purchase",
    amount: "-50000",
    status: "completed",
    description: "Mua BOT BÁN ITEM (30 ngày)",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    id: "payment-4",
    userId: "user-1",
    type: "deposit", 
    amount: "1000000",
    status: "pending",
    description: "Nạp tiền qua chuyển khoản",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  }
];

// Mock purchases data for history
export const mockPurchases = [
  {
    id: "purchase-1",
    userId: "user-1",
    toolId: "1",
    finalPrice: "15000",
    duration: "7 days",
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // expires in 5 days
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    tool: mockTools[0] // NHẶT NGỌC HÀNG NGÀY
  },
  {
    id: "purchase-2",
    userId: "user-1", 
    toolId: "3",
    finalPrice: "50000",
    duration: "30 days",
    expiresAt: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000), // expires in 24 days
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    tool: mockTools[2] // BOT BÁN ITEM
  }
];

// Mock VPS data
export const mockVPS = [
  {
    id: "vps-1",
    name: "VN HTTP PRIVATE",
    price: "30000",
    duration: "30 ngày",
    specs: {
      cores: "1 CORE",
      ram: "1 GB",
      feature: "IP ZALO 0766702003"
    },
    availability: {
      inStock: 901,
      purchased: 99
    },
    isActive: true
  },
  {
    id: "vps-2", 
    name: "VPS VN + TOOL NRO",
    price: "90000",
    duration: "30 ngày",
    specs: {
      cores: "1 CORE", 
      ram: "1 GB",
      feature: "VPS chuyên game NRO"
    },
    availability: {
      inStock: 999,
      purchased: 191
    },
    isActive: true
  },
  {
    id: "vps-3",
    name: "VPS VN PREMIUM",
    price: "150000",
    duration: "30 ngày",
    specs: {
      cores: "2 CORE",
      ram: "2 GB",
      feature: "VPS cao cấp hiệu năng tốt"
    },
    availability: {
      inStock: 456,
      purchased: 344
    },
    isActive: true
  }
];

// Default credentials
export const defaultCredentials = {
  user: {
    username: "demo",
    password: "demo123"
  },
  admin: {
    username: "admin", 
    password: "admin123"
  }
};