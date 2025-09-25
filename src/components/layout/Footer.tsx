import { FaFacebook, FaTelegram, FaPhone } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">LINHCONG.NET</h3>
            <p className="text-gray-300 mb-2">Hệ thống ban tool - vps - captcha giá rẻ</p>
            <p className="text-gray-300">Đảm bảo uy tín và chất lượng</p>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">VỀ CHÚNG TÔI</h3>
            <p className="text-gray-300 mb-2">Chúng tôi làm việc một cách chuyên nghiệp</p>
            <p className="text-gray-300 mb-2">uy tín, nhanh chóng</p>
            <p className="text-gray-300 mb-4">luôn đặt quyền lợi của bạn lên hàng đầu</p>
            
            {/* Contact Buttons */}
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => window.open('https://zalo.me/linhcong', '_blank')}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full text-lg transition-colors"
                title="Liên hệ Zalo"
              >
                <FaPhone />
              </button>
              <button
                onClick={() => window.open('https://t.me/linhcong', '_blank')}
                className="bg-blue-400 hover:bg-blue-500 text-white p-3 rounded-full text-lg transition-colors"
                title="Liên hệ Telegram"
              >
                <FaTelegram />
              </button>
              <button
                onClick={() => window.open('https://facebook.com/linhcong', '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full text-lg transition-colors"
                title="Liên hệ Facebook"
              >
                <FaFacebook />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm italic">
            Copyright © 2022 CAPTCHA - DEV BY Mr.DUNG
          </p>
        </div>
      </div>
    </footer>
  );
}