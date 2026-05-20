import React from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  BrainCircuit,
  TrendingUp,
  Sparkles,
  Settings
} from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import MobileHeader from "@/components/layout/MobileHeader";
import PullToRefresh from "@/components/layout/PullToRefresh";
import { useQueryClient } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "AI Tutor",
    url: createPageUrl("Chat"),
    icon: MessageSquare,
  },
  {
    title: "Topics",
    url: createPageUrl("Topics"),
    icon: BookOpen,
  },
  {
    title: "Quizzes",
    url: createPageUrl("Quizzes"),
    icon: BrainCircuit,
  },
  {
    title: "Progress",
    url: createPageUrl("Progress"),
    icon: TrendingUp,
  },
  {
    title: "Settings",
    url: "/Settings",
    icon: Settings,
  },
];

export default function Layout({ children, currentPageName }) {
  // currentPageName used by parent routing context
  void currentPageName;
  const location = useLocation();
  const queryClient = useQueryClient();
  const handleRefresh = async () => {
    await queryClient.invalidateQueries();
  };

  return (
    <SidebarProvider>
      <div
        className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
      >
        <Sidebar className="border-r border-purple-100 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-purple-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Science AI</h2>
                <p className="text-xs text-purple-600 font-medium">NSW Years 7-8</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Learning Hub
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`
                            hover:bg-purple-50 transition-all duration-200 rounded-xl mb-1
                            ${isActive ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md' : 'text-gray-700'}
                          `}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-purple-600'}`} />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-purple-100 p-4 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center shadow">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">Student</p>
                <p className="text-xs text-gray-600 truncate">Keep learning! 🚀</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          <MobileHeader />

          <PullToRefresh onRefresh={handleRefresh}>
            {children}
          </PullToRefresh>
        </main>
        <BottomNav />
      </div>
    </SidebarProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  currentPageName: PropTypes.string,
};

Layout.defaultProps = {
  currentPageName: "",
};