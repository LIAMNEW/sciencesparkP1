
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
// import { useMutation, useQueryClient } from "@tanstack/react-query"; // Removed as useMutation is no longer used
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, X, Sparkles } from "lucide-react";

const TOPICS = [
  // Stage 4
  { value: "observing-universe", label: "Observing the Universe", stage: 4 },
  { value: "forces", label: "Forces", stage: 4 },
  { value: "cells-classification", label: "Cells and Classification", stage: 4 },
  { value: "solutions-mixtures", label: "Solutions and Mixtures", stage: 4 },
  { value: "living-systems", label: "Living Systems", stage: 4 },
  { value: "periodic-table", label: "Periodic Table & Atomic Structure", stage: 4 },
  { value: "change", label: "Change", stage: 4 },
  { value: "data-science-1", label: "Data Science 1", stage: 4 },
  // Stage 5
  { value: "energy", label: "Energy", stage: 5 },
  { value: "disease", label: "Disease", stage: 5 },
  { value: "materials", label: "Materials", stage: 5 },
  { value: "environmental-sustainability", label: "Environmental Sustainability", stage: 5 },
  { value: "genetics", label: "Genetics & Evolutionary Change", stage: 5 },
  { value: "reactions", label: "Reactions", stage: 5 },
  { value: "waves-motion", label: "Waves and Motion", stage: 5 },
  { value: "data-science-2", label: "Data Science 2", stage: 5 }
];

// TOPIC_OUTCOMES is removed as per the outline. Outcomes are now dynamically generated.

export default function QuizCreator({ onQuizCreated, onCancel }) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [questionCount, setQuestionCount] = useState(5); // Renamed from numQuestions
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null); // Added error state
  // const queryClient = useQueryClient(); // Removed as useMutation is no longer used

  const generateQuiz = async () => {
    setIsGenerating(true);
    setError(null); // Clear previous errors

    const selectedTopicObj = TOPICS.find(t => t.value === topic);
    if (!selectedTopicObj) {
      setError("Please select a valid topic.");
      setIsGenerating(false);
      return;
    }

    const stageYears = selectedTopicObj.stage === 4 ? "7-8" : "9-10";
    const stageInfo = `Stage ${selectedTopicObj.stage} (Years ${stageYears})`;

    const prompt = `You are creating a science quiz for NSW students following the NSW Science 7-10 (2023) syllabus.

Topic: ${selectedTopicObj.label}
Stage: ${stageInfo}
Difficulty: ${difficulty}
Number of questions: ${questionCount}

Create a quiz with ${questionCount} multiple-choice questions (4 options each, only one correct).

Requirements:
- Align questions with NSW Science 7-10 (2023) syllabus content
- Use age-appropriate language for ${stageInfo}
- Include Australian context and examples where relevant
- Cover different aspects of the topic (concepts, applications, analysis)
- Provide clear, educational explanations
- For Stage 4: Focus on foundational understanding, observation, and basic scientific thinking
- For Stage 5: Include more complex concepts, analysis, and real-world applications

Difficulty guidelines:
- Beginner: Basic recall and understanding
- Intermediate: Application and analysis
- Advanced: Synthesis, evaluation, and complex problem-solving

Return ONLY valid JSON in this exact format:
{
  "title": "Quiz title (engaging, specific to topic and difficulty)",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "Why this answer is correct and how it relates to the syllabus"
    }
  ]
}`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: {
                    type: "array",
                    items: { type: "string" }
                  },
                  correct_answer: { type: "number" },
                  explanation: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Basic validation for the LLM response structure
      if (!response || !response.title || !Array.isArray(response.questions) || response.questions.length === 0) {
        throw new Error("Invalid response structure from LLM.");
      }

      const quiz = await base44.entities.Quiz.create({
        topic,
        title: response.title,
        difficulty,
        // NESA outcomes are now simplified to a generic working scientifically outcome based on stage
        nesa_outcomes: [`SC${selectedTopicObj.stage}-WS-01`],
        questions: response.questions
      });

      // queryClient.invalidateQueries(['quizzes']); // Removed as useMutation is no longer used
      onQuizCreated(quiz); // Callback for successful quiz creation
    } catch (err) {
      console.error("Quiz generation error:", err);
      setError("Failed to generate quiz. Please try again. " + (err.message || ""));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-none shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <CardTitle>Create AI Quiz</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}> {/* Changed onClose to onCancel */}
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger id="topic">
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1.5 text-sm font-semibold text-gray-500">Stage 4 (Years 7-8)</div>
              {TOPICS.filter(t => t.stage === 4).map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
              <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 mt-2">Stage 5 (Years 9-10)</div>
              {TOPICS.filter(t => t.stage === 5).map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger id="difficulty">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="questionCount">Number of Questions</Label>
          <Input
            id="questionCount"
            type="number"
            min="3"
            max="10"
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value) || 0)} // Ensure parsed value is a number
          />
        </div>

        <Button
          onClick={generateQuiz} // Changed to call the generateQuiz function
          disabled={!topic || isGenerating || questionCount < 3 || questionCount > 10 || questionCount === 0} // Added more robust validation for questionCount
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Quiz...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Quiz
            </>
          )}
        </Button>
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </CardContent>
    </Card>
  );
}
