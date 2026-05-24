import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Sparkles, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ResourceRecommender from "../components/learning/ResourceRecommender";
import { useSyllabus } from "@/hooks/useSyllabus";

export default function Topics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");
  const { topics: TOPICS, syllabusLoading } = useSyllabus();

  // Sync with local storage for persistence across reloads
  useEffect(() => {
    const savedTopicId = localStorage.getItem("current_topic_id");
    const urlTopicId = searchParams.get("topic");
    
    if (!urlTopicId && savedTopicId) {
      setSearchParams({ topic: savedTopicId });
    }
  }, []);

  const topicId = searchParams.get("topic");
  const selectedTopic = topicId ? TOPICS.find(t => t.code === topicId) || null : null;

  const setSelectedTopic = (topic) => {
    if (topic) {
      localStorage.setItem("current_topic_id", topic.code);
      setSearchParams({ topic: topic.code });
    } else {
      localStorage.removeItem("current_topic_id");
      setSearchParams({});
    }
  };

  const filteredTopics = TOPICS.filter(t => {
    const difficultyMatch = selectedDifficulty === "all" || t.difficulty.toLowerCase() === selectedDifficulty;
    const stageMatch = selectedStage === "all" || t.stage === parseInt(selectedStage);
    return difficultyMatch && stageMatch;
  });

  if (syllabusLoading && TOPICS.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Loading syllabus...</span>
      </div>
    );
  }

  if (selectedTopic) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setSelectedTopic(null)}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>

        <div className="mb-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedTopic.color} flex items-center justify-center mb-4 shadow-lg`}>
            <selectedTopic.icon className="w-8 h-8 text-white" />
          </div>
          <Badge variant="secondary" className="mb-2">Stage {selectedTopic.stage} • Years {selectedTopic.stage === 4 ? "7-8" : "9-10"}</Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedTopic.title}</h1>
          <p className="text-lg text-gray-600 mb-4">{selectedTopic.description}</p>
          <div className="flex gap-2 mb-6 flex-wrap">
            <Badge variant="secondary">{selectedTopic.difficulty}</Badge>
            {selectedTopic.outcomes.map(outcome => (
              <Badge key={outcome} variant="outline">{outcome}</Badge>
            ))}
          </div>
          <div className="flex gap-2 mb-6">
            <Link to={createPageUrl(`Chat?topic=${selectedTopic.code}`)}>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Ask AI Tutor
              </Button>
            </Link>
          </div>
        </div>

        <ResourceRecommender 
          topic={selectedTopic.title}
          outcomes={selectedTopic.outcomes}
          studentLevel={selectedTopic.difficulty.toLowerCase()}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">NSW Science 7-10 (2023)</h1>
              <p className="text-gray-600">Complete NESA Syllabus Coverage</p>
            </div>
          </div>
          <p className="text-lg text-gray-600 mt-4">
            Explore all Stage 4 and Stage 5 focus areas aligned with the NSW curriculum
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mt-6 space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Stage</p>
            <div className="flex gap-2 flex-wrap">
              {["all", "4", "5"].map((stage) => (
                <Button
                  key={stage}
                  variant={selectedStage === stage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStage(stage)}
                  className={selectedStage === stage ? "bg-gradient-to-r from-purple-600 to-blue-600" : ""}
                >
                  {stage === "all" ? "All Stages" : `Stage ${stage} (Years ${stage === "4" ? "7-8" : "9-10"})`}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Difficulty</p>
            <div className="flex gap-2 flex-wrap">
              {["all", "beginner", "intermediate", "advanced"].map((level) => (
                <Button
                  key={level}
                  variant={selectedDifficulty === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(level)}
                  className={selectedDifficulty === level ? "bg-gradient-to-r from-purple-600 to-blue-600" : ""}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full group cursor-pointer">
              <CardHeader>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <topic.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">{topic.title}</CardTitle>
                <div className="flex gap-2 mb-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    Stage {topic.stage}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {topic.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{topic.description}</p>
                
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">NESA Outcomes</p>
                  <div className="flex flex-wrap gap-1">
                    {topic.outcomes.map(outcome => (
                      <Badge key={outcome} variant="outline" className="text-xs">
                        {outcome}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => setSelectedTopic(topic)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Resources
                  </Button>
                  <Link to={createPageUrl(`Chat?topic=${topic.code}`)} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Learn
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}