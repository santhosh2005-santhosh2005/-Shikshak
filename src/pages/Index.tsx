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

/* ─── Light Monochrome Neuro-Adaptive Calm UI ────────────── */
const calm = {
  card: "bg-white border border-gray-200 shadow-sm rounded-3xl p-8 text-black transition-all hover:shadow-md",
  cardLight: "bg-gray-100 border border-gray-200 shadow-sm rounded-3xl p-8 text-black transition-all hover:shadow-md",
  cardGray: "bg-gray-50 border border-gray-200 shadow-sm rounded-3xl p-8 text-black transition-all hover:shadow-md",
  btnPrimary: "bg-gray-200 text-black font-medium text-lg px-8 py-4 rounded-full hover:bg-gray-300 transition-colors inline-flex items-center gap-2 shadow-sm focus:ring-4 focus:ring-gray-100",
  btnSecondary: "bg-white text-black border-2 border-gray-200 font-medium text-lg px-8 py-4 rounded-full hover:bg-gray-50 transition-colors inline-flex items-center gap-2 focus:ring-4 focus:ring-gray-100",
  tag: "bg-white text-black font-medium px-4 py-1.5 rounded-full inline-block border border-gray-200",
  tagLight: "bg-gray-200 text-black font-medium px-4 py-1.5 rounded-full inline-block",
  sectionTitle: "text-3xl md:text-5xl font-semibold text-black tracking-tight leading-tight",
  textMuted: "text-gray-600 leading-relaxed text-lg md:text-xl",
  textBase: "text-black leading-relaxed text-lg md:text-xl",
  label: "font-medium text-black text-sm mb-2",
  input: "w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-black focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all bg-white",
};

