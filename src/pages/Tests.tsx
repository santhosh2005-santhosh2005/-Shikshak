import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { TestCard } from "@/components/TestCard";
import { BookOpen, Eye, Clock, List, Search, Users, Baby, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccessibility } from "@/components/AccessibilitySettings";
import { getStyles } from "@/lib/design-system";
import { ScrollArea } from "@/components/ui/scroll-area";

const Tests = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings } = useAccessibility();
  const isNeo = settings.uiTheme === "neo";
  const s = getStyles(settings.uiTheme);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const testsAges6to9 = [
    { title: "Picture Reading", description: "Look at pictures and choose the right word - fun and easy!", icon: <BookOpen className="h-5 w-5" />, link: "/reading-test-6-9" },
    { title: "Sound Games", description: "Listen to sounds and pick the matching pictures", icon: <Eye className="h-5 w-5" />, link: "/phonological-test-6-9" },
    { title: "Memory Match", description: "Remember pictures and find them again - like a memory game!", icon: <Clock className="h-5 w-5" />, link: "/memory-test-6-9" },
    { title: "Story Order", description: "Put pictures in the right order to tell a story", icon: <List className="h-5 w-5" />, link: "/sequencing-test-6-9" },
  ];

  const testsAges9to12 = [
    { title: "Reading Skills", description: "Read short stories and answer simple questions", icon: <BookOpen className="h-5 w-5" />, link: "/reading-test-9-12" },
    { title: "Word Sounds", description: "Identify sounds in words and spell simple words", icon: <Eye className="h-5 w-5" />, link: "/phonological-test-9-12" },
    { title: "Remember & Repeat", description: "Listen to instructions and follow them in order", icon: <Clock className="h-5 w-5" />, link: "/memory-test-9-12" },
    { title: "Put in Order", description: "Arrange words and sentences in the correct sequence", icon: <List className="h-5 w-5" />, link: "/sequencing-test-9-12" },
  ];

  const testsAbove12 = [
    { title: "Reading Fluency", description: "Assess how quickly and accurately you can read text passages", icon: <BookOpen className="h-5 w-5" />, link: "/reading-test" },
    { title: "Phonological Awareness", description: "Test your ability to identify and manipulate sounds in words", icon: <Eye className="h-5 w-5" />, link: "/phonological-test" },
    { title: "Working Memory", description: "Measure your capacity to hold and manipulate information", icon: <Clock className="h-5 w-5" />, link: "/memory-test" },
    { title: "Sequencing", description: "Evaluate your ability to arrange items in the correct order", icon: <List className="h-5 w-5" />, link: "/sequencing-test" },
    { title: "Spelling & Writing", description: "Check your spelling skills and writing abilities", icon: <Search className="h-5 w-5" />, link: "/spelling-test" },
  ];

  return (
    <ScrollArea className="h-screen" style={!isNeo ? { backgroundColor: 'var(--app-bg)' } : { backgroundColor: '#ffffff' }}>
      <div className={`min-h-screen ${isNeo ? "font-bold bg-grid" : "font-sans"} text-black`}>
        <Navbar />
        
        <div className={`container mx-auto pt-32 pb-20 px-4 relative z-0`}>
          <div className={`max-w-5xl mx-auto text-center space-y-6 transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
             <span className={s.tag}>SCREENING CENTER</span>
             <AnimatedHeading delay={200} className={`${s.sectionTitle} text-5xl md:text-8xl text-center`}>
              CHOOSE YOUR <span className={isNeo ? "bg-[#FEF08A] px-4" : "text-gray-500"}>JOURNEY</span>
            </AnimatedHeading>
            
            <p className={`${s.textBase} text-xl md:text-2xl max-w-2xl mx-auto ${isNeo ? "uppercase font-black" : ""}`}>
              Assessment specifically for your age group. immediate feedback for every mind.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto mt-16">
            <Tabs defaultValue="above-12" className="w-full">
              <TabsList className={`grid w-full grid-cols-3 mb-12 ${isNeo ? "bg-black p-1 border-4 border-black" : ""}`}>
                <TabsTrigger value="6-9" className={`flex items-center gap-2 ${isNeo ? "data-[state=active]:bg-[#86EFAC] text-black font-black uppercase" : ""}`}>
                  <Baby className="h-4 w-4" /> 6-9 Years
                </TabsTrigger>
                <TabsTrigger value="9-12" className={`flex items-center gap-2 ${isNeo ? "data-[state=active]:bg-[#FDA4AF] text-black font-black uppercase" : ""}`}>
                  <Users className="h-4 w-4" /> 9-12 Years
                </TabsTrigger>
                <TabsTrigger value="above-12" className={`flex items-center gap-2 ${isNeo ? "data-[state=active]:bg-[#D8B4FE] text-black font-black uppercase" : ""}`}>
                  <GraduationCap className="h-4 w-4" /> Above 12
                </TabsTrigger>
              </TabsList>

              <TabsContent value="6-9" className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {testsAges6to9.map((test, i) => (
                    <TestCard key={i} {...test} index={i} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="9-12" className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {testsAges9to12.map((test, i) => (
                    <TestCard key={i} {...test} index={i} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="above-12" className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testsAbove12.map((test, i) => (
                    <TestCard key={i} {...test} index={i} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className={`mt-20 p-8 ${isNeo ? "border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white" : "rounded-3xl bg-white border shadow-sm"}`} style={!isNeo ? { backgroundColor: 'var(--card-bg)' } : {}}>
              <div className="grid md:grid-cols-[1fr_3fr] gap-8">
                <div className="flex items-center justify-center">
                  <div className={`w-24 h-24 bg-black text-white flex items-center justify-center ${isNeo ? "" : "rounded-full"}`}>
                    <Clock className="h-10 w-10" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-4 uppercase">HOW THESE TESTS WORK</h3>
                  <p className={s.textBase}>
                    Our age-specific screening tests identify potential signs of dyslexia by measuring key 
                    skills for each stage. Younger children get visual activities while 
                    older participants receive comprehensive assessments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Tests;
