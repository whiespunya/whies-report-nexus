
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Layout/Sidebar";
import Header from "@/components/Layout/Header";
import { cn } from "@/lib/utils";

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          isCollapsed ? "ml-0 md:ml-16" : "ml-0 md:ml-64"
        )}
      >
        <Header />
        <main className="p-4 md:p-6 flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
