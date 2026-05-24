import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Trophy, TrendingUp, Target, Sparkles, BookOpen, BrainCircuit, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useSyllabus } from "@/hooks/useSyllabus";

export default function Progress() {
  const [user, setUser] = React.useState(null);
  const { outcomesMap: NESA_OUTCOMES, syllabusLoading } = useSyllabus();

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: attempts = [], isError: attemptsError, refetch: refetchAttempts } = useQuery({
    queryKey: ['attempts', user?.id],
    queryFn: () => base44.entities.QuizAttempt.filter({ student_id: user?.id }, '-created_date'),
    enabled: !!user,
    initialData: []
  });

  const { data: sessions = [], isError: sessionsError } = useQuery({
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
    
    const stage = code.includes("SC4") ? 4 : 5;
    const isWorkingScientifically = code.includes("WS");
    
    return {
      code,
      name,
      progress: avgScore,
      attempts: relevantAttempts.length,
      stage,
      category: isWorkingScientifically ? "Working Scientifically" : "Content Focus Area"
    };
  });

  // Group by stage
  const stage4Outcomes = outcomesProgress.filter(o => o.stage === 4);
  const stage5Outcomes = outcomesProgress.filter(o => o.stage === 5);

  if (attemptsError || sessionsError) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <ErrorMessage
          message="We couldn't load your progress data. Please check your connection and try again."
          onRetry={refetchAttempts}
        />
      </div>
    );
  }

  const isNewUser = attempts.length === 0 && sessions.length === 0;

  if (isNewUser) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>
            <p className="text-gray-600">NSW Science 7-10 (2023) Syllabus Coverage</p>
          </div>
        </div>
        <div className="text-center py-16 bg-white rounded-3xl shadow-md">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-10 h-10 text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No progress yet</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Your progress will appear here as you chat with the AI Tutor and complete quizzes. Start learning to track your NSW syllabus coverage!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/Chat">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 gap-2">
                <BookOpen className="w-4 h-4" />
                Start Chatting
              </Button>
            </Link>
            <Link to="/Quizzes">
              <Button variant="outline" className="gap-2">
                <BrainCircuit className="w-4 h-4" />
                Take a Quiz
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-gray-600">NSW Science 7-10 (2023) Syllabus Coverage</p>
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

      {/* Stage 4 Outcomes */}
      <Card className="border-none shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Stage 4 Outcomes (Years 7-8)
          </CardTitle>
          <p className="text-sm text-gray-600">Foundation science knowledge and skills</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {stage4Outcomes.map((outcome, index) => (
              <motion.div
                key={outcome.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Badge variant="outline" className="font-mono text-xs">
                      {outcome.code}
                    </Badge>
                    <span className="font-medium text-gray-900 text-sm">{outcome.name}</span>
                    <Badge variant="secondary" className="text-xs ml-auto">
                      {outcome.category}
                    </Badge>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 ml-4">
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

      {/* Stage 5 Outcomes */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Stage 5 Outcomes (Years 9-10)
          </CardTitle>
          <p className="text-sm text-gray-600">Advanced science concepts and applications</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {stage5Outcomes.map((outcome, index) => (
              <motion.div
                key={outcome.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Badge variant="outline" className="font-mono text-xs">
                      {outcome.code}
                    </Badge>
                    <span className="font-medium text-gray-900 text-sm">{outcome.name}</span>
                    <Badge variant="secondary" className="text-xs ml-auto">
                      {outcome.category}
                    </Badge>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 ml-4">
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