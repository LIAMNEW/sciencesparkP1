import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizTaker({ quiz, onComplete, onCancel }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const selectedAnswer = answers[currentQuestion];

  const selectAnswer = (index) => {
    setAnswers({ ...answers, [currentQuestion]: index });
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = async () => {
    const results = quiz.questions.map((q, index) => ({
      question: q.question,
      selected: answers[index],
      correct: q.correct_answer,
      isCorrect: answers[index] === q.correct_answer,
      explanation: q.explanation
    }));

    const correctCount = results.filter(r => r.isCorrect).length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= 70;

    await base44.entities.QuizAttempt.create({
      student_id: user.id,
      quiz_id: quiz.id,
      answers: results,
      score,
      passed
    });

    onComplete({ quiz, results, score, passed });
  };

  const allAnswered = Object.keys(answers).length === quiz.questions.length;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={onCancel} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600">Question {currentQuestion + 1} of {quiz.questions.length}</p>
          </div>
          <Badge variant="outline">{quiz.topic}</Badge>
        </div>

        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="border-none shadow-xl mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    selectedAnswer === index
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-purple-600 bg-purple-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === index && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentQuestion < quiz.questions.length - 1 ? (
          <Button
            onClick={nextQuestion}
            disabled={selectedAnswer === undefined}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={submitQuiz}
            disabled={!allAnswered}
            className="bg-gradient-to-r from-green-600 to-emerald-600"
          >
            Submit Quiz
            <Send className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}