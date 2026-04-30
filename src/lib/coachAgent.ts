export type LearnerState = 'hesitation' | 'impulsive' | 'distracted' | 'normal';
export type LearningType = 'dyslexia' | 'adhd' | 'autism' | 'general';

/**
 * Determines the user's state based on interaction metrics.
 */
export const decideState = (
  responseTime: number,
  clickCount: number,
  idleTime: number
): LearnerState => {
  const HESITATION_THRESHOLD = 15000; 
  const IMPULSIVE_CLICK_THRESHOLD = 4; 
  const DISTRACTED_IDLE_THRESHOLD = 30000; 

  if (clickCount >= IMPULSIVE_CLICK_THRESHOLD) {
    return 'impulsive';
  }
  
  if (idleTime >= DISTRACTED_IDLE_THRESHOLD) {
    return 'distracted';
  }
  
  if (responseTime >= HESITATION_THRESHOLD) {
    return 'hesitation';
  }

  return 'normal';
};

/**
 * Determines if a direct support link should be provided based on state severity.
 */
export const getCoachLink = (state: LearnerState): string | null => {
  if (state === 'hesitation' || state === 'distracted') {
    return '/support'; // Use '/support' as this is the actual route in App.tsx for SupportResourcesPage
  }
  return null;
};

interface NudgeData {
  message: string;
  variant: 'attention' | 'encouragement' | 'neutral';
  actionLabel?: string;
  actionLink?: string;
}

/**
 * Returns a tailored nudge message with optional actions.
 */
export const buildNudge = (
  state: LearnerState,
  type: LearningType
): NudgeData | null => {
  if (state === 'normal') return null;

  const guidanceDb: Record<LearningType, Record<Exclude<LearnerState, 'normal'>, { msg: string; variant: 'attention' | 'encouragement' }>> = {
    dyslexia: {
      hesitation: { msg: "Take your time. Try reading the sentence slowly.", variant: "encouragement" },
      impulsive: { msg: "Let's pause. Reread the options carefully.", variant: "attention" },
      distracted: { msg: "Let's gently bring focus back to the task.", variant: "attention" }
    },
    adhd: {
      hesitation: { msg: "You're doing great! Just pick the one that feels right.", variant: "encouragement" },
      impulsive: { msg: "Quick clicks! Let's focus on one step at a time.", variant: "attention" },
      distracted: { msg: "Hey there! Let's get back to the mission.", variant: "attention" }
    },
    autism: {
      hesitation: { msg: "It's okay to take your time. There is no rush.", variant: "encouragement" },
      impulsive: { msg: "One click is enough. Wait for the screen to update.", variant: "attention" },
      distracted: { msg: "Take a deep breath. Ready to continue?", variant: "attention" }
    },
    general: {
      hesitation: { msg: "Need a hint? Take your time to think.", variant: "encouragement" },
      impulsive: { msg: "Slow down a bit. Quality over speed!", variant: "attention" },
      distracted: { msg: "Are you still there? Let's finish this!", variant: "attention" }
    }
  };

  const baseNudge = guidanceDb[type]?.[state] || guidanceDb.general[state];
  const link = getCoachLink(state);

  return {
    message: baseNudge.msg,
    variant: baseNudge.variant,
    ...(link ? { actionLabel: 'View Help', actionLink: link } : {})
  };
};
