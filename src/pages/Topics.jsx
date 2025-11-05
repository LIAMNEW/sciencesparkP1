import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Microscope, 
  Zap, 
  Atom, 
  Mountain, 
  Telescope,
  Wind,
  Droplets,
  Heart,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

const TOPICS = [
  {
    id: "cells",
    title: "Cells & Classification",
    description: "Explore the building blocks of life and how living things are organized",
    icon: Microscope,
    color: "from-green-500 to-emerald-600",
    outcomes: ["SC4-LW-01", "SC4-WS-01", "SC4-WS-06"],
    difficulty: "Beginner"
  },
  {
    id: "body-systems",
    title: "Body Systems",
    description: "Discover how organs work together to keep us alive",
    icon: Heart,
    color: "from-red-500 to-pink-600",
    outcomes: ["SC4-LW-02", "SC4-WS-03", "SC4-WS-04"],
    difficulty: "Intermediate"
  },
  {
    id: "mixtures",
    title: "Mixtures & Separation",
    description: "Learn about different types of mixtures and how to separate them",
    icon: Droplets,
    color: "from-blue-500 to-cyan-600",
    outcomes: ["SC4-CW-01", "SC4-WS-02", "SC4-WS-04"],
    difficulty: "Beginner"
  },
  {
    id: "atoms",
    title: "Particles & Atoms",
    description: "Understand the tiny particles that make up everything",
    icon: Atom,
    color: "from-purple-500 to-violet-600",
    outcomes: ["SC4-CW-02", "SC4-WS-01", "SC4-WS-07"],
    difficulty: "Intermediate"
  },
  {
    id: "forces",
    title: "Forces & Motion",
    description: "Investigate how forces affect the movement of objects",
    icon: Wind,
    color: "from-orange-500 to-amber-600",
    outcomes: ["SC4-FOR-01", "SC4-WS-03", "SC4-WS-05"],
    difficulty: "Intermediate"
  },
  {
    id: "energy",
    title: "Energy Transformations",
    description: "Discover how energy changes from one form to another",
    icon: Zap,
    color: "from-yellow-500 to-orange-600",
    outcomes: ["SC4-MOT-01", "SC4-WS-04", "SC4-WS-06"],
    difficulty: "Intermediate"
  },
  {
    id: "rock-cycle",
    title: "Rock Cycle & Resources",
    description: "Learn about rocks, minerals, and Earth's resources",
    icon: Mountain,
    color: "from-stone-500 to-slate-600",
    outcomes: ["SC4-GEA-01", "SC4-WS-02", "SC4-WS-04"],
    difficulty: "Beginner"
  },
  {
    id: "universe",
    title: "Observing the Universe",
    description: "Explore space, stars, and our place in the cosmos",
    icon: Telescope,
    color: "from-indigo-500 to-blue-600",
    outcomes: ["SC4-OUT-01", "SC4-WS-07"],
    difficulty: "Advanced"
  }
];

export default function Topics() {
  const [selectedDifficulty, setSelectedDifficulty] = React.useState("all");

  const filteredTopics = selectedDifficulty === "all" 
    ? TOPICS 
    : TOPICS.filter(t => t.difficulty.toLowerCase() === selectedDifficulty);

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
              <h1 className="text-3xl font-bold text-gray-900">NSW Science Topics</h1>
              <p className="text-gray-600">Years 7-8 Curriculum</p>
            </div>
          </div>
          <p className="text-lg text-gray-600 mt-4">
            Explore key science concepts aligned with NESA learning outcomes
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-2 mt-6 flex-wrap">
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

      {/* Topics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full group cursor-pointer">
              <CardHeader>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <topic.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">{topic.title}</CardTitle>
                <Badge variant="secondary" className="w-fit">
                  {topic.difficulty}
                </Badge>
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
                  <Link to={createPageUrl(`Chat?topic=${topic.id}`)} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Learn Now
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