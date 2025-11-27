import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components";
import { 
  Shield, 
  Zap, 
  Users, 
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Shield,
      title: "An toàn & Bảo mật",
      description: "Tất cả công cụ được kiểm duyệt kỹ lưỡng và đảm bảo an toàn"
    },
    {
      icon: Zap,
      title: "Hiệu suất cao",
      description: "Các công cụ được tối ưu hóa để đạt hiệu suất tối đa"
    },
    {
      icon: Users,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giúp bạn mọi lúc"
    }
  ];

  const stats = [
    { value: "1,000+", label: "Người dùng tin tưởng" },
    { value: "50+", label: "Công cụ chất lượng" },
    { value: "99.9%", label: "Uptime đảm bảo" },
    { value: "24/7", label: "Hỗ trợ khách hàng" }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Thị trường{" "}
                <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  công cụ
                </span>
                <br />
                chuyên nghiệp
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Khám phá và mua các công cụ phần mềm chất lượng cao từ các nhà phát triển uy tín. 
                Tất cả đều được kiểm duyệt và đảm bảo an toàn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold"
                  onClick={() => (window.location.href = "https://api.shoptoolnro.com.vn/api/login")}
                  data-testid="button-get-started"
                >
                  Khám phá công cụ
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold"
                  data-testid="button-learn-more"
                >
                  Tìm hiểu thêm
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tại sao chọn SHOPTOOLNRO?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Chúng tôi cam kết mang đến cho bạn những công cụ tốt nhất với chất lượng đảm bảo
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    <CardContent className="p-8 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Sẵn sàng bắt đầu?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Tham gia cùng hàng nghìn người dùng đã tin tưởng SHOPTOOLNRO cho nhu cầu công cụ của họ
              </p>
              <div className="flex items-center justify-center space-x-4 mb-8">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-muted-foreground">Miễn phí tham gia</span>
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-muted-foreground">Hỗ trợ 24/7</span>
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-muted-foreground">Thanh toán an toàn</span>
              </div>
              <Button 
                size="lg"
                className="px-8 py-4 text-lg font-semibold"
                onClick={() => (window.location.href = "https://api.shoptoolnro.com.vn/api/login")}
                data-testid="button-join-now"
              >
                Tham gia ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">TM</span>
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    SHOPTOOLNRO
                  </span>
                </div>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Thị trường công cụ phần mềm hàng đầu Việt Nam. Cung cấp các giải pháp chất lượng cao cho doanh nghiệp và cá nhân.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Sản phẩm</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Công cụ SEO</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Social Media</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Email Marketing</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Automation</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Hỗ trợ</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Trung tâm trợ giúp</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Liên hệ</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Chính sách</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Điều khoản</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2024 SHOPTOOLNRO. Tất cả quyền được bảo lưu.</p>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
