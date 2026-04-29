import { useState, useRef, useEffect } from "react";
import { Upload, MessageSquare, FileText, Send, Loader2, Trash2, Sparkles } from "lucide-react";
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
import { Cpu } from "lucide-react";
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
  const [provider, setProvider] = useState<AIProvider>("gemini");
  
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
    <div className={`min-h-screen ${isNeo ? "font-bold bg-grid" : "font-sans"} text-black`}>
      <Navbar />
      <TTSBanner />

      <div className={`container mx-auto max-w-7xl ${settings.textToSpeech ? 'pt-36' : 'pt-24'} px-4 pb-8`}>
        {/* Header */}
        <div className="mb-6 text-center">
          <TTSText text="AI Chat with PDF">
            <h1 className={`text-5xl md:text-6xl font-black mb-3 ${isNeo ? "uppercase" : ""}`}>
              AI <span className="text-primary">Chat</span> with PDF
            </h1>
          </TTSText>
          <TTSText text="Upload your PDF and ask questions to get instant AI-powered answers">
            <p className={`text-lg ${isNeo ? "font-bold" : "text-gray-600"}`}>
              Upload your PDF and ask questions to get instant AI-powered answers
            </p>
          </TTSText>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          {/* Left Panel - PDF Upload */}
          <div className={`lg:col-span-1 rounded-2xl border-2 ${isNeo ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "border-gray-200 bg-white shadow-sm"} p-6 flex flex-col`}>
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <TTSText text="Upload PDF">Upload PDF</TTSText>
            </h2>

            {!pdfFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${
                  isNeo ? "border-black" : "border-gray-300"
                }`}
              >
                <Upload className={`h-16 w-16 mb-4 ${isNeo ? "text-black" : "text-gray-400"}`} />
                <p className="text-lg font-bold mb-2">Click to upload PDF</p>
                <p className={`text-sm ${isNeo ? "font-medium" : "text-gray-500"}`}>
                  Maximum 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className={`p-4 rounded-xl mb-4 ${isNeo ? "bg-[#86EFAC] border-4 border-black" : "bg-green-50 border-2 border-green-200"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="h-6 w-6 mt-1" />
                      <div className="flex-1">
                        <p className="font-bold text-sm truncate">{pdfFile.name}</p>
                        {pdfInfo && (
                          <p className={`text-xs mt-1 ${isNeo ? "font-medium" : "text-gray-600"}`}>
                            {pdfInfo.pages} pages • {pdfInfo.size}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRemovePDF}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {isSummarizing ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
                      <p className="font-bold">Generating summary...</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className={`text-sm mb-3 ${isNeo ? "font-medium" : "text-gray-600"}`}>
                      PDF uploaded! You can now:
                    </p>
                    <ul className={`space-y-2 text-sm ${isNeo ? "font-medium" : "text-gray-600"}`}>
                      <li className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Ask questions about the content
                      </li>
                      <li className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Get detailed explanations
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Summarize sections
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Chat */}
          <div className={`lg:col-span-2 rounded-2xl border-2 ${isNeo ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "border-gray-200 bg-white shadow-sm"} flex flex-col`}>
            {/* Chat Header */}
            <div className={`p-4 border-b-2 ${isNeo ? "border-black" : "border-gray-200"} flex items-center justify-between`}>
              <h2 className="text-xl font-black flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <TTSText text="Chat">Chat</TTSText>
              </h2>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" />
                  <Select value={provider} onValueChange={(val) => setProvider(val as AIProvider)}>
                    <SelectTrigger className={`w-[140px] h-8 text-xs ${isNeo ? "border-2 border-black font-bold" : ""}`}>
                      <SelectValue placeholder="Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini">Gemini Pro</SelectItem>
                      <SelectItem value="openai">OpenAI (GPT-3.5)</SelectItem>
                      <SelectItem value="groq">Groq (Llama 3)</SelectItem>
                      <SelectItem value="openrouter">OpenRouter</SelectItem>
                      <SelectItem value="ollama">Ollama (Local)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearChat}
                  className="text-xs"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {!pdfFile ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <MessageSquare className={`h-20 w-20 mx-auto mb-4 ${isNeo ? "text-black" : "text-gray-300"}`} />
                    <TTSText text="Upload a PDF to start chatting">
                      <p className="text-xl font-black mb-2">
                        Upload a PDF to start chatting
                      </p>
                    </TTSText>
                    <p className={`text-sm ${isNeo ? "font-medium" : "text-gray-500"}`}>
                      Upload a PDF document on the left, then ask any questions about its content.
                    </p>
                  </div>
                </div>
              ) : messages.length === 0 && !isSummarizing ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4" />
                    <p className="text-lg font-black">Processing your PDF...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.role === "user"
                              ? isNeo
                                ? "bg-[#86EFAC] border-4 border-black"
                                : "bg-primary text-primary-foreground"
                              : isNeo
                              ? "bg-[#FEF08A] border-4 border-black"
                              : "bg-gray-100"
                          }`}
                        >
                          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className={`rounded-2xl px-4 py-3 ${isNeo ? "bg-[#FEF08A] border-4 border-black" : "bg-gray-100"}`}>
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm font-bold">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className={`p-4 border-t-2 ${isNeo ? "border-black" : "border-gray-200"}`}>
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={pdfFile ? "Ask a question about your PDF..." : "Upload a PDF first..."}
                  disabled={!pdfFile || isLoading}
                  className={`flex-1 ${isNeo ? "border-4 border-black font-bold" : ""}`}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!pdfFile || isLoading || !inputMessage.trim()}
                  size="icon"
                  className={isNeo ? "border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : ""}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className={`text-xs mt-2 text-center ${isNeo ? "font-medium" : "text-gray-500"}`}>
                Press Enter to send • AI may not always be accurate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
