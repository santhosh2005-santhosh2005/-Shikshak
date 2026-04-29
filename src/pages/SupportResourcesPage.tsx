
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Phone, Mail, ExternalLink, Heart, Brain, Lightbulb, Download, Globe, Smartphone, Headphones, MonitorSpeaker, Calculator, PenTool, Video, GraduationCap, Building, MessageCircle, FileText, Zap, Music, GamepadIcon, Star } from "lucide-react";

const SupportResourcesPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const emergencySupport = [
    {
      title: "International Dyslexia Association Helpline",
      phone: "+1-410-296-0232",
      description: "Professional guidance and support for dyslexia-related questions",
      icon: Phone,
      color: "blue-500",
      link: "tel:+14102960232"
    },
    {
      title: "Learning Disabilities Hotline",
      phone: "1-855-303-4636",
      description: "24/7 support for learning difficulties and educational advocacy",
      icon: BookOpen,
      color: "green-500",
      link: "tel:18553034636"
    },
    {
      title: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "Mental health crisis support via text messaging",
      icon: MessageCircle,
      color: "purple-500",
      link: "sms:741741"
    }
  ];

  const readingAndWritingTools = [
    {
      title: "Text-to-Speech Software",
      items: [
        { name: "NaturalReader", url: "https://www.naturalreaders.com", description: "Free and premium text-to-speech with natural voices" },
        { name: "Voice Dream Reader", url: "https://www.voicedream.com", description: "Mobile app for reading digital content aloud" },
        { name: "Read&Write by Texthelp", url: "https://www.texthelp.com/readwrite", description: "Comprehensive reading and writing support" },
        { name: "Speechify", url: "https://speechify.com", description: "AI-powered text-to-speech platform" }
      ],
      icon: Headphones,
      color: "blue-500"
    },
    {
      title: "Writing Assistance Tools",
      items: [
        { name: "Grammarly", url: "https://www.grammarly.com", description: "AI writing assistant for grammar and clarity" },
        { name: "Ginger Software", url: "https://www.gingersoftware.com", description: "Grammar checker and sentence rephraser" },
        { name: "Dragon NaturallySpeaking", url: "https://www.nuance.com/dragon.html", description: "Professional speech recognition software" },
        { name: "Co:Writer", url: "https://www.donjohnston.com/cowriter", description: "Word prediction and spelling support" }
      ],
      icon: PenTool,
      color: "green-500"
    },
    {
      title: "Reading Support Apps",
      items: [
        { name: "Learning Ally", url: "https://learningally.org", description: "Human-narrated audiobooks for students" },
        { name: "Bookshare", url: "https://www.bookshare.org", description: "Digital library for people with reading barriers" },
        { name: "Voice Dream Reader", url: "https://www.voicedream.com", description: "Advanced reading app with OCR capabilities" },
        { name: "ClaroRead", url: "https://www.clarosoftware.com", description: "Comprehensive reading support software" }
      ],
      icon: BookOpen,
      color: "purple-500"
    }
  ];

  const learningPlatforms = [
    {
      title: "Dyslexia-Specific Programs",
      items: [
        { name: "Nessy Learning Programme", url: "https://www.nessy.com", description: "Multi-sensory reading and spelling program" },
        { name: "Wilson Reading System", url: "https://www.wilsonlanguage.com", description: "Structured literacy approach for dyslexic learners" },
        { name: "Orton-Gillingham Online", url: "https://www.orton-gillingham.com", description: "Multisensory approach to reading instruction" },
        { name: "Dyslexia Gold", url: "https://www.dyslexiagold.co.uk", description: "Comprehensive dyslexia training program" }
      ],
      icon: GraduationCap,
      color: "orange-500"
    },
    {
      title: "Interactive Learning",
      items: [
        { name: "Reading Eggs", url: "https://readingeggs.com", description: "Fun online reading lessons for all ages" },
        { name: "Khan Academy", url: "https://www.khanacademy.org", description: "Free educational content with accessibility features" },
        { name: "Lexia Core5", url: "https://www.lexialearning.com", description: "Adaptive reading instruction program" },
        { name: "Fast ForWord", url: "https://www.scilearn.com", description: "Brain training for language and reading skills" }
      ],
      icon: MonitorSpeaker,
      color: "teal-500"
    },
    {
      title: "Mobile Learning Apps",
      items: [
        { name: "ModMath", url: "https://www.modmath.com", description: "Digital graph paper for math problems" },
        { name: "Prizmo 4", url: "https://www.creaceed.com/prizmo", description: "OCR app with text recognition" },
        { name: "SimpleMind", url: "https://simplemind.eu", description: "Mind mapping for visual learning" },
        { name: "Inspiration Maps", url: "https://www.inspiration.com", description: "Visual learning and concept mapping" }
      ],
      icon: Smartphone,
      color: "indigo-500"
    }
  ];

  const supportCommunities = [
    {
      title: "Online Communities",
      items: [
        { name: "Reddit r/Dyslexia", url: "https://www.reddit.com/r/Dyslexia", description: "Active community for support and advice" },
        { name: "Dyslexia Support Group (Facebook)", url: "https://www.facebook.com/groups/dyslexiasupport", description: "Large Facebook community for families" },
        { name: "British Dyslexia Association Forum", url: "https://www.bdadyslexia.org.uk", description: "UK-based support and resources" },
        { name: "International Dyslexia Association", url: "https://dyslexiaida.org", description: "Global organization with local chapters" }
      ],
      icon: Users,
      color: "pink-500"
    },
    {
      title: "Professional Networks",
      items: [
        { name: "Academic Language Therapy Association", url: "https://www.altaread.org", description: "Professional therapist network" },
        { name: "International Multisensory Structured Language Education Council", url: "https://www.imslec.org", description: "Certification for reading specialists" },
        { name: "Learning Disabilities Association", url: "https://ldaamerica.org", description: "National organization for learning disabilities" },
        { name: "Council for Learning Disabilities", url: "https://council-for-learning-disabilities.org", description: "Professional development and research" }
      ],
      icon: Brain,
      color: "cyan-500"
    }
  ];

  const accommodationGuides = [
    {
      title: "Workplace Accommodations",
      description: "Legal rights and practical accommodations for the workplace",
      items: [
        "Extended time for complex tasks and projects",
        "Written instructions and meeting summaries",
        "Assistive technology provision (text-to-speech, voice recognition)",
        "Flexible work schedules and break periods",
        "Alternative formats for documents and presentations",
        "Quiet workspace or noise-cancelling headphones",
        "Permission to record meetings and training sessions"
      ],
      icon: Building,
      color: "emerald-500"
    },
    {
      title: "Educational Accommodations",
      description: "IEP/504 plan accommodations for students",
      items: [
        "Extended time on tests and assignments (typically 1.5x or 2x)",
        "Alternative testing formats (oral exams, multiple choice vs. essay)",
        "Use of assistive technology (calculators, spell-checkers, laptops)",
        "Note-taking assistance or permission to record lectures",
        "Preferential seating (front of class, away from distractions)",
        "Audio versions of textbooks and reading materials",
        "Reduced homework load while maintaining learning objectives"
      ],
      icon: GraduationCap,
      color: "violet-500"
    }
  ];

  const researchAndInformation = [
    {
      title: "Leading Research Organizations",
      items: [
        { name: "Yale Center for Dyslexia & Creativity", url: "https://dyslexia.yale.edu", description: "Cutting-edge research and resources" },
        { name: "University of Michigan Dyslexia Help", url: "https://dyslexiahelp.umich.edu", description: "Evidence-based information and tools" },
        { name: "Haskins Laboratories", url: "https://haskins.yale.edu", description: "Research on reading and language" },
        { name: "Scientific Studies of Reading Journal", url: "https://www.tandfonline.com/toc/hssr20/current", description: "Peer-reviewed research publication" }
      ],
      icon: Brain,
      color: "amber-500"
    },
    {
      title: "Educational Resources",
      items: [
        { name: "Understood.org", url: "https://www.understood.org", description: "Comprehensive learning differences resource" },
        { name: "LD Online", url: "http://www.ldonline.org", description: "Learning disabilities information and community" },
        { name: "Reading Rockets", url: "https://www.readingrockets.org", description: "Research-based reading strategies" },
        { name: "Colorín Colorado", url: "https://www.colorincolorado.org", description: "Bilingual literacy for educators and families" }
      ],
      icon: BookOpen,
      color: "lime-500"
    }
  ];

  const downloadableResources = [
    { name: "IEP/504 Plan Checklist for Parents", type: "PDF Guide", description: "Comprehensive checklist for educational planning" },
    { name: "Dyslexia Accommodation Request Letter Template", type: "Word Template", description: "Professional letter template for requesting accommodations" },
    { name: "College Application Disclosure Guide", type: "PDF Guide", description: "When and how to disclose dyslexia in college applications" },
    { name: "Workplace Rights and Accommodations Handbook", type: "PDF Guide", description: "Know your rights under ADA and other laws" },
    { name: "Study Strategies for Dyslexic Students", type: "PDF Guide", description: "Proven study techniques and learning strategies" },
    { name: "Technology Setup Guide for Reading Support", type: "PDF Guide", description: "Step-by-step setup for assistive technology" }
  ];

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      
      <div className="absolute inset-0 -z-10 bg-grid"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
      
      <div className="container mx-auto pt-32 pb-20 px-4 md:pt-36 relative z-0">
        <div className={`max-w-7xl mx-auto transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <AnimatedHeading delay={200} className="text-4xl md:text-5xl font-bold mb-8">
              Dyslexia Support & Resources
            </AnimatedHeading>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Comprehensive resources, tools, and support networks to help individuals with dyslexia thrive in education, work, and daily life.
            </p>
          </div>

          {/* Emergency Support */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
              <Phone className="h-8 w-8 text-red-500" />
              Emergency Support & Helplines
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {emergencySupport.map((helpline, index) => (
                <Card key={index} className="border-l-4 border-l-red-500 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className={`flex-shrink-0 rounded-full p-3 bg-${helpline.color}/10 text-${helpline.color}`}>
                        <helpline.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{helpline.title}</h3>
                        <Button 
                          variant="outline" 
                          className="text-2xl font-bold mb-3 w-full"
                          onClick={() => openLink(helpline.link)}
                        >
                          {helpline.phone}
                        </Button>
                        <p className="text-sm text-muted-foreground">
                          {helpline.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Reading and Writing Tools */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
              <Zap className="h-8 w-8 text-blue-500" />
              Assistive Technology Tools
            </h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {readingAndWritingTools.map((category, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-${category.color}/10 rounded-full flex items-center justify-center mb-4`}>
                      <category.icon className={`h-6 w-6 text-${category.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{category.title}</h3>
                    <div className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <Button
                          key={itemIndex}
                          variant="ghost"
                          className="w-full justify-start text-left h-auto p-3 hover:bg-primary/5"
                          onClick={() => openLink(item.url)}
                        >
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {item.name}
                              <ExternalLink className="h-3 w-3" />
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.description}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Learning Platforms */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
              <GraduationCap className="h-8 w-8 text-green-500" />
              Learning Platforms & Programs
            </h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {learningPlatforms.map((platform, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-${platform.color}/10 rounded-full flex items-center justify-center mb-4`}>
                      <platform.icon className={`h-6 w-6 text-${platform.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{platform.title}</h3>
                    <div className="space-y-3">
                      {platform.items.map((item, itemIndex) => (
                        <Button
                          key={itemIndex}
                          variant="ghost"
                          className="w-full justify-start text-left h-auto p-3 hover:bg-primary/5"
                          onClick={() => openLink(item.url)}
                        >
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {item.name}
                              <ExternalLink className="h-3 w-3" />
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.description}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Support Communities */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
              <Users className="h-8 w-8 text-purple-500" />
              Support Communities & Networks
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {supportCommunities.map((community, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-${community.color}/10 rounded-full flex items-center justify-center mb-4`}>
                      <community.icon className={`h-6 w-6 text-${community.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{community.title}</h3>
                    <div className="space-y-3">
                      {community.items.map((item, itemIndex) => (
                        <Button
                          key={itemIndex}
                          variant="ghost"
                          className="w-full justify-start text-left h-auto p-3 hover:bg-primary/5"
                          onClick={() => openLink(item.url)}
                        >
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {item.name}
                              <ExternalLink className="h-3 w-3" />
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.description}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Accommodations */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-orange-500" />
              Accommodation Guides
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {accommodationGuides.map((guide, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-${guide.color}/10 rounded-full flex items-center justify-center mb-4`}>
                      <guide.icon className={`h-6 w-6 text-${guide.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
                    <p className="text-muted-foreground mb-4">{guide.description}</p>
                    <div className="space-y-2">
                      {guide.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start gap-2 text-sm">
                          <Star className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Research and Information */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
              <Brain className="h-8 w-8 text-cyan-500" />
              Research & Information
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {researchAndInformation.map((research, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-${research.color}/10 rounded-full flex items-center justify-center mb-4`}>
                      <research.icon className={`h-6 w-6 text-${research.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{research.title}</h3>
                    <div className="space-y-3">
                      {research.items.map((item, itemIndex) => (
                        <Button
                          key={itemIndex}
                          variant="ghost"
                          className="w-full justify-start text-left h-auto p-3 hover:bg-primary/5"
                          onClick={() => openLink(item.url)}
                        >
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {item.name}
                              <ExternalLink className="h-3 w-3" />
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.description}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Downloadable Resources */}
          <Card className="mb-16 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Free Downloadable Resources</h3>
                <p className="text-muted-foreground">Templates, guides, and checklists to help you navigate dyslexia support</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {downloadableResources.map((resource, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="h-auto p-4 text-left justify-start gap-3 hover:bg-primary/5 transition-all duration-300 animate-fade-in"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <Download className="h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <div className="font-medium text-sm">{resource.name}</div>
                      <div className="text-xs text-muted-foreground">{resource.type}</div>
                      <div className="text-xs text-muted-foreground mt-1">{resource.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Need Additional Support?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you find the right resources and connect with local professionals.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button className="gap-2" onClick={() => openLink('mailto:support@dyslexiascreening.com')}>
                  <Mail className="h-4 w-4" />
                  Email Support
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => openLink('tel:+18553034636')}>
                  <Phone className="h-4 w-4" />
                  Call Us
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => openLink('https://dyslexiaida.org/local-resources')}>
                  <Globe className="h-4 w-4" />
                  Find Local Resources
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportResourcesPage;
