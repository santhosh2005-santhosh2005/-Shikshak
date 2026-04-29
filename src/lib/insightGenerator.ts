/**
 * Intelligent Insight Generator for DysCover
 * Generates explainable WHY + WHAT TO DO insights based on assessment data
 */

export interface InsightData {
  accuracy?: number;
  averageTime?: number;
  timeScore?: number;
  riskLevel?: "Low" | "Moderate" | "High";
  riskFactors?: string[];
  learningType?: "dyslexia" | "adhd" | "autism" | "mixed" | "general";
  correctAnswers?: number;
  totalQuestions?: number;
  attentionSpan?: number;
  weakAreas?: Array<{ area: string; level: string }>;
  testType?: string;
  behaviorPatterns?: string[];
}

export interface GeneratedInsight {
  why: string;
  whatToDo: string[];
  strength: string;
  challenge: string;
  confidence: number; // 0-100 indicating how confident we are in this insight
}

export interface ComprehensiveInsights {
  primary: GeneratedInsight;
  secondary?: GeneratedInsight;
  generalObservations: string[];
  learningStyle: string;
  recommendedApproach: string;
}

/**
 * Main insight generator function
 * Analyzes assessment data and generates intelligent, actionable insights
 */
export const generateInsights = (data: InsightData): ComprehensiveInsights => {
  const learningType = data.learningType || determineLearningType(data);
  
  let primary: GeneratedInsight;
  let secondary: GeneratedInsight | undefined;
  let generalObservations: string[] = [];
  let learningStyle = "";
  let recommendedApproach = "";

  switch (learningType) {
    case "dyslexia":
      primary = generateDyslexiaInsights(data);
      learningStyle = "Visual-Spatial & Multi-Sensory";
      recommendedApproach = "Use multi-sensory teaching methods combining visual, auditory, and kinesthetic approaches";
      break;
    
    case "adhd":
      primary = generateADHDInsights(data);
      learningStyle = "Interactive & Movement-Based";
      recommendedApproach = "Break tasks into shorter segments with frequent breaks and rewards";
      break;
    
    case "autism":
      primary = generateAutismInsights(data);
      learningStyle = "Structured & Predictable";
      recommendedApproach = "Maintain consistent routines and provide clear, step-by-step instructions";
      break;
    
    case "mixed":
      primary = generateMixedPatternInsights(data);
      secondary = generateSecondaryInsight(data);
      learningStyle = "Adaptive & Flexible";
      recommendedApproach = "Use personalized adaptive methods that adjust to the child's changing needs";
      generalObservations = [
        "Shows varied performance across different task types",
        "Benefits from flexibility in learning approaches",
        "May need different strategies for different subjects"
      ];
      break;
    
    default:
      primary = generateGeneralInsights(data);
      learningStyle = "Individualized";
      recommendedApproach = "Continue monitoring and adapt strategies based on progress";
      generalObservations = [
        "Shows typical learning patterns with room for growth",
        "Responds well to structured support",
        "Benefits from regular practice and reinforcement"
      ];
  }

  return {
    primary,
    secondary,
    generalObservations,
    learningStyle,
    recommendedApproach
  };
};

/**
 * Determines learning type based on assessment data
 */
const determineLearningType = (data: InsightData): "dyslexia" | "adhd" | "autism" | "mixed" | "general" => {
  const { accuracy, averageTime, riskFactors, weakAreas } = data;
  
  // Check for dyslexia indicators
  const hasDyslexiaFactors = riskFactors?.some(f => 
    f.toLowerCase().includes("phonological") ||
    f.toLowerCase().includes("reading") ||
    f.toLowerCase().includes("decoding") ||
    f.toLowerCase().includes("letter")
  ) || weakAreas?.some(w => 
    w.area.toLowerCase().includes("phonological") ||
    w.area.toLowerCase().includes("reading")
  );

  // Check for ADHD indicators
  const hasADHDFactors = (averageTime !== undefined && averageTime < 5 && accuracy !== undefined && accuracy < 80) ||
    riskFactors?.some(f => 
      f.toLowerCase().includes("attention") ||
      f.toLowerCase().includes("impulse") ||
      f.toLowerCase().includes("focus")
    ) || weakAreas?.some(w => 
      w.area.toLowerCase().includes("focus") ||
      w.area.toLowerCase().includes("attention")
    );

  // Check for autism indicators
  const hasAutismFactors = (accuracy !== undefined && accuracy > 85 && averageTime !== undefined && averageTime > 7) ||
    riskFactors?.some(f => 
      f.toLowerCase().includes("social") ||
      f.toLowerCase().includes("flexibility") ||
      f.toLowerCase().includes("transition")
    ) || weakAreas?.some(w => 
      w.area.toLowerCase().includes("social") ||
      w.area.toLowerCase().includes("flexibility")
    );

  // Count matches
  const matches = [
    hasDyslexiaFactors ? "dyslexia" : null,
    hasADHDFactors ? "adhd" : null,
    hasAutismFactors ? "autism" : null
  ].filter(Boolean);

  if (matches.length > 1) return "mixed";
  if (matches.length === 0) return "general";
  return matches[0] as "dyslexia" | "adhd" | "autism";
};

