import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Sparkles } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Map root tab paths → display titles
const TAB_TITLES = {
  "/": "Home",
  "/Topics": "Topics",
  "/Chat": "AI Tutor",
  "/Quizzes": "Quizzes",
  "/Progress": "Progress",
  "/Settings": "Settings",
};

const TAB_ROOTS = ["/Topics", "/Chat", "/Quizzes", "/Progress", "/Settings", "/"];

function getPageTitle(pathname) {
  if (TAB_TITLES[pathname]) return TAB_TITLES[pathname];
  // Derive from first path segment
  const segment = "/" + pathname.split("/").filter(Boolean)[0];
  return TAB_TITLES[segment] || "ScienceSpark";
}

function getTabRoot(pathname) {
  if (pathname === "/") return "/";
  for (const root of TAB_ROOTS) {
    if (root !== "/" && pathname.startsWith(root)) return root;
  }
  return null;
}

function isAtTabRoot(pathname) {
  return TAB_ROOTS.includes(pathname);
}

export default function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const atRoot = isAtTabRoot(location.pathname);
  const tabRoot = getTabRoot(location.pathname);
  const showBack = !atRoot && tabRoot;

  return (
    <header
      className="lg:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-purple-100 dark:border-gray-700 px-4 flex items-center gap-2 z-40"
      style={{ paddingTop: "max(env(safe-area-inset-top), 0px)", minHeight: "56px" }}
    >
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium text-sm py-2 pr-2 -ml-1"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
      ) : (
        <SidebarTrigger className="hover:bg-purple-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors -ml-1" />
      )}

      <div className="flex-1 flex items-center justify-center gap-2">
        {!showBack && (
          <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
        )}
        <h1 className="text-base font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      {/* Right spacer to keep title centered */}
      <div className="w-10" />
    </header>
  );
}