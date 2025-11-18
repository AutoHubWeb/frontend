import { FaFacebook, FaTelegram, FaPhone } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">SHOPTOOLNRO</h3>
            <p className="text-gray-300 mb-2">Hệ thống bán tools, vps, proxy giá rẻ</p>
            <p className="text-gray-300">Đảm bảo uy tín và chất lượng</p>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">VỀ CHÚNG TÔI</h3>
            <p className="text-gray-300 mb-2">Chúng tôi làm việc một cách chuyên nghiệp</p>
            <p className="text-gray-300 mb-2">uy tín, nhanh chóng</p>
            <p className="text-gray-300 mb-4">luôn đặt quyền lợi của bạn lên hàng đầu</p>
            
            {/* Contact Information */}
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <FaPhone className="text-blue-500 mr-2" />
                <span>Zalo: 0877655624</span>
              </div>
              <div className="flex items-center mb-2">
                <FaTelegram className="text-blue-400 mr-2" />
                <a 
                  href="https://t.me/shoptooltienthanh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-white transition-colors"
                >
                  Telegram: @shoptooltienthanh
                </a>
              </div>
              <div className="flex items-center">
                <FaFacebook className="text-blue-600 mr-2" />
                <a 
                  href="https://www.facebook.com/tiienthanhne" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm italic">
            Copyright © 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