/**
 * Generate Dyslexia-specific insights
 */
const generateDyslexiaInsights = (data: InsightData): GeneratedInsight => {
  const { accuracy, averageTime, timeScore } = data;
  
  // Determine specific dyslexia pattern
  let why = "";
  let challenge = "";
  
  if (averageTime !== undefined && averageTime > 12) {
    why = "The child struggles due to slower phonological decoding speed. Their brain processes written words differently, requiring more time to connect sounds with letters and break down complex words.";
    challenge = "Reading Speed & Decoding";
  } else if (accuracy !== undefined && accuracy < 65) {
    why = "The child shows difficulty with phonological awareness - the ability to recognize and manipulate sounds in words. This affects their ability to sound out unfamiliar words and may cause letter reversals (b/d) or confusion with similar-looking letters.";
    challenge = "Phonological Processing";
  } else {
    why = "The child demonstrates typical dyslexic patterns where visual processing may be stronger than auditory processing. They might excel at understanding concepts through pictures but struggle with text-heavy materials.";
    challenge = "Text Processing";
  }

  const whatToDo = [
    "Use audio-assisted reading exercises where the child can listen and follow along simultaneously",
    "Apply multi-sensory techniques: trace letters in sand, use colored overlays, or build words with magnetic letters",
    "Break reading tasks into 10-minute intervals with short breaks to prevent cognitive fatigue",
    "Use dyslexia-friendly fonts (OpenDyslexic, Arial, or Comic Sans) at 14-16pt size",
    "Provide text-to-speech tools for longer passages and assignments",
    "Practice phonics through games and songs rather than repetitive drills"
  ];

  const strength = accuracy !== undefined && accuracy > 70
    ? "Shows strong comprehension when content is accessible through alternative methods"
    : "Demonstrates persistence and effort despite processing challenges";

  return {
    why,
    whatToDo,
    strength,
    challenge,
    confidence: calculateConfidence(data, "dyslexia")
  };
};

/**
 * Generate ADHD-specific insights
 */
const generateADHDInsights = (data: InsightData): GeneratedInsight => {
  const { accuracy, averageTime, attentionSpan } = data;
  
  let why = "";
  let challenge = "";
  
  if (averageTime !== undefined && averageTime < 5) {
    why = "Performance indicates impulsive responding rather than lack of understanding. The child's brain seeks quick stimulation, leading to fast but sometimes inaccurate answers. Attention drops significantly after short durations, indicating attention variability typical of ADHD.";
    challenge = "Sustained Attention & Impulse Control";
  } else if (attentionSpan !== undefined && attentionSpan < 40) {
    why = "The child's attention system shows high variability - they can hyperfocus on engaging tasks but struggle with sustained attention on less stimulating activities. This is not a lack of ability, but a difference in how their brain regulates attention and dopamine.";
    challenge = "Attention Regulation";
  } else {
    why = "The child shows signs of executive function challenges, particularly in maintaining focus and regulating response speed. Their brain's reward system responds better to immediate feedback and varied stimulation.";
    challenge = "Executive Function";
  }

  const whatToDo = [
    "Break lessons into shorter segments (10-15 minutes) with active breaks in between",
    "Incorporate movement-based learning: let them stand, use fidget tools, or act out concepts",
    "Use visual timers to make time concrete and help with self-regulation",
    "Provide immediate, specific praise and rewards for completed tasks",
    "Reduce environmental distractions: create a clean, quiet workspace",
    "Use gamification and point systems to maintain engagement",
    "Allow flexible seating options and periodic movement breaks"
  ];

  const strength = accuracy !== undefined && accuracy > 75
    ? "Demonstrates strong capability when engaged and focused"
    : "Shows creativity and quick thinking despite attention challenges";

  return {
    why,
    whatToDo,
    strength,
    challenge,
    confidence: calculateConfidence(data, "adhd")
  };
};

