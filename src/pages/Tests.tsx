
import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { TestCard } from "@/components/TestCard";
import { BookOpen, Eye, Clock, List, Search, Users, Baby, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Tests = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const testsAges6to9 = [
    {
      title: "Picture Reading",
      description: "Look at pictures and choose the right word - fun and easy!",
      icon: <BookOpen className="h-5 w-5" />,
      link: "/reading-test-6-9"
    },
    {
      title: "Sound Games",
      description: "Listen to sounds and pick the matching pictures",
      icon: <Eye className="h-5 w-5" />,
      link: "/phonological-test-6-9"
    },
    {
      title: "Memory Match",
      description: "Remember pictures and find them again - like a memory game!",
      icon: <Clock className="h-5 w-5" />,
      link: "/memory-test-6-9"
    },
    {
      title: "Story Order",
      description: "Put pictures in the right order to tell a story",
      icon: <List className="h-5 w-5" />,
      link: "/sequencing-test-6-9"
    },
  ];

  const testsAges9to12 = [
    {
      title: "Reading Skills",
      description: "Read short stories and answer simple questions",
      icon: <BookOpen className="h-5 w-5" />,
      link: "/reading-test-9-12"
    },
    {
      title: "Word Sounds",
      description: "Identify sounds in words and spell simple words",
      icon: <Eye className="h-5 w-5" />,
      link: "/phonological-test-9-12"
    },
    {
      title: "Remember & Repeat",
      description: "Listen to instructions and follow them in order",
      icon: <Clock className="h-5 w-5" />,
      link: "/memory-test-9-12"
    },
    {
      title: "Put in Order",
      description: "Arrange words and sentences in the correct sequence",
      icon: <List className="h-5 w-5" />,
      link: "/sequencing-test-9-12"
    },
  ];

  const testsAbove12 = [
    {
      title: "Reading Fluency",
      description: "Assess how quickly and accurately you can read text passages",
      icon: <BookOpen className="h-5 w-5" />,
      link: "/reading-test"
    },
    {
      title: "Phonological Awareness",
      description: "Test your ability to identify and manipulate sounds in words",
      icon: <Eye className="h-5 w-5" />,
      link: "/phonological-test"
    },
    {
      title: "Working Memory",
      description: "Measure your capacity to hold and manipulate information",
      icon: <Clock className="h-5 w-5" />,
      link: "/memory-test"
    },
    {
      title: "Sequencing",
      description: "Evaluate your ability to arrange items in the correct order",
      icon: <List className="h-5 w-5" />,
      link: "/sequencing-test"
    },
    {
      title: "Spelling & Writing",
      description: "Check your spelling skills and writing abilities",
      icon: <Search className="h-5 w-5" />,
      link: "/spelling-test"
    },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      
      <div className="absolute inset-0 -z-10 bg-grid"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
      
      <div className="container mx-auto pt-32 pb-20 px-4 md:pt-40 relative z-0">
        <div className={`max-w-5xl mx-auto text-center space-y-6 transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <AnimatedHeading delay={200} className="text-4xl md:text-5xl font-bold mb-8">
            Dyslexia Screening Tests
          </AnimatedHeading>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Choose the right assessment for your age group. Each test is designed specifically for different developmental stages and provides immediate feedback.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto mt-16">
          <Tabs defaultValue="above-12" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="6-9" className="flex items-center gap-2">
                <Baby className="h-4 w-4" />
                6-9 Years
              </TabsTrigger>
              <TabsTrigger value="9-12" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                9-12 Years
              </TabsTrigger>
              <TabsTrigger value="above-12" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Above 12 Years
              </TabsTrigger>
            </TabsList>

            <TabsContent value="6-9" className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Fun Learning Games (Ages 6-9)</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Designed for young learners with colorful, interactive activities. Each game takes about 2-3 minutes.
                  <br />
                  <span className="text-sm font-medium text-primary mt-2 block">
                    Parents: Please assist your child as needed and ensure they're comfortable.
                  </span>
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {testsAges6to9.map((test, i) => (
                  <div 
                    key={i} 
                    className="opacity-0 animate-fade-in"
                    style={{ animationDelay: `${300 + i * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    <TestCard
                      title={test.title}
                      description={test.description}
                      icon={test.icon}
                      link={test.link}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="9-12" className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Learning Assessments (Ages 9-12)</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Age-appropriate tests that build on reading and learning skills. Each assessment takes about 3-4 minutes.
                  <br />
                  <span className="text-sm font-medium text-primary mt-2 block">
                    Take your time and don't worry about getting everything perfect!
                  </span>
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {testsAges9to12.map((test, i) => (
                  <div 
                    key={i} 
                    className="opacity-0 animate-fade-in"
                    style={{ animationDelay: `${300 + i * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    <TestCard
                      title={test.title}
                      description={test.description}
                      icon={test.icon}
                      link={test.link}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="above-12" className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Comprehensive Screening (Above 12 Years)</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Detailed assessments for teens and adults. Each test takes approximately 3-5 minutes and provides comprehensive feedback.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {testsAbove12.map((test, i) => (
                  <div 
                    key={i} 
                    className="opacity-0 animate-fade-in"
                    style={{ animationDelay: `${300 + i * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    <TestCard
                      title={test.title}
                      description={test.description}
                      icon={test.icon}
                      link={test.link}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-16 p-6 md:p-8 bg-card rounded-xl border shadow-sm">
            <div className="grid md:grid-cols-[1fr_2fr] gap-6">
              <div className="flex items-center justify-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="h-10 w-10 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">How these tests work</h3>
                <p className="text-muted-foreground">
                  Our age-specific screening tests are designed to identify potential signs of dyslexia by measuring key 
                  skills appropriate for each developmental stage. Younger children get visual, interactive activities while 
                  older participants receive more comprehensive assessments.
                </p>
                <div className="mt-4 text-sm text-muted-foreground/80">
                  <strong>Note:</strong> These screenings are not a substitute for a formal evaluation by a qualified professional.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tests;
