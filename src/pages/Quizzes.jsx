
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BrainCircuit, 
  Plus, 
  Loader2,
  CheckCircle,
  XCircle,
  Trophy,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import QuizCreator from "../components/quiz/QuizCreator";
import QuizTaker from "../components/quiz/QuizTaker";
import QuizResults from "../components/quiz/QuizResults";

export default function Quizzes() {
  const [user, setUser] = useState(null);
  const [showCreator, setShowCreator] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: quizzes = [] } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => base44.entities.Quiz.list('-created_date'),
    initialData: []
  });

  const { data: myAttempts = [] } = useQuery({
    queryKey: ['myAttempts', user?.id],
    queryFn: () => base44.entities.QuizAttempt.filter({ student_id: user?.id }, '-created_date'),
    enabled: !!user,
    initialData: []
  });

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setQuizResults(null);
  };

  const handleQuizComplete = (results) => {
    setQuizResults(results);
    setActiveQuiz(null);
  };

  const handleQuizCreated = (quiz) => {
    queryClient.invalidateQueries(['quizzes']);
    setShowCreator(false);
    startQuiz(quiz);
  };

  if (activeQuiz) {
    return <QuizTaker quiz={activeQuiz} onComplete={handleQuizComplete} onCancel={() => setActiveQuiz(null)} />;
  }

  if (quizResults) {
    return <QuizResults results={quizResults} onClose={() => setQuizResults(null)} />;
  }

  if (showCreator) {
    return <QuizCreator onQuizCreated={handleQuizCreated} onCancel={() => setShowCreator(false)} />;
  }

  const stats = {
    totalQuizzes: quizzes.length,
    attempted: myAttempts.length,
    passed: myAttempts.filter(a => a.passed).length,
    avgScore: myAttempts.length > 0 
      ? Math.round(myAttempts.reduce((sum, a) => sum + a.score, 0) / myAttempts.length)
      : 0
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Science Quizzes</h1>
              <p className="text-gray-600">Test your knowledge</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowCreator(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Quiz
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Available", value: stats.totalQuizzes, icon: BrainCircuit },
            { label: "Attempted", value: stats.attempted, icon: CheckCircle },
            { label: "Passed", value: stats.passed, icon: Trophy },
            { label: "Avg Score", value: `${stats.avgScore}%`, icon: Sparkles }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-none shadow-md">
                <CardContent className="p-4">
                  <stat.icon className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quizzes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {quizzes.map((quiz, index) => {
            const myAttempt = myAttempts.find(a => a.quiz_id === quiz.id);
            
            return (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      {myAttempt && (
                        <Badge variant={myAttempt.passed ? "default" : "secondary"} className={myAttempt.passed ? "bg-green-500" : ""}>
                          {myAttempt.score}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{quiz.topic}</Badge>
                      <Badge variant="outline">{quiz.difficulty}</Badge>
                      <Badge variant="outline">{quiz.questions?.length || 0} questions</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {quiz.nesa_outcomes && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 mb-1">NESA Outcomes</p>
                        <div className="flex flex-wrap gap-1">
                          {quiz.nesa_outcomes.map(outcome => (
                            <Badge key={outcome} variant="secondary" className="text-xs">
                              {outcome}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button 
                      onClick={() => startQuiz(quiz)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {myAttempt ? 'Retake Quiz' : 'Start Quiz'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {quizzes.length === 0 && (
        <div className="text-center py-16">
          <BrainCircuit className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600 mb-2">No quizzes yet</p>
          <p className="text-gray-500 mb-6">Create your first AI-generated quiz!</p>
          <Button 
            onClick={() => setShowCreator(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Quiz
          </Button>
        </div>
      )}
    </div>
  );
}
