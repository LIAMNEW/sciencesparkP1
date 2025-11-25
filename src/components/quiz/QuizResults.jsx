import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, CheckCircle, XCircle, ArrowLeft, Sparkles, Loader2, Target, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function QuizResults({ results, onClose }) {
  const { quiz, results: questionResults, score, passed } = results;
  const correctCount = questionResults.filter(r => r.isCorrect).length;
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateAIFeedback();
  }, []);

  const generateAIFeedback = async () => {
    setIsGenerating(true);

    try {
      const incorrectQuestions = questionResults
        .filter(r => !r.isCorrect)
        .map(r => r.question);

      const prompt = `You are a supportive NSW Science teacher providing personalized feedback to a Year 7-8 student.

Quiz Details:
- Topic: ${quiz.topic}
- Score: ${score}%
- Questions Correct: ${correctCount}/${questionResults.length}
- Questions Missed: ${incorrectQuestions.join("; ")}

Provide encouraging, personalized feedback that includes:

1. **Celebration**: Acknowledge what they did well (be specific!)
2. **Areas to Focus**: 2-3 specific concepts they should review (based on missed questions)
3. **Next Steps**: Practical study suggestions (videos to watch, activities to try, concepts to practice)
4. **Encouragement**: Motivating message about their learning journey

Keep it warm, age-appropriate, and under 300 words. Use Australian English.
IMPORTANT: Do NOT include a signature, name, or placeholder like "[Your Name]" at the end. Just end with the encouraging message.`;

      const feedback = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: false
      });

      setAiFeedback(feedback);
    } catch (error) {
      console.error("Feedback generation error:", error);
      setAiFeedback("Great effort on this quiz! Keep practicing and you'll continue to improve. 🌟");
    }

    setIsGenerating(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={onClose} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Quizzes
      </Button>

      {/* Score Card */}
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

      {/* AI Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-none shadow-xl mb-8 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Personalized AI Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-3" />
                <span className="text-gray-600">Analyzing your performance...</span>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{aiFeedback}</ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Insights */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="border-none shadow-md">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-gray-900">{correctCount}</p>
            <p className="text-sm text-gray-600">Correct Answers</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6 text-center">
            <XCircle className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-2xl font-bold text-gray-900">{questionResults.length - correctCount}</p>
            <p className="text-sm text-gray-600">To Review</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6 text-center">
            <Lightbulb className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <p className="text-2xl font-bold text-gray-900">{Math.round((correctCount / questionResults.length) * 100)}%</p>
            <p className="text-sm text-gray-600">Mastery Level</p>
          </CardContent>
        </Card>
      </div>

      {/* Question Review */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Answers</h2>
      <div className="space-y-4">
        {questionResults.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
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

      {/* Action Buttons */}
      <div className="flex gap-3 mt-8">
        <Button 
          onClick={onClose}
          variant="outline"
          className="flex-1"
        >
          Back to Quizzes
        </Button>
        {!passed && (
          <Button 
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}