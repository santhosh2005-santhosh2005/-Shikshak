import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { WordsPullUp, WordsPullUpMultiStyle, ScrollRevealText } from "@/components/PrismaComponents";

const PrismaLanding = () => {
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });

  const primaryColor = "#E1E0CC";

  const navItems = [
    { name: "Student Login", path: "/auth/login" },
    { name: "Teacher Portal", path: "/auth/teacher-login" },
    { name: "Parent Access", path: "/auth/parent-auth" },
    { name: "About Shikshak", path: "/about" },
    { name: "Resources", path: "/support" },
  ];

  return (
    <div className="bg-black text-white selection:bg-primary/30 selection:text-primary min-h-screen">
      {/* SECTION 1: HERO */}
      <section className="h-screen w-full p-4 md:p-6 flex flex-col relative overflow-hidden">
        <div className="relative flex-1 w-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-[#050505]">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-screen"
          >
            <source src="/shikshak-hero.mp4" type="video/mp4" />
          </video>

          {/* Overlays */}
          <div className="absolute inset-0 noise-overlay opacity-[0.6] mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />

          {/* Navbar */}
          <nav className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-black rounded-b-2xl md:rounded-b-3xl px-4 py-3 md:px-12 flex items-center gap-4 sm:gap-8 md:gap-14 lg:gap-16 border-x border-b border-white/10 shadow-2xl">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-[10px] sm:text-xs md:text-sm font-medium tracking-widest uppercase transition-colors"
                  style={{ color: "rgba(225, 224, 204, 0.8)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#E1E0CC")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(225, 224, 204, 0.8)")}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-20 z-10">
            <div className="flex items-end justify-between">
              {/* Big Title - Bottom Left */}
              <div>
                <WordsPullUp
                  text="Shikshak"
                  showAsterisk
                  className="text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[18vw] font-medium leading-[0.8] tracking-[-0.07em]"
                  style={{ color: primaryColor }}
                />
              </div>
              {/* Button - Bottom Right */}
              <div className="mb-[2vw] flex-shrink-0">
                <Link to="/auth/role-selection">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex items-center gap-2 bg-primary text-black rounded-full pl-6 pr-2 py-2 font-bold text-sm sm:text-base transition-all hover:gap-4"
                  >
                    CHOOSE YOUR ROLE
                    <div className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT — WHITE */}
      <section className="bg-white py-32 px-6 flex flex-col items-center">
        <div className="bg-gray-50 w-full max-w-6xl rounded-[2.5rem] p-12 md:p-24 text-center border border-black/5">
          <span className="text-black/40 text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-8 block font-bold">
            The Mission
          </span>
          
          <div className="mb-12">
            <WordsPullUpMultiStyle
              segments={[
                { text: "We are Shikshak,", className: "font-normal text-black" },
                { text: " a neuro-adaptive platform.", className: "font-serif italic text-black" },
                { text: " We specialize in dyslexia screening, personalized learning, and AI-driven growth metrics.", className: "font-normal text-black" }
              ]}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-4xl mx-auto leading-[1.1] sm:leading-[1.0]"
            />
          </div>

          <ScrollRevealText
            text="Over the last year, we have built a bridge between education and technology. Our algorithms detect learning patterns in real-time, providing students with a calm, focused environment where they can thrive regardless of their starting point."
            className="text-black/70 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
          />
        </div>
      </section>

      {/* SECTION 3: FEATURES */}
      <section className="min-h-screen bg-black py-32 px-6 relative">
        <div className="absolute inset-0 bg-noise opacity-[0.15] pointer-events-none" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="mb-20 text-center space-y-4">
            <WordsPullUpMultiStyle
              segments={[
                { text: "Intelligent tools for neuro-diverse minds.", className: "text-primary" }
              ]}
              className="text-2xl sm:text-4xl md:text-5xl font-normal mb-2"
            />
            <WordsPullUpMultiStyle
              segments={[
                { text: "Built for clarity. Powered by empathy.", className: "text-gray-500" }
              ]}
              className="text-xl sm:text-2xl md:text-3xl font-normal"
            />
          </div>

          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-auto lg:h-[480px]">
            {/* Card 1 - Video Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={featuresInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl overflow-hidden group border border-white/10"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-1000"
              >
                <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4" type="video/mp4" />
              </video>
              <div className="absolute bottom-8 left-8">
                <p className="text-xl font-bold" style={{ color: primaryColor }}>Adaptive learning space.</p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <FeatureCard
              delay={0.15}
              inView={featuresInView}
              icon="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85"
              number="01"
              title="AI Screening."
              items={["Pattern recognition", "Early dyslexia detection", "Empathetic assessment", "Detailed score analysis"]}
            />

            {/* Card 3 */}
            <FeatureCard
              delay={0.3}
              inView={featuresInView}
              icon="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85"
              number="02"
              title="Progress Digest."
              items={["Parent insights", "Teacher student tracking", "AI performance notes", "Real-time milestones"]}
            />

            {/* Card 4 */}
            <FeatureCard
              delay={0.45}
              inView={featuresInView}
              icon="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85"
              number="03"
              title="Focus Tools."
              items={["Reading Ruler", "Text-to-Speech", "Dyslexic-friendly fonts", "Calm UI themes"]}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ delay, inView, icon, number, title, items }: any) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[#1a1a1a] rounded-3xl p-8 flex flex-col border border-white/5 hover:border-primary/20 transition-colors group"
    >
      <div className="flex justify-between items-start mb-12">
        <img src={icon} alt="" className="w-12 h-12 rounded-xl object-cover" />
        <span className="text-primary/40 font-bold text-lg">{number}</span>
      </div>
      <h3 className="text-2xl font-bold text-primary mb-6">{title}</h3>
      <ul className="space-y-4 mb-auto">
        {items.map((item: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-gray-400 text-sm">
            <Check className="h-4 w-4 text-primary" />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <a href="#" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors">
          Learn more
          <ArrowRight className="h-3 w-3 -rotate-45" />
        </a>
      </div>
    </motion.div>
  );
};

export default PrismaLanding;
