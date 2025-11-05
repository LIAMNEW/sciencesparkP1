import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Loader2, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

const NESA_CONTEXT = `You are an expert NSW Science teacher for Years 7-8 students. You teach following the NESA curriculum.

Key NESA Outcomes you support:
- Working Scientifically: SC4-WS-01 to SC4-WS-08
- Living World: SC4-LW-01 (Cells), SC4-LW-02 (Body Systems)
- Chemical World: SC4-CW-01 (Mixtures), SC4-CW-02 (Atoms)
- Physical World: SC4-FOR-01 (Forces), SC4-MOT-01 (Energy)
- Earth & Space: SC4-GEA-01 (Rock Cycle), SC4-OUT-01 (Universe)

Your teaching style:
- Friendly, encouraging, and age-appropriate
- Use Australian examples and context
- Break down complex concepts simply
- Encourage curiosity and questions
- Mention relevant NESA outcomes when appropriate
- Provide real-world connections
- Use emojis occasionally for engagement`;

export default function Chat() {
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    const session = await base44.entities.ChatSession.create({
      student_id: user.id,
      topic: topicParam || "general",
      title: topicParam ? `Learning about ${topicParam}` : "New Conversation",
      last_message: "Started new conversation",
      message_count: 0
    });
    setSessionId(session.id);

    // Send initial greeting
    if (topicParam) {
      await sendInitialMessage(session.id, topicParam);
    }
  };

  const sendInitialMessage = async (sessionId, topic) => {
    const greeting = await base44.integrations.Core.InvokeLLM({
      prompt: `${NESA_CONTEXT}

A student just started learning about: ${topic}

Write a warm, engaging greeting (2-3 sentences) to:
1. Welcome them
2. Briefly mention why this topic is interesting
3. Ask what they'd like to know

Be friendly and encouraging!`,
      add_context_from_internet: false
    });

    await base44.entities.ChatMessage.create({
      session_id: sessionId,
      role: "assistant",
      content: greeting
    });

    queryClient.invalidateQueries(['messages', sessionId]);
  };

  const sendMessageMutation = useMutation({
    mutationFn: async (message) => {
      setIsLoading(true);

      // Save user message
      await base44.entities.ChatMessage.create({
        session_id: sessionId,
        role: "user",
        content: message
      });

      // Get conversation history
      const history = await base44.entities.ChatMessage.filter(
        { session_id: sessionId }, 
        'created_date'
      );

      // Build conversation context
      const conversationHistory = history.slice(-6).map(m => 
        `${m.role === 'user' ? 'Student' : 'Teacher'}: ${m.content}`
      ).join('\n\n');

      // Generate AI response
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${NESA_CONTEXT}

Conversation so far:
${conversationHistory}

Student's latest question: "${message}"

Provide a helpful, educational response that:
- Answers their question clearly
- Uses appropriate Year 7-8 level language
- Includes Australian examples when relevant
- Encourages further learning
- Mentions relevant NESA outcomes if applicable

Keep response concise (3-5 paragraphs max).`,
        add_context_from_internet: false
      });

      // Save AI response
      await base44.entities.ChatMessage.create({
        session_id: sessionId,
        role: "assistant",
        content: response
      });

      // Update session
      await base44.entities.ChatSession.update(sessionId, {
        last_message: message.slice(0, 100),
        message_count: history.length + 2
      });

      setIsLoading(false);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', sessionId]);
      setInput("");
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

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">AI Science Tutor</h1>
            <p className="text-sm text-gray-600">Ask me anything about science!</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
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
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about science..."
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
  );
}