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
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">PARENT PORTAL</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 mb-4">Today's Report</h1>
            <p className="text-lg text-gray-500">Simple, supportive insights into your child's journey.</p>
          </motion.div>

          {!report && !isGenerating && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm text-center p-12">
              <div className="h-20 w-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready for an update?</h3>
              <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto">
                Our AI will analyze your child's recent activities and create a supportive summary just for you.
              </p>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg px-8 py-4 rounded-full transition-colors inline-flex items-center gap-2 shadow-sm"
                onClick={generateParentSummary}
              >
                Generate Today's Report
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
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                          <FileText className="h-8 w-8 text-blue-500" /> Today's Report
                        </h2>
                        <div className="flex items-center gap-2 mt-3 font-medium text-gray-500">
                          <Calendar className="h-4 w-4" /> {report.date}
                        </div>
                      </div>
                      <button className="p-2.5 bg-white rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors border border-gray-200 shadow-sm">
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-8 md:p-10 space-y-12">
                    <section>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Heart className="h-5 w-5 text-rose-500" /> Summary
                      </h3>
                      <p className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed bg-rose-50/50 p-6 rounded-2xl">
                        {report.summary}
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-500" /> Key Observations
                      </h3>
                      <ul className="space-y-4 bg-blue-50/30 p-6 rounded-2xl">
                        {report.observations.map((obs: string, i: number) => (
                          <li key={i} className="flex items-start gap-4">
                            <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                            <span className="text-lg text-gray-700">{obs}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500" /> Suggestions for Home
                      </h3>
                      <div className="grid gap-4 bg-amber-50/30 p-6 rounded-2xl">
                        {report.suggestions.map((sug: string, i: number) => (
                          <div key={i} className="flex gap-4 items-start">
                            <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
                              {i + 1}
                            </div>
                            <span className="text-lg text-gray-700 pt-0.5">{sug}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="pt-8 border-t border-gray-100 flex justify-center">
                      <button 
                        className="text-gray-500 hover:text-gray-900 font-medium px-6 py-2 transition-colors"
                        onClick={() => setReport(null)}
                      >
                        Generate New Report
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-center font-medium text-gray-400 text-sm">
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