/**
 * Generate Autism-specific insights
 */
const generateAutismInsights = (data: InsightData): GeneratedInsight => {
  const { accuracy, averageTime, weakAreas } = data;
  
  let why = "";
  let challenge = "";
  
  const hasSocialChallenges = weakAreas?.some(w => 
    w.area.toLowerCase().includes("social") ||
    w.area.toLowerCase().includes("inference")
  );
  
  const hasFlexibilityChallenges = weakAreas?.some(w => 
    w.area.toLowerCase().includes("flexibility") ||
    w.area.toLowerCase().includes("transition")
  );

  if (accuracy !== undefined && accuracy > 85) {
    why = "The child performs exceptionally well in structured, predictable tasks with clear rules. Their brain excels at pattern recognition and detail-oriented work. However, they may struggle when expectations change unexpectedly or when tasks require social inference and contextual flexibility.";
    challenge = "Flexibility & Social Context";
  } else if (hasFlexibilityChallenges) {
    why = "The child thrives in predictable environments but experiences difficulty when routines change or when abstract thinking is required. This is not a limitation of intelligence, but a difference in how their brain processes ambiguity and transitions.";
    challenge = "Transitions & Abstract Thinking";
  } else {
    why = "The child shows strengths in systematic, logical tasks while finding open-ended or socially complex situations challenging. They benefit from explicit instruction and may need support generalizing skills across different contexts.";
    challenge = "Generalization & Social Understanding";
  }

  const whatToDo = [
    "Provide clear, step-by-step structured tasks with explicit expectations",
    "Maintain consistent layout, routines, and predictable schedules",
    "Use visual schedules and advance warnings before transitions",
    "Break down abstract concepts into concrete, literal examples",
    "Teach social skills through structured role-play and social stories",
    "Allow extra processing time when introducing new concepts",
    "Use their special interests as motivators and learning bridges",
    "Create a quiet space for breaks when overwhelmed"
  ];

  const strength = "Demonstrates exceptional focus, attention to detail, and ability to master structured systems";

  return {
    why,
    whatToDo,
    strength,
    challenge,
    confidence: calculateConfidence(data, "autism")
  };
};

/**
 * Generate insights for mixed patterns
 */
const generateMixedPatternInsights = (data: InsightData): GeneratedInsight => {
  const why = "The child shows a complex learning profile with strengths in some areas and challenges in others. This mixed pattern suggests that a one-size-fits-all approach won't work effectively. Their brain processes different types of information in varied ways, requiring adaptive and flexible teaching strategies.";
  
  const challenge = "Variable Performance Across Domains";
  
  const whatToDo = [
    "Use adaptive learning tools that adjust difficulty based on real-time performance",
    "Identify and leverage their strongest learning modality (visual, auditory, kinesthetic)",
    "Provide multiple ways to engage with content and demonstrate understanding",
    "Monitor patterns: note which times of day and which subjects show better performance",
    "Combine strategies from different approaches rather than using a single method",
    "Regularly reassess and adjust strategies as the child develops"
  ];

  const strength = "Shows versatility and the ability to succeed with the right support combinations";

  return {
    why,
    whatToDo,
    strength,
    challenge,
    confidence: calculateConfidence(data, "mixed")
  };
};

/**
 * Generate secondary insight for mixed patterns
 */
