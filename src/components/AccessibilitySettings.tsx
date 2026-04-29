
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings, Volume2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type AccessibilitySettings = {
  dyslexicFont: "none" | "opendyslexic" | "comic-sans" | "lexend" | "atkinson";
  largeText: boolean;
  lineSpacing: boolean;
  backgroundTheme: "default" | "sepia" | "soft-blue" | "soft-gray";
  disableAnimations: boolean;
  readingRuler: boolean;
  textToSpeech: boolean;
};

const defaultSettings: AccessibilitySettings = {
  dyslexicFont: "none",
  largeText: false,
  lineSpacing: false,
  backgroundTheme: "default",
  disableAnimations: false,
  readingRuler: false,
  textToSpeech: false,
};

const fontOptions = [
  { value: "none", label: "Default Font", family: "'Inter', system-ui, sans-serif" },
  { value: "opendyslexic", label: "OpenDyslexic", family: "'OpenDyslexic', 'Comic Sans MS', cursive, sans-serif" },
  { value: "comic-sans", label: "Comic Sans MS", family: "'Comic Sans MS', cursive, sans-serif" },
  { value: "lexend", label: "Lexend", family: "'Lexend', sans-serif" },
  { value: "atkinson", label: "Atkinson Hyperlegible", family: "'Atkinson Hyperlegible', sans-serif" },
];

export const AccessibilityContext = React.createContext<{
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  readText: (text: string) => void;
  stopReading: () => void;
  rulerHeight: number;
  updateRulerHeight: (height: number) => void;
  isReading: boolean;
  readTextUnderRuler: () => void;
}>({
  settings: defaultSettings,
  updateSettings: () => {},
  readText: () => {},
  stopReading: () => {},
  rulerHeight: 60,
  updateRulerHeight: () => {},
  isReading: false,
  readTextUnderRuler: () => {},
});

