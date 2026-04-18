import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, BookOpen, BrainCircuit, Settings } from "lucide-react";

const navItems = [
  { title: "Home", path: "/", icon: LayoutDashboard },
  { title: "Topics", path: "/Topics", icon: BookOpen },
  { title: "Chat", path: "/Chat", icon: MessageSquare },
  { title: "Quizzes", path: "/Quizzes", icon: BrainCircuit },
  { title: "Settings", path: "/Settings", icon: Settings },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-purple-100 flex items-center justify-around"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || 
          (item.path !== "/" && location.pathname.startsWith(item.path));
        return (
          <Link
            key={item.title}
            to={item.path}
            className={`flex flex-col items-center gap-1 py-3 px-3 min-w-0 flex-1 transition-colors ${
              isActive ? "text-purple-600" : "text-gray-500"
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive ? "text-purple-600" : "text-gray-400"}`} />
            <span className="text-xs font-medium truncate">{item.title}</span>
            {isActive && (
              <span className="absolute top-0 w-8 h-0.5 bg-purple-600 rounded-b-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}