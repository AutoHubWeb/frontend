import { useAuth } from "@/features/auth";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = false }: LayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1">
        {isAuthenticated && showSidebar && (
          <div className="hidden lg:flex lg:flex-shrink-0">
            <Sidebar />
          </div>
        )}
        <main className="flex-1">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
