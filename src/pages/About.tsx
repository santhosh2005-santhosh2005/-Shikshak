import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { motion } from "framer-motion";
import { useAccessibility } from "@/components/AccessibilitySettings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getStyles, neoColors } from "@/lib/design-system";
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
  Search
} from "lucide-react";

const About = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings } = useAccessibility();
  const isNeo = settings.uiTheme === "neo";
  const s = getStyles(settings.uiTheme);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const timelineEvents = [
    { year: "1896", title: "First Recognition", description: "Dr. W. Pringle Morgan first described 'congenital word blindness'.", icon: BookOpen },
    { year: "1925", title: "Research Expansion", description: "Samuel Orton began systematic studies of reading difficulties.", icon: Search },
    { year: "1970s", title: "Scientific Understanding", description: "Discovered that dyslexia is neurobiological in origin.", icon: Brain },
    { year: "1990", title: "Legal Recognition", description: "The ADA recognized dyslexia as a disability.", icon: Award },
    { year: "2000s", title: "Technology", description: "Digital tools transformed how people learn and work.", icon: Globe },
    { year: "2020+", title: "AI-Powered", description: "Modern AI enable early detection and personalized interventions.", icon: Lightbulb }
  ];

  const facts = [
    { icon: Users, stat: "1 in 10", label: "Have dyslexia", description: "Affects about 15-20% of the population." },
    { icon: Brain, stat: "80%", label: "Undiagnosed", description: "Many never receive proper diagnosis." },
    { icon: Target, stat: "98%", label: "Can learn", description: "Nearly all can become successful readers." },
    { icon: Heart, stat: "Strength", label: "Advantage", description: "Different thinking styles are strengths." }
  ];

  const myths = [
    { myth: "Reading backwards", truth: "It's about connecting sounds to letters.", icon: BookOpen },
    { myth: "Low intelligence", truth: "No connection. Many brilliant minds have it.", icon: Brain },
    { myth: "Outgrowing it", truth: "It's lifelong, but skills can be developed.", icon: Clock },
    { myth: "Only reading", truth: "Can impact writing, math, and organization.", icon: Target }
  ];

  return (
    <ScrollArea className="h-screen" style={!isNeo ? { backgroundColor: 'var(--app-bg)' } : { backgroundColor: '#ffffff' }}>
      <div className={`min-h-screen ${isNeo ? "font-bold bg-grid" : "font-sans"} text-black`}>
        <Navbar />
        
        {/* HERO SECTION */}
        <section className={`min-h-[70vh] flex items-center pt-32 pb-20 px-4 ${isNeo ? "border-b-8 border-black bg-[#D8B4FE]" : ""}`}>
          <div className="container mx-auto max-w-6xl text-center">
            <motion.div
              initial={settings.disableAnimations ? {} : { opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <span className={s.tag}>ABOUT SHIKSHAK</span>
              <AnimatedHeading delay={200} className={`${s.sectionTitle} text-5xl md:text-8xl mt-6 text-center`}>
                UNDERSTANDING <span className={isNeo ? "bg-white px-4" : "text-gray-500"}>DYSLEXIA</span>
              </AnimatedHeading>
              <p className={`${s.textBase} text-xl md:text-3xl max-w-3xl mx-auto mt-8 ${isNeo ? "uppercase font-black" : ""}`}>
                Dyslexia is a learning difference that affects how the brain processes written language. 
                It's not about intelligence—it's about thinking differently.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FACTS SECTION */}
        <section className={`py-24 px-4 ${isNeo ? "border-y-8 border-black bg-white" : ""}`}>
          <div className="container mx-auto max-w-6xl">
            <h2 className={`${s.sectionTitle} text-center mb-16`}>THE NUMBERS.</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {facts.map((fact, i) => (
                <div key={i} className={`${s.card} ${isNeo ? neoColors[i % 5] : "bg-white"} text-center flex flex-col items-center gap-4`}>
                  <div className={`w-16 h-16 bg-white border-4 border-black flex items-center justify-center ${isNeo ? "" : "rounded-2xl"}`}>
                    <fact.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-4xl font-black">{fact.stat}</h3>
                  <h4 className="text-xl font-bold uppercase">{fact.label}</h4>
                  <p className={s.textMuted}>{fact.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TIMELINE SECTION */}
        <section className={`py-24 px-4 ${isNeo ? "border-b-8 border-black bg-[#FEF08A]" : ""}`}>
          <div className="container mx-auto max-w-6xl">
            <h2 className={`${s.sectionTitle} text-center mb-16`}>HISTORY.</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {timelineEvents.map((event, i) => (
                <div key={i} className={`${s.card} ${isNeo ? "bg-white" : "bg-white"} flex flex-col gap-4`}>
                   <div className="flex items-center gap-4">
                      <div className="bg-black text-white px-3 py-1 font-black text-xl">{event.year}</div>
                      <h3 className="text-xl font-black uppercase">{event.title}</h3>
                   </div>
                   <p className={s.textMuted}>{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MYTHS SECTION */}
        <section className={`py-24 px-4 ${isNeo ? "border-b-8 border-black bg-[#86EFAC]" : ""}`}>
          <div className="container mx-auto max-w-6xl">
            <h2 className={`${s.sectionTitle} text-center mb-16`}>MYTHS VS TRUTH.</h2>
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
              {myths.map((myth, i) => (
                <div key={i} className={`${s.card} ${isNeo ? "bg-white" : "bg-white"} flex flex-col md:flex-row gap-6`}>
                  <div className={`w-16 h-16 flex-shrink-0 bg-black text-white flex items-center justify-center ${isNeo ? "" : "rounded-2xl"}`}>
                    <myth.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-red-600 uppercase mb-2">MYTH: {myth.myth}</h4>
                    <p className={s.textBase}><span className="text-green-600 font-black">TRUTH:</span> {myth.truth}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-5xl">
             <div className={`${isNeo ? "border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] bg-[#FDA4AF]" : "rounded-3xl bg-gray-50 p-12"} p-12 text-center`}>
                <h2 className={`${s.sectionTitle} text-center mb-6`}>READY TO LEARN?</h2>
                <p className={`${s.textBase} text-xl md:text-2xl max-w-2xl mx-auto mb-10 ${isNeo ? "uppercase font-black" : ""}`}>
                   Our comprehensive screening can help you understand your unique learning profile.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/tests" className={s.btnPrimary}>START ASSESSMENT <ArrowRight className="h-6 w-6" /></Link>
                  <Link to="/support" className={s.btnSecondary} style={!isNeo ? { backgroundColor: 'var(--card-bg)' } : {}}>FIND RESOURCES</Link>
                </div>
             </div>
          </div>
        </section>

        <footer className={`text-black border-t-8 border-black bg-white pt-16 pb-12 px-4`}>
          <div className="container mx-auto max-w-6xl text-center">
            <div className="flex flex-col items-center gap-4">
              <div className={s.logo}>S</div>
              <span className="text-4xl font-black text-black uppercase tracking-tighter">SHIKSHAK</span>
              <div className="font-black text-xl">© {new Date().getFullYear()} SHIKSHAK. NEURO-ADAPTIVE PLATFORM.</div>
            </div>
          </div>
        </footer>
      </div>
    </ScrollArea>
  );
};

export default About;
