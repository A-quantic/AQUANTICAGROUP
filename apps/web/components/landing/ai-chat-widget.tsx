"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, X, Send, Bot, User } from "lucide-react";

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
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (question: string): string => {
    const lower = question.toLowerCase();
    if (lower.includes("independizar")) {
      return "Para independizar un predio necesitas: 1) Copia literal de la partida registral, 2) Planos aprobados por municipalidad, 3) Certificado de parámetros urbanísticos, 4) Pago de tasas en SUNARP. El trámite toma aproximadamente 45-60 días. ¿Te gustaría que uno de nuestros especialistas revise tu caso específico?";
    }
    if (lower.includes("tarda") || lower.includes("tiempo")) {
      return "El tiempo de un saneamiento varía según el caso: Saneamiento simple (3-6 meses), con observaciones municipales (6-12 meses), casos complejos con linderos (12-18 meses). Te damos garantía de respuesta en 24 horas y un cronograma detallado en tu expediente digital.";
    }
    if (lower.includes("documentos")) {
      return "Los documentos base son: DNI del propietario, Partida registral actualizada, Recibo de agua o luz, Planos si los tienes. Cada caso es único - puedes subir tus documentos a nuestro portal y nuestra IA detectará automáticamente qué falta.";
    }
    if (lower.includes("sunarp") || lower.includes("inscribir")) {
      return "Para inscribir en SUNARP necesitas presentar: Minuta o contrato, Partida registral del antecedente, Tasas pagadas. Lo hacemos por ti incluyendo la elaboración de la minuta. ¿Tienes ya los documentos listos?";
    }
    return "Gracias por tu consulta. Para darte información precisa sobre tu caso específico, te recomiendo agendar una evaluación gratuita con uno de nuestros especialistas. ¿Te gustaría que te contactemos por WhatsApp?";
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
              {isTyping && (
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
                  disabled={!input.trim() || isTyping}
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
