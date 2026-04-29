
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedHeadingProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  showOnScroll?: boolean;
}

export function AnimatedHeading({
  children,
  className,
  delay = 0,
  showOnScroll = false,
}: AnimatedHeadingProps) {
  const [isVisible, setIsVisible] = useState(!showOnScroll);

  useEffect(() => {
    if (!showOnScroll) return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const elementRef = document.getElementById(`heading-${delay}`);
      
      if (elementRef) {
        const elementPosition = elementRef.offsetTop;
        
        if (scrollPosition > elementPosition) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check in case element is already in view
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showOnScroll, delay]);

  return (
    <div 
      id={`heading-${delay}`}
      className={cn(
        "overflow-hidden",
        className
      )}
    >
      <div 
        className={cn(
          "transform transition-all duration-700",
          isVisible 
            ? "translate-y-0 opacity-100" 
            : "translate-y-8 opacity-0"
        )}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  );
}
