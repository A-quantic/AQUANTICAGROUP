"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, X, Send, Bot, User, Loader2 } from "lucide-react";
import { useAIChat } from "@/hooks/use-ai";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "¡Hola! Soy AURA, el asistente virtual de AQUANTICA. Estoy especializada en saneamiento físico legal, SUNARP y COFOPRI. ¿En qué puedo ayudarte hoy?",
    timestamp: new Date(),
  },
];

const quickQuestions = [
  "¿Qué trámite necesito para independizar?",
  "¿Cuánto tarda un saneamiento?",
  "¿Qué documentos necesito?",
  "¿Cómo inscribo en SUNARP?",
];

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiChat = useAIChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    if (!content.trim() || aiChat.isPending) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await aiChat.mutateAsync({
        message: content,
        sessionId,
      });

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Lo siento, hubo un error. Intenta de nuevo o contáctanos por WhatsApp al 977 498 144.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/30 hover:scale-110 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-navy" />
        ) : (
          <Sparkles className="w-6 h-6 text-navy" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-navy border border-gold/20 rounded-lg shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="bg-gold/10 p-4 border-b border-gold/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-white">AURA</h4>
                  <p className="text-xs text-white/50">
                    IA especializada en normativa peruana
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-gold/20"
                        : "bg-gold/10 border border-gold/30"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-gold" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-gold" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.role === "user"
                        ? "bg-gold text-navy"
                        : "bg-white/5 text-white border border-gold/10"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {aiChat.isPending && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-gold" />
                  </div>
                  <div className="bg-white/5 border border-gold/10 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gold/50 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gold/50 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-gold/50 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />

              {/* Quick Questions */}
              {messages.length < 3 && (
                <div className="pt-2">
                  <p className="text-xs text-white/40 mb-2">Preguntas frecuentes:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="text-xs bg-white/5 hover:bg-gold/20 border border-gold/20 hover:border-gold text-white/70 hover:text-white px-3 py-1.5 rounded transition-colors text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gold/20 bg-navy-mid">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu pregunta..."
                  className="bg-white/5 border-gold/20 focus:border-gold"
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="gold"
                  disabled={!input.trim() || aiChat.isPending}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
