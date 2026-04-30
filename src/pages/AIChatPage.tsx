import { useState, useRef, useEffect } from "react";
import { Upload, MessageSquare, FileText, Send, Loader2, Trash2, Sparkles, Plus, History, Settings, Paperclip, Globe, Zap, MoreHorizontal, ArrowUp, Cpu, Mic, MicOff, Volume2, VolumeX, Square, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAccessibility } from "@/components/AccessibilitySettings";
import { TTSText, TTSBanner } from "@/components/TTSText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { extractTextFromPDF, getPDFInfo } from "@/lib/pdfExtractor";
import { chatWithPDF, summarizePDF, ChatMessage, AIProvider } from "@/lib/aiChat";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

const AIChatPage = () => {
  const { settings } = useAccessibility();
  const { toast } = useToast();
  const isNeo = settings.uiTheme === "neo";
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>("");
  const [pdfInfo, setPdfInfo] = useState<{pages: number, size: string} | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [provider, setProvider] = useState<AIProvider>("groq");
  const [isListening, setIsListening] = useState(false);
  const [readingMessageIndex, setReadingMessageIndex] = useState<number | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (isVoiceMode) {
          handleVoiceModeInput(transcript);
        } else {
          setInputMessage(prev => prev + (prev ? " " : "") + transcript);
        }
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error("Failed to start speech recognition", error);
      }
    }
  };

  const speakMessage = (text: string, index: number) => {
    if (readingMessageIndex === index) {
      window.speechSynthesis.cancel();
      setReadingMessageIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    
    // Clean markdown for better speech
    const cleanText = text
      .replace(/[*_#`\[\]()]/g, "")
      .replace(/📄/g, "PDF content")
      .replace(/&nbsp;/g, " ")
      .trim();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1;
    
    utterance.onend = () => setReadingMessageIndex(null);
    utterance.onerror = () => setReadingMessageIndex(null);
    
    // Select a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    // Try to find a premium/natural sounding English voice
    const naturalVoice = 
      voices.find(v => v.name.includes("Google US English")) ||
      voices.find(v => v.name.includes("Natural")) ||
      voices.find(v => v.lang === "en-US") ||
      voices[0];
      
    if (naturalVoice) utterance.voice = naturalVoice;
    
    window.speechSynthesis.speak(utterance);
    setReadingMessageIndex(index);
  };

  // Ensure voices are loaded
  useEffect(() => {
    const handleVoicesChanged = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
  }, []);

  const handleVoiceModeInput = async (transcript: string) => {
    setIsLoading(true);
    const userMessage: ChatMessage = { role: "user", content: transcript };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await chatWithPDF(transcript, pdfText, messages, provider);
      const assistantMessage: ChatMessage = { role: "assistant", content: response };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Automatic speaking in voice mode
      speakMessage(response, messages.length + 1);
    } catch (error) {
      console.error("Voice mode error", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger voice mode speech end to restart listening
  useEffect(() => {
    if (isVoiceMode && readingMessageIndex === null && !isLoading && !isListening) {
      const timer = setTimeout(() => {
        toggleListening();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isVoiceMode, readingMessageIndex, isLoading, isListening]);

  // Handle PDF file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Extract text from PDF
      const text = await extractTextFromPDF(file);
      const info = await getPDFInfo(file);

      setPdfFile(file);
      setPdfText(text);
      setPdfInfo(info);
      setMessages([]);

      toast({
        title: "PDF uploaded successfully!",
        description: `Extracted ${info.pages} pages. You can now start chatting.`,
      });

      // Auto-generate summary
      setIsSummarizing(true);
      const summary = await summarizePDF(text, provider);
      setMessages([
        {
          role: "assistant",
          content: `📄 **PDF Summary**\n\n${summary}\n\nYou can now ask me any questions about this document!`,
        },
      ]);
      setIsSummarizing(false);
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to process PDF.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputMessage.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await chatWithPDF(userMessage.content, pdfText, messages, provider);
      
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Auto-speak if enabled
      if (autoSpeak) {
        setTimeout(() => {
          speakMessage(response, messages.length + 1);
        }, 500);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get response.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear chat
  const handleClearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
    });
  };

  // Remove PDF
  const handleRemovePDF = () => {
    setPdfFile(null);
    setPdfText("");
    setPdfInfo(null);
    setMessages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "PDF removed",
      description: "You can upload a new PDF to continue.",
    });
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isNeo ? "font-bold bg-white" : "font-sans bg-[#f9f9f9]"} text-black`}>
      {/* Sidebar */}
      <div className={`w-16 flex flex-col items-center py-4 border-r ${isNeo ? "border-black border-r-4" : "border-gray-200 bg-white"}`}>
        <div className="mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-10 w-10 rounded-xl ${isNeo ? "bg-black text-white" : "bg-gray-100 text-black"}`}
            onClick={() => handleClearChat()}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex flex-col gap-6 flex-1">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-400 hover:text-black">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-400 hover:text-black">
            <History className="h-5 w-5" />
          </Button>
          {pdfFile && (
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-10 w-10 rounded-xl ${isNeo ? "bg-[#86EFAC] text-black border-2 border-black" : "bg-green-100 text-green-700"}`}
                onClick={() => handleRemovePDF()}
              >
                <FileText className="h-5 w-5" />
              </Button>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
            </div>
          )}
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsVoiceMode(true)}
            className={`h-12 w-12 rounded-2xl transition-all bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:scale-110`}
            title="Open Gemini Voice Mode"
          >
            <Sparkles className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`h-10 w-10 rounded-xl transition-all ${autoSpeak ? "bg-blue-50 text-blue-600 border-2 border-blue-200" : "text-gray-400 hover:text-black"}`}
            title={autoSpeak ? "Turn off Auto-Speak" : "Turn on Auto-Speak"}
          >
            {autoSpeak ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-400 hover:text-black">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Navbar />

        <div className={`flex-1 flex flex-col w-full max-w-4xl mx-auto ${settings.textToSpeech ? 'pt-32' : 'pt-16'} transition-all overflow-hidden`}>
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-black text-gray-900"
                >
                  What can I help with?
                </motion.h1>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className={`rounded-full px-6 border-2 ${isNeo ? "border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-gray-200"}`}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Analyze PDF
                  </Button>
                  <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                </div>
              </div>
            ) : (
              <div className="py-8 space-y-8">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex group ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] px-1 py-1 ${
                          message.role === "user"
                            ? "bg-transparent text-black"
                            : "bg-transparent text-black"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isNeo ? "bg-black" : "bg-primary"}`}>
                              <Sparkles className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-wider text-gray-400">Assistant</span>
                          </div>
                        )}
                        <div className={`text-base leading-relaxed whitespace-pre-wrap ${message.role === "user" ? `px-4 py-3 rounded-3xl ${isNeo ? "bg-[#86EFAC] border-4 border-black" : "bg-gray-100"}` : ""}`}>
                          {message.content}
                        </div>
                        {message.role === "assistant" && (
                          <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={`h-8 w-8 rounded-full ${readingMessageIndex === index ? "text-primary bg-primary/10" : "text-gray-400"}`}
                              onClick={() => speakMessage(message.content, index)}
                            >
                              {readingMessageIndex === index ? (
                                <div className="flex items-end gap-[2px] h-3">
                                  <motion.div 
                                    animate={{ height: [4, 12, 4] }} 
                                    transition={{ repeat: Infinity, duration: 0.6 }} 
                                    className="w-[2px] bg-primary rounded-full" 
                                  />
                                  <motion.div 
                                    animate={{ height: [8, 4, 8] }} 
                                    transition={{ repeat: Infinity, duration: 0.5 }} 
                                    className="w-[2px] bg-primary rounded-full" 
                                  />
                                  <motion.div 
                                    animate={{ height: [4, 10, 4] }} 
                                    transition={{ repeat: Infinity, duration: 0.7 }} 
                                    className="w-[2px] bg-primary rounded-full" 
                                  />
                                </div>
                              ) : (
                                <Volume2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-sm font-bold text-gray-400">Assistant is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-32" />
              </div>
            )}
          </div>

          {/* Input Bar Section */}
          <div className="p-4 md:p-8 w-full max-w-4xl mx-auto">
            <div className={`relative flex flex-col p-2 rounded-[32px] transition-all shadow-lg ${
              isNeo 
                ? "bg-white border-4 border-black" 
                : "bg-white border border-gray-200 shadow-xl shadow-black/5"
            }`}>
              <div className="flex items-center px-4 pt-2">
                <textarea
                  rows={1}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={pdfFile ? "Ask about your PDF..." : "Ask me anything (Math, Science, etc.)..."}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-lg py-2 resize-none outline-none"
                  style={{ minHeight: '44px', maxHeight: '200px' }}
                />
              </div>

              <div className="flex items-center justify-between px-2 pb-2 mt-2">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="h-9 w-9 rounded-full text-gray-400 hover:text-black">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full h-8 px-3 text-xs font-bold text-gray-400 hover:text-black flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" />
                    Deep Search
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full h-8 px-3 text-xs font-bold text-gray-400 hover:text-black flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" />
                    Reason
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-400 hover:text-black">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Select value={provider} onValueChange={(val) => setProvider(val as AIProvider)}>
                    <SelectTrigger className="w-[120px] h-8 text-[10px] uppercase font-black border-none bg-gray-50 rounded-full">
                      <SelectValue placeholder="Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini">Gemini</SelectItem>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="groq">Groq</SelectItem>
                      <SelectItem value="openrouter">OpenRouter</SelectItem>
                      <SelectItem value="ollama">Ollama</SelectItem>
                    </SelectContent>
                  </Select>

                   <Button 
                    onClick={toggleListening}
                    variant="ghost"
                    size="icon"
                    className={`h-10 w-10 rounded-full transition-all ${
                      isListening 
                        ? "bg-red-50 text-red-500 animate-pulse" 
                        : "text-gray-400 hover:text-black"
                    }`}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>

                  <Button 
                    onClick={handleSendMessage}
                    disabled={isLoading || (!inputMessage.trim() && !isListening)}
                    size="icon"
                    className={`h-10 w-10 rounded-full transition-all ${
                      isNeo 
                        ? "bg-black text-white border-4 border-black" 
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-center mt-3 text-gray-400 uppercase font-bold tracking-widest">
              AI Chat can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
      {/* Voice Mode Overlay */}
      <AnimatePresence>
        {isVoiceMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-8"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setIsVoiceMode(false);
                window.speechSynthesis.cancel();
                recognitionRef.current?.stop();
              }}
              className="absolute top-8 right-8 h-12 w-12 text-white/50 hover:text-white"
            >
              <X className="h-8 w-8" />
            </Button>

            <div className="flex-1 flex flex-col items-center justify-center space-y-12 w-full max-w-lg">
              <div className="relative h-64 w-full flex items-center justify-center gap-2">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: isListening || readingMessageIndex !== null ? [20, 100 + Math.random() * 100, 20] : 20,
                      opacity: isListening || readingMessageIndex !== null ? 1 : 0.3
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 0.5 + Math.random() * 0.5,
                      ease: "easeInOut"
                    }}
                    className="w-2 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
                  />
                ))}
              </div>

              <div className="text-center space-y-4">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                  {isListening ? "Listening..." : isLoading ? "Thinking..." : readingMessageIndex !== null ? "Gemini is Speaking" : "Voice Active"}
                </h2>
                <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                  {isListening ? "Speak now, I'm all ears" : "Real-time conversation active"}
                </p>
              </div>

              {messages.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 w-full backdrop-blur-sm">
                  <p className="text-white/80 text-lg text-center leading-relaxed italic">
                    "{messages[messages.length - 1].content.substring(0, 150)}..."
                  </p>
                </div>
              )}
            </div>

            <div className="mt-auto pb-12 flex items-center gap-6">
               <div className={`w-4 h-4 rounded-full ${isListening ? "bg-red-500 animate-ping" : "bg-green-500"}`} />
               <span className="text-white/60 font-black uppercase text-sm tracking-widest">
                 {isListening ? "User Talking" : "System Ready"}
               </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatPage;
