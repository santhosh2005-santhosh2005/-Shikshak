
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { ReadTextButton } from "@/components/AccessibilitySettings";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Tool {
  name: string;
  url: string;
}

interface ActivityCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  steps: string[];
  tools: Tool[];
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  description,
  icon: Icon,
  steps,
  tools
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start">
          <div className="bg-primary/10 p-2 rounded-full mr-4">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{title}</CardTitle>
              <ReadTextButton text={title} className="ml-2" />
            </div>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-0 px-6">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-primary w-full justify-between"
          onClick={() => setExpanded(!expanded)}
        >
          <span>{expanded ? "Hide Details" : "Show Details"}</span>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardContent>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-4">
              <div className="mb-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  How to Practice
                  <ReadTextButton text="How to Practice" className="ml-2" />
                </h4>
                <ul className="space-y-2 list-disc pl-5">
                  {steps.map((step, index) => (
                    <li key={index} className="text-muted-foreground">
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  Recommended Tools
                  <ReadTextButton text="Recommended Tools" className="ml-2" />
                </h4>
                <div className="space-y-2">
                  {tools.map((tool, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm" 
                      className="mr-2 mb-2"
                      asChild
                    >
                      <a 
                        href={tool.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        {tool.name}
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
