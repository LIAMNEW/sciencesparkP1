import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function WelcomeStep({ onNext }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white text-center shadow-2xl border border-white/20">
      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-3xl font-bold mb-3">Welcome to ScienceSpark</h1>
      <p className="text-white/80 text-lg mb-2">Your AI-powered NSW Science tutor</p>
      <p className="text-white/60 text-sm mb-8">
        Aligned with the NSW Science 7–10 (2023) Syllabus for Years 7 & 8
      </p>
      <Button
        onClick={onNext}
        className="w-full bg-white text-purple-700 hover:bg-white/90 font-semibold text-base py-6 rounded-2xl shadow-lg"
      >
        Get Started →
      </Button>
    </div>
  );
}