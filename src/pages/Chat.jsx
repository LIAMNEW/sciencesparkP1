
import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Loader2, BookOpen, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import ResourceRecommender from "../components/learning/ResourceRecommender";

const NESA_CONTEXT = `You are an expert NSW Science teacher for Years 7-10 students (Stage 4 and Stage 5). You teach following the NSW Science 7-10 (2023) syllabus.

STAGE 4 (Years 7-8) Focus Areas:
- Working Scientifically (SC4-WS-01 to SC4-WS-08): Observation, questioning, planning, conducting investigations, data processing, analysis, problem-solving, communication
- Observing the Universe (SC4-OTU-01): Scientific observations, space science, Aboriginal astronomy
- Forces (SC4-FOR-01): Contact/non-contact forces, magnets, simple machines
- Cells and Classification (SC4-CLS-01): Cell structures, classification of living things
- Solutions and Mixtures (SC4-SOL-01): Properties of matter, solutions, separation techniques
- Living Systems (SC4-LIV-01): Body systems, plant systems, ecosystems
- Periodic Table and Atomic Structure (SC4-PRT-01): Elements, atomic structure, periodic table patterns
- Change (SC4-CHG-01): Energy transfers, geological and chemical change
- Data Science 1 (SC4-DA1-01): Scientific models, data collection and analysis

STAGE 5 (Years 9-10) Focus Areas:
- Working Scientifically (SC5-WS-01 to SC5-WS-08): Advanced skills including hypothesis development, ethical investigations, evaluation
- Energy (SC5-EGY-01): Conservation of energy, energy sources, electrical circuits
- Disease (SC5-DIS-01): Homeostasis, infectious/non-infectious diseases, prevention
- Materials (SC5-MAT-01): Resources, chemical bonding, organic chemistry, polymers
- Environmental Sustainability (SC5-ENV-01): Sustainability principles, climate science, recycling
- Genetics and Evolutionary Change (SC5-GEV-01, SC5-GEV-02): DNA, inheritance, genetic technologies, evolution
- Reactions (SC5-RXN-01, SC5-RXN-02): Conservation of mass, chemical reactions, nuclear reactions
- Waves and Motion (SC5-WAM-01, SC5-WAM-02): Wave properties, sound, light, Newton's laws
- Data Science 2 (SC5-DA2-01): Scientific claims vs pseudoscience, large datasets, statistical analysis

Your teaching style:
- Friendly, encouraging, and age-appropriate (12-16 years old)
- Use Australian examples and context (Australian scientists, locations, species)
- Include Aboriginal and Torres Strait Islander perspectives when relevant (astronomy, classification, sustainable practices)
- Break down complex concepts simply with real-world connections
- Encourage curiosity and scientific thinking
- Mention relevant NESA outcomes when appropriate
- Use emojis occasionally for engagement
- Emphasize working scientifically skills (observation, questioning, investigation)
- Connect topics across disciplines (biology, chemistry, physics, geology)`;

