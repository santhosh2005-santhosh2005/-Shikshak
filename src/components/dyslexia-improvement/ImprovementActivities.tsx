import React, { useState } from "react";
import { motion } from "framer-motion";
import { DyslexiaLevel } from "@/types/dyslexia";
import { ActivityCard } from "@/components/dyslexia-improvement/ActivityCard";
import { useAccessibility } from "@/components/AccessibilitySettings";

// Icons
import { Brain, Book, AudioLines, Star, ArrowRight, Lightbulb } from "lucide-react";

interface ImprovementActivitiesProps {
  level: DyslexiaLevel;
}

export const ImprovementActivities: React.FC<ImprovementActivitiesProps> = ({ level }) => {
  const { settings } = useAccessibility();
  const animationsDisabled = settings.disableAnimations;

  const mildActivities = [
    {
      title: "Daily Reading with Tracking",
      description: "Read 15–20 mins daily using a reading ruler or text-to-speech tool.",
      icon: Book,
      steps: [
        "Set aside 15-20 minutes of daily reading time",
        "Use a reading ruler or the built-in ruler feature",
        "Try apps like BeeLine Reader or NaturalReader",
        "Track progress in a reading journal"
      ],
      tools: [
        {name: "BeeLine Reader", url: "https://www.beelinereader.com/"},
        {name: "NaturalReader", url: "https://www.naturalreaders.com/"},
      ]
    },
    {
      title: "Spelling Improvement Apps",
      description: "Use apps like Simplex Spelling or Word Wizard for 5-10 mins daily.",
      icon: Brain,
      steps: [
        "Practice with spelling apps for 5-10 minutes daily",
        "Focus on commonly confused words",
        "Review and revisit challenging words regularly",
        "Use mnemonics to remember tricky spellings"
      ],
      tools: [
        {name: "Simplex Spelling", url: "https://www.pyxwise.com/simplexspelling.html"},
        {name: "Word Wizard", url: "https://lescapadou.com/LEscapadou_-_Fun_and_Educational_applications_for_iPad_and_iPhone/Word_Wizard.html"},
      ]
    },
    {
      title: "Visual Letter Practice",
      description: "Trace letters that often get confused (b/d/p/q) using a mirror or drawing app.",
      icon: Lightbulb,
      steps: [
        "Identify your commonly confused letters (b/d, p/q, etc.)",
        "Practice tracing them in the air or on paper",
        "Use a mirror to observe your hand movements",
        "Try drawing apps for interactive practice"
      ],
      tools: [
        {name: "Letter School App", url: "https://www.letterschool.org/"},
        {name: "Dyslexia Quest", url: "https://www.nessy.com/us/apps/dyslexia-quest/"},
      ]
    },
    {
      title: "Font & Background Experiments",
      description: "Use OpenDyslexic font + sepia background for less visual stress.",
      icon: Star,
      steps: [
        "Try different font combinations in your device settings",
        "Enable OpenDyslexic in your accessibility settings",
        "Test various background colors (sepia, soft blue)",
        "Adjust text size and spacing for comfort"
      ],
      tools: [
        {name: "OpenDyslexic", url: "https://opendyslexic.org/"},
        {name: "Dyslexie Font", url: "https://www.dyslexiefont.com/"},
      ]
    },
    {
      title: "Memory Games",
      description: "Play memory or word sequence games to build cognitive skills.",
      icon: Brain,
      steps: [
        "Play word games like Knoword for 10 minutes daily",
        "Try Wordle or Spelling Bee for vocabulary building",
        "Use memory matching games to strengthen recall",
        "Challenge yourself with increasingly difficult levels"
      ],
      tools: [
        {name: "Knoword", url: "https://www.knoword.org/"},
        {name: "Wordle", url: "https://www.nytimes.com/games/wordle/"},
      ]
    }
  ];

  const moderateActivities = [
    {
      title: "Guided Reading Practice",
      description: "Use structured reading platforms like GraphoGame or ReadAlong by Google.",
      icon: Book,
      steps: [
        "Use structured reading apps for 20 minutes daily",
        "Practice reading aloud with a supportive listener",
        "Record yourself reading to track progress",
        "Focus on one paragraph at a time with breaks"
      ],
      tools: [
        {name: "GraphoGame", url: "https://graphogame.com/"},
        {name: "ReadAlong by Google", url: "https://readalong.google/"},
      ]
    },
    {
      title: "Phoneme Matching Games",
      description: "Match sounds to words with apps like Phonics Genius or printable worksheets.",
      icon: AudioLines,
      steps: [
        "Practice identifying sounds within words",
        "Use phonics apps to connect sounds to letters",
        "Create your own sound-word matches with flashcards",
        "Play rhyming games to strengthen phonemic awareness"
      ],
      tools: [
        {name: "Phonics Genius", url: "https://www.phonicsgenius.com/"},
        {name: "Nessy Learning", url: "https://www.nessy.com/us/"},
      ]
    },
    {
      title: "Daily Dictation",
      description: "Listen to short audio (e.g., a TED quote), then try writing it down.",
      icon: Book,
      steps: [
        "Listen to a short audio clip (1-2 sentences)",
        "Try to write down exactly what you heard",
        "Compare with the original text",
        "Gradually increase difficulty with longer passages"
      ],
      tools: [
        {name: "TED Talks", url: "https://www.ted.com/talks"},
        {name: "Dictation Practice App", url: "https://dictation.io/"},
      ]
    },
    {
      title: "Structured Literacy Work",
      description: "Follow a sample Orton-Gillingham sequence for systematic practice.",
      icon: Lightbulb,
      steps: [
        "Work through systematic phonics exercises",
        "Practice with decodable texts at your level",
        "Build from sounds to syllables to words",
        "Use multisensory approaches (touch, sight, sound)"
      ],
      tools: [
        {name: "Barton Reading", url: "https://bartonreading.com/"},
        {name: "Orton-Gillingham Online", url: "https://ortongillinghamonline.com/"},
      ]
    },
    {
      title: "Weekly Progress Log",
      description: "Keep a journal to track your improvements and challenges.",
      icon: Star,
      steps: [
        "Set weekly reading and writing goals",
        "Record your daily practice activities",
        "Note what's becoming easier and what remains challenging",
        "Celebrate small improvements and milestones"
      ],
      tools: [
        {name: "Reading Tracker Templates", url: "https://www.readingrockets.org/article/reading-logs"},
        {name: "Progress Monitoring App", url: "https://www.understood.org/en/articles/8-tools-for-taking-notes"},
      ]
    }
  ];

  const severeActivities = [
    {
      title: "Text-to-Speech Everything",
      description: "Use TTS for all reading through browser plugins or dedicated apps.",
      icon: AudioLines,
      steps: [
        "Install text-to-speech extensions on all your devices",
        "Use TTS for emails, articles, and books",
        "Adjust reading speed to match comprehension needs",
        "Follow along visually while listening when possible"
      ],
      tools: [
        {name: "Read&Write", url: "https://www.texthelp.com/products/read-and-write-education/"},
        {name: "NaturalReader", url: "https://www.naturalreaders.com/"},
      ]
    },
    {
      title: "Multi-Sensory Reading",
      description: "Combine sight + sound + touch using specialized apps and techniques.",
      icon: Brain,
      steps: [
        "Trace letters and words while saying them aloud",
        "Use sand trays or finger paint for tactile practice",
        "Try apps that combine visuals, audio, and interaction",
        "Create letter shapes with clay or pipe cleaners"
      ],
      tools: [
        {name: "Touch-type Read and Spell", url: "https://www.readandspell.com/"},
        {name: "Dyslexia Gold", url: "https://dyslexiagold.co.uk/"},
      ]
    },
    {
      title: "Specialized Programs",
      description: "Follow comprehensive approaches like Barton Reading, Wilson Program, or Nessy.",
      icon: Book,
      steps: [
        "Consider working with a trained literacy specialist",
        "Follow a structured, sequential reading program",
        "Practice daily for shorter periods (15-20 minutes)",
        "Use multisensory materials designed for dyslexia"
      ],
      tools: [
        {name: "Wilson Reading System", url: "https://www.wilsonlanguage.com/"},
        {name: "Nessy Learning", url: "https://www.nessy.com/us/"},
      ]
    },
    {
      title: "Break Down Words",
      description: "Practice visual syllable breaking on common word sets.",
      icon: Lightbulb,
      steps: [
        "Learn to identify syllables in words",
        "Use colored markers to highlight different syllables",
        "Practice with common words from your reading materials",
        "Create a personal dictionary of broken-down words"
      ],
      tools: [
        {name: "Syllable Division Resources", url: "https://www.readingrockets.org/strategies/syllable_games"},
        {name: "Syllable Counter", url: "https://syllablecounter.net/"},
      ]
    },
    {
      title: "Daily 10-Minute Drills",
      description: "Rotate through focused daily exercises targeting different skills.",
      icon: Star,
      steps: [
        "Day 1: Letter tracing and formation",
        "Day 2: Audio dictation of simple sentences",
        "Day 3: Memory matching with cards",
        "Day 4: Sight word recognition games",
        "Day 5: Reading with a magnifying reading strip"
      ],
      tools: [
        {name: "Dyslexia Reading Well", url: "https://www.dyslexia-reading-well.com/"},
        {name: "Reading Rockets", url: "https://www.readingrockets.org/"},
      ]
    },
    {
      title: "Speech Therapist Support",
      description: "Connect with professional help through directories based on your location.",
      icon: ArrowRight,
      steps: [
        "Research speech-language pathologists in your area",
        "Look for professionals with dyslexia specialization",
        "Ask about evaluation and individual treatment plans",
        "Explore teletherapy options if in-person isn't available"
      ],
      tools: [
        {name: "ASHA ProFind", url: "https://www.asha.org/profind/"},
        {name: "International Dyslexia Association", url: "https://dyslexiaida.org/provider-directories/"},
      ]
    }
  ];

  // Determine which activities to show based on level
  const getActivitiesByLevel = () => {
    switch (level) {
      case "mild":
        return mildActivities;
      case "moderate":
        return moderateActivities;
      case "severe":
        return severeActivities;
      default:
        return [];
    }
  };

  const activities = getActivitiesByLevel();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="grid grid-cols-1 gap-6"
      variants={containerVariants}
      initial={animationsDisabled ? "visible" : "hidden"}
      animate="visible"
    >
      {activities.map((activity, index) => (
        <motion.div
          key={`${level}-${index}`}
          variants={animationsDisabled ? {} : itemVariants}
          className="w-full"
        >
          <ActivityCard 
            title={activity.title} 
            description={activity.description}
            icon={activity.icon}
            steps={activity.steps}
            tools={activity.tools}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
