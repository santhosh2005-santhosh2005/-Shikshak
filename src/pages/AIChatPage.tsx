import { useState, useRef, useEffect } from "react";
import { Upload, MessageSquare, FileText, Send, Loader2, Trash2, Sparkles, Plus, History, Settings, Paperclip, Globe, Zap, MoreHorizontal, ArrowUp, Cpu } from "lucide-react";
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    if (!inputMessage.trim() || !pdfText) return;

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
        <div className="mt-auto">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-400 hover:text-black">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Navbar />
        <TTSBanner />

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
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
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
                  placeholder={pdfFile ? "Ask anything..." : "Upload a PDF to get started..."}
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
                    onClick={handleSendMessage}
                    disabled={!pdfFile || isLoading || !inputMessage.trim()}
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
    </div>
  );
};

export default AIChatPage;
