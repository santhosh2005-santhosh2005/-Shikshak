import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { useAccessibility } from "@/components/AccessibilitySettings";
import { getStyles, neoColors } from "@/lib/design-system";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, Users, Phone, Mail, ExternalLink, Heart, Brain, Download, 
  Globe, Smartphone, Headphones, MonitorSpeaker, PenTool, GraduationCap, 
  Building, MessageCircle, FileText, Zap, Star 
} from "lucide-react";

const SupportResourcesPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings } = useAccessibility();
  const isNeo = settings.uiTheme === "neo";
  const s = getStyles(settings.uiTheme);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const emergencySupport = [
    { title: "International Dyslexia Helpline", phone: "+1-410-296-0232", description: "Professional guidance for dyslexia-related questions", icon: Phone, color: "bg-[#FDA4AF]" },
    { title: "Learning Disabilities Hotline", phone: "1-855-303-4636", description: "24/7 support for educational advocacy", icon: BookOpen, color: "bg-[#86EFAC]" },
    { title: "Crisis Text Line", phone: "Text HOME to 741741", description: "Mental health crisis support via text", icon: MessageCircle, color: "bg-[#D8B4FE]" }
  ];

  const readingAndWritingTools = [
    { title: "Audio Software", items: ["NaturalReader", "Speechify", "Voice Dream"], icon: Headphones },
    { title: "Writing Assistants", items: ["Grammarly", "Ginger", "Dragon"], icon: PenTool },
    { title: "Reading Apps", items: ["Learning Ally", "Bookshare", "ClaroRead"], icon: BookOpen }
  ];

  const accommodationGuides = [
    { title: "Workplace", description: "Legal rights and practical accommodations.", icon: Building },
    { title: "Education", description: "IEP/504 plan accommodations.", icon: GraduationCap }
  ];

  const openLink = (url: string) => { window.open(url, '_blank'); };

  return (
    <ScrollArea className="h-screen" style={!isNeo ? { backgroundColor: 'var(--app-bg)' } : { backgroundColor: '#ffffff' }}>
      <div className={`min-h-screen ${isNeo ? "font-bold bg-grid" : "font-sans"} text-black`}>
        <Navbar />
        
        <div className="container mx-auto pt-32 pb-20 px-4 relative z-0">
          <div className={`max-w-7xl mx-auto transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-16">
              <span className={s.tag}>RESOURCES</span>
              <AnimatedHeading delay={200} className={`${s.sectionTitle} text-5xl md:text-8xl mt-6 text-center`}>
                SUPPORT & <span className={isNeo ? "bg-[#FEF08A] px-4" : "text-gray-500"}>TOOLS</span>
              </AnimatedHeading>
              <p className={`${s.textBase} text-xl md:text-2xl max-w-3xl mx-auto mt-8 ${isNeo ? "uppercase font-black" : ""}`}>
                Comprehensive tools and networks to help individuals with dyslexia thrive in education and work.
              </p>
            </div>

            {/* Emergency Support */}
            <div className="mb-20">
              <h2 className={`${s.sectionTitle} text-center mb-12`}>HELPLINES.</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {emergencySupport.map((helpline, i) => (
                  <div key={i} className={`${s.card} ${isNeo ? helpline.color : "bg-white"}`}>
                    <div className="flex flex-col gap-6">
                      <div className={`w-14 h-14 bg-white border-4 border-black flex items-center justify-center ${isNeo ? "" : "rounded-2xl"}`}>
                        <helpline.icon className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black uppercase mb-2">{helpline.title}</h3>
                        <button 
                          onClick={() => openLink(helpline.phone)}
                          className={`text-2xl font-black mb-4 w-full py-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all`}
                        >
                          {helpline.phone}
                        </button>
                        <p className={s.textMuted}>{helpline.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assistive Tech */}
            <div className="mb-20">
              <h2 className={`${s.sectionTitle} text-center mb-12`}>ASSISTIVE TECH.</h2>
              <div className="grid lg:grid-cols-3 gap-8">
                {readingAndWritingTools.map((cat, i) => (
                  <div key={i} className={`${s.card} ${isNeo ? neoColors[(i + 2) % 5] : "bg-white"}`}>
                    <div className={`w-14 h-14 bg-white border-4 border-black flex items-center justify-center mb-6 ${isNeo ? "" : "rounded-2xl"}`}>
                      <cat.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-4">{cat.title}</h3>
                    <div className="space-y-3">
                      {cat.items.map((item, j) => (
                        <div key={j} className={`p-3 bg-white border-4 border-black font-black text-sm uppercase flex items-center justify-between`}>
                          {item}
                          <Zap className="h-4 w-4" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accommodation Guides */}
            <div className="mb-20">
               <h2 className={`${s.sectionTitle} text-center mb-12`}>GUIDES.</h2>
               <div className="grid lg:grid-cols-2 gap-8">
                  {accommodationGuides.map((guide, i) => (
                    <div key={i} className={`${s.card} ${isNeo ? neoColors[(i + 1) % 5] : "bg-white"}`}>
                      <div className={`w-14 h-14 bg-white border-4 border-black flex items-center justify-center mb-6 ${isNeo ? "" : "rounded-2xl"}`}>
                        <guide.icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-2xl font-black uppercase mb-2">{guide.title}</h3>
                      <p className={`${s.textBase} mb-6`}>{guide.description}</p>
                      <button className={s.btnPrimary}>DOWNLOAD GUIDE</button>
                    </div>
                  ))}
               </div>
            </div>

            {/* CTA */}
            <div className={`${isNeo ? "border-8 border-black shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] bg-[#FEF08A]" : "rounded-3xl bg-gray-50"} p-12 text-center`}>
              <div className="max-w-2xl mx-auto">
                <Heart className="h-12 w-12 mx-auto mb-6" />
                <h2 className={`${s.sectionTitle} text-center mb-6`}>NEED HELP?</h2>
                <p className={`${s.textBase} text-xl md:text-2xl mb-10 ${isNeo ? "font-black uppercase" : ""}`}>
                   Our support team is here to help you find the right resources.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <button className={s.btnPrimary}>EMAIL SUPPORT</button>
                  <button className={s.btnSecondary} style={!isNeo ? { backgroundColor: 'var(--card-bg)' } : {}}>CALL US</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default SupportResourcesPage;
