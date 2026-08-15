// Layout component - wraps pages with common layout structure

import { type ReactNode, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

interface LayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  title?: string;
}

export default function Layout({ children, sidebar, title }: LayoutProps) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change
  if (sidebarOpen) {
    // This effect is not ideal here, but for simplicity let's stick to closing on click
    // or we can use a useEffect
  }

  return (
    <div
      className={`h-screen flex flex-col ${
        theme === "light" ? "light-theme" : ""
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center px-3 md:px-8 h-15 ${
          theme === "light"
            ? "bg-white border-b-2 border-[#1fb854]"
            : "bg-[#1b1717] border-b-2 border-[#1fb854]"
        } z-20 relative`}
      >
        {/* Mobile Sidebar Toggle */}
        {sidebar && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`md:hidden mr-3 text-xl ${
              theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
            }`}
          >
            <i className={`fa-solid ${sidebarOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </button>
        )}

        <Link
          to={
            user?.role === "admin"
              ? "/admin/dashboard"
              : user?.role === "employee"
              ? "/employee/dashboard"
              : "/user/dashboard"
          }
          style={{
            fontFamily: "Lobster",
          }}
          className={`text-xl md:text-3xl hover:scale-105 transition ${
            theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
          }`}
        >
          StitchCraft
        </Link>
        
        {title && (
          <h1
            className={`hidden sm:block text-lg md:text-xl font-semibold ${
              theme === "light" ? "text-[#178a3f]" : "text-[#30ce67]"
            } ml-4`}
          >
            {title}
          </h1>
        )}

        <button
          onClick={logout}
          className={`btn btn-ghost ml-auto border mx-1 ${
            theme === "light" ? "text-[#178a3f]" : "text-[#1fb854]"
          } text-[0.6rem] md:text-xs`}
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>LOGOUT
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        {sidebar && (
          <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-20 md:hidden"
                onClick={() => setSidebarOpen(false)}
              ></div>
            )}
            
            {/* Sidebar Content */}
            <div 
              className={`
                fixed md:relative z-30 h-full transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                md:block
              `}
            >
              <div 
                className="h-full overflow-y-auto"
                onClick={() => {
                   // Optional: close on link click if we want
                   if (window.innerWidth < 768) setSidebarOpen(false);
                }}
              >
                {sidebar}
              </div>
            </div>
          </>
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto w-full">{children}</div>
      </div>
    </div>
  );
}