export const useAccessibility = () => React.useContext(AccessibilityContext);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [rulerHeight, setRulerHeight] = useState(60);
  const [isReading, setIsReading] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [rulerPosition, setRulerPosition] = useState(300);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibilitySettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const savedRulerHeight = localStorage.getItem("rulerHeight");
    if (savedRulerHeight) {
      setRulerHeight(parseInt(savedRulerHeight, 10));
    }

    // Initialize Web Speech API
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
    }

    // Load font links
    loadFontLinks();

    // Apply initial settings to document
    applySettingsToDocument(savedSettings ? JSON.parse(savedSettings) : defaultSettings);
  }, []);

  // Save settings to localStorage and apply to document on change
  useEffect(() => {
    localStorage.setItem("accessibilitySettings", JSON.stringify(settings));
    applySettingsToDocument(settings);
  }, [settings]);

  // Save ruler height to localStorage
  useEffect(() => {
    localStorage.setItem("rulerHeight", rulerHeight.toString());
  }, [rulerHeight]);

  // Load font links
  const loadFontLinks = () => {
    const fontLinks = [
      { id: 'opendyslexic-font', href: 'https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/OpenDyslexic-Regular.css' },
      { id: 'lexend-font', href: 'https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap' },
      { id: 'atkinson-font', href: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap' }
    ];

    fontLinks.forEach(({ id, href }) => {
      if (!document.querySelector(`#${id}`)) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    });
  };

  // Apply settings to document
  const applySettingsToDocument = (currentSettings: AccessibilitySettings) => {
    const root = document.documentElement;

    // Font family
    const selectedFont = fontOptions.find(font => font.value === currentSettings.dyslexicFont);
    if (selectedFont) {
      root.style.setProperty("--font-sans", selectedFont.family);
      document.body.style.fontFamily = selectedFont.family;
    }

    // Disable animations
    if (currentSettings.disableAnimations) {
      root.style.setProperty("--animation-duration", "0s");
      root.style.setProperty("--transition-duration", "0s");
      document.body.classList.add("disable-animations");
      const style = document.createElement('style');
      style.textContent = `
        .disable-animations *,
        .disable-animations *::before,
        .disable-animations *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `;
      if (!document.querySelector('#disable-animations-style')) {
        style.id = 'disable-animations-style';
        document.head.appendChild(style);
      }
    } else {
      root.style.removeProperty("--animation-duration");
      root.style.removeProperty("--transition-duration");
      document.body.classList.remove("disable-animations");
      const existingStyle = document.querySelector('#disable-animations-style');
      if (existingStyle) {
        existingStyle.remove();
      }
    }

    // Background theme
    const body = document.body;
    body.classList.remove("bg-sepia", "bg-soft-blue", "bg-soft-gray");
    switch (currentSettings.backgroundTheme) {
      case "sepia":
        body.classList.add("bg-sepia");
        break;
      case "soft-blue":
        body.classList.add("bg-soft-blue");
        break;
      case "soft-gray":
        body.classList.add("bg-soft-gray");
        break;
      default:
        // Use default theme
        break;
    }

    // Text size
    if (currentSettings.largeText) {
      root.classList.add("large-text");
    } else {
      root.classList.remove("large-text");
    }

    // Line spacing
    if (currentSettings.lineSpacing) {
      root.classList.add("increased-line-spacing");
    } else {
      root.classList.remove("increased-line-spacing");
    }
  };

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateRulerHeight = (height: number) => {
    setRulerHeight(height);
  };

  const readText = (text: string) => {
    if (speechSynthesis && settings.textToSpeech) {
      // Stop any current reading
      stopReading();
      
      // Create new utterance
      const newUtterance = new SpeechSynthesisUtterance(text);
      newUtterance.rate = 0.8; // Slower rate for dyslexic users
      newUtterance.pitch = 1;
      newUtterance.volume = 1;
      
      setUtterance(newUtterance);
      setIsReading(true);
      
      // Set up event handlers
      newUtterance.onend = () => {
        setIsReading(false);
      };
      
      newUtterance.onerror = () => {
        setIsReading(false);
        console.error("Speech synthesis error");
      };
      
      // Start speaking
      speechSynthesis.speak(newUtterance);
    }
  };

  const stopReading = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsReading(false);
    }
  };

  const readTextUnderRuler = () => {
    if (!settings.textToSpeech || !settings.readingRuler) return;

    // Get elements at the ruler position
    const centerX = window.innerWidth / 2;
    const elements = document.elementsFromPoint(centerX, rulerPosition);
    let textToRead = "";

    for (const element of elements) {
      if (element.textContent && element.textContent.trim()) {
        const rect = element.getBoundingClientRect();
        // Check if the ruler overlaps with this element
        if (rect.top <= rulerPosition + rulerHeight / 2 && rect.bottom >= rulerPosition - rulerHeight / 2) {
          // Get text content and clean it up
          const fullText = element.textContent.trim();
          
          // If it's a long text, try to get the line under the ruler
          if (fullText.length > 50) {
            const words = fullText.split(' ');
            // Take a reasonable chunk of text (around 10-15 words)
            const chunkSize = Math.min(15, words.length);
            textToRead = words.slice(0, chunkSize).join(' ');
          } else {
            textToRead = fullText;
          }
          break;
        }
      }
    }

    if (textToRead) {
      readText(textToRead);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSettings,
        readText,
        stopReading,
        rulerHeight,
        updateRulerHeight,
        isReading,
        readTextUnderRuler,
      }}
    >
      {children}
      {settings.readingRuler && (
        <ReadingRuler 
          rulerPosition={rulerPosition}
          setRulerPosition={setRulerPosition}
        />
      )}
    </AccessibilityContext.Provider>
  );
};

