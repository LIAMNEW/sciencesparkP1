import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Target, ChevronDown, ChevronUp, Loader2, BookOpen, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useSyllabus } from "@/hooks/useSyllabus";

const MASTERY_THRESHOLD = 70;

function OutcomeRow({ outcome, learningProgress }) {
  const [expanded, setExpanded] = useState(false);
  const progress = learningProgress[outcome.code] ?? 0;
  const mastered = progress >= MASTERY_THRESHOLD;
  const practiced = progress > 0;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
      >
        {mastered ? (
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
        ) : (
          <Circle className={`w-5 h-5 flex-shrink-0 ${practiced ? "text-amber-400" : "text-gray-300"}`} />
        )}
        <Badge variant="outline" className="font-mono text-xs flex-shrink-0">{outcome.code}</Badge>
        <span className="font-medium text-gray-800 text-sm flex-1 min-w-0 truncate">{outcome.title}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {mastered && (
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Mastered</span>
          )}
          {!mastered && practiced && (
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">In Progress</span>
          )}
          {!practiced && (
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Not started</span>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-gray-50">
              {outcome.description && (
                <p className="text-sm text-gray-600 mb-3">{outcome.description}</p>
              )}
              <div className="flex items-center gap-3 mb-2">
                <Progress value={progress} className="h-2 flex-1" />
                <span className="text-sm font-semibold text-gray-700 w-10 text-right">{progress}%</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {mastered ? "✅ Mastery achieved!" : `Need ${MASTERY_THRESHOLD}% to master`}
                </p>
                <Link to={`/Chat?topic=${outcome.code}`}>
                  <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
                    <BookOpen className="w-3 h-3" /> Practice
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StageSection({ label, subtitle, outcomes, learningProgress, color }) {
  const [showAll, setShowAll] = useState(false);
  const mastered = outcomes.filter(o => (learningProgress[o.code] ?? 0) >= MASTERY_THRESHOLD).length;
  const practiced = outcomes.filter(o => {
    const p = learningProgress[o.code] ?? 0;
    return p > 0 && p < MASTERY_THRESHOLD;
  }).length;

  const visible = showAll ? outcomes : outcomes.slice(0, 6);

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`flex items-center gap-2 text-${color}-700`}>
              <Target className={`w-5 h-5 text-${color}-600`} />
              {label}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{mastered}/{outcomes.length}</p>
            <p className="text-xs text-gray-500">mastered</p>
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">
            <CheckCircle2 className="w-3 h-3" /> {mastered} Mastered
          </span>
          <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full font-medium">
            <Circle className="w-3 h-3" /> {practiced} In Progress
          </span>
          <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium">
            <Circle className="w-3 h-3" /> {outcomes.length - mastered - practiced} Not started
          </span>
        </div>
        <Progress value={outcomes.length > 0 ? Math.round((mastered / outcomes.length) * 100) : 0} className="h-1.5 mt-2" />
      </CardHeader>

      <CardContent className="space-y-2">
        {visible.map(outcome => (
          <OutcomeRow key={outcome.code} outcome={outcome} learningProgress={learningProgress} />
        ))}
        {outcomes.length > 6 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-gray-500 hover:text-gray-700"
            onClick={() => setShowAll(s => !s)}
          >
            {showAll ? "Show less" : `Show ${outcomes.length - 6} more outcomes`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function OutcomesDashboard({ learningProgress = {} }) {
  const { outcomes, syllabusLoading } = useSyllabus();

  const stage4 = outcomes.filter(o => o.stage === 4);
  const stage5 = outcomes.filter(o => o.stage === 5);

  if (syllabusLoading && outcomes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading syllabus outcomes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">NSW Syllabus Outcomes</h2>
          <p className="text-sm text-gray-500 mt-1">NSW Science 7-10 (2023) — track your mastery across all outcomes</p>
        </div>
        <Link to="/Quizzes">
          <Button variant="outline" size="sm" className="gap-2">
            <BrainCircuit className="w-4 h-4" /> Take a Quiz
          </Button>
        </Link>
      </div>
      <StageSection
        label="Stage 4 (Years 7–8)"
        subtitle="Foundation science knowledge and skills"
        outcomes={stage4}
        learningProgress={learningProgress}
        color="purple"
      />
      <StageSection
        label="Stage 5 (Years 9–10)"
        subtitle="Advanced science concepts and applications"
        outcomes={stage5}
        learningProgress={learningProgress}
        color="blue"
      />
    </div>
  );
}