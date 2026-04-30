import { useState, useRef, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccessibility } from "@/components/AccessibilitySettings";
import { 
  Youtube, 
  Pencil, 
  Eraser, 
  Trash2, 
  Undo, 
  Download, 
  Maximize2, 
  Settings2,
  ChevronRight,
  Plus,
  Play,
  FileText,
  Palette,
  Sparkles,
  CheckCircle2,
  Paperclip,
  Upload,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TTSText, TTSBanner } from "@/components/TTSText";
import { extractTextFromPDF } from "@/lib/pdfExtractor";

const CourseRoom = () => {
  const { settings } = useAccessibility();
  const { toast } = useToast();
  const isNeo = settings.uiTheme === "neo";
  
  const [ytUrl, setYtUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("whiteboard");
  
  // PDF Resource State
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Whiteboard state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState<"pencil" | "eraser">("pencil");
  
  // Notes state
  const [notes, setNotes] = useState("");

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(ytUrl);
    if (id) {
      setVideoId(id);
      toast({
        title: "Course Created!",
        description: "Your YouTube video is ready. Let's start learning!",
      });
    } else {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube link.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setIsAnalyzing(true);
      try {
        const text = await extractTextFromPDF(file);
        setPdfText(text);
        toast({ title: "Analysis Complete", description: "PDF processed successfully!" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to process PDF.", variant: "destructive" });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  // Canvas Logic
  useEffect(() => {
    if (activeTab === "whiteboard" && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      
      if (canvas.width === 0 || canvas.width !== rect.width * 2) {
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        const context = canvas.getContext("2d");
        if (context) {
          context.scale(2, 2);
          context.lineCap = "round";
          context.strokeStyle = color;
          context.lineWidth = lineWidth;
          contextRef.current = context;
          
          context.fillStyle = "white";
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
      } else {
        const context = canvas.getContext("2d");
        if (context) {
          contextRef.current = context;
        }
      }
    }
  }, [activeTab, color, lineWidth]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
      contextRef.current.lineWidth = tool === "eraser" ? lineWidth * 4 : lineWidth;
    }
  }, [color, lineWidth, tool]);

  const startDrawing = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    const { offsetX, offsetY } = getCoordinates(nativeEvent);
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(nativeEvent);
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const finishDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const getCoordinates = (event: any) => {
    if (event.touches) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        return {
          offsetX: event.touches[0].clientX - rect.left,
          offsetY: event.touches[0].clientY - rect.top,
        };
      }
    }
    return {
      offsetX: event.offsetX,
      offsetY: event.offsetY,
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) {
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className={`h-screen flex flex-col ${isNeo ? "bg-white font-bold" : "bg-[#f8fafc] font-sans"} overflow-hidden text-black`}>
      <Navbar />
      <TTSBanner />
      
      <main className="flex-1 flex flex-col pt-24 pb-6 px-6 overflow-hidden">
        {!videoId ? (
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className={`w-20 h-20 mx-auto flex items-center justify-center ${isNeo ? "bg-[#FEF08A] border-4 border-black" : "bg-primary/10 text-primary rounded-3xl"}`}>
                <Play className="w-10 h-10" />
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">
                <TTSText text="Create Your Course">Create Your Course</TTSText>
              </h1>
              <p className="text-gray-500 font-medium">
                <TTSText text="Paste a YouTube link to transform it into an interactive learning room.">
                  Paste a YouTube link to transform it into an interactive learning room.
                </TTSText>
              </p>
            </motion.div>

            <form onSubmit={handleUrlSubmit} className="w-full space-y-4">
              <div className="relative">
                <Input 
                  value={ytUrl}
                  onChange={(e) => setYtUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={`h-16 px-6 text-lg ${isNeo ? "border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none" : "rounded-2xl border-gray-200"}`}
                />
                <Button 
                  type="submit"
                  className={`absolute right-2 top-2 h-12 px-8 ${isNeo ? "bg-black text-white border-none rounded-none font-black" : "rounded-xl"}`}
                >
                  START COURSE
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
            {/* Left: Video Player */}
            <div className="flex-[1.2] flex flex-col gap-4 overflow-hidden">
              <div className={`relative aspect-video w-full overflow-hidden ${isNeo ? "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "rounded-3xl shadow-xl shadow-slate-200"}`}>
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  className="absolute inset-0 w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Right: Interaction Area */}
            <div className="flex-1 flex flex-col min-h-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                <TabsList className={`grid w-full grid-cols-3 mb-4 p-1 ${isNeo ? "bg-black border-4 border-black" : "bg-slate-100 rounded-2xl"}`}>
                  <TabsTrigger 
                    value="whiteboard" 
                    className={`font-black uppercase text-xs h-10 ${isNeo ? "data-[state=active]:bg-[#FEF08A] rounded-none text-white data-[state=active]:text-black" : "rounded-xl"}`}
                  >
                    <Palette className="w-4 h-4 mr-2" /> Whiteboard
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notes"
                    className={`font-black uppercase text-xs h-10 ${isNeo ? "data-[state=active]:bg-[#D8B4FE] rounded-none text-white data-[state=active]:text-black" : "rounded-xl"}`}
                  >
                    <FileText className="w-4 h-4 mr-2" /> Notes
                  </TabsTrigger>
                  <TabsTrigger 
                    value="resources"
                    className={`font-black uppercase text-xs h-10 ${isNeo ? "data-[state=active]:bg-[#FDA4AF] rounded-none text-white data-[state=active]:text-black" : "rounded-xl"}`}
                  >
                    <Paperclip className="w-4 h-4 mr-2" /> Resources
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 min-h-0">
                  <TabsContent value="whiteboard" className="h-full m-0 flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2 p-2 overflow-x-auto no-scrollbar">
                      <div className={`flex items-center gap-1 p-1 ${isNeo ? "border-2 border-black bg-white" : "bg-white rounded-xl border"}`}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setTool("pencil")}
                          className={`h-9 w-9 ${tool === "pencil" ? (isNeo ? "bg-black text-white" : "bg-primary/10 text-primary") : ""}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setTool("eraser")}
                          className={`h-9 w-9 ${tool === "eraser" ? (isNeo ? "bg-black text-white" : "bg-primary/10 text-primary") : ""}`}
                        >
                          <Eraser className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className={`flex items-center gap-2 p-1 px-3 ${isNeo ? "border-2 border-black bg-white" : "bg-white rounded-xl border"}`}>
                        {[ "#000000", "#ef4444", "#3b82f6", "#22c55e", "#f59e0b" ].map((c) => (
                          <button
                            key={c}
                            onClick={() => { setColor(c); setTool("pencil"); }}
                            className={`w-5 h-5 rounded-full border-2 border-black/10 transition-transform hover:scale-125 ${color === c && tool === "pencil" ? "scale-125 border-black" : ""}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>

                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={clearCanvas}
                        className={`h-9 w-9 ${isNeo ? "border-2 border-black bg-white hover:bg-red-50" : "bg-white rounded-xl border"}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className={`flex-1 relative bg-white overflow-hidden cursor-crosshair ${isNeo ? "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "rounded-3xl border border-slate-200"}`}>
                      <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={finishDrawing}
                        onMouseLeave={finishDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={finishDrawing}
                        className="w-full h-full touch-none"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="h-full m-0">
                    <div className={`h-full p-6 flex flex-col ${isNeo ? "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "bg-white rounded-3xl border border-slate-200"}`}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 ${isNeo ? "bg-black text-white" : "bg-primary/10 text-primary rounded-lg"}`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <Input 
                              placeholder="Note Title..."
                              className={`h-8 border-none bg-transparent font-black uppercase text-sm p-0 focus-visible:ring-0`}
                            />
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Last updated: Just now</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`h-8 gap-1.5 font-black uppercase text-[10px] ${isNeo ? "border-2 border-black" : "bg-gray-50 hover:bg-gray-100"}`}
                            onClick={() => {
                              toast({
                                title: "AI Refinement",
                                description: "Refining your notes for clarity and structure...",
                              });
                            }}
                          >
                            <Sparkles className="w-3 h-3 text-purple-500" />
                            AI Refine
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`h-8 w-8 ${isNeo ? "border-2 border-black" : "bg-gray-50"}`}
                            onClick={() => {
                              const blob = new Blob([notes], { type: "text/plain" });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = "lesson_notes.txt";
                              a.click();
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto px-1 custom-scrollbar">
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Start typing your lesson notes here... The AI can help you refine them later!"
                          className="w-full h-full bg-transparent border-none focus:ring-0 resize-none text-lg leading-relaxed outline-none min-h-[300px]"
                        />
                      </div>
                      
                      <div className="mt-4 pt-4 border-t flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Auto-saved</span>
                          <span>{notes.split(/\s+/).filter(Boolean).length} words</span>
                        </div>
                        <span>Characters: {notes.length}</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="resources" className="h-full m-0">
                    <div className={`h-full p-8 flex flex-col items-center justify-center text-center ${isNeo ? "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "bg-white rounded-3xl border border-slate-200"}`}>
                      {pdfFile ? (
                        <div className="space-y-6 w-full">
                          <div className={`w-20 h-20 mx-auto flex items-center justify-center ${isNeo ? "bg-[#FDA4AF] border-4 border-black" : "bg-red-50 text-red-500 rounded-3xl"}`}>
                            <FileText className="w-10 h-10" />
                          </div>
                          <div>
                            <h3 className="text-xl font-black uppercase">{pdfFile.name}</h3>
                            <p className="text-sm text-gray-500 font-bold uppercase">Ready for Analysis</p>
                          </div>
                          <div className="flex gap-4 justify-center">
                            <Button 
                              onClick={() => {
                                toast({
                                  title: "AI Analysis",
                                  description: "Summarizing resource for your lesson...",
                                });
                              }}
                              className={isNeo ? "bg-[#86EFAC] border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : ""}
                            >
                              <Sparkles className="w-4 h-4 mr-2" /> Summarize
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setPdfFile(null);
                                setPdfText("");
                              }}
                              className={isNeo ? "border-4 border-black font-black" : ""}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className={`w-20 h-20 mx-auto flex items-center justify-center ${isNeo ? "bg-gray-100 border-4 border-black" : "bg-slate-50 text-slate-400 rounded-3xl"}`}>
                            <Paperclip className="w-10 h-10" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-black uppercase">Study Materials</h3>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto">Upload a PDF textbook or worksheet to study alongside the video.</p>
                          </div>
                          <Button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isAnalyzing}
                            className={isNeo ? "bg-[#FDA4AF] border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : ""}
                          >
                            {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                            Upload Resource
                          </Button>
                          <input 
                            ref={fileInputRef} 
                            type="file" 
                            accept=".pdf" 
                            className="hidden" 
                            onChange={handleFileUpload}
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseRoom;
