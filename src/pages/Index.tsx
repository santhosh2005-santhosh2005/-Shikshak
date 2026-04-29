import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Users, Mail, Phone, Heart, Building, Send, Brain, BookOpen, CheckCircle, Clock } from "lucide-react";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { Navbar } from "@/components/Navbar";
import { useAccessibility } from "@/components/AccessibilitySettings";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

/* ─── UI DESIGN SYSTEMS ─────────────────────────────────── */

// 1. NEURO-ADAPTIVE CALM UI (Default)
const calm = {
  card: "border border-gray-200 shadow-sm rounded-3xl p-8 text-black transition-all hover:shadow-md",
  cardLight: "bg-gray-100 border border-gray-200 shadow-sm rounded-3xl p-8 text-black transition-all hover:shadow-md",
  cardGray: "bg-gray-50 border border-gray-200 shadow-sm rounded-3xl p-8 text-black transition-all hover:shadow-md",
  btnPrimary: "bg-gray-200 text-black font-medium text-lg px-8 py-4 rounded-full hover:bg-gray-300 transition-colors inline-flex items-center gap-2 shadow-sm focus:ring-4 focus:ring-gray-100",
  btnSecondary: "bg-white text-black border-2 border-gray-200 font-medium text-lg px-8 py-4 rounded-full hover:bg-gray-50 transition-colors inline-flex items-center gap-2 focus:ring-4 focus:ring-gray-100",
  tag: "bg-white text-black font-medium px-4 py-1.5 rounded-full inline-block border border-gray-200",
  tagLight: "bg-gray-200 text-black font-medium px-4 py-1.5 rounded-full inline-block",
  sectionTitle: "text-3xl md:text-4xl font-semibold text-black tracking-tight leading-tight",
  textMuted: "text-gray-600 leading-relaxed text-base md:text-lg",
  textBase: "text-black leading-relaxed text-base md:text-lg",
  label: "font-medium text-black text-sm mb-2",
  input: "w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-black focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all bg-white",
  logo: "w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-black font-bold text-xl shadow-sm",
};

// 2. VIBRANT NEO-BRUTALISM
const neo = {
  card: "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-black transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
  cardLight: "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-black transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
  cardGray: "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-black transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
  btnPrimary: "bg-[#86EFAC] text-black border-4 border-black font-black text-lg px-8 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all inline-flex items-center gap-2",
  btnSecondary: "bg-[#FEF08A] text-black border-4 border-black font-black text-lg px-8 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all inline-flex items-center gap-2",
  tag: "bg-[#FDA4AF] text-black font-black px-4 py-1.5 border-4 border-black inline-block text-sm",
  tagLight: "bg-[#D8B4FE] text-black font-black px-4 py-1.5 border-4 border-black inline-block text-sm",
  sectionTitle: "text-3xl md:text-5xl font-black text-black uppercase tracking-tighter leading-none text-left",
  textMuted: "text-black font-bold leading-tight text-base md:text-lg",
  textBase: "text-black font-bold leading-tight text-base md:text-lg",
  label: "font-black text-black text-sm mb-1 uppercase",
  input: "w-full border-4 border-black px-4 py-2 text-black font-bold focus:bg-[#FEF08A] outline-none transition-all bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
  logo: "w-12 h-12 bg-[#86EFAC] border-4 border-black flex items-center justify-center text-black font-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
};

const neoColors = ["bg-[#FEF08A]", "bg-[#FDA4AF]", "bg-[#86EFAC]", "bg-[#D8B4FE]", "bg-[#FDBA74]"];

