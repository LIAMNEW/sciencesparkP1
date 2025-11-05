import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  BookOpen, 
  BrainCircuit, 
  Trophy,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: recentSessions = [] } = useQuery({
    queryKey: ['recentSessions', user?.id],
    queryFn: () => base44.entities.ChatSession.filter({ student_id: user?.id }, '-created_date', 3),
    enabled: !!user,
    initialData: []
  });

  const { data: recentAttempts = [] } = useQuery({
    queryKey: ['recentAttempts', user?.id],
    queryFn: () => base44.entities.QuizAttempt.filter({ student_id: user?.id }, '-created_date', 5),
    enabled: !!user,
    initialData: []
  });

  const stats = {
    totalChats: recentSessions.length,
    quizzesTaken: recentAttempts.length,
    averageScore: recentAttempts.length > 0 
      ? Math.round(recentAttempts.reduce((sum, a) => sum + a.score, 0) / recentAttempts.length)
      : 0,
    achievements: recentAttempts.filter(a => a.passed).length
  };

  const quickActions = [
    {
      title: "Ask AI Tutor",
      description: "Get instant help with any science topic",
      icon: MessageSquare,
      color: "from-purple-500 to-blue-500",
      link: createPageUrl("Chat")
    },
    {
      title: "Explore Topics",
      description: "Browse NSW curriculum topics",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      link: createPageUrl("Topics")
    },
    {
      title: "Take a Quiz",
      description: "Test your knowledge",
      icon: BrainCircuit,
      color: "from-cyan-500 to-teal-500",
      link: createPageUrl("Quizzes")
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Welcome Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6" />
              <span className="text-sm font-medium opacity-90">Welcome back!</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Ready to explore science?
            </h1>
            <p className="text-lg opacity-90 mb-6 max-w-2xl">
              Your AI-powered learning companion for NSW Science curriculum
            </p>
            <Link to={createPageUrl("Chat")}>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg">
                Start Learning <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Conversations", value: stats.totalChats, icon: MessageSquare, color: "purple" },
          { label: "Quizzes Taken", value: stats.quizzesTaken, icon: BrainCircuit, color: "blue" },
          { label: "Avg Score", value: `${stats.averageScore}%`, icon: TrendingUp, color: "cyan" },
          { label: "Passed", value: stats.achievements, icon: Trophy, color: "teal" }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 flex items-center justify-center mb-3`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link to={action.link}>
                <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Chats */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Recent Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSessions.length > 0 ? (
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <Link key={session.id} to={createPageUrl(`Chat?session=${session.id}`)}>
                    <div className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer">
                      <p className="font-medium text-gray-900 mb-1">{session.title || 'Science Chat'}</p>
                      <p className="text-sm text-gray-600 truncate">{session.last_message}</p>
                      <p className="text-xs text-gray-500 mt-1">{session.topic}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No conversations yet</p>
                <p className="text-sm mt-1">Start chatting with your AI tutor!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Quizzes */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600" />
              Recent Quiz Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentAttempts.length > 0 ? (
              <div className="space-y-3">
                {recentAttempts.map((attempt) => (
                  <div key={attempt.id} className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">Quiz Result</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        attempt.passed ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {attempt.score}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(attempt.created_date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BrainCircuit className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No quizzes taken yet</p>
                <p className="text-sm mt-1">Test your knowledge!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}