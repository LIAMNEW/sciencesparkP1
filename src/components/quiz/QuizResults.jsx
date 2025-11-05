import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function QuizResults({ results, onClose }) {
  const { quiz, results: questionResults, score, passed } = results;
  const correctCount = questionResults.filter(r => r.isCorrect).length;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={onClose} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Quizzes
      </Button>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className={`border-none shadow-2xl mb-8 ${
          passed ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-orange-50 to-amber-50'
        }`}>
          <CardContent className="p-8 text-center">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              passed ? 'bg-green-500' : 'bg-orange-500'
            }`}>
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h1>
            <p className="text-5xl font-bold text-gray-900 mb-2">{score}%</p>
            <p className="text-lg text-gray-700">
              You got {correctCount} out of {questionResults.length} questions correct
            </p>
            {passed ? (
              <Badge className="mt-4 bg-green-500 text-white">Passed! 🎉</Badge>
            ) : (
              <Badge variant="secondary" className="mt-4">Try again to pass (70%+)</Badge>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Answers</h2>
      <div className="space-y-4">
        {questionResults.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`border-2 ${
              result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg flex-1">
                    {index + 1}. {result.question}
                  </CardTitle>
                  {result.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Your answer:</p>
                  <p className={`font-medium ${result.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {quiz.questions[index].options[result.selected]}
                  </p>
                </div>
                {!result.isCorrect && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Correct answer:</p>
                    <p className="font-medium text-green-700">
                      {quiz.questions[index].options[result.correct]}
                    </p>
                  </div>
                )}
                <div className="pt-3 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-1">Explanation:</p>
                  <p className="text-gray-600">{result.explanation}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}