export default function Chat() {
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [error, setError] = useState(null); // Added error state
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const urlParams = new URLSearchParams(window.location.search);
  const topicParam = urlParams.get("topic");

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    if (user && !sessionId) {
      createNewSession();
    }
  }, [user]);

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', sessionId],
    queryFn: () => base44.entities.ChatMessage.filter({ session_id: sessionId }, 'created_date'),
    enabled: !!sessionId,
    initialData: []
  });

  const createNewSession = async () => {
    try {
      const session = await base44.entities.ChatSession.create({
        student_id: user.id,
        topic: topicParam || "general",
        title: topicParam ? `Learning about ${topicParam}` : "New Conversation",
        last_message: "Started new conversation",
        message_count: 0
      });
      setSessionId(session.id);
      setCurrentTopic(topicParam);
      setError(null); // Clear any previous errors

      if (topicParam) {
        await sendInitialMessage(session.id, topicParam);
      }
    } catch (err) {
      console.error("Session creation error:", err);
      setError("Failed to start chat session. Please refresh the page.");
    }
  };

  const sendInitialMessage = async (sessionId, topic) => {
    try {
      const greeting = await base44.integrations.Core.InvokeLLM({
        prompt: `${NESA_CONTEXT}

A student just started learning about: ${topic}

Write a warm, engaging greeting (2-3 sentences) to:
1. Welcome them enthusiastically
2. Briefly mention why this topic is interesting and relevant to NSW students
3. Ask what specific aspect they'd like to explore first

Be friendly, encouraging and mention any relevant real-world Australian connections!`,
        add_context_from_internet: false
      });

      await base44.entities.ChatMessage.create({
        session_id: sessionId,
        role: "assistant",
        content: greeting
      });

      queryClient.invalidateQueries(['messages', sessionId]);
    } catch (err) {
      console.error("Initial message error:", err);
      // Not setting an error message for the user here as it's less critical
      // and the chat might still be functional.
    }
  };

  const sendMessageMutation = useMutation({
    mutationFn: async (message) => {
      setIsLoading(true);
      setError(null); // Clear previous errors when sending a new message

      try {
        await base44.entities.ChatMessage.create({
          session_id: sessionId,
          role: "user",
          content: message
        });

        const history = await base44.entities.ChatMessage.filter(
          { session_id: sessionId }, 
          'created_date'
        );

        const conversationHistory = history.slice(-6).map(m => 
          `${m.role === 'user' ? 'Student' : 'Teacher'}: ${m.content}`
        ).join('\n\n');

        const response = await base44.integrations.Core.InvokeLLM({
          prompt: `${NESA_CONTEXT}

Conversation so far:
${conversationHistory}

Student's latest question: "${message}"

Provide a helpful, educational response that:
- Answers their question clearly using NSW syllabus content
- Uses Year 7-10 appropriate language
- Includes Australian examples when relevant (scientists, locations, species, applications)
- Relates to working scientifically skills when appropriate
- Encourages further learning and scientific thinking
- Mentions relevant NESA outcome codes if directly applicable

Keep response concise (3-5 paragraphs max). Be warm and encouraging.`,
          add_context_from_internet: false
        });

        await base44.entities.ChatMessage.create({
          session_id: sessionId,
          role: "assistant",
          content: response
        });

        await base44.entities.ChatSession.update(sessionId, {
          last_message: message.slice(0, 100),
          message_count: history.length + 2
        });

        setIsLoading(false);
        return response;
      } catch (err) {
        setIsLoading(false);
        setError("Failed to send message. Please try again.");
        console.error("Send message error:", err);
        throw err; // Re-throw the error so react-query can handle it if needed
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', sessionId]);
      setInput("");
      setError(null); // Clear error on successful send
    },
    onError: () => {
      setIsLoading(false); // Ensure loading state is reset on error
    }
  });

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessageMutation.mutate(input);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user || !sessionId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (showResources && currentTopic) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => setShowResources(false)} className="mb-6">
            Back to Chat
          </Button>
          <ResourceRecommender 
            topic={currentTopic}
            outcomes={[]}
            studentLevel="intermediate"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">ScienceSpark AI Tutor</h1>
              <p className="text-sm text-gray-600">NSW Science 7-10 (2023) Expert</p>
            </div>
          </div>
          {currentTopic && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowResources(true)}
              className="hidden md:flex"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Get Resources
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {error && ( // Display error message here
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {error}
            </motion.div>
          )}
          
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                )}
                <Card className={`max-w-[80%] p-4 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none shadow-lg' 
                    : 'bg-white border-purple-100 shadow-md'
                }`}>
                  <div className={`prose prose-sm max-w-none ${message.role === 'user' ? 'prose-invert' : ''}`}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <Card className="p-4 bg-white border-purple-100">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  <span className="text-gray-600">Thinking...</span>
                </div>
              </Card>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-purple-100 p-4">
        <div className="max-w-4xl mx-auto">
          {currentTopic && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowResources(true)}
              className="mb-3 md:hidden w-full"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Get Learning Resources
            </Button>
          )}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about NSW Science..."
              className="flex-1 border-purple-200 focus:border-purple-400"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