/* ─── Sub-components ─────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, description, index = 0 }: { icon: any; title: string; description: string; index?: number }) => {
  const { settings } = useAccessibility();
  const isNeo = settings.uiTheme === "neo";
  const s = isNeo ? neo : calm;
  
  const color = neoColors[index % neoColors.length];
  const cardStyle = isNeo ? `${s.card} ${color}` : s.cardGray;
  const iconBg = "bg-white border-4 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";

  return (
    <motion.div
      className={`${cardStyle} flex flex-col gap-3 h-full`}
      style={!isNeo ? { backgroundColor: index % 2 === 0 ? 'var(--section-bg)' : 'var(--card-bg)' } : {}}
      initial={settings.disableAnimations ? {} : { opacity: 0, y: 20 }}
      whileInView={settings.disableAnimations ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={`w-12 h-12 ${isNeo ? iconBg : "bg-white border border-gray-200 rounded-2xl"} flex items-center justify-center`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-black">{title}</h3>
      <p className={`${s.textMuted} text-sm md:text-base`}>{description}</p>
    </motion.div>
  );
};

const TestimonialCard = ({ quote, author, role, index = 0 }: { quote: string; author: string; role: string; index?: number }) => {
  const { settings } = useAccessibility();
  const isNeo = settings.uiTheme === "neo";
  const s = isNeo ? neo : calm;
  
  const color = neoColors[(index + 2) % neoColors.length];
  const cardStyle = isNeo ? `${s.card} ${color}` : s.card;

  return (
    <motion.div
      className={`${cardStyle} flex flex-col gap-4 relative overflow-hidden h-full`}
      style={!isNeo ? { backgroundColor: 'var(--card-bg)' } : {}}
      initial={settings.disableAnimations ? {} : { opacity: 0, y: 20 }}
      whileInView={settings.disableAnimations ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={`absolute top-2 right-4 text-6xl font-serif leading-none ${isNeo ? "text-black/20" : "text-gray-200"}`}>"</div>
      <p className={`text-black text-base md:text-lg leading-relaxed italic relative z-10 font-bold`}>"{quote}"</p>
      <div className={`flex items-center gap-3 mt-auto pt-3 border-t ${isNeo ? "border-black border-t-4" : "border-gray-200"}`}>
        <div className={`w-10 h-10 flex items-center justify-center font-black text-lg bg-white text-black border-4 border-black ${isNeo ? "" : "rounded-full"}`}>
          {author.charAt(0)}
        </div>
        <div>
          <div className="font-black text-sm">{author}</div>
          <div className="text-xs font-bold opacity-70">{role}</div>
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, number, label, index = 0 }: { icon: any; number: string; label: string; index?: number }) => {
  const { settings } = useAccessibility();
  const isNeo = settings.uiTheme === "neo";
  const s = isNeo ? neo : calm;
  
  const color = neoColors[(index + 1) % neoColors.length];
  const cardStyle = isNeo ? `${s.card} ${color}` : s.card;

  return (
    <motion.div
      className={`${cardStyle} flex flex-col items-center text-center gap-3`}
      style={!isNeo ? { backgroundColor: 'var(--card-bg)' } : {}}
      initial={settings.disableAnimations ? {} : { opacity: 0, scale: 0.95 }}
      whileInView={settings.disableAnimations ? {} : { opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={`w-12 h-12 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isNeo ? "" : "rounded-2xl"}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-3xl md:text-4xl font-black tracking-tight">{number}</h3>
      <p className="font-black text-xs md:text-sm uppercase tracking-wider">{label}</p>
    </motion.div>
  );
};

/* ─── Main Page ──────────────────────────────────────────── */
const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings } = useAccessibility();
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  const isNeo = settings.uiTheme === "neo";
  const s = isNeo ? neo : calm;

  useEffect(() => { setIsLoaded(true); }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: "We'll get back to you soon." });
    setContactForm({ name: "", email: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <ScrollArea className="h-screen" style={!isNeo ? { backgroundColor: 'var(--app-bg)' } : { backgroundColor: '#ffffff' }}>
      <div className={`min-h-screen ${isNeo ? "font-bold bg-grid" : "font-sans"} text-black selection:bg-[#FEF08A] selection:text-black`}>
        <Navbar />

        {/* ── HERO PAGE ─────────────────────────────────── */}
        <section className={`min-h-screen flex items-center pt-20 pb-12 px-4 ${isNeo ? "border-b-8 border-black bg-white" : ""}`}>
          <div className={`container mx-auto max-w-6xl transition-all duration-1000 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Column: Text Content */}
              <div className="flex flex-col items-start text-left space-y-6 md:space-y-10 z-10">
                <div className="flex flex-wrap justify-start gap-3">
                  <span className={s.tag}>NEURO-ADAPTIVE</span>
                  <span className={s.tagLight}>SHIKSHAK 2.0</span>
                </div>

              <AnimatedHeading delay={200} className={`${s.sectionTitle} text-4xl md:text-7xl lg:text-8xl`}>
                LEARN WITHOUT <span className={isNeo ? "bg-[#FEF08A] px-2 md:px-4" : ""}>LIMITS.</span><br />
                <span className={isNeo ? "bg-[#86EFAC] px-2 md:px-4 mt-2 inline-block" : "text-gray-500"}>GROW WITHOUT FRICTION.</span>
              </AnimatedHeading>
              
              <p className={`text-lg md:text-2xl max-w-2xl leading-tight ${isNeo ? "font-black text-black uppercase" : "text-gray-600"}`}>
                Experience a vibrant, accessible platform designed specifically to support unique learning styles.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                <Link to="/tests" className={s.btnPrimary}>
                  START SCREENING <ArrowRight className="h-6 w-6" />
                </Link>
                <Link to="/about" className={s.btnSecondary} style={!isNeo ? { backgroundColor: 'var(--card-bg)' } : {}}>
                  OUR MISSION
                </Link>
              </div>
            </div>

            {/* Right Column: Video container */}
            <div className="relative mt-8 lg:mt-0 w-full max-w-lg mx-auto lg:max-w-none lg:ml-auto">
              <div className={`absolute top-4 -right-4 md:-right-8 w-full h-[90%] bg-[#FEF08A] rounded-[2rem] transform rotate-3 ${isNeo ? "border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]" : "shadow-xl opacity-60"}`}></div>
              <div className={`relative z-10 w-full overflow-hidden rounded-[2rem] bg-white transform -rotate-2 hover:rotate-0 transition-transform duration-500 ${isNeo ? "border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]" : "border-4 border-white shadow-2xl"}`}>
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-[350px] md:h-[450px] lg:h-[550px] object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
                >
                  <source src="/shikshak-hero.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          </div>
        </section>

        {/* ── SCIENCE & STATS PAGE ──────────────────────── */}
        <section className={`min-h-screen flex flex-col justify-center py-20 px-4 border-y ${isNeo ? "border-y-8 border-black bg-[#FDA4AF]" : "border-gray-200"}`} style={!isNeo ? { backgroundColor: 'var(--section-bg)' } : {}}>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-4">
              <span className={s.tagLight} style={!isNeo ? { backgroundColor: 'var(--card-bg)' } : {}}>RESEARCH-BACKED</span>
              <h2 className={s.sectionTitle}>BUILT ON SCIENCE.</h2>
              <p className={s.textMuted}>
                We combine cognitive science with modern, inclusive technology to create screening tools that don't overwhelm.
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12">
              <StatCard icon={Brain} number="20" label="Hours" index={0} />
              <StatCard icon={BookOpen} number="90%" label="Accuracy" index={1} />
              <StatCard icon={CheckCircle} number="2+" label="Users" index={2} />
              <StatCard icon={Clock} number="10m" label="Quick" index={3} />
            </div>

            <div className={`${isNeo ? "border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-[#D8B4FE]" : "rounded-3xl shadow-sm border border-gray-200 bg-white"} p-6 md:p-10 flex flex-col md:flex-row justify-around items-center gap-6 divide-y md:divide-y-0 md:divide-x ${isNeo ? "divide-black divide-y-4 md:divide-x-8" : "divide-gray-200"}`} style={!isNeo ? { backgroundColor: 'var(--card-bg)' } : {}}>
              <div className="text-center px-4 w-full">
                <div className="text-3xl md:text-5xl font-black text-black mb-1">1 in 10</div>
                <div className="font-black uppercase tracking-wider text-xs md:text-sm">Signs of Dyslexia</div>
              </div>
              <div className="text-center px-4 w-full pt-4 md:pt-0">
                <div className="text-3xl md:text-5xl font-black text-black mb-1">80%</div>
                <div className="font-black uppercase tracking-wider text-xs md:text-sm">Undiagnosed</div>
              </div>
              <div className="text-center px-4 w-full pt-4 md:pt-0">
                <div className="text-3xl md:text-5xl font-black text-black mb-1">30 min</div>
                <div className="font-black uppercase tracking-wider text-xs md:text-sm">Fast Result</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MISSION PAGE ─────────────────────────────── */}
        <section id="mission" className="min-h-screen flex items-center py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
              <div className="lg:w-1/3 space-y-6 md:space-y-8">
                <span className={s.tag}>OUR MISSION</span>
                <h2 className={s.sectionTitle}>EMPOWERING EVERY MIND.</h2>
                <p className={s.textBase}>
                  We believe technology should adapt to the user. Our goal is to make identification accessible and provide neuro-friendly tools.
                </p>
                <div className="pt-2">
                  <Link to="/about" className={`text-black font-black text-xl md:text-2xl inline-flex items-center gap-2 hover:gap-6 transition-all border-b-8 ${isNeo ? "border-black bg-[#FEF08A] px-4" : "border-gray-300 pb-1 hover:border-black"}`}>
                    READ FULL STORY <ArrowRight className="h-6 w-6" />
                  </Link>
                </div>
              </div>
              
              <div className="lg:w-2/3 grid sm:grid-cols-2 gap-4 md:gap-8">
                <FeatureCard icon={Heart} title="Early Detection" description="Identify signs early when intervention works best." index={0} />
                <FeatureCard icon={Users} title="Community" description="A supportive space for unique learners." index={1} />
                <FeatureCard icon={Building} title="Growth" description="Continuous research for better learning." index={2} />
                <div className={`${isNeo ? "border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-[#86EFAC]" : "rounded-3xl border border-gray-200 shadow-sm bg-white"} p-6 md:p-8 text-black flex flex-col justify-between hover:translate-x-2 transition-all`}>
                  <div className={`w-12 h-12 bg-white border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <Globe className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-2 uppercase">GLOBAL IMPACT</h3>
                    <p className="font-bold text-base md:text-lg text-black/80">50,000+ users worldwide using our tools.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS PAGE ─────────────────────────── */}
        <section className={`min-h-screen flex items-center py-20 px-4 border-y ${isNeo ? "border-y-8 border-black bg-[#FDBA74]" : "border-gray-200"}`} style={!isNeo ? { backgroundColor: 'var(--section-bg)' } : {}}>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-4">
              <span className={s.tagLight} style={!isNeo ? { backgroundColor: 'var(--card-bg)' } : {}}>TESTIMONIALS</span>
              <h2 className={s.sectionTitle}>REAL STORIES.</h2>
              <p className={s.textMuted}>
                Hear from students who found a better way to learn.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-10">
              <TestimonialCard quote="Understanding my style made everything easier. Stress-free design." author="Santhosh" role="Student" index={0} />
              <TestimonialCard quote="A safe, supportive environment for my daughter." author="Harshvardhan" role="Parent" index={1} />
              <TestimonialCard quote="Finally feel understood without the fatigue." author="Bhuvi" role="Student" index={2} />
            </div>
          </div>
        </section>

        {/* ── CONTACT PAGE ──────────────────────────────── */}
        <section id="contact" className="min-h-screen flex items-center py-20 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <div className={`${isNeo ? "border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]" : "rounded-[3rem] border border-gray-200 shadow-sm"} overflow-hidden bg-white`}>
              <div className="grid md:grid-cols-5 h-full">
                <div className={`md:col-span-2 p-10 md:p-12 flex flex-col justify-between border-r ${isNeo ? "border-r-8 border-black bg-[#86EFAC]" : "border-gray-200 bg-gray-50"}`}>
                  <div>
                    <h2 className={`text-3xl font-black text-black mb-6 uppercase tracking-tighter`}>CONTACT US.</h2>
                    <p className={`text-lg mb-8 md:mb-12 font-black uppercase`}>Reach out anytime.</p>
                    <div className="space-y-6 md:space-y-8">
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className={`w-12 h-12 bg-white border-4 border-black flex items-center justify-center flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                          <Mail className="h-5 w-5 text-black" />
                        </div>
                        <span className="font-black text-base md:text-xl">support@shikshak.edu</span>
                      </div>
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className={`w-12 h-12 bg-white border-4 border-black flex items-center justify-center flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                          <Phone className="h-5 w-5 text-black" />
                        </div>
                        <span className="font-black text-base md:text-xl">+91 600 5609 423</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-3 p-10 md:p-12">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className={s.label}>NAME</label>
                        <input id="name" name="name" value={contactForm.name} onChange={handleInputChange} placeholder="JANE DOE" required className={s.input} />
                      </div>
                      <div>
                        <label htmlFor="email" className={s.label}>EMAIL</label>
                        <input id="email" name="email" type="email" value={contactForm.email} onChange={handleInputChange} placeholder="EMAIL@EXAMPLE.COM" required className={s.input} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="message" className={s.label}>MESSAGE</label>
                      <textarea id="message" name="message" value={contactForm.message} onChange={handleInputChange} placeholder="HOW CAN WE HELP?" rows={3} required className={`${s.input} resize-none`} />
                    </div>
                    <button type="submit" className={`${s.btnPrimary} w-full justify-center`}>
                      SEND MESSAGE <Send className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER PAGE ───────────────────────────────── */}
        <footer className={`min-h-[50vh] flex items-center text-black border-t-8 border-black bg-white py-12 px-4`}>
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {["NAVIGATE", "SUPPORT", "LEGAL", "CONNECT"].map((title, i) => (
                <div key={title}>
                  <h3 className="font-black text-black mb-4 uppercase tracking-widest text-lg bg-[#FEF08A] inline-block px-2">{title}</h3>
                  <div className="space-y-2">
                    <Link to="#" className="block font-black text-base hover:translate-x-2 transition-all">LINK ONE</Link>
                    <Link to="#" className="block font-black text-base hover:translate-x-2 transition-all">LINK TWO</Link>
                  </div>
                </div>
              ))}
            </div>
            <div className={`pt-8 border-t-8 border-black flex flex-col md:flex-row justify-between items-center gap-6`}>
              <div className="flex items-center gap-4">
                <div className={s.logo}>S</div>
                <span className="text-3xl font-black text-black uppercase tracking-tighter">SHIKSHAK</span>
              </div>
              <div className="font-black text-sm md:text-lg text-center md:text-left">© {new Date().getFullYear()} SHIKSHAK. NEURO-ADAPTIVE PLATFORM.</div>
            </div>
          </div>
        </footer>
      </div>
    </ScrollArea>
  );
};

export default Index;
