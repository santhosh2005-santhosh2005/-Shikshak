import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { useAccessibility } from "@/components/AccessibilitySettings";
import { getStyles, neoColors } from "@/lib/design-system";
import { 
  ArrowLeft, 
  Gamepad2, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Info,
  Type,
  AudioLines,
  Sparkles,
  Search,
  BookOpen,
  History
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type Level = "home" | "mild" | "moderate" | "severe";
type GameType = "word-sort" | "flash-word" | "letter-match" | "phoneme-builder" | "audio-dictation" | "syllable-tap" | "sound-match" | "focus-line";

const ImproveDyslexiaPage = () => {
  const [currentLevel, setCurrentLevel] = useState<Level>("home");
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const { settings, readText, stopReading, isReading } = useAccessibility();
  const isNeo = settings.uiTheme === "neo";
  const s = getStyles(settings.uiTheme);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      stopReading();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // --- GAME COMPONENTS ---

  const WordSortingGame = () => {
    const words = ["SUN", "CAT", "DOG", "FISH", "BIRD", "HOUSE", "APPLE"];
    const [word, setWord] = useState("");
    const [scrambled, setScrambled] = useState<string[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing");
    const [score, setScore] = useState(0);

    const init = () => {
      const w = words[Math.floor(Math.random() * words.length)];
      setWord(w);
      setScrambled(w.split("").sort(() => Math.random() - 0.5));
      setSelected([]);
      setStatus("playing");
    };

    useEffect(init, []);

    const check = () => {
      if (selected.join("") === word) {
        setStatus("correct");
        setScore(s => s + 10);
        speak("Great job! That is correct.");
      } else {
        setStatus("wrong");
        speak("Not quite. Try again!");
      }
    };

    return (
      <div className="space-y-8 text-center">
        <div className="flex justify-between items-center bg-white border-4 border-black p-4 mb-4">
          <span className="font-black uppercase">YOUR SCORE:</span>
          <span className="text-2xl font-black">{score}</span>
        </div>
        
        <div className="min-h-[100px] border-4 border-dashed border-black flex items-center justify-center gap-2 p-4 bg-gray-50">
          {selected.length === 0 ? <span className="text-gray-400 font-bold uppercase">Select letters below</span> : 
            selected.map((l, i) => (
              <motion.div initial={{scale:0}} animate={{scale:1}} key={i} className="w-12 h-12 bg-black text-white flex items-center justify-center text-2xl font-black">{l}</motion.div>
            ))
          }
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {scrambled.map((l, i) => (
            <button key={i} onClick={() => setSelected([...selected, l])} className="w-14 h-14 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-2xl font-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">{l}</button>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={init} className={s.btnSecondary}><RefreshCw className="mr-2" /> NEW WORD</button>
          <button onClick={check} className={s.btnPrimary} disabled={selected.length !== word.length}>CHECK ANSWER</button>
        </div>

        {status === "correct" && <div className="p-4 bg-[#86EFAC] border-4 border-black font-black uppercase animate-bounce">AMAZING! CORRECT!</div>}
        {status === "wrong" && <div className="p-4 bg-red-400 border-4 border-black font-black uppercase">TRY AGAIN!</div>}
      </div>
    );
  };

  const AudioDictationGame = () => {
    const words = ["PENCIL", "SCHOOL", "GARDEN", "FLOWER", "WINDOW", "KITTEN"];
    const [word, setWord] = useState("");
    const [input, setInput] = useState("");
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);

    const init = () => {
      const w = words[Math.floor(Math.random() * words.length)];
      setWord(w);
      setInput("");
      setAttempts(0);
    };

    useEffect(init, []);

    const check = () => {
      if (input.toUpperCase() === word) {
        setScore(s => s + 20);
        speak("Correct spelling! Well done.");
        init();
      } else {
        setAttempts(a => a + 1);
        speak("Almost. Listen again.");
      }
    };

    return (
      <div className="space-y-8 text-center">
        <div className="grid grid-cols-2 gap-4">
          <div className={`${s.card} bg-[#FEF08A] py-2`}>SCORE: {score}</div>
          <div className={`${s.card} bg-[#FDA4AF] py-2`}>ATTEMPTS: {attempts}/3</div>
        </div>
        
        <button onClick={() => speak(word)} className={`${s.btnPrimary} w-full h-24 text-2xl flex items-center justify-center gap-4`}>
          <Volume2 className="h-10 w-10" /> SPEAK WORD
        </button>

        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type the word you hear..."
          className="w-full p-6 text-3xl font-black uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center focus:outline-none focus:ring-0"
        />

        <div className="flex gap-4">
          <button onClick={() => speak(word.charAt(input.length))} className={s.btnSecondary} style={{backgroundColor: '#ffffff'}}>GET LETTER</button>
          <button onClick={check} className={s.btnPrimary} style={{flex: 2}}>CHECK</button>
        </div>
        
        <button onClick={init} className="text-black font-black uppercase underline">Skip Word</button>
      </div>
    );
  };

  const FlashWordGame = () => {
    const words = ["PLANE", "TRAIN", "HOUSE", "MOUSE", "BRIGHT", "STRONG"];
    const [word, setWord] = useState("");
    const [show, setShow] = useState(false);
    const [input, setInput] = useState("");
    const [status, setStatus] = useState<"ready" | "flashing" | "input" | "result">("ready");

    const flash = () => {
      const w = words[Math.floor(Math.random() * words.length)];
      setWord(w);
      setStatus("flashing");
      setShow(true);
      setTimeout(() => {
        setShow(false);
        setStatus("input");
      }, 1000);
    };

    const check = () => {
      setStatus("result");
    };

    return (
      <div className="space-y-10 text-center">
        <div className="h-40 border-8 border-black bg-gray-50 flex items-center justify-center">
          {show ? <span className="text-6xl font-black">{word}</span> : <div className="h-4 w-32 bg-black animate-pulse" />}
        </div>
        
        {status === "ready" && <button onClick={flash} className={s.btnPrimary}>START FLASH</button>}
        
        {status === "input" && (
          <div className="space-y-4">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              className="w-full p-4 text-3xl border-4 border-black text-center" 
              placeholder="What word did you see?" 
            />
            <button onClick={check} className={s.btnPrimary}>SUBMIT</button>
          </div>
        )}

        {status === "result" && (
          <div className="space-y-4">
            <div className={`text-3xl font-black ${input.toUpperCase() === word ? "text-green-500" : "text-red-500"}`}>
              {input.toUpperCase() === word ? "CORRECT!" : "WRONG! IT WAS " + word}
            </div>
            <button onClick={() => { setStatus("ready"); setInput(""); }} className={s.btnPrimary}>NEXT</button>
          </div>
        )}
      </div>
    );
  };

  const LetterMatchGame = () => {
    const pairs = [["b", "d"], ["p", "q"], ["n", "u"], ["m", "w"]];
    const [pair, setPair] = useState(["b", "d"]);
    const [target, setTarget] = useState("b");
    const [score, setScore] = useState(0);

    const init = () => {
      const p = pairs[Math.floor(Math.random() * pairs.length)];
      setPair([...p].sort(() => Math.random() - 0.5));
      setTarget(p[Math.floor(Math.random() * p.length)]);
    };

    useEffect(init, []);

    const click = (l: string) => {
      if (l === target) {
        setScore(s => s + 10);
        speak("Correct!");
      } else {
        speak("Try again.");
      }
      init();
    };

    return (
      <div className="text-center space-y-10">
        <h3 className="text-3xl font-black uppercase">FIND THE LETTER: <span className="text-6xl text-primary">{target}</span></h3>
        <div className="grid grid-cols-2 gap-10">
          {pair.map(l => (
            <button key={l} onClick={() => click(l)} className="h-40 border-8 border-black text-8xl font-black bg-white hover:bg-black hover:text-white transition-all shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              {l}
            </button>
          ))}
        </div>
        <div className="text-2xl font-black">SCORE: {score}</div>
      </div>
    );
  };

  const SyllableTapGame = () => {
    const data = [
      { word: "ELEPHANT", count: 3 },
      { word: "CAT", count: 1 },
      { word: "APPLE", count: 2 },
      { word: "BANANA", count: 3 },
      { word: "COMPUTER", count: 3 },
      { word: "WATER", count: 2 }
    ];
    const [item, setItem] = useState(data[0]);
    const [taps, setTaps] = useState(0);
    const [status, setStatus] = useState<"playing" | "result">("playing");

    const init = () => {
      setItem(data[Math.floor(Math.random() * data.length)]);
      setTaps(0);
      setStatus("playing");
    };

    const check = () => {
      if (taps === item.count) speak("Perfect! " + item.count + " syllables.");
      else speak("Actually, it has " + item.count + " syllables.");
      setStatus("result");
    };

    return (
      <div className="text-center space-y-10">
        <h3 className="text-5xl font-black">{item.word}</h3>
        <div className="flex justify-center gap-4">
          {[...Array(taps)].map((_, i) => (
            <motion.div initial={{scale:0}} animate={{scale:1}} key={i} className="w-10 h-10 rounded-full bg-primary border-4 border-black" />
          ))}
        </div>
        <div className="flex gap-4 justify-center">
           <button onClick={() => setTaps(t => t + 1)} className="w-24 h-24 border-8 border-black rounded-full bg-white text-4xl font-black shadow-lg">TAP</button>
           <button onClick={() => setTaps(0)} className="w-24 h-24 border-8 border-black rounded-full bg-gray-100 flex items-center justify-center"><RefreshCw /></button>
        </div>
        <button onClick={check} className={s.btnPrimary} disabled={taps === 0}>CHECK SYLLABLES</button>
        {status === "result" && (
          <div className="space-y-4">
             <p className="text-2xl font-black">{taps === item.count ? "CORRECT!" : "WRONG! IT HAS " + item.count}</p>
             <button onClick={init} className={s.btnSecondary}>NEXT WORD</button>
          </div>
        )}
      </div>
    );
  };

  const LetterSoundMatchGame = () => {
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const [target, setTarget] = useState("A");
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState(0);

    const init = () => {
      const t = letters[Math.floor(Math.random() * letters.length)];
      setTarget(t);
      const opts = [t];
      while(opts.length < 3) {
        const o = letters[Math.floor(Math.random() * letters.length)];
        if (!opts.includes(o)) opts.push(o);
      }
      setOptions(opts.sort(() => Math.random() - 0.5));
    };

    useEffect(init, []);

    const click = (l: string) => {
      if (l === target) {
        setScore(s => s + 5);
        speak("Correct!");
        init();
      } else {
        speak("Try another one.");
      }
    };

    return (
      <div className="text-center space-y-12">
        <button onClick={() => speak(target)} className="w-40 h-40 border-8 border-black bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
           <Volume2 className="h-20 w-20" />
        </button>
        <p className="text-2xl font-black uppercase">LISTEN AND MATCH</p>
        <div className="grid grid-cols-3 gap-6">
          {options.map(l => (
            <button key={l} onClick={() => click(l)} className="h-24 border-4 border-black bg-[#D8B4FE] text-4xl font-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {l}
            </button>
          ))}
        </div>
        <div className="text-2xl font-black">SCORE: {score}</div>
      </div>
    );
  };

  const FocusLineGame = () => {
    const text = "The quick brown fox jumps over the lazy dog. Reading is a wonderful journey that opens up new worlds. Sometimes letters can be tricky, but with a focus line, we can follow them one by one. Take your time and enjoy each word.";
    const [line, setLine] = useState(0);
    const words = text.split(" ");
    const lines = [];
    for (let i = 0; i < words.length; i += 6) {
      lines.push(words.slice(i, i + 6).join(" "));
    }

    return (
      <div className="space-y-8">
        <div className="p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-3xl font-bold leading-[3em] relative overflow-hidden">
          {lines.map((l, i) => (
            <div key={i} className="relative z-10 px-4">
              {l}
              {line === i && <motion.div layoutId="focus" className="absolute inset-0 bg-yellow-200/50 -z-10 border-y-4 border-yellow-400" />}
            </div>
          ))}
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={() => setLine(Math.max(0, line - 1))} className={s.btnSecondary}><ArrowLeft /> PREV LINE</button>
          <button onClick={() => setLine(Math.min(lines.length - 1, line + 1))} className={s.btnPrimary}>NEXT LINE <ArrowRight /></button>
        </div>
        <button onClick={() => speak(lines[line])} className={`${s.btnSecondary} w-full`}><Volume2 className="mr-2" /> READ THIS LINE</button>
      </div>
    );
  };

  // --- RENDER HELPERS ---

  const renderGame = () => {
    if (!activeGame) return null;
    return (
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="mt-12 mb-20"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
            <Sparkles className="h-8 w-8 text-primary" />
            Featured Activity: {activeGame.replace("-", " ")}
          </h2>
          <button 
            onClick={() => {
              setActiveGame(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className={`${s.btnSecondary} py-2`}
          >
            <ArrowLeft className="mr-2" /> BACK TO MENU
          </button>
        </div>
        <div className={`w-full bg-white border-[6px] border-black p-6 md:p-12 ${isNeo ? "shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]" : "shadow-xl"}`}>
          {activeGame === "word-sort" && <WordSortingGame />}
          {activeGame === "audio-dictation" && <AudioDictationGame />}
          {activeGame === "flash-word" && <FlashWordGame />}
          {activeGame === "letter-match" && <LetterMatchGame />}
          {activeGame === "syllable-tap" && <SyllableTapGame />}
          {activeGame === "sound-match" && <LetterSoundMatchGame />}
          {activeGame === "focus-line" && <FocusLineGame />}
          
          {!["word-sort", "audio-dictation", "flash-word", "letter-match", "syllable-tap", "sound-match", "focus-line"].includes(activeGame) && (
            <div className="text-center py-10">
              <h3 className="text-2xl font-black uppercase">Coming Soon</h3>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const LevelSection = ({ level }: { level: "mild" | "moderate" | "severe" }) => {
    const config = {
      mild: { 
        title: "Mild Level Activities", 
        color: "#86EFAC", 
        desc: "Designed for individuals who struggle occasionally with reading fluency. Focuses on word recognition.",
        games: [
          { id: "word-sort", name: "Word Sorting Game", icon: Type, desc: "Drag scrambled letters to form words." },
          { id: "flash-word", name: "Flash Word Recognition", icon: Sparkles, desc: "Recognize words flashed on screen." },
          { id: "letter-match", name: "Letter Look-Alike Matching", icon: Search, desc: "Distinguish between similar letters." },
          { id: "focus-line", name: "Reading Focus Line", icon: BookOpen, desc: "Practice reading with a highlighted line." }
        ]
      },
      moderate: { 
        title: "Moderate Level Activities", 
        color: "#FEF08A", 
        desc: "For those who regularly struggle with reading and spelling. Focuses on phonemic awareness.",
        games: [
          { id: "phoneme-builder", name: "Phoneme Builder", icon: AudioLines, desc: "Drag sounds to form correct words." },
          { id: "audio-dictation", name: "Audio Dictation", icon: Volume2, desc: "Type what you hear for feedback." },
          { id: "syllable-tap", name: "Syllable Tap", icon: Gamepad2, desc: "Listen and tap to count syllables." }
        ]
      },
      severe: { 
        title: "Severe Level Activities", 
        color: "#FDA4AF", 
        desc: "For significant reading challenges. Focuses on fundamental letter-to-sound matching.",
        games: [
          { id: "sound-match", name: "Letter-to-Sound Match", icon: AudioLines, desc: "Match played sound to the letter." },
          { id: "word-trace", name: "Word Tracing", icon: Type, desc: "Trace letters following guided paths." }
        ]
      }
    };

    const c = config[level];

    return (
      <div className="space-y-12 pb-20">
        <div className="text-center">
           <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">{c.title}</h2>
           <p className="font-bold text-xl opacity-70">Games and activities for {level} dyslexia symptoms</p>
        </div>

        <div className={`${s.card} ${isNeo ? "" : "bg-white"} bg-opacity-20 backdrop-blur-md p-8 border-[6px]`} style={{ borderColor: c.color }}>
          <h3 className="text-2xl font-black uppercase mb-4" style={{ color: c.color }}>About {level} Level</h3>
          <p className="text-lg font-bold leading-tight">{c.desc}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {c.games.map((g, i) => (
            <motion.div 
              key={g.id} 
              initial={{ opacity:0, y:20 }} 
              animate={{ opacity:1, y:0 }} 
              transition={{ delay: i * 0.1 }}
              className={`${s.card} group flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-black text-white flex items-center justify-center border-4 border-black group-hover:bg-white group-hover:text-black transition-colors">
                    <g.icon className="h-8 w-8" />
                  </div>
                  <span className={`${s.tag} bg-opacity-20`} style={{ backgroundColor: c.color }}>{level}</span>
                </div>
                <h4 className="text-2xl font-black uppercase mb-2 tracking-tighter">{g.name}</h4>
                <p className="font-bold opacity-70 text-sm">{g.desc}</p>
              </div>
              <button 
                onClick={() => {
                  setActiveGame(g.id as GameType);
                  setTimeout(() => {
                    document.getElementById('game-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }} 
                className={`${s.btnPrimary} mt-8 w-full`}
              >
                PLAY GAME
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <ScrollArea className="h-screen bg-white">
      <div className={`min-h-screen ${isNeo ? "font-bold bg-grid" : "font-sans"} text-black`}>
        <Navbar />
        {renderGame()}
        
        {/* TOP NAV BAR (MOCKING THE SCREENSHOT) */}
        <div className="fixed top-20 left-0 right-0 z-40 bg-white border-b-4 border-black px-10 py-4 flex justify-center gap-10 font-black uppercase text-sm">
           <button onClick={() => setCurrentLevel("home")} className={`hover:underline ${currentLevel === "home" ? "bg-black text-white px-2" : ""}`}>Home</button>
           <button onClick={() => setCurrentLevel("mild")} className={`hover:underline ${currentLevel === "mild" ? "bg-black text-white px-2" : ""}`}>Mild</button>
           <button onClick={() => setCurrentLevel("moderate")} className={`hover:underline ${currentLevel === "moderate" ? "bg-black text-white px-2" : ""}`}>Moderate</button>
           <button onClick={() => setCurrentLevel("severe")} className={`hover:underline ${currentLevel === "severe" ? "bg-black text-white px-2" : ""}`}>Severe</button>
        </div>

        <div className="container mx-auto pt-48 pb-20 px-4 max-w-7xl">
          {currentLevel === "home" && (
            <div className="space-y-20">
               <div className="text-center">
                  <h1 className="text-7xl font-black uppercase tracking-tighter mb-6">CHOOSE YOUR LEVEL.</h1>
                  <p className="text-2xl font-bold opacity-70">Select the difficulty that matches your needs</p>
               </div>

               <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { id: "mild", color: "#86EFAC", desc: "Basic reading challenges. Scrambled letters and recognition." },
                    { id: "moderate", color: "#FEF08A", desc: "Intermediate difficulties. Phonemes and audio dictation." },
                    { id: "severe", color: "#FDA4AF", desc: "Significant challenges. Letter-to-sound fundamental matching." }
                  ].map(l => (
                    <div key={l.id} className={`${s.card} border-[8px] flex flex-col justify-between`} style={{ borderColor: l.color }}>
                       <div>
                          <h2 className="text-4xl font-black uppercase mb-4">{l.id}</h2>
                          <p className="font-bold text-lg mb-8">{l.desc}</p>
                       </div>
                       <button onClick={() => {
                         setCurrentLevel(l.id as Level);
                         window.scrollTo({ top: 0, behavior: 'smooth' });
                       }} className={s.btnPrimary} style={{ backgroundColor: l.color }}>EXPLORE {l.id} ACTIVITIES</button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {currentLevel !== "home" && (
            <>
              <LevelSection level={currentLevel as any} />
              <div id="game-section">
                {renderGame()}
              </div>
            </>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ImproveDyslexiaPage;
