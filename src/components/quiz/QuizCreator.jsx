import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, X, Sparkles } from "lucide-react";

const TOPICS = [
  "cells", "body-systems", "mixtures", "atoms", 
  "forces", "energy", "rock-cycle", "universe"
];

const TOPIC_OUTCOMES = {
  "cells": ["SC4-LW-01", "SC4-WS-01", "SC4-WS-06"],
  "body-systems": ["SC4-LW-02", "SC4-WS-03", "SC4-WS-04"],
  "mixtures": ["SC4-CW-01", "SC4-WS-02", "SC4-WS-04"],
  "atoms": ["SC4-CW-02", "SC4-WS-01", "SC4-WS-07"],
  "forces": ["SC4-FOR-01", "SC4-WS-03", "SC4-WS-05"],
  "energy": ["SC4-MOT-01", "SC4-WS-04", "SC4-WS-06"],
  "rock-cycle": ["SC4-GEA-01", "SC4-WS-02", "SC4-WS-04"],
  "universe": ["SC4-OUT-01", "SC4-WS-07"]
};

export default function QuizCreator({ onClose }) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  const generateQuizMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);

      const prompt = `Generate a ${difficulty} level science quiz for NSW Year 7-8 students on the topic: ${topic}.

Create ${numQuestions} multiple choice questions that:
- Test understanding aligned with NESA curriculum
- Have 4 options each
- Include clear explanations
- Use age-appropriate language
- Include Australian context where relevant

Return ONLY valid JSON in this exact format:
{
  "title": "Quiz title here",
  "questions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}`;

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
                  options: { type: "array", items: { type: "string" } },
                  correct_answer: { type: "number" },
                  explanation: { type: "string" }
                }
              }
            }
          }
        }
      });

      const quiz = await base44.entities.Quiz.create({
        topic,
        title: response.title,
        difficulty,
        nesa_outcomes: TOPIC_OUTCOMES[topic] || [],
        questions: response.questions
      });

      setIsGenerating(false);
      return quiz;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['quizzes']);
      onClose();
    },
    onError: (error) => {
      console.error("Quiz generation error:", error);
      setIsGenerating(false);
    }
  });

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <Card className="border-none shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <CardTitle>Create AI Quiz</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Topic</Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {TOPICS.map(t => (
                  <SelectItem key={t} value={t}>
                    {t.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Number of Questions</Label>
            <Input
              type="number"
              min="3"
              max="10"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            />
          </div>

          <Button
            onClick={() => generateQuizMutation.mutate()}
            disabled={!topic || isGenerating}
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
        </CardContent>
      </Card>
    </div>
  );
}