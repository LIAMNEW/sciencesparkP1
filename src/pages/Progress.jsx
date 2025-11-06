import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Trophy, TrendingUp, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// NSW Science 7-10 (2023) Syllabus - All Outcomes
const NESA_OUTCOMES = {
  // Stage 4 Working Scientifically
  "SC4-WS-01": "Questioning and predicting",
  "SC4-WS-02": "Planning investigations",
  "SC4-WS-03": "Conducting investigations",
  "SC4-WS-04": "Processing data and information",
  "SC4-WS-05": "Analysing data and information",
  "SC4-WS-06": "Problem-solving",
  "SC4-WS-07": "Communicating",
  "SC4-WS-08": "Working collaboratively",
  
  // Stage 4 Content
  "SC4-OTU-01": "Observing the Universe",
  "SC4-FOR-01": "Forces",
  "SC4-CLS-01": "Cells and Classification",
  "SC4-SOL-01": "Solutions and Mixtures",
  "SC4-LIV-01": "Living Systems",
  "SC4-PRT-01": "Periodic Table and Atomic Structure",
  "SC4-CHG-01": "Change",
  "SC4-DA1-01": "Data Science 1",
  
  // Stage 5 Working Scientifically
  "SC5-WS-01": "Questioning and predicting",
  "SC5-WS-02": "Planning investigations",
  "SC5-WS-03": "Conducting investigations",
  "SC5-WS-04": "Processing data and information",
  "SC5-WS-05": "Analysing data and information",
  "SC5-WS-06": "Problem-solving",
  "SC5-WS-07": "Communicating",
  "SC5-WS-08": "Working collaboratively",
  
  // Stage 5 Content
  "SC5-EGY-01": "Energy",
  "SC5-DIS-01": "Disease",
  "SC5-MAT-01": "Materials",
  "SC5-ENV-01": "Environmental Sustainability",
  "SC5-GEV-01": "Genetics and Evolutionary Change 1",
  "SC5-GEV-02": "Genetics and Evolutionary Change 2",
  "SC5-RXN-01": "Reactions 1",
  "SC5-RXN-02": "Reactions 2",
  "SC5-WAM-01": "Waves and Motion 1",
  "SC5-WAM-02": "Waves and Motion 2",
  "SC5-DA2-01": "Data Science 2"
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