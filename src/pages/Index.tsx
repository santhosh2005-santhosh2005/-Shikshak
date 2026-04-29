
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Users, Mail, Phone, Heart, Building, Send, Brain, BookOpen, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { Navbar } from "@/components/Navbar";
import { useAccessibility } from "@/components/AccessibilitySettings";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Float = ({ children, delay, className = "" }: { children: React.ReactNode; delay: number; className?: string }) => {
  return (
    <span 
      className={`inline-block animate-float ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </span>
  );
};

const TextWithFloatingChars = ({ text }: { text: string }) => {
  return (
    <div className="relative">
      {text.split('').map((char, i) => (
        <Float key={i} delay={i * 120} className={`${char === ' ' ? 'px-1' : ''}`}>
          {char}
        </Float>
      ))}
    </div>
  );
};

const FloatingLetters = () => {
  const letters = "abcdefghijklmnopqrstuvwxyz".split('');
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] -z-10">
      {Array.from({ length: 40 }).map((_, i) => {
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        const size = Math.random() * 40 + 10;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 20 + 10;
        
        return (
          <div
            key={i}
            className="absolute text-primary font-heading animate-float"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              fontSize: `${size}px`,
              opacity: 0.3,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          >
            {randomLetter}
          </div>
        );
      })}
    </div>
  );
};

// Feature component for "Our Mission" section
const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => {
  const { settings } = useAccessibility();
  const animationsDisabled = settings.disableAnimations;
  
  return (
    <motion.div
      className="flex flex-col items-center text-center p-6 rounded-2xl"
      initial={animationsDisabled ? {} : { opacity: 0, y: 20 }}
      whileInView={animationsDisabled ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

// Global presence component
const LocationCard = ({ country, users }: { country: string, users: number }) => {
  const { settings } = useAccessibility();
  const animationsDisabled = settings.disableAnimations;
  
  return (
    <motion.div 
      className="rounded-lg border p-4 flex justify-between items-center"
      initial={animationsDisabled ? {} : { opacity: 0, x: -10 }}
      whileInView={animationsDisabled ? {} : { opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="font-medium">{country}</div>
      <div className="text-muted-foreground text-sm">{users.toLocaleString()}+ users</div>
    </motion.div>
  );
};

// Testimonial component
const TestimonialCard = ({ quote, author, role }: { quote: string, author: string, role: string }) => {
  const { settings } = useAccessibility();
  const animationsDisabled = settings.disableAnimations;
  
  return (
    <motion.div 
      className="bg-card/50 p-6 rounded-xl border relative"
      initial={animationsDisabled ? {} : { opacity: 0, y: 20 }}
      whileInView={animationsDisabled ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-4xl text-primary/20 absolute top-4 right-4">"</div>
      <p className="text-muted-foreground mb-4 relative z-10">{quote}</p>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
          {author.charAt(0)}
        </div>
        <div>
          <div className="font-medium">{author}</div>
          <div className="text-sm text-muted-foreground">{role}</div>
        </div>
      </div>
    </motion.div>
  );
};

// Stats component
const StatCard = ({ icon: Icon, number, label }: { icon: any, number: string, label: string }) => {
  const { settings } = useAccessibility();
  const animationsDisabled = settings.disableAnimations;
  
  return (
    <motion.div
      className="flex flex-col items-center text-center p-6"
      initial={animationsDisabled ? {} : { opacity: 0, scale: 0.95 }}
      whileInView={animationsDisabled ? {} : { opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="text-3xl font-bold text-primary">{number}</h3>
      <p className="text-muted-foreground text-sm">{label}</p>
    </motion.div>
  );
};

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings } = useAccessibility();
  const animationsDisabled = settings.disableAnimations;
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you soon.",
    });
    setContactForm({
      name: "",
      email: "",
      message: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <ScrollArea className="h-screen">
      <div className="min-h-screen relative">
        <Navbar />
        <FloatingLetters />
        
        <div className="absolute inset-0 -z-10 bg-grid"></div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        
        {/* Hero Section */}
        <section className="container mx-auto pt-32 pb-20 px-4 md:pt-40 md:pb-32 relative z-0">
          <div className={`max-w-4xl mx-auto text-center space-y-6 transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium mb-6">
              <TextWithFloatingChars text="Early Screening for Dyslexia" />
            </div>
            
            <AnimatedHeading delay={200} className="text-4xl md:text-6xl font-bold leading-tight">
              Understand Your Mind Better.
              <br />
              <span className="text-primary">Early Clarity on Dyslexia</span> Starts Here.
            </AnimatedHeading>
            
            <AnimatedHeading delay={400} className="text-xl md:text-2xl max-w-2xl mx-auto text-muted-foreground">
              Take short, guided tests that assess key reading, writing, and memory patterns.
            </AnimatedHeading>
            
            <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center items-center" style={{ transitionDelay: '600ms' }}>
              <Button size="lg" className="gap-2 rounded-full px-6 group" asChild>
                <Link to="/tests">
                  Start Screening
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-6" asChild>
                <Link to="/about">Learn About Dyslexia</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="bg-card/40 backdrop-blur-sm border rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <h3 className="text-4xl font-bold text-primary">1 in 10</h3>
                <p className="text-muted-foreground mt-2">People have signs of dyslexia</p>
              </div>
              <div className="text-center">
                <h3 className="text-4xl font-bold text-primary">80%</h3>
                <p className="text-muted-foreground mt-2">Of dyslexics go undiagnosed</p>
              </div>
              <div className="text-center">
                <h3 className="text-4xl font-bold text-primary">30 min</h3>
                <p className="text-muted-foreground mt-2">To complete our screening</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Our Approach Section */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-12"
              initial={animationsDisabled ? {} : { opacity: 0, y: 20 }}
              whileInView={animationsDisabled ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Scientific Approach</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We combine cognitive science with modern technology to create accessible screening tools.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <StatCard 
                icon={Brain}
                number="2+"
                label="Years Research" 
              />
              <StatCard 
                icon={BookOpen}
                number="90%"
                label="Accuracy Rate" 
              />
              <StatCard 
                icon={CheckCircle}
                number="1.2M+"
                label="Tests Completed" 
              />
              <StatCard 
                icon={Clock}
                number="10 min"
                label="Average Test Time" 
              />
            </div>
          </div>
        </section>
        
        {/* User Testimonials Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-16"
              initial={animationsDisabled ? {} : { opacity: 0, y: 20 }}
              whileInView={animationsDisabled ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Stories from people who have found clarity through our dyslexia screening tools.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <TestimonialCard 
                quote="This test helped me understand why I've always struggled with reading. The personalized results were eye-opening."
                author="Abhishek A R."
                role="Student, 16"
              />
              <TestimonialCard 
                quote="As a parent, I was worried about my daughter's reading difficulties. This screening gave us the clarity to seek professional help."
                author="Sheetal Kumari."
                role="Parent, 38"
              />
              <TestimonialCard 
                quote="The accessibility features made this test so much easier for me. I finally feel understood and for me that is the best thing ever!"
                author="Amay Verma"
                role="Student, 19"
              />
            </div>
          </div>
        </section>
        
        {/* Our Mission Section */}
        <section id="mission" className="py-24 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-16"
              initial={animationsDisabled ? {} : { opacity: 0, y: 20 }}
              whileInView={animationsDisabled ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We're committed to making dyslexia identification accessible, destigmatizing the condition, 
                and providing tools for improvement.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Heart}
                title="Early Detection" 
                description="We provide accessible screening tools to help identify dyslexia signs early, when intervention is most effective."
              />
              <FeatureCard 
                icon={Users}
                title="Community Support" 
                description="Building a supportive community where people with dyslexia can share experiences and strategies."
              />
              <FeatureCard 
                icon={Building}
                title="Continuous Improvement" 
                description="We're constantly researching and developing new methods to make dyslexia management easier."
              />
            </div>
          </div>
        </section>
        
        {/* Global Impact Section */}
        <section id="global" className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-16"
              initial={animationsDisabled ? {} : { opacity: 0, y: 20 }}
              whileInView={animationsDisabled ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Global Impact</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our dyslexia screening tools and resources are helping people around the world 
                gain access to life-changing support.
              </p>
            </motion.div>
            
            <div className="flex items-center justify-center mb-12">
              <motion.div 
                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                initial={animationsDisabled ? {} : { scale: 0 }}
                whileInView={animationsDisabled ? {} : { scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Globe className="h-8 w-8 text-primary" />
              </motion.div>
            </div>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <LocationCard country="India" users={42000} />
              <LocationCard country="United States" users={2500} />
              <LocationCard country="United Kingdom" users={1200} />
              <LocationCard country="Australia" users={750} />
              <LocationCard country="Canada" users={6800} />
              <LocationCard country="Germany" users={4500} />
              
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section id="contact" className="py-24 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={animationsDisabled ? {} : { opacity: 0, x: -20 }}
                whileInView={animationsDisabled ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
                <p className="text-muted-foreground mb-6">
                  Have questions about dyslexia or need support? We're here to help.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <span>aditya1290manhas.com</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <span>+91 600 5609 423</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={animationsDisabled ? {} : { opacity: 0, x: 20 }}
                whileInView={animationsDisabled ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-card rounded-xl border p-6"
              >
                <form onSubmit={handleContactSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                      <Input 
                        id="name" 
                        name="name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        placeholder="Your name" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                      <Textarea 
                        id="message" 
                        name="message"
                        value={contactForm.message}
                        onChange={handleInputChange}
                        placeholder="How can we help you?" 
                        rows={5} 
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full gap-2">
                      Send Message
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Footer with quick links */}
        <footer className="bg-card border-t py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Navigate</h3>
                <div className="space-y-2">
                  <Link to="/" className="block text-muted-foreground hover:text-foreground">Home</Link>
                  <Link to="/about" className="block text-muted-foreground hover:text-foreground">About</Link>
                  <Link to="/tests" className="block text-muted-foreground hover:text-foreground">Tests</Link>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4">Support</h3>
                <div className="space-y-2">
                  <Link to="/support" className="block text-muted-foreground hover:text-foreground">Resources</Link>
                  <Link to="/improve" className="block text-muted-foreground hover:text-foreground">Improve</Link>
                  <a href="#contact" className="block text-muted-foreground hover:text-foreground">Contact</a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4">Legal</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-muted-foreground hover:text-foreground">Privacy Policy</a>
                  <a href="#" className="block text-muted-foreground hover:text-foreground">Terms of Service</a>
                  <a href="#" className="block text-muted-foreground hover:text-foreground">Cookie Policy</a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4">Connect</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-muted-foreground hover:text-foreground">Twitter</a>
                  <a href="#" className="block text-muted-foreground hover:text-foreground">Facebook</a>
                  <a href="#" className="block text-muted-foreground hover:text-foreground">Instagram</a>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} DysCover. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </ScrollArea>
  );
};

export default Index;
