
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { ReadTextButton } from "@/components/AccessibilitySettings";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

export const LevelInstructionCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          Choose Your Dyslexia Level
          <ReadTextButton text="Choose Your Dyslexia Level" />
        </h2>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <CollapsibleTrigger asChild>
            <button className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              {isOpen ? (
                <>
                  Hide Instructions <ChevronUp className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  Show Instructions <ChevronDown className="ml-1 h-4 w-4" />
                </>
              )}
            </button>
          </CollapsibleTrigger>
        </Collapsible>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleContent>
          <Card>
            <CardContent className="pt-6">
              <p className="mb-4">
                Everyone experiences dyslexia differently. Select the level that best describes your challenges:
              </p>
              <ul className="space-y-3">
                <li className="flex">
                  <div className="bg-primary/20 p-2 rounded-full mr-3 mt-1">
                    <span className="text-primary font-bold">M</span>
                  </div>
                  <div>
                    <p className="font-medium">Mild</p>
                    <p className="text-muted-foreground">You read slowly, mix up letters occasionally, or struggle with spelling — but you manage.</p>
                  </div>
                  <ReadTextButton 
                    text="Mild: You read slowly, mix up letters occasionally, or struggle with spelling — but you manage."
                    className="ml-2 self-start" 
                  />
                </li>
                <li className="flex">
                  <div className="bg-primary/20 p-2 rounded-full mr-3 mt-1">
                    <span className="text-primary font-bold">M</span>
                  </div>
                  <div>
                    <p className="font-medium">Moderate</p>
                    <p className="text-muted-foreground">You find reading and writing difficult and often avoid reading aloud. Mistakes are frequent.</p>
                  </div>
                  <ReadTextButton 
                    text="Moderate: You find reading and writing difficult and often avoid reading aloud. Mistakes are frequent."
                    className="ml-2 self-start" 
                  />
                </li>
                <li className="flex">
                  <div className="bg-primary/20 p-2 rounded-full mr-3 mt-1">
                    <span className="text-primary font-bold">S</span>
                  </div>
                  <div>
                    <p className="font-medium">Severe</p>
                    <p className="text-muted-foreground">Reading feels overwhelming. You often guess words, skip lines, and struggle with basic fluency.</p>
                  </div>
                  <ReadTextButton 
                    text="Severe: Reading feels overwhelming. You often guess words, skip lines, and struggle with basic fluency."
                    className="ml-2 self-start" 
                  />
                </li>
              </ul>
              <p className="mt-4 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm text-muted-foreground">Not sure? Start with Mild. You can always adjust later.</span>
              </p>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
