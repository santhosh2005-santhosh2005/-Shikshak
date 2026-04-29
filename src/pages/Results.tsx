
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { ArrowRight, Info, Check, AlertCircle, Clock, Target, Brain } from "lucide-react";

interface TestResults {
  test: string;
  accuracy: number;
  averageTime: number;
  timeScore: number;
  riskFactors: string[];
  riskLevel: "Low" | "Moderate" | "High";
  correctAnswers: number;
  totalQuestions: number;
  detailedResults?: Array<{
    questionIndex: number;
    isCorrect: boolean;
    timeSpent: number;
    difficulty: string;
  }>;
}

const Results = () => {
  const [results, setResults] = useState<TestResults | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedResults = localStorage.getItem("testResults");
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        // Validate that the results have the required properties
        if (parsedResults && 
            typeof parsedResults.test === 'string' && 
            typeof parsedResults.accuracy === 'number') {
          setResults(parsedResults);
        }
      } catch (error) {
        console.error("Failed to parse test results:", error);
      }
    }
    
    setIsLoaded(true);
  }, []);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "High": return "text-red-600 bg-red-100 border-red-300";
      case "Moderate": return "text-amber-600 bg-amber-100 border-amber-300";
      default: return "text-green-600 bg-green-100 border-green-300";
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "High": return AlertCircle;
      case "Moderate": return Clock;
      default: return Check;
    }
  };

  const getDyslexiaMessage = (riskLevel: string, riskFactors: string[]) => {
    switch (riskLevel) {
      case "High":
        return {
          title: "High Indication of Dyslexia",
          message: "Your test results show several patterns commonly associated with dyslexia. We strongly recommend consulting with a learning specialist or educational psychologist for a comprehensive evaluation."
        };
      case "Moderate":
        return {
          title: "Moderate Signs of Reading Difficulties",
          message: "Your results suggest some challenges that may be related to dyslexia. Consider discussing these findings with an educational professional who can provide more detailed assessment."
        };
      default:
        return {
          title: "Low Indication of Dyslexia",
          message: "Your test performance shows good reading comprehension and processing speed. However, if you continue to experience reading difficulties, professional evaluation may still be beneficial."
        };
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      
      <div className="absolute inset-0 -z-10 bg-grid"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
      
      <div className="container mx-auto pt-32 pb-20 px-4 md:pt-40 relative z-0">
        <div className={`max-w-5xl mx-auto transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <AnimatedHeading delay={200} className="text-3xl md:text-4xl font-bold mb-4">
              Your Detailed Test Analysis
            </AnimatedHeading>
            {results && (
              <p className="text-lg text-muted-foreground">
                {results.test} - Comprehensive Results & Dyslexia Assessment
              </p>
            )}
          </div>
          
          {results ? (
            <div className="space-y-8">
              {/* Dyslexia Risk Assessment */}
              <Card className={`border-2 ${getRiskColor(results.riskLevel)}`}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className={`flex-shrink-0 rounded-full p-3 ${getRiskColor(results.riskLevel)}`}>
                      {React.createElement(getRiskIcon(results.riskLevel), { className: "h-6 w-6" })}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        {getDyslexiaMessage(results.riskLevel, results.riskFactors).title}
                      </h3>
                      <p className="text-sm mb-4">
                        {getDyslexiaMessage(results.riskLevel, results.riskFactors).message}
                      </p>
                      
                      {results.riskFactors && results.riskFactors.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Identified Factors:</h4>
                          <ul className="text-sm space-y-1">
                            {results.riskFactors.map((factor, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary">
                      {typeof results.accuracy === 'number' ? results.accuracy.toFixed(1) : 'N/A'}%
                    </h3>
                    <p className="text-sm text-muted-foreground">Reading Accuracy</p>
                    <p className="text-xs mt-2">
                      {results.correctAnswers} of {results.totalQuestions} correct
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-600">
                      {typeof results.averageTime === 'number' ? results.averageTime.toFixed(1) : 'N/A'}s
                    </h3>
                    <p className="text-sm text-muted-foreground">Average Time</p>
                    <p className="text-xs mt-2">Per question</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-purple-600">
                      {typeof results.timeScore === 'number' ? results.timeScore.toFixed(1) : 'N/A'}%
                    </h3>
                    <p className="text-sm text-muted-foreground">Processing Speed</p>
                    <p className="text-xs mt-2">Compared to typical</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Question Analysis */}
              {results.detailedResults && results.detailedResults.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Question-by-Question Analysis</h3>
                    <div className="space-y-3">
                      {results.detailedResults.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              result.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">
                                Question {index + 1} - {result.difficulty} difficulty
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {result.isCorrect ? 'Correct' : 'Incorrect'} in {result.timeSpent.toFixed(1)}s
                              </p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            result.timeSpent > 30 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {result.timeSpent > 30 ? 'Slow' : 'Good pace'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Next Steps */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 rounded-full p-2 bg-blue-100 text-blue-600">
                      <Info className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Recommended Next Steps</h3>
                      <div className="space-y-3">
                        {results.riskLevel === "High" && (
                          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-sm font-medium text-red-800 mb-2">Immediate Recommendations:</p>
                            <ul className="text-sm text-red-700 space-y-1 list-disc pl-4">
                              <li>Schedule an appointment with an educational psychologist</li>
                              <li>Contact your local dyslexia association for resources</li>
                              <li>Explore our improvement activities for immediate support</li>
                            </ul>
                          </div>
                        )}
                        
                        {results.riskLevel === "Moderate" && (
                          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-sm font-medium text-amber-800 mb-2">Suggested Actions:</p>
                            <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
                              <li>Consider professional assessment for detailed evaluation</li>
                              <li>Try our dyslexia improvement exercises</li>
                              <li>Use reading aids and accessibility tools</li>
                            </ul>
                          </div>
                        )}

                        <div className="flex gap-3 mt-4">
                          <Button size="sm" variant="outline" asChild>
                            <Link to="/about">Learn More About Dyslexia</Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link to="/improve">Try Improvement Activities</Link>
                          </Button>
                          <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
                            <Link to="/learning-mode">Start Personalized Learning</Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link to="/tests">Take Another Test</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-lg">No test results found. Please take a test first.</p>
              <Button className="mt-6" asChild>
                <Link to="/tests">Go to Tests</Link>
              </Button>
            </Card>
          )}
          
          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg" className="gap-2 rounded-full px-6" asChild>
              <Link to="/">
                Back to Home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