export const AccessibilitySettings = () => {
  const { settings, updateSettings, rulerHeight, updateRulerHeight } = useAccessibility();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed right-4 bottom-4 z-50 rounded-full h-10 w-10"
          aria-label="Accessibility settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Accessibility Settings</DrawerTitle>
            <DrawerDescription>
              Customize your reading experience to match your needs.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dyslexic-font">Dyslexia-friendly fonts</Label>
                  <Select
                    value={settings.dyslexicFont}
                    onValueChange={(value) =>
                      updateSettings({ dyslexicFont: value as AccessibilitySettings["dyslexicFont"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="large-text">Larger text size</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase the base font size
                    </p>
                  </div>
                  <Switch
                    id="large-text"
                    checked={settings.largeText}
                    onCheckedChange={(checked) =>
                      updateSettings({ largeText: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="line-spacing">Increased line spacing</Label>
                    <p className="text-sm text-muted-foreground">
                      Add more space between lines
                    </p>
                  </div>
                  <Switch
                    id="line-spacing"
                    checked={settings.lineSpacing}
                    onCheckedChange={(checked) =>
                      updateSettings({ lineSpacing: checked })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Background theme</Label>
                  <ToggleGroup
                    type="single"
                    value={settings.backgroundTheme}
                    onValueChange={(value) =>
                      updateSettings({ backgroundTheme: value as AccessibilitySettings["backgroundTheme"] })
                    }
                    className="justify-between"
                  >
                    <ToggleGroupItem value="default" aria-label="Default background">
                      <div className="h-6 w-6 rounded-full bg-background border"></div>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="sepia" aria-label="Sepia background">
                      <div className="h-6 w-6 rounded-full bg-[#fcefc7]"></div>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="soft-blue" aria-label="Soft blue background">
                      <div className="h-6 w-6 rounded-full bg-[#d3e4fd]"></div>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="soft-gray" aria-label="Soft gray background">
                      <div className="h-6 w-6 rounded-full bg-[#f1f0fb]"></div>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="disable-animations">Disable animations</Label>
                    <p className="text-sm text-muted-foreground">
                      For motion sensitivity
                    </p>
                  </div>
                  <Switch
                    id="disable-animations"
                    checked={settings.disableAnimations}
                    onCheckedChange={(checked) =>
                      updateSettings({ disableAnimations: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reading-ruler">Reading ruler</Label>
                    <p className="text-sm text-muted-foreground">
                      Highlight the line you're reading
                    </p>
                  </div>
                  <Switch
                    id="reading-ruler"
                    checked={settings.readingRuler}
                    onCheckedChange={(checked) =>
                      updateSettings({ readingRuler: checked })
                    }
                  />
                </div>
                
                {settings.readingRuler && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ruler-height">Ruler height</Label>
                      <span className="text-sm text-muted-foreground">
                        {rulerHeight}px
                      </span>
                    </div>
                    <Slider
                      id="ruler-height"
                      min={20}
                      max={100}
                      step={5}
                      value={[rulerHeight]}
                      onValueChange={(values) => updateRulerHeight(values[0])}
                      className="w-full"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="text-to-speech">Text to speech</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable reading content aloud
                    </p>
                  </div>
                  <Switch
                    id="text-to-speech"
                    checked={settings.textToSpeech}
                    onCheckedChange={(checked) =>
                      updateSettings({ textToSpeech: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

// Keep ReadingRuler as internal component, not exported
const ReadingRuler: React.FC<{ 
  rulerPosition: number; 
  setRulerPosition: (position: number) => void;
}> = ({ rulerPosition, setRulerPosition }) => {
  const { settings, rulerHeight, readTextUnderRuler } = useAccessibility();

  useEffect(() => {
    if (!settings.readingRuler) return;

    const handleMouseMove = (e: MouseEvent) => {
      setRulerPosition(e.clientY);
    };

    const handleClick = () => {
      if (settings.textToSpeech) {
        readTextUnderRuler();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [settings.readingRuler, settings.textToSpeech, readTextUnderRuler, setRulerPosition]);

  if (!settings.readingRuler) return null;

  return (
    <motion.div
      className="fixed left-0 w-full z-40 pointer-events-none bg-primary/20 border-y-2 border-primary/50"
      style={{
        height: rulerHeight,
        top: rulerPosition - rulerHeight / 2,
      }}
      animate={{
        top: rulerPosition - rulerHeight / 2,
      }}
      transition={
        settings.disableAnimations 
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 300,
              damping: 30,
            }
      }
    />
  );
};

export const ReadTextButton: React.FC<{ text: string; className?: string }> = ({ 
  text, 
  className
}) => {
  const { settings, readText, stopReading, isReading } = useAccessibility();
  
  if (!settings.textToSpeech) return null;
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("text-muted-foreground hover:text-foreground", className, {
        "animate-pulse": isReading,
      })}
      onClick={() => {
        if (isReading) {
          stopReading();
        } else {
          readText(text);
        }
      }}
      aria-label={isReading ? "Stop reading" : "Read text aloud"}
    >
      <Volume2 className="h-4 w-4" />
    </Button>
  );
};
