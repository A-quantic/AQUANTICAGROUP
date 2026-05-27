"use client";

import { useState, useRef, useEffect } from "react";
import { useAIChat } from "@/hooks/use-ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/components/ui/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  "¿Qué trámite necesito para independizar?",
  "¿Cuánto tarda un saneamiento?",
  "¿Qué documentos necesito?",
  "¿Cómo inscribo en SUNARP?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "¡Hola! Soy AURA, tu asistente virtual especializado en saneamiento físico legal y normativa inmobiliaria peruana. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ]);
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
        content:
          "Lo siento, hubo un error procesando tu consulta. Por favor intenta de nuevo o contactanos por WhatsApp al 977 498 144.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-serif font-bold text-white">
          Chat con AURA
        </h1>
        <p className="text-white/50 mt-1">
          Tu asistente virtual especializado en normativa inmobiliaria peruana
        </p>
      </div>

      <Card className="flex-1 bg-navy-mid border-gold/10 flex flex-col overflow-hidden">
        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === "user"
                    ? "bg-gold/20"
                    : "bg-gold/10 border border-gold/30"
                )}
              >
                {message.role === "user" ? (
                  <User className="w-5 h-5 text-gold" />
                ) : (
                  <Sparkles className="w-5 h-5 text-gold" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[80%] p-4 rounded-lg",
                  message.role === "user"
                    ? "bg-gold text-navy"
                    : "bg-white/5 text-white border border-gold/10"
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p
                  className={cn(
                    "text-xs mt-2",
                    message.role === "user"
                      ? "text-navy/60"
                      : "text-white/40"
                  )}
                >
                  {message.timestamp.toLocaleTimeString("es-PE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {aiChat.isPending && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-gold" />
              </div>
              <div className="bg-white/5 border border-gold/10 p-4 rounded-lg">
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
            <div className="pt-4">
              <p className="text-xs text-white/40 mb-2">Preguntas frecuentes:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-xs bg-white/5 hover:bg-gold/20 border border-gold/20 hover:border-gold text-white/70 hover:text-white px-3 py-1.5 rounded transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        {/* Input */}
        <div className="p-4 border-t border-gold/10 bg-navy/50">
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
              placeholder="Escribe tu pregunta sobre saneamiento, SUNARP, COFOPRI..."
              className="bg-white/5 border-gold/20 focus:border-gold flex-1"
              disabled={aiChat.isPending}
            />
            <Button
              type="submit"
              variant="gold"
              size="icon"
              disabled={!input.trim() || aiChat.isPending}
            >
              {aiChat.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
          <p className="text-xs text-white/40 mt-2 text-center">
            AURA es un asistente de IA especializado. Para casos complejos, te
            recomendamos contactar directamente con nuestros especialistas.
          </p>
        </div>
      </Card>
    </div>
  );
}
