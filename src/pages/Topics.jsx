import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Microscope, 
  Zap, 
  Atom, 
  Mountain, 
  Telescope,
  Wind,
  Droplets,
  FlaskConical,
  BarChart3,
  Dna,
  Leaf,
  Recycle,
  Flame,
  Waves,
  Pill,
  ArrowRight,
  Sparkles,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ResourceRecommender from "../components/learning/ResourceRecommender";

// NSW Science 7-10 (2023) Syllabus - Stage 4 and Stage 5 Topics
const TOPICS = [
  // STAGE 4 (Years 7-8)
  {
    id: "observing-universe",
    title: "Observing the Universe",
    description: "Explore how scientific observations increase knowledge of the Universe",
    icon: Telescope,
    color: "from-indigo-500 to-purple-600",
    outcomes: ["SC4-OTU-01", "SC4-WS-01", "SC4-WS-02"],
    stage: 4,
    difficulty: "Beginner"
  },
  {
    id: "forces",
    title: "Forces",
    description: "Describe contact and non-contact forces, force diagrams and simple machines",
    icon: Wind,
    color: "from-orange-500 to-red-600",
    outcomes: ["SC4-FOR-01", "SC4-WS-03", "SC4-WS-05"],
    stage: 4,
    difficulty: "Intermediate"
  },
  {
    id: "cells-classification",
    title: "Cells and Classification",
    description: "Cell structures and classification of organisms using scientific conventions",
    icon: Microscope,
    color: "from-green-500 to-emerald-600",
    outcomes: ["SC4-CLS-01", "SC4-WS-01", "SC4-WS-06"],
    stage: 4,
    difficulty: "Beginner"
  },
  {
    id: "solutions-mixtures",
    title: "Solutions and Mixtures",
    description: "Properties of substances and separation techniques",
    icon: Droplets,
    color: "from-blue-500 to-cyan-600",
    outcomes: ["SC4-SOL-01", "SC4-WS-02", "SC4-WS-04"],
    stage: 4,
    difficulty: "Beginner"
  },
  {
    id: "living-systems",
    title: "Living Systems",
    description: "Body systems, plant systems and ecosystems",
    icon: Leaf,
    color: "from-lime-500 to-green-600",
    outcomes: ["SC4-LIV-01", "SC4-WS-03", "SC4-WS-04"],
    stage: 4,
    difficulty: "Intermediate"
  },
  {
    id: "periodic-table",
    title: "Periodic Table & Atomic Structure",
    description: "Elements, compounds and atomic models",
    icon: Atom,
    color: "from-purple-500 to-pink-600",
    outcomes: ["SC4-PRT-01", "SC4-WS-01", "SC4-WS-07"],
    stage: 4,
    difficulty: "Intermediate"
  },
  {
    id: "change",
    title: "Change",
    description: "Energy causes geological and chemical change",
    icon: Mountain,
    color: "from-amber-500 to-orange-600",
    outcomes: ["SC4-CHG-01", "SC4-WS-04", "SC4-WS-05"],
    stage: 4,
    difficulty: "Intermediate"
  },
  {
    id: "data-science-1",
    title: "Data Science 1",
    description: "Using data to model and predict phenomena",
    icon: BarChart3,
    color: "from-teal-500 to-cyan-600",
    outcomes: ["SC4-DA1-01", "SC4-WS-04", "SC4-WS-07"],
    stage: 4,
    difficulty: "Beginner"
  },
  
  // STAGE 5 (Years 9-10)
  {
    id: "energy",
    title: "Energy",
    description: "Energy sources, conservation of energy and electrical circuits",
    icon: Zap,
    color: "from-yellow-500 to-orange-600",
    outcomes: ["SC5-EGY-01", "SC5-WS-04", "SC5-WS-06"],
    stage: 5,
    difficulty: "Advanced"
  },
  {
    id: "disease",
    title: "Disease",
    description: "Causes of disease, prevention and management",
    icon: Pill,
    color: "from-red-500 to-pink-600",
    outcomes: ["SC5-DIS-01", "SC5-WS-04", "SC5-WS-06"],
    stage: 5,
    difficulty: "Advanced"
  },
  {
    id: "materials",
    title: "Materials",
    description: "Chemical properties, bonding and polymers",
    icon: FlaskConical,
    color: "from-slate-500 to-gray-600",
    outcomes: ["SC5-MAT-01", "SC5-WS-02", "SC5-WS-03"],
    stage: 5,
    difficulty: "Advanced"
  },
  {
    id: "environmental-sustainability",
    title: "Environmental Sustainability",
    description: "Climate science, human impacts and recycling",
    icon: Recycle,
    color: "from-green-500 to-teal-600",
    outcomes: ["SC5-ENV-01", "SC5-WS-05", "SC5-WS-06"],
    stage: 5,
    difficulty: "Advanced"
  },
  {
    id: "genetics",
    title: "Genetics & Evolutionary Change",
    description: "DNA, inheritance and natural selection",
    icon: Dna,
    color: "from-violet-500 to-purple-600",
    outcomes: ["SC5-GEV-01", "SC5-GEV-02", "SC5-WS-04"],
    stage: 5,
    difficulty: "Advanced"
  },
  {
    id: "reactions",
    title: "Reactions",
    description: "Chemical and nuclear reactions",
    icon: Flame,
    color: "from-orange-500 to-red-600",
    outcomes: ["SC5-RXN-01", "SC5-RXN-02", "SC5-WS-03"],
    stage: 5,
    difficulty: "Advanced"
  },
  {
    id: "waves-motion",
    title: "Waves and Motion",
    description: "Properties of waves and Newton's laws of motion",
    icon: Waves,
    color: "from-blue-500 to-indigo-600",
    outcomes: ["SC5-WAM-01", "SC5-WAM-02", "SC5-WS-04"],
    stage: 5,
    difficulty: "Advanced"
  },
  {
    id: "data-science-2",
    title: "Data Science 2",
    description: "Evidence-based decisions and scientific claims",
    icon: BarChart3,
    color: "from-cyan-500 to-blue-600",
    outcomes: ["SC5-DA2-01", "SC5-WS-07", "SC5-WS-08"],
    stage: 5,
    difficulty: "Advanced"
  }
];

export default function Topics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");
  
  // Sync with local storage for persistence across reloads
  useEffect(() => {
    const savedTopicId = localStorage.getItem("current_topic_id");
    const urlTopicId = searchParams.get("topic");
    
    if (!urlTopicId && savedTopicId) {
      // Restore from storage if URL param is missing (e.g. after reload/back navigation)
      setSearchParams({ topic: savedTopicId });
    }
  }, []);

  const topicId = searchParams.get("topic");
  const selectedTopic = topicId ? TOPICS.find(t => t.id === topicId) || null : null;

  const setSelectedTopic = (topic) => {
    if (topic) {
      localStorage.setItem("current_topic_id", topic.id);
      setSearchParams({ topic: topic.id });
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
            <Link to={createPageUrl(`Chat?topic=${selectedTopic.id}`)}>
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
                  <Link to={createPageUrl(`Chat?topic=${topic.id}`)} className="flex-1">
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