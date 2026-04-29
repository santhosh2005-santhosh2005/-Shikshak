import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessibility } from "@/components/AccessibilitySettings";
import { getStyles, neoColors } from "@/lib/design-system";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sparkles, Heart, Lightbulb, Target, CheckCircle2, 
  Loader2, FileText, Calendar, Share2, Brain, Star 
} from "lucide-react";
import { generateParentFriendlyInsight, InsightData } from "@/lib/insightGenerator";

const ParentDigest = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<any>(null);
  const { settings } = useAccessibility();
  const isNeo = settings.uiTheme === "neo";
  const s = getStyles(settings.uiTheme);

  const generateParentSummary = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockData: InsightData = {
      accuracy: 65,
      riskLevel: "High" as const,
      averageTime: 14.2,
      learningType: "dyslexia" as const,
      attentionSpan: 45,
      weakAreas: [{ area: "Reading Speed", level: "Low" }, { area: "Phonological Awareness", level: "Weak" }]
    };

    const intelligentInsights = generateParentFriendlyInsight(mockData);

    setReport({
      summary: intelligentInsights.summary,
      observations: intelligentInsights.observations,
      suggestions: intelligentInsights.suggestions,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      strength: "Shows persistent effort"
    });
    setIsGenerating(false);
  };

  return (
    <ScrollArea className="h-screen" style={!isNeo ? { backgroundColor: 'var(--app-bg)' } : { backgroundColor: '#ffffff' }}>
      <div className={`min-h-screen ${isNeo ? "font-bold bg-grid" : "font-sans"} text-black`}>
        <Navbar />
        
        <div className="container mx-auto pt-32 pb-20 px-4 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className={s.tag}>PARENT PORTAL</span>
            <h1 className={`${s.sectionTitle} mt-4 text-center`}>DAILY DIGEST.</h1>
            <p className={s.textMuted}>Simple, supportive insights into your child's journey.</p>
          </motion.div>

          {!report && !isGenerating && (
            <div className={`${s.card} ${isNeo ? "bg-[#FDA4AF]" : "bg-white"} text-center p-12`}>
              <Sparkles className="h-16 w-16 mx-auto mb-6" />
              <h3 className="text-2xl font-black uppercase mb-4">READY FOR AN UPDATE?</h3>
              <p className={`${s.textBase} mb-10`}>
                Our AI will analyze your child's recent activities and create a supportive summary just for you.
              </p>
              <button 
                className={s.btnPrimary}
                onClick={generateParentSummary}
              >
                GENERATE TODAY'S REPORT
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <Loader2 className="h-16 w-16 text-black animate-spin" />
              <p className="font-black uppercase tracking-widest animate-pulse">CREATING SUPPORTIVE SUMMARY...</p>
            </div>
          )}

          <AnimatePresence>
            {report && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-10"
              >
                <div className={`${s.card} p-0 overflow-hidden bg-white`}>
                  <div className={`p-8 ${isNeo ? "bg-black text-white" : "bg-gray-100"} border-b-8 border-black`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-3xl font-black uppercase flex items-center gap-3">
                          <FileText className="h-8 w-8" /> PROGRESS REPORT
                        </h2>
                        <div className="flex items-center gap-2 mt-2 font-bold opacity-80">
                          <Calendar className="h-4 w-4" /> {report.date}
                        </div>
                      </div>
                      <button className={`p-2 border-4 border-black ${isNeo ? "bg-white text-black" : "bg-white"}`}>
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-12">
                    <section>
                      <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" /> TODAY'S STORY
                      </h3>
                      <p className="text-xl font-bold leading-tight">{report.summary}</p>
                    </section>

                    <section className="grid md:grid-cols-2 gap-6">
                       <div className={`p-6 border-4 border-black bg-[#86EFAC] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                          <div className="text-xs font-black uppercase mb-2">Key Strength</div>
                          <p className="font-black text-lg">{report.strength}</p>
                       </div>
                       <div className={`p-6 border-4 border-black bg-[#D8B4FE] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                          <div className="text-xs font-black uppercase mb-2">Current Focus</div>
                          <p className="font-black text-lg uppercase">Skill Building</p>
                       </div>
                    </section>

                    <section>
                      <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-500" /> WHAT WE OBSERVED
                      </h3>
                      <div className="space-y-4">
                        {report.observations.map((obs: string, i: number) => (
                          <div key={i} className="flex gap-4 p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                            <span className="font-bold">{obs}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" /> AT-HOME SUPPORT
                      </h3>
                      <div className="grid gap-6">
                        {report.suggestions.map((sug: string, i: number) => (
                          <div key={i} className="flex gap-6">
                            <div className="h-10 w-10 border-4 border-black bg-[#FEF08A] flex items-center justify-center font-black text-xl shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                              {i + 1}
                            </div>
                            <span className="font-bold pt-2">{sug}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="pt-8 border-t-8 border-black flex justify-center">
                      <button 
                        className={s.btnSecondary}
                        onClick={() => setReport(null)}
                      >
                        GENERATE NEW REPORT
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-center font-black uppercase text-sm opacity-50">
                  Created with love for your child's unique path.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ParentDigest;
