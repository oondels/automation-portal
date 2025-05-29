import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export function MainLayout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isMobile={isMobile} />

      <main className={`flex-1 transition-all ${isMobile ? "ml-0" : "ml-[80px]"} p-4 md:p-6`}>
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
      
      <Toaster position="top-right" richColors />
    </div>
  );
}