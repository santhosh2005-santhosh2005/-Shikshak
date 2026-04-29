import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { ArrowRight, Check, AlertCircle, Clock, Target, Brain, Lightbulb, HelpCircle } from "lucide-react";
import { useAccessibility } from "@/components/AccessibilitySettings";
import { getStyles, neoColors } from "@/lib/design-system";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateInsights, InsightData } from "@/lib/insightGenerator";

interface TestResults {
  test: string;
  accuracy: number;
  averageTime: number;
  timeScore: number;
  riskFactors: string[];
  riskLevel: "Low" | "Moderate" | "High";
  correctAnswers: number;
  totalQuestions: number;
}

const Results = () => {
  const [results, setResults] = useState<TestResults | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings } = useAccessibility();
  const isNeo = settings.uiTheme === "neo";
  const s = getStyles(settings.uiTheme);

  useEffect(() => {
    const storedResults = localStorage.getItem("testResults");
    if (storedResults) {
      try {
        setResults(JSON.parse(storedResults));
      } catch (error) { console.error(error); }
    }
    setIsLoaded(true);
  }, []);

  const intelligentInsights = useMemo(() => {
    if (!results) return null;
    const insightData: InsightData = {
      accuracy: results.accuracy,
      averageTime: results.averageTime,
      timeScore: results.timeScore,
      riskLevel: results.riskLevel,
      riskFactors: results.riskFactors,
      testType: results.test
    };
    return generateInsights(insightData);
  }, [results]);

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "High": return AlertCircle;
      case "Moderate": return Clock;
      default: return Check;
    }
  };

  const getDyslexiaMessage = (riskLevel: string) => {
    switch (riskLevel) {
      case "High": return { title: "High Indication", message: "Patterns associated with dyslexia detected. Professional evaluation recommended." };
      case "Moderate": return { title: "Moderate Signs", message: "Some challenges related to dyslexia suggest professional assessment." };
      default: return { title: "Low Indication", message: "Good processing speed. Professional evaluation may still be beneficial if difficulties persist." };
    }
  };

  return (
    <ScrollArea className="h-screen" style={!isNeo ? { backgroundColor: 'var(--app-bg)' } : { backgroundColor: '#ffffff' }}>
      <div className={`min-h-screen ${isNeo ? "font-bold bg-grid" : "font-sans"} text-black`}>
        <Navbar />
        
        <div className="container mx-auto pt-32 pb-20 px-4 relative z-0">
          <div className={`max-w-5xl mx-auto transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
               <span className={s.tag}>ANALYSIS</span>
               <AnimatedHeading delay={200} className={`${s.sectionTitle} text-center`}>TEST ANALYSIS.</AnimatedHeading>
               {results && <p className={s.textMuted}>{results.test} - COMPLETE ASSESSMENT</p>}
            </div>
            
            {results ? (
              <div className="space-y-10">
                {/* Risk Assessment */}
                <div className={`${s.card} ${isNeo ? (results.riskLevel === 'High' ? 'bg-[#FDA4AF]' : 'bg-[#86EFAC]') : 'bg-white'}`}>
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className={`w-20 h-20 border-4 border-black flex items-center justify-center bg-white ${isNeo ? "" : "rounded-full"}`}>
                       {React.createElement(getRiskIcon(results.riskLevel), { className: "h-10 w-10" })}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                       <h3 className="text-3xl font-black uppercase mb-2">
                        {getDyslexiaMessage(results.riskLevel).title}
                       </h3>
                       <p className="font-bold leading-tight mb-4">
                        {getDyslexiaMessage(results.riskLevel).message}
                       </p>
                       <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                          {results.riskFactors.map((f, i) => (
                            <span key={i} className="bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase">{f}</span>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className={`${s.card} ${isNeo ? "bg-[#FEF08A]" : "bg-white"} text-center`}>
                    <Target className="h-10 w-10 mx-auto mb-4" />
                    <div className="text-4xl font-black">{results.accuracy.toFixed(1)}%</div>
                    <div className="text-xs font-black uppercase">Reading Accuracy</div>
                  </div>
                  <div className={`${s.card} ${isNeo ? "bg-[#86EFAC]" : "bg-white"} text-center`}>
                    <Clock className="h-10 w-10 mx-auto mb-4" />
                    <div className="text-4xl font-black">{results.averageTime.toFixed(1)}s</div>
                    <div className="text-xs font-black uppercase">Avg Response</div>
                  </div>
                  <div className={`${s.card} ${isNeo ? "bg-[#D8B4FE]" : "bg-white"} text-center`}>
                    <Brain className="h-10 w-10 mx-auto mb-4" />
                    <div className="text-4xl font-black">{results.timeScore.toFixed(1)}%</div>
                    <div className="text-xs font-black uppercase">Processing Speed</div>
                  </div>
                </div>

                {/* Intelligent Insights */}
                {intelligentInsights && (
                  <div className="space-y-8">
                    <div className={`${s.card} ${isNeo ? "bg-[#D1FAE5]" : "bg-white"}`}>
                      <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2"><HelpCircle /> UNDERSTANDING YOUR RESULTS</h3>
                      <p className="font-bold mb-6">{intelligentInsights.primary.why}</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <div className="text-[10px] font-black uppercase mb-1">Your Strength</div>
                          <p className="font-black text-sm">{intelligentInsights.primary.strength}</p>
                        </div>
                        <div className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <div className="text-[10px] font-black uppercase mb-1">Focus Area</div>
                          <p className="font-black text-sm">{intelligentInsights.primary.challenge}</p>
                        </div>
                      </div>
                    </div>

                    <div className={`${s.card} ${isNeo ? "bg-[#FEF08A]" : "bg-white"}`}>
                       <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2"><Lightbulb /> RECOMMENDED ACTIONS</h3>
                       <div className="space-y-4">
                          {intelligentInsights.primary.whatToDo.slice(0, 4).map((a, i) => (
                            <div key={i} className="bg-white border-4 border-black p-4 font-bold flex gap-4 items-center">
                               <div className="h-8 w-8 bg-black text-white flex items-center justify-center font-black">{i+1}</div>
                               {a}
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex flex-wrap gap-4 justify-center mt-12">
                   <Link to="/learning-mode" className={s.btnPrimary}>START LEARNING <ArrowRight /></Link>
                   <Link to="/improve" className={s.btnSecondary} style={!isNeo ? { backgroundColor: 'var(--card-bg)' } : {}}>IMPROVEMENT ACTIVITIES</Link>
                   <Link to="/tests" className={s.btnSecondary} style={!isNeo ? { backgroundColor: 'var(--card-bg)' } : {}}>TAKE ANOTHER TEST</Link>
                </div>
              </div>
            ) : (
              <div className={`${s.card} text-center py-20 bg-white`}>
                <p className="text-xl font-black uppercase mb-8">No results found.</p>
                <Link to="/tests" className={s.btnPrimary}>GO TO TESTS</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Results;
