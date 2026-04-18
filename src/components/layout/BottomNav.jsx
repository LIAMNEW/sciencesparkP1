import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, MessageSquare, BookOpen, BrainCircuit, TrendingUp } from "lucide-react";

const navItems = [
  { title: "Home",     path: "/",         icon: LayoutDashboard },
  { title: "Topics",   path: "/Topics",   icon: BookOpen },
  { title: "Chat",     path: "/Chat",     icon: MessageSquare },
  { title: "Quizzes",  path: "/Quizzes",  icon: BrainCircuit },
  { title: "Progress", path: "/Progress", icon: TrendingUp },
];

function isTabActive(item, pathname) {
  if (item.path === "/") return pathname === "/";
  return pathname === item.path || pathname.startsWith(item.path + "/");
}

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e, item) => {
    if (isTabActive(item, location.pathname)) {
      e.preventDefault();
      // Pop back to root of this tab — preserves native-app feel
      navigate(item.path, { replace: true });
    }
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-purple-100 dark:border-gray-700 flex items-stretch justify-around"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {navItems.map((item) => {
        const active = isTabActive(item, location.pathname);
        return (
          <Link
            key={item.title}
            to={item.path}
            onClick={(e) => handleNavClick(e, item)}
            className={`relative flex flex-col items-center justify-center gap-0.5 pt-2 pb-1 min-w-0 flex-1 transition-colors select-none ${
              active ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {/* Active pill indicator at top */}
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-b-full" />
            )}
            <item.icon className={`w-5 h-5 ${active ? "text-purple-600 dark:text-purple-400" : "text-gray-400 dark:text-gray-500"}`} />
            <span className={`text-[10px] font-medium truncate ${active ? "font-semibold" : ""}`}>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}