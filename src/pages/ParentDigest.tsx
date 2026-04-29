import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Heart, 
  Lightbulb, 
  Target, 
  CheckCircle2, 
  Loader2,
  FileText,
  Calendar,
  Share2,
  Brain,
  Star
} from "lucide-react";
import { generateParentFriendlyInsight, InsightData } from "@/lib/insightGenerator";

const ParentDigest = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [testData, setTestData] = useState<any>(null);

  useEffect(() => {
    const storedResults = localStorage.getItem("testResults");
    if (storedResults) {
      try {
        setTestData(JSON.parse(storedResults));
      } catch (e) {
        console.error("Failed to parse results", e);
      }
    }
  }, []);

  const generateParentSummary = async () => {
    setIsGenerating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock data for generation if no real data exists
    const data = testData || {
      accuracy: 65,
      riskLevel: "High" as const,
      test: "Phonological Awareness",
      averageTime: 14.2,
      learningType: "dyslexia" as const,
      attentionSpan: 45,
      weakAreas: [
        { area: "Reading Speed", level: "Low" },
        { area: "Phonological Awareness", level: "Weak" }
      ]
    };

    // Prepare insight data
    const insightData: InsightData = {
      accuracy: data.accuracy,
      averageTime: data.averageTime,
      timeScore: data.timeScore,
      riskLevel: data.riskLevel,
      learningType: data.learningType,
      attentionSpan: data.attentionSpan,
      weakAreas: data.weakAreas,
      riskFactors: data.riskFactors
    };

    // Generate intelligent parent-friendly insights
    const intelligentInsights = generateParentFriendlyInsight(insightData);

    setReport({
      summary: intelligentInsights.summary,
      observations: intelligentInsights.observations,
      suggestions: intelligentInsights.suggestions,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      learningStyle: data.learningStyle || "Individualized",
      strength: data.strength || "Shows persistent effort"
    });
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-rose-50/30">
      <Navbar />
      
      <div className="container mx-auto pt-32 pb-20 px-4 max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center p-3 bg-rose-100 rounded-2xl mb-4">
            <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Parent Daily Digest</h1>
          <p className="text-slate-600 mt-2">Simple, supportive insights into your child's learning journey</p>
        </motion.div>

        {!report && !isGenerating && (
          <Card className="border-dashed border-2 border-rose-200 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Sparkles className="h-12 w-12 text-rose-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Ready for Today's Update?</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Our AI will analyze your child's recent activities and create a supportive summary just for you.
              </p>
              <Button 
                size="lg" 
                className="bg-rose-500 hover:bg-rose-600 px-8 py-6 text-lg rounded-2xl shadow-lg shadow-rose-200"
                onClick={generateParentSummary}
              >
                Generate Today's Report
              </Button>
            </CardContent>
          </Card>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-12 w-12 text-rose-500 animate-spin" />
            <p className="text-rose-600 font-medium animate-pulse">Creating your supportive summary...</p>
          </div>
        )}

        <AnimatePresence>
          {report && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <Card className="border-none shadow-xl shadow-rose-100 overflow-hidden">
                <CardHeader className="bg-rose-500 text-white p-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <FileText className="h-6 w-6" /> Daily Progress Report
                      </CardTitle>
                      <CardDescription className="text-rose-100 flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" /> {report.date}
                      </CardDescription>
                    </div>
                    <Button variant="secondary" size="icon" className="rounded-full bg-white/20 hover:bg-white/30 border-none text-white">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="p-8 space-y-10 bg-white">
                  {/* Summary Section */}
                  <section className="space-y-4">
                    <h3 className="text-rose-600 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                      <Heart className="h-4 w-4" /> Today's Story
                    </h3>
                    <p className="text-xl text-slate-700 leading-relaxed font-medium">
                      {report.summary}
                    </p>
                  </section>

                  {/* Learning Style & Strength */}
                  {(report.learningStyle || report.strength) && (
                    <section className="space-y-4">
                      <h3 className="text-rose-600 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                        <Brain className="h-4 w-4" /> Your Child's Profile
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {report.learningStyle && (
                          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <div className="text-xs font-bold text-blue-700 uppercase mb-1">Learning Style</div>
                            <p className="text-slate-700 font-medium">{report.learningStyle}</p>
                          </div>
                        )}
                        {report.strength && (
                          <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                            <div className="text-xs font-bold text-green-700 uppercase mb-1 flex items-center gap-1">
                              <Star className="h-3 w-3" /> Key Strength
                            </div>
                            <p className="text-slate-700 font-medium">{report.strength}</p>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {/* Observations */}
                  <section className="space-y-4">
                    <h3 className="text-rose-600 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                      <Target className="h-4 w-4" /> What We Observed
                    </h3>
                    <div className="grid gap-3">
                      {report.observations.map((obs: string, i: number) => (
                        <div key={i} className="flex gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-slate-700">{obs}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Suggestions */}
                  <section className="space-y-4">
                    <h3 className="text-rose-600 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" /> Ways to Support at Home
                    </h3>
                    <div className="grid gap-4">
                      {report.suggestions.map((sug: string, i: number) => (
                        <li key={i} className="list-none flex gap-4 text-slate-600">
                          <div className="h-8 w-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shrink-0 font-bold">
                            {i + 1}
                          </div>
                          <span className="pt-1">{sug}</span>
                        </li>
                      ))}
                    </div>
                  </section>

                  <div className="pt-8 border-t flex justify-center">
                    <Button 
                      variant="outline" 
                      className="text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => setReport(null)}
                    >
                      Generate New Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <p className="text-center text-slate-400 text-sm italic">
                This report was generated with love to help you support your child's unique learning path.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ParentDigest;
