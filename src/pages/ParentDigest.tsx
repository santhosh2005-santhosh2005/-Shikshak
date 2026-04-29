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
  Share2
} from "lucide-react";

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
      riskLevel: "High",
      test: "Phonological Awareness",
      averageTime: 14.2
    };

    // Determine content based on data
    let summary = "";
    let observations = [];
    let suggestions = [];

    if (data.accuracy < 70 || data.riskLevel === "High") {
      summary = "Your child is showing a wonderful effort in their reading tasks! We've noticed that while they have a strong visual memory for pictures, they sometimes find it a bit tricky to match sounds with letters. This is very common and something we can work on together with patience and support.";
      observations = [
        "Strong ability to remember visual patterns and images",
        "Takes a little extra time to decode new or complex words",
        "Shows great persistence even when tasks get challenging"
      ];
      suggestions = [
        "Try using audio-assisted reading books where the child can listen and follow along",
        "Focus on short, 10-minute fun reading sessions to prevent fatigue",
        "Play rhyming games during everyday activities to strengthen sound awareness"
      ];
    } else {
      summary = "Your child had a very productive learning session today! They showed great focus and were able to complete most tasks with high accuracy. They seem to enjoy structured activities and follow instructions very well.";
      observations = [
        "High level of accuracy in matching and sequencing tasks",
        "Follows step-by-step instructions with great care",
        "Shows a preference for predictable and organized learning environments"
      ];
      suggestions = [
        "Continue providing a quiet, organized space for learning",
        "Use visual schedules to help transition between different activities",
        "Encourage their strengths in detail-oriented tasks"
      ];
    }

    setReport({
      summary,
      observations,
      suggestions,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
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