/* ─── Sub-components ─────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, description, dark = false }: { icon: any; title: string; description: string; dark?: boolean }) => {
  const { settings } = useAccessibility();
  
  const cardStyle = dark ? calm.cardLight : calm.cardGray;
  const iconBg = dark ? "bg-white border border-gray-200 text-black" : "bg-white border border-gray-200 text-black";

  return (
    <motion.div
      className={`${cardStyle} flex flex-col gap-5`}
      initial={settings.disableAnimations ? {} : { opacity: 0, y: 20 }}
      whileInView={settings.disableAnimations ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center`}>
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className={calm.textMuted}>{description}</p>
    </motion.div>
  );
};

const TestimonialCard = ({ quote, author, role, dark = false }: { quote: string; author: string; role: string; dark?: boolean }) => {
  const { settings } = useAccessibility();
  
  const cardStyle = dark ? calm.cardLight : calm.card;

  return (
    <motion.div
      className={`${cardStyle} flex flex-col gap-6 relative overflow-hidden`}
      initial={settings.disableAnimations ? {} : { opacity: 0, y: 20 }}
      whileInView={settings.disableAnimations ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={`absolute top-4 right-6 text-8xl font-serif leading-none text-gray-200`}>"</div>
      <p className={`text-black text-lg md:text-xl leading-relaxed italic relative z-10`}>"{quote}"</p>
      <div className={`flex items-center gap-4 mt-auto pt-4 border-t border-gray-200`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-xl shadow-sm border bg-white text-black border-gray-200`}>
          {author.charAt(0)}
        </div>
        <div>
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, number, label, dark = false }: { icon: any; number: string; label: string; dark?: boolean }) => {
  const { settings } = useAccessibility();
  
  const cardStyle = dark ? calm.cardLight : calm.card;
  const iconBg = "bg-white border border-gray-200 text-black";

  return (
    <motion.div
      className={`${cardStyle} flex flex-col items-center text-center gap-4`}
      initial={settings.disableAnimations ? {} : { opacity: 0, scale: 0.95 }}
      whileInView={settings.disableAnimations ? {} : { opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center shadow-sm`}>
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-5xl font-bold tracking-tight">{number}</h3>
      <p className="font-medium text-lg text-gray-600">{label}</p>
    </motion.div>
  );
};

/* ─── Main Page ──────────────────────────────────────────── */
const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings } = useAccessibility();
  const animationsDisabled = settings.disableAnimations;
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

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
    <ScrollArea className="h-screen bg-white">
      <div className="min-h-screen font-sans text-black selection:bg-gray-200 selection:text-black">
        <Navbar />

        {/* ── HERO ───────────────────────────────────────── */}
        <section className="pt-32 pb-24 px-4 md:pt-40">
          <div className={`container mx-auto max-w-6xl transition-all duration-1000 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
              <div className="flex flex-wrap justify-center gap-3">
                <span className={calm.tag}>Neuro-Adaptive Calm UI</span>
                <span className={calm.tagLight}>Accessible Learning</span>
              </div>

              <AnimatedHeading delay={200} className="text-5xl md:text-7xl font-bold text-black tracking-tight leading-[1.1]">
                Learn without limits.<br />
                <span className="text-gray-500">Grow without friction.</span>
              </AnimatedHeading>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
                Experience a calm, accessible platform designed specifically to support unique learning styles and reduce cognitive overload.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/tests" className={calm.btnPrimary}>
                  Start Screening <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/about" className={calm.btnSecondary}>
                  Explore Our Approach
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ── SOFT STATS BAR ─────────────────────────────── */}
        <div className="container mx-auto max-w-5xl px-4 pb-24">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200 flex flex-col md:flex-row justify-around items-center gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="text-center px-8 w-full">
              <div className="text-4xl font-bold text-black mb-2">1 in 10</div>
              <div className="text-gray-600 font-medium">People have signs of dyslexia</div>
            </div>
            <div className="text-center px-8 w-full pt-8 md:pt-0">
              <div className="text-4xl font-bold text-black mb-2">80%</div>
              <div className="text-gray-600 font-medium">Go undiagnosed</div>
            </div>
            <div className="text-center px-8 w-full pt-8 md:pt-0">
              <div className="text-4xl font-bold text-black mb-2">30 min</div>
              <div className="text-gray-600 font-medium">To complete screening</div>
            </div>
          </div>
        </div>

        {/* ── SCIENTIFIC APPROACH ────────────────────────── */}
        <section className="py-24 px-4 bg-gray-50 border-y border-gray-200">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className={calm.tagLight}>Cognitive Ease Design</span>
              <h2 className={calm.sectionTitle}>Built on science,<br />designed for comfort.</h2>
              <p className={calm.textMuted}>
                We combine cognitive science with modern, inclusive technology to create screening tools that don't overwhelm.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={Brain} number="2+" label="Years Research" />
              <StatCard icon={BookOpen} number="90%" label="Accuracy Rate" dark />
              <StatCard icon={CheckCircle} number="1.2M+" label="Tests Completed" />
              <StatCard icon={Clock} number="10m" label="Avg Test Time" dark />
            </div>
          </div>
        </section>

        {/* ── OUR MISSION ────────────────────────────────── */}
        <section id="mission" className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/3 space-y-6">
                <span className={calm.tag}>Our Mission</span>
                <h2 className={calm.sectionTitle}>Empowering<br />every mind.</h2>
                <p className={calm.textBase}>
                  We believe technology should adapt to the user, not the other way around. Our goal is to make dyslexia identification accessible, destigmatize the condition, and provide neuro-friendly tools for continuous improvement.
                </p>
                <div className="pt-4">
                  <Link to="/about" className="text-black font-semibold text-lg inline-flex items-center gap-2 hover:gap-3 transition-all border-b-2 border-gray-300 pb-1 hover:border-black">
                    Read our full story <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
              
              <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6">
                <FeatureCard 
                  icon={Heart} 
                  title="Early Detection" 
                  description="Gentle, accessible screening tools to help identify dyslexia signs early, when intervention is most effective." 
                />
                <FeatureCard 
                  icon={Users} 
                  title="Community Support" 
                  description="Building a calm, supportive space where people with dyslexia can share experiences and strategies." 
                  dark
                />
                <FeatureCard 
                  icon={Building} 
                  title="Continuous Growth" 
                  description="We are constantly researching and developing new methods to make neurodivergent learning easier." 
                />
                <div className="bg-gray-100 rounded-3xl p-8 border border-gray-200 text-black flex flex-col justify-between hover:shadow-md transition-all">
                  <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <Globe className="h-7 w-7 text-black" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Global Impact</h3>
                    <p className="text-gray-600 text-lg md:text-xl">Reaching over 50,000 users worldwide with accessible education tools.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ───────────────────────────────── */}
        <section className="py-24 px-4 bg-gray-50 border-y border-gray-200">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <span className={calm.tagLight}>Inclusive Voices</span>
              <h2 className={calm.sectionTitle}>Stories of clarity.</h2>
              <p className={calm.textMuted}>
                Hear from students and parents who found a more peaceful path to understanding their learning styles.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <TestimonialCard
                quote="This test helped me understand why I've always struggled with reading. The soft design and clear text made it stress-free."
                author="Abhishek A R."
                role="Student, 16"
              />
              <TestimonialCard
                quote="As a parent, I was worried about my daughter's reading difficulties. This screening felt like a safe, supportive environment."
                author="Sheetal Kumari."
                role="Parent, 38"
                dark
              />
              <TestimonialCard
                quote="The accessibility features made this test so much easier for me. I finally feel understood without the cognitive fatigue."
                author="Amay Verma"
                role="Student, 19"
              />
            </div>
          </div>
        </section>

        {/* ── CONTACT ────────────────────────────────────── */}
        <section id="contact" className="py-24 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-200 overflow-hidden">
              <div className="grid md:grid-cols-5 h-full">
                {/* Left info */}
                <div className="md:col-span-2 bg-gray-100 p-10 md:p-12 flex flex-col justify-between border-r border-gray-200">
                  <div>
                    <h2 className="text-3xl font-semibold text-black mb-4">We're here to listen.</h2>
                    <p className="text-gray-600 text-lg mb-12">
                      Reach out if you need support, have questions, or just want to connect with our team.
                    </p>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 text-black">
                        <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Mail className="h-5 w-5 text-black" />
                        </div>
                        <span className="font-medium text-lg">support@dyscover.edu</span>
                      </div>
                      <div className="flex items-center gap-4 text-black">
                        <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Phone className="h-5 w-5 text-black" />
                        </div>
                        <span className="font-medium text-lg">+91 600 5609 423</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right form */}
                <div className="md:col-span-3 p-10 md:p-12">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className={`block ${calm.label}`}>Preferred Name</label>
                        <input
                          id="name"
                          name="name"
                          value={contactForm.name}
                          onChange={handleInputChange}
                          placeholder="Jane Doe"
                          required
                          className={calm.input}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className={`block ${calm.label}`}>Email Address</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={contactForm.email}
                          onChange={handleInputChange}
                          placeholder="jane@example.com"
                          required
                          className={calm.input}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="message" className={`block ${calm.label}`}>How can we help?</label>
                      <textarea
                        id="message"
                        name="message"
                        value={contactForm.message}
                        onChange={handleInputChange}
                        placeholder="I'd like to learn more about..."
                        rows={4}
                        required
                        className={`${calm.input} resize-none`}
                      />
                    </div>
                    <button type="submit" className={`${calm.btnPrimary} w-full justify-center mt-4`}>
                      Send Message <Send className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────── */}
        <footer className="bg-gray-100 text-black border-t border-gray-200 pt-16 pb-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div>
                <h3 className="font-semibold text-black mb-6">Navigate</h3>
                <div className="space-y-4">
                  <Link to="/" className="block text-gray-600 hover:text-black transition-colors">Home</Link>
                  <Link to="/about" className="block text-gray-600 hover:text-black transition-colors">About Us</Link>
                  <Link to="/tests" className="block text-gray-600 hover:text-black transition-colors">Screening Tests</Link>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-black mb-6">Support</h3>
                <div className="space-y-4">
                  <Link to="/support" className="block text-gray-600 hover:text-black transition-colors">Learning Resources</Link>
                  <Link to="/improve" className="block text-gray-600 hover:text-black transition-colors">Improvement Plans</Link>
                  <a href="#contact" className="block text-gray-600 hover:text-black transition-colors">Contact Team</a>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-black mb-6">Legal</h3>
                <div className="space-y-4">
                  <a href="#" className="block text-gray-600 hover:text-black transition-colors">Privacy Policy</a>
                  <a href="#" className="block text-gray-600 hover:text-black transition-colors">Terms of Service</a>
                  <a href="#" className="block text-gray-600 hover:text-black transition-colors">Accessibility Statement</a>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-black mb-6">Connect</h3>
                <div className="space-y-4">
                  <a href="#" className="block text-gray-600 hover:text-black transition-colors">Twitter / X</a>
                  <a href="#" className="block text-gray-600 hover:text-black transition-colors">LinkedIn</a>
                  <a href="#" className="block text-gray-600 hover:text-black transition-colors">Instagram</a>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-black font-bold text-xl shadow-sm">D</div>
                <span className="text-xl font-semibold text-black">DysCover</span>
              </div>
              <div className="text-gray-500 font-medium text-center md:text-left">
                © {new Date().getFullYear()} DysCover. Neuro-Adaptive Learning Platform.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ScrollArea>
  );
};

export default Index;
