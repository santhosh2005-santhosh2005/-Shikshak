import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { motion } from "framer-motion";
import { useAccessibility } from "@/components/AccessibilitySettings";
import { 
  ArrowRight, 
  Brain, 
  BookOpen, 
  Users, 
  Clock, 
  Target, 
  Heart,
  Lightbulb,
  Award,
  Globe,
  CheckCircle,
  Calendar,
  Stethoscope,
  GraduationCap,
  Search
} from "lucide-react";

const About = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings } = useAccessibility();
  const animationsDisabled = settings.disableAnimations;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const timelineEvents = [
    {
      year: "1896",
      title: "First Recognition",
      description: "Dr. W. Pringle Morgan first described 'congenital word blindness' - what we now know as dyslexia.",
      icon: BookOpen,
      color: "bg-blue-500"
    },
    {
      year: "1925",
      title: "Research Expansion",
      description: "Samuel Orton began systematic studies of reading difficulties and developed early intervention methods.",
      icon: Search,
      color: "bg-green-500"
    },
    {
      year: "1970s",
      title: "Scientific Understanding",
      description: "Researchers discovered that dyslexia is neurobiological in origin, not a result of laziness or lack of intelligence.",
      icon: Brain,
      color: "bg-purple-500"
    },
    {
      year: "1990",
      title: "Legal Recognition",
      description: "The Americans with Disabilities Act recognized dyslexia as a disability, ensuring educational accommodations.",
      icon: Award,
      color: "bg-orange-500"
    },
    {
      year: "2000s",
      title: "Technology Revolution",
      description: "Digital tools and assistive technologies transformed how people with dyslexia learn and work.",
      icon: Globe,
      color: "bg-cyan-500"
    },
    {
      year: "2020+",
      title: "AI-Powered Solutions",
      description: "Modern AI and machine learning enable early detection and personalized interventions like our platform.",
      icon: Lightbulb,
      color: "bg-pink-500"
    }
  ];

  const facts = [
    {
      icon: Users,
      stat: "1 in 10",
      label: "People have dyslexia",
      description: "Dyslexia affects about 15-20% of the population, making it one of the most common learning differences."
    },
    {
      icon: Brain,
      stat: "80%",
      label: "Go undiagnosed",
      description: "Many people with dyslexia never receive proper diagnosis or support, especially women and minorities."
    },
    {
      icon: Target,
      stat: "98%",
      label: "Can learn to read",
      description: "With proper instruction and support, nearly all people with dyslexia can become successful readers."
    },
    {
      icon: GraduationCap,
      stat: "40%",
      label: "Of self-made millionaires",
      description: "Have dyslexia, showing that different thinking styles can be tremendous strengths."
    }
  ];

  const myths = [
    {
      myth: "Dyslexia means reading letters backwards",
      truth: "Dyslexia is primarily about difficulty connecting sounds to letters, not visual confusion.",
      icon: BookOpen
    },
    {
      myth: "People with dyslexia aren't intelligent",
      truth: "Dyslexia has no connection to intelligence. Many brilliant minds have dyslexia.",
      icon: Brain
    },
    {
      myth: "Children will outgrow dyslexia",
      truth: "Dyslexia is lifelong, but with proper support, people can develop excellent reading skills.",
      icon: Clock
    },
    {
      myth: "Dyslexia only affects reading",
      truth: "Dyslexia can impact writing, spelling, math, and organizational skills too.",
      icon: Target
    }
  ];

  const TimelineEvent = ({ event, index }: { event: typeof timelineEvents[0], index: number }) => (
    <motion.div
      initial={animationsDisabled ? {} : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={animationsDisabled ? {} : { opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`flex items-center gap-6 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full ${event.color} flex items-center justify-center`}>
                <event.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-2xl font-bold text-primary">{event.year}</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <p className="text-muted-foreground">{event.description}</p>
          </CardContent>
        </Card>
      </div>
      <div className="w-4 h-4 bg-primary rounded-full relative z-10"></div>
      <div className="flex-1"></div>
    </motion.div>
  );

  const FactCard = ({ fact, index }: { fact: typeof facts[0], index: number }) => (
    <motion.div
      initial={animationsDisabled ? {} : { opacity: 0, y: 20 }}
      whileInView={animationsDisabled ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardContent className="p-0">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <fact.icon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-3xl font-bold text-primary mb-2">{fact.stat}</h3>
          <h4 className="text-lg font-semibold mb-3">{fact.label}</h4>
          <p className="text-sm text-muted-foreground">{fact.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  const MythCard = ({ myth, index }: { myth: typeof myths[0], index: number }) => (
    <motion.div
      initial={animationsDisabled ? {} : { opacity: 0, y: 20 }}
      whileInView={animationsDisabled ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <myth.icon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-2">Myth: {myth.myth}</h4>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-green-600">Truth:</span> {myth.truth}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      
      <div className="absolute inset-0 -z-10 bg-grid"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <div className="container mx-auto pt-32 pb-20 px-4 md:pt-40 relative z-0">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <AnimatedHeading delay={200} className="text-4xl md:text-5xl font-bold mb-6">
              Understanding <span className="text-primary">Dyslexia</span>
            </AnimatedHeading>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Dyslexia is a learning difference that affects how the brain processes written language. 
              It's not about intelligence—it's about thinking differently.
            </p>
            <Button size="lg" className="gap-2" asChild>
              <Link to="/tests">
                Take Our Assessment
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Key Facts Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">The Numbers Tell the Story</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {facts.map((fact, index) => (
                <FactCard key={index} fact={fact} index={index} />
              ))}
            </div>
          </section>

          {/* Timeline Section */}
          <section className="mb-20">
            <motion.div
              initial={animationsDisabled ? {} : { opacity: 0, y: 20 }}
              whileInView={animationsDisabled ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">A Journey Through History</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From first recognition to modern AI-powered solutions, here's how our understanding of dyslexia has evolved.
              </p>
            </motion.div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-primary/20 h-full"></div>
              
              <div className="space-y-12">
                {timelineEvents.map((event, index) => (
                  <TimelineEvent key={index} event={event} index={index} />
                ))}
              </div>
            </div>
          </section>

          {/* Myths vs Facts Section */}
          <section className="mb-20">
            <motion.div
              initial={animationsDisabled ? {} : { opacity: 0, y: 20 }}
              whileInView={animationsDisabled ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Breaking Down Myths</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Let's dispel common misconceptions and share the truth about dyslexia.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {myths.map((myth, index) => (
                <MythCard key={index} myth={myth} index={index} />
              ))}
            </div>
          </section>

          {/* What Dyslexia Actually Is */}
          <section className="mb-20">
            <motion.div
              initial={animationsDisabled ? {} : { opacity: 0, y: 20 }}
              whileInView={animationsDisabled ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card/50 rounded-2xl p-8 md:p-12"
            >
              <h2 className="text-3xl font-bold mb-6 text-center">What Dyslexia Really Is</h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-lg text-muted-foreground mb-6">
                    Dyslexia is a neurobiological condition that affects the way the brain processes language. 
                    It's characterized by difficulties with:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Phonological processing (connecting sounds to letters)",
                      "Reading fluency and accuracy",
                      "Spelling and writing",
                      "Working memory for language tasks"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-16 w-16 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Brain imaging shows that people with dyslexia use different neural pathways when reading.
                  </p>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Strengths Section */}
          <section className="mb-20">
            <motion.div
              initial={animationsDisabled ? {} : { opacity: 0, y: 20 }}
              whileInView={animationsDisabled ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">The Dyslexic Advantage</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                People with dyslexia often have remarkable strengths that can lead to extraordinary achievements.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Lightbulb,
                  title: "Creative Thinking",
                  description: "Enhanced ability to think outside the box and see unique solutions to problems."
                },
                {
                  icon: Target,
                  title: "Big Picture Vision",
                  description: "Excellent at seeing patterns, connections, and the overall context of situations."
                },
                {
                  icon: Heart,
                  title: "Entrepreneurial Spirit",
                  description: "Strong problem-solving skills and resilience that often lead to business success."
                }
              ].map((strength, index) => (
                <motion.div
                  key={index}
                  initial={animationsDisabled ? {} : { opacity: 0, y: 20 }}
                  whileInView={animationsDisabled ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <strength.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{strength.title}</h3>
                      <p className="text-muted-foreground">{strength.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <motion.div
            initial={animationsDisabled ? {} : { opacity: 0, y: 20 }}
            whileInView={animationsDisabled ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-primary/5 rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Learn More About Yourself?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our comprehensive screening can help you understand your learning profile and discover your unique strengths.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link to="/tests">
                  Start Your Assessment
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/support">Find Resources</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
