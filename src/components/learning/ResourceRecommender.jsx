import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Loader2, 
  ExternalLink,
  Video,
  BookOpen,
  Lightbulb,
  Microscope
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResourceRecommender({ topic, outcomes = [], studentLevel = "intermediate" }) {
  const [resources, setResources] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load resources from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(`resources_${topic}`);
      if (saved) {
        setResources(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load resources", e);
    }
  }, [topic]);

  const generateResources = async () => {
    setIsLoading(true);
    
    try {
      const prompt = `You are an expert NSW Science educator. Generate personalized FREE learning resources for a Year 7-10 student.

Topic: ${topic}
NESA Outcomes: ${outcomes.join(", ")}
Student Level: ${studentLevel}

Generate a comprehensive learning resource guide with DIVERSE, FREE, and ACCESSIBLE resources.
CRITICAL: Verify ALL links are working and lead to the specific content described. Do not output 404 or "page not found" links.

1. 4 recommended YouTube videos (INCREASED VARIETY):
   - Mix of Australian (ABC Education, CSIRO, Questacon) and high-quality international channels.
   - Look for specific, high-rated videos that explain concepts clearly.
   - Avoid repeating the same channel multiple times if possible.

2. 3 interactive simulations or specific educational web pages (ALL MUST BE FREE):
   - Prioritize: PhET, LabXchange, CK-12, BioInteractive, The Physics Classroom, Concord Consortium.
   - Also search for topic-specific interactive tools.
   - Ensure the link goes DIRECTLY to the simulation/activity, not a general homepage.

3. 2-3 High-Quality Reading/Textbook Resources (EXPANDED):
   - Source 1: OpenStax (https://openstax.org/k12) - specific chapter/book.
   - Source 2: OER Commons - Use the link "https://oercommons.org/oer" so students can search for specific resources themselves.
   - Source 3: Other reputable free educational sites (e.g., CK-12 FlexBooks, Lumen Learning).
   - MUST be specific to the topic and appropriate for High School level.

4. 2 hands-on activities students can try at home using common household materials.

5. 3 key concepts to focus on aligned with NESA outcomes.

6. Real-world Australian connections.

IMPORTANT: Use your internet access to VERIFY that every URL is a currently working, valid link. Do not guess URLs.
Search for the most current and highly-rated resources to ensure variety.

Return ONLY valid JSON in this format:
{
  "videos": [
    {"title": "Video title", "description": "What they'll learn", "channel": "Channel name"}
  ],
  "simulations": [
    {"title": "Activity name", "description": "What to do", "url": "full URL to the resource"}
  ],
  "readings": [
    {"title": "Resource title", "description": "Brief description", "url": "full URL", "source": "OpenStax/OER Commons/etc"}
  ],
  "activities": [
    {"title": "Activity name", "description": "Step-by-step instructions", "materials": "What they need"}
  ],
  "key_concepts": ["Concept 1", "Concept 2", "Concept 3"],
  "australian_connection": "How this relates to Australia"
}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            videos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  channel: { type: "string" }
                }
              }
            },
            simulations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  url: { type: "string" }
                }
              }
            },
            readings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  url: { type: "string" },
                  source: { type: "string" }
                }
              }
            },
            activities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  materials: { type: "string" }
                }
              }
            },
            key_concepts: {
              type: "array",
              items: { type: "string" }
            },
            australian_connection: { type: "string" }
          }
        }
      });

      setResources(response);
      localStorage.setItem(`resources_${topic}`, JSON.stringify(response));
    } catch (error) {
      console.error("Resource generation error:", error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      {!resources && !isLoading && (
        <Card className="border-2 border-dashed border-purple-300 bg-purple-50/50">
          <CardContent className="p-6 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Get AI-Powered Learning Resources
            </h3>
            <p className="text-gray-600 mb-4">
              Let AI recommend personalized videos, activities, and resources for this topic
            </p>
            <Button 
              onClick={generateResources}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Resources
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-purple-600" />
            <p className="text-gray-600">Generating personalized resources...</p>
          </CardContent>
        </Card>
      )}

      <AnimatePresence>
        {resources && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Key Concepts */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                  Key Concepts to Focus On
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {resources.key_concepts?.map((concept, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                      {concept}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Videos */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-red-600" />
                  Recommended Videos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {resources.videos?.map((video, index) => {
                  const searchQuery = encodeURIComponent(`${video.title} ${video.channel}`);
                  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
                  
                  return (
                    <div 
                      key={index} 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        setTimeout(() => {
                          window.open(youtubeSearchUrl, '_blank', 'noopener,noreferrer');
                        }, 100);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(youtubeSearchUrl, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className="block p-4 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors cursor-pointer border-2 border-transparent hover:border-red-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{video.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {video.channel}
                          </Badge>
                        </div>
                        <ExternalLink className="w-5 h-5 text-red-600 flex-shrink-0" />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Interactive Simulations */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-blue-600" />
                  Interactive Simulations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {resources.simulations?.map((sim, index) => {
                  // Ensure URL has proper protocol
                  let url = sim.url || '';
                  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                  }
                  
                  if (!url) return null;

                  return (
                    <div 
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        setTimeout(() => {
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }, 100);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer border-2 border-transparent hover:border-blue-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{sim.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{sim.description}</p>
                          <p className="text-xs text-blue-600 font-medium">{sim.url}</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Free Textbooks & Readings */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  Free Textbooks & Readings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {resources.readings?.map((reading, index) => {
                  let url = reading.url || '';
                  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                  }
                  
                  if (!url) return null;

                  return (
                    <div 
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        setTimeout(() => {
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }, 100);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className="block p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer border-2 border-transparent hover:border-orange-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{reading.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{reading.description}</p>
                          <Badge variant="outline" className="text-xs text-orange-700 border-orange-200">
                            {reading.source}
                          </Badge>
                        </div>
                        <ExternalLink className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Hands-on Activities */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  Try at Home
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resources.activities?.map((activity, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">{activity.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                    <div className="mt-2 p-2 bg-white rounded border border-green-200">
                      <p className="text-xs font-medium text-gray-700 mb-1">Materials needed:</p>
                      <p className="text-xs text-gray-600">{activity.materials}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Australian Connection */}
            {resources.australian_connection && (
              <Card className="border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🇦🇺</span>
                    Australian Connection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{resources.australian_connection}</p>
                </CardContent>
              </Card>
            )}

            <Button 
              onClick={generateResources}
              variant="outline"
              className="w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Regenerate Resources
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}