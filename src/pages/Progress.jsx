import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Trophy, TrendingUp, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const NESA_OUTCOMES = {
  "SC4-WS-01": "Questioning and predicting",
  "SC4-WS-02": "Planning investigations",
  "SC4-WS-03": "Conducting investigations",
  "SC4-WS-04": "Processing data and analyzing",
  "SC4-WS-05": "Problem solving",
  "SC4-WS-06": "Communicating scientific ideas",
  "SC4-WS-07": "Using digital technologies",
  "SC4-LW-01": "Cells and Classification",
  "SC4-LW-02": "Body Systems",
  "SC4-CW-01": "Mixtures and Physical Properties",
  "SC4-CW-02": "Particles and Atoms",
  "SC4-FOR-01": "Forces and Motion",
  "SC4-MOT-01": "Energy",
  "SC4-GEA-01": "Rock Cycle",
  "SC4-OUT-01": "Observing the Universe"
};

export default function Progress() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: attempts = [] } = useQuery({
    queryKey: ['attempts', user?.id],
    queryFn: () => base44.entities.QuizAttempt.filter({ student_id: user?.id }, '-created_date'),
    enabled: !!user,
    initialData: []
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions', user?.id],
    queryFn: () => base44.entities.ChatSession.filter({ student_id: user?.id }),
    enabled: !!user,
    initialData: []
  });

  const stats = {
    totalSessions: sessions.length,
    totalQuizzes: attempts.length,
    passed: attempts.filter(a => a.passed).length,
    avgScore: attempts.length > 0 
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
      : 0
  };

  const outcomesProgress = Object.entries(NESA_OUTCOMES).map(([code, name]) => {
    const relevantAttempts = attempts.filter(a => {
      return true;
    });
    const avgScore = relevantAttempts.length > 0
      ? Math.round(relevantAttempts.reduce((sum, a) => sum + a.score, 0) / relevantAttempts.length)
      : 0;
    
    return {
      code,
      name,
      progress: avgScore,
      attempts: relevantAttempts.length
    };
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>
            <p className="text-gray-600">Track your learning journey</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Chat Sessions", value: stats.totalSessions, icon: Sparkles, color: "purple" },
            { label: "Quizzes Taken", value: stats.totalQuizzes, icon: Target, color: "blue" },
            { label: "Quizzes Passed", value: stats.passed, icon: Trophy, color: "green" },
            { label: "Average Score", value: `${stats.avgScore}%`, icon: TrendingUp, color: "cyan" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <stat.icon className={`w-8 h-8 text-${stat.color}-600 mb-3`} />
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* NESA Outcomes Progress */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            NESA Learning Outcomes
          </CardTitle>
          <p className="text-sm text-gray-600">Your mastery of NSW Science curriculum outcomes</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {outcomesProgress.map((outcome, index) => (
              <motion.div
                key={outcome.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">
                      {outcome.code}
                    </Badge>
                    <span className="font-medium text-gray-900">{outcome.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {outcome.progress}%
                  </span>
                </div>
                <ProgressBar value={outcome.progress} className="h-2" />
                <p className="text-xs text-gray-500">
                  {outcome.attempts > 0 
                    ? `${outcome.attempts} activities completed`
                    : 'Not yet practiced'}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}