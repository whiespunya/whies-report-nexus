
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/utils/routes";
import { useAppContext } from "@/contexts/AppContext";
import {
  LayoutDashboard,
  ClipboardList,
  User,
  LogOut,
  ClipboardPlus,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TechnicianSidebar = () => {
  const location = useLocation();
  const { logout } = useAppContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileMenu = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const technicianLinks = [
    {
      name: "Dashboard",
      path: ROUTES.TECHNICIAN_DASHBOARD,
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Submit Report",
      path: ROUTES.TECHNICIAN_SUBMIT_REPORT,
      icon: <ClipboardPlus className="h-5 w-5" />,
    },
    {
      name: "My Reports",
      path: ROUTES.TECHNICIAN_REPORTS,
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      name: "Profile",
      path: ROUTES.TECHNICIAN_PROFILE,
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="md:hidden fixed z-50 top-4 left-4 bg-white shadow-md"
      >
        {isMobileOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col h-screen fixed top-0 left-0 z-40 transition-all duration-300",
          isCollapsed && !isMobileOpen ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div
            className={cn(
              "flex items-center overflow-hidden",
              isCollapsed && "justify-center"
            )}
          >
            {!isCollapsed ? (
              <h1 className="text-lg font-semibold text-whies-800 truncate">
                Whies Industri
              </h1>
            ) : (
              <span className="text-xl font-bold text-whies-800">WI</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="hidden md:flex"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto py-4">
          <nav className="flex-1">
            <ul className="space-y-1 px-2">
              {technicianLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={closeMobileMenu}
                    className={cn(
                      "flex items-center rounded-md py-2 px-3 text-sm font-medium transition-colors",
                      location.pathname === link.path
                        ? "bg-whies-100 text-whies-800"
                        : "text-gray-600 hover:bg-whies-50 hover:text-whies-800",
                      isCollapsed && "justify-center px-2"
                    )}
                  >
                    {link.icon}
                    {!isCollapsed && <span className="ml-3">{link.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto px-2">
            <Button
              variant="ghost"
              onClick={() => {
                closeMobileMenu();
                logout();
              }}
              className={cn(
                "w-full flex items-center rounded-md py-2 px-3 text-sm font-medium text-gray-600 hover:bg-whies-50 hover:text-whies-800",
                isCollapsed && "justify-center px-2"
              )}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default TechnicianSidebar;