const generateSecondaryInsight = (data: InsightData): GeneratedInsight | undefined => {
  const { accuracy, averageTime } = data;
  
  // If accuracy is moderate but time varies significantly
  if (accuracy !== undefined && accuracy > 60 && accuracy < 80 && averageTime !== undefined) {
    return {
      why: "The inconsistency in performance suggests that external factors (fatigue, interest level, environment) significantly impact results. The child has the capability but needs optimal conditions to perform consistently.",
      whatToDo: [
        "Track performance patterns to identify optimal learning times",
        "Ensure adequate sleep and nutrition before learning sessions",
        "Create a consistent, distraction-free learning environment"
      ],
      strength: "Capable of strong performance under right conditions",
      challenge: "Performance Consistency",
      confidence: 60
    };
  }
  
  return undefined;
};

/**
 * Generate general insights when no specific pattern is detected
 */
const generateGeneralInsights = (data: InsightData): GeneratedInsight => {
  const { accuracy, averageTime } = data;
  
  let why = "";
  let challenge = "";
  
  if (accuracy !== undefined && accuracy > 80) {
    why = "The child shows typical learning patterns with good overall performance. They benefit from continued support and enrichment to maintain progress and address any minor areas of difficulty.";
    challenge = "Minor skill refinements";
  } else if (accuracy !== undefined && accuracy < 60) {
    why = "The child shows mixed learning patterns and benefits from adaptive methods. Multiple factors may be influencing performance, and a comprehensive evaluation could help identify specific areas for targeted support.";
    challenge = "Multiple areas need attention";
  } else {
    why = "The child demonstrates average performance with room for growth in specific areas. They respond well to structured support and benefit from regular practice and positive reinforcement.";
    challenge = "Targeted skill development";
  }

  const whatToDo = [
    "Continue monitoring progress across different skill areas",
    "Provide regular practice opportunities in challenging areas",
    "Celebrate improvements and effort, not just accuracy",
    "Use a variety of teaching methods to find what works best",
    "Maintain open communication with teachers and specialists",
    "Encourage reading and learning activities at their comfort level"
  ];

  const strength = accuracy !== undefined && accuracy > 70
    ? "Shows solid foundation with potential for advancement"
    : "Demonstrates willingness to engage and try";

  return {
    why,
    whatToDo,
    strength,
    challenge,
    confidence: calculateConfidence(data, "general")
  };
};

/**
 * Calculate confidence score based on data completeness
 */
const calculateConfidence = (data: InsightData, type: string): number => {
  let confidence = 50; // Base confidence
  
  // Increase confidence based on data availability
  if (data.accuracy !== undefined) confidence += 10;
  if (data.averageTime !== undefined) confidence += 10;
  if (data.riskLevel) confidence += 10;
  if (data.riskFactors && data.riskFactors.length > 0) confidence += 10;
  if (data.weakAreas && data.weakAreas.length > 0) confidence += 10;
  if (data.attentionSpan !== undefined) confidence += 10;
  
  // Cap at 95
  return Math.min(confidence, 95);
};

/**
 * Generate a simplified insight summary for Parent Digest
 */
export const generateParentFriendlyInsight = (data: InsightData): {
  summary: string;
  observations: string[];
  suggestions: string[];
} => {
  const insights = generateInsights(data);
  const { primary } = insights;
  
  // Convert technical insights to parent-friendly language
  const summary = `Your child is showing wonderful effort in their learning journey. ${primary.why.split('.')[0]}. We've identified that ${primary.challenge.toLowerCase()} is an area where they need extra support, but they also demonstrate real strengths in ${primary.strength.toLowerCase()}.`;
  
  const observations = [
    primary.strength,
    `Currently working through challenges with ${primary.challenge.toLowerCase()}`,
    `Shows a ${insights.learningStyle.toLowerCase()} learning style`
  ];
  
  const suggestions = primary.whatToDo.slice(0, 4); // Top 4 suggestions
  
  return {
    summary,
    observations,
    suggestions
  };
};

/**
 * Generate teacher-specific detailed insights
 */
export const generateTeacherInsight = (data: InsightData) => {
  const insights = generateInsights(data);
  
  return {
    whyExplanation: insights.primary.why,
    recommendedActions: insights.primary.whatToDo,
    studentStrength: insights.primary.strength,
    mainChallenge: insights.primary.challenge,
    learningStyle: insights.learningStyle,
    teachingApproach: insights.recommendedApproach,
    confidence: insights.primary.confidence,
    generalObservations: insights.generalObservations,
    secondaryInsight: insights.secondary
  };
};
