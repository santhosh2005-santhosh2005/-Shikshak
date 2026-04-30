import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { decideState, buildNudge, LearningType } from '@/lib/coachAgent';
import { Brain, Sparkles, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CoachNudgeProps {
  learningType?: LearningType;
}

export const CoachNudge: React.FC<CoachNudgeProps> = ({ learningType = 'general' }) => {
  const [nudgeMsg, setNudgeMsg] = useState<{ message: string; variant: 'attention' | 'encouragement' | 'neutral', actionLabel?: string, actionLink?: string } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Metrics state
  const lastActionTime = useRef<number>(Date.now());
  const clickCount = useRef<number>(0);
  const clickResetTimer = useRef<NodeJS.Timeout | null>(null);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const startHideTimer = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!isHovered) {
        setNudgeMsg(null);
      }
    }, 5000);
  }, [isHovered]);

  useEffect(() => {
    if (nudgeMsg && !isHovered) {
      startHideTimer();
    } else if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }
  }, [nudgeMsg, isHovered, startHideTimer]);

  useEffect(() => {
    const handleInteraction = (e: MouseEvent | KeyboardEvent) => {
      const now = Date.now();
      
      if (e.type === 'click') {
        clickCount.current += 1;
        if (clickResetTimer.current) clearTimeout(clickResetTimer.current);
        clickResetTimer.current = setTimeout(() => {
          clickCount.current = 0;
        }, 2000);
      }
      
      const responseTime = now - lastActionTime.current;
      analyzeBehavior(responseTime, clickCount.current, 0);
      lastActionTime.current = now;
    };

    const idleCheckInterval = setInterval(() => {
      const now = Date.now();
      const idleTime = now - lastActionTime.current;
      analyzeBehavior(0, clickCount.current, idleTime);
    }, 5000);

    window.addEventListener('click', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction, { passive: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      clearInterval(idleCheckInterval);
      if (clickResetTimer.current) clearTimeout(clickResetTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [learningType]);

  const analyzeBehavior = (responseTime: number, clicks: number, idle: number) => {
    // Don't trigger new nudges if one is already showing
    if (nudgeMsg) return;

    const state = decideState(responseTime, clicks, idle);
    if (state !== 'normal') {
      const nudge = buildNudge(state, learningType);
      if (nudge) {
        setNudgeMsg(nudge);
        clickCount.current = 0; 
        lastActionTime.current = Date.now();
      }
    }
  };

  return (
    <AnimatePresence>
      {nudgeMsg && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            startHideTimer();
          }}
          className={`fixed bottom-6 right-6 z-[9999] p-5 max-w-sm flex items-start gap-4 transition-colors
            border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
            ${nudgeMsg.variant === 'attention' ? 'bg-[#FEF08A] text-black' : 'bg-[#86EFAC] text-black'}
          `}
        >
          <div className="mt-1 bg-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {nudgeMsg.variant === 'attention' ? (
              <Brain className="w-6 h-6 text-black animate-pulse" />
            ) : (
              <Sparkles className="w-6 h-6 text-black" />
            )}
          </div>
          <div className="flex-1 pointer-events-auto">
            <h4 className="font-black uppercase text-xs tracking-wider mb-2">
              Learning Coach
            </h4>
            <p className="font-bold text-sm leading-tight mb-3">
              {nudgeMsg.message}
            </p>
            
            {nudgeMsg.actionLabel && nudgeMsg.actionLink && (
              <Link 
                to={nudgeMsg.actionLink}
                className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 font-black uppercase text-xs hover:bg-gray-800 transition-colors border-2 border-black"
                onClick={(e) => {
                  // Fallback safety if link fails
                  if (!nudgeMsg.actionLink) {
                    e.preventDefault();
                  }
                }}
              >
                {nudgeMsg.actionLabel}
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
