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
  History,
  ArrowRight,
  X
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TTSText, TTSBanner } from "@/components/TTSText";

type Level = "home" | "mild" | "moderate" | "severe";
type GameType = "word-sort" | "flash-word" | "letter-match" | "phoneme-builder" | "audio-dictation" | "syllable-tap" | "sound-match" | "focus-line" | "word-trace";

const ImproveDyslexiaPage = () => {
  const [currentLevel, setCurrentLevel] = useState<Level>("home");
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const { settings, readText, stopReading, isReading } = useAccessibility();
  const isNeo = settings.uiTheme === "neo";
  const s = getStyles(settings.uiTheme);

  const speak = (text: string) => {
    readText(text);
  };

  // Using standard TTSText for consistency

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
      <div className="space-y-6 text-center w-full">
        <div className={`flex justify-between items-center p-4 rounded-xl border-2 ${isNeo ? "bg-white border-black" : "bg-black/5 border-black/5"}`}>
          <span className="font-bold uppercase opacity-60">SCORE:</span>
          <span className="text-2xl font-black">{score}</span>
        </div>
        
        <div className={`min-h-[100px] flex items-center justify-center gap-2 p-4 rounded-2xl ${isNeo ? "border-4 border-dashed border-black bg-gray-50" : "bg-black/5 border-2 border-dashed border-black/10"}`}>
          {selected.length === 0 ? <span className="opacity-40 font-bold uppercase">Select letters below</span> : 
            selected.map((l, i) => (
              <motion.div 
                initial={{scale:0}} 
                animate={{scale:1}} 
                key={i} 
                onClick={() => setSelected(selected.filter((_, idx) => idx !== i))}
                className={`w-12 h-12 flex items-center justify-center text-2xl font-black cursor-pointer hover:bg-red-500 transition-colors ${isNeo ? "bg-black text-white" : "bg-primary text-white rounded-lg"}`}
                title="Click to remove"
              >
                {l}
              </motion.div>
            ))
          }
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {scrambled.map((l, i) => (
            <button key={i} onClick={() => setSelected([...selected, l])} className={`${isNeo ? "w-14 h-14 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-2xl font-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none" : "w-14 h-14 bg-white/80 border-2 border-black/10 rounded-xl text-xl font-bold hover:border-primary hover:text-primary"} transition-all`}>{l}</button>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={init} className={s.btnSecondary}><RefreshCw className="mr-2" /> NEW WORD</button>
          <button onClick={check} className={s.btnPrimary} disabled={selected.length !== word.length}>CHECK ANSWER</button>
        </div>

        <AnimatePresence>
          {status === "correct" && <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="p-4 bg-green-500/10 text-green-700 rounded-xl font-bold uppercase">AMAZING! CORRECT!</motion.div>}
          {status === "wrong" && <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="p-4 bg-red-500/10 text-red-700 rounded-xl font-bold uppercase">TRY AGAIN!</motion.div>}
        </AnimatePresence>
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
      <div className="space-y-8 text-center w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-3 rounded-xl border-2 font-bold ${isNeo ? "bg-white border-black" : "bg-yellow-500/10 border-yellow-500/20"}`}>SCORE: {score}</div>
          <div className={`p-3 rounded-xl border-2 font-bold ${isNeo ? "bg-white border-black" : "bg-red-500/10 border-red-500/20"}`}>ATTEMPTS: {attempts}/3</div>
        </div>
        
        <button onClick={() => speak(word)} className={`${s.btnPrimary} w-full h-24 text-2xl flex items-center justify-center gap-4`}>
          <Volume2 className="h-10 w-10" /> SPEAK WORD
        </button>

        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type the word you hear..."
          className={`w-full p-6 text-3xl font-black uppercase text-center focus:outline-none ${isNeo ? "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white" : "border-2 border-black/10 rounded-2xl bg-black/5"}`}
        />

        <div className="flex gap-4">
          <button onClick={() => setInput("")} className={s.btnSecondary} style={{flex: 1}} title="Clear all"><X /></button>
          <button onClick={() => speak(word.charAt(input.length))} className={s.btnSecondary} style={{flex: 1}}>GET LETTER</button>
          <button onClick={check} className={s.btnPrimary} style={{flex: 2}}>CHECK</button>
        </div>
        
        <button onClick={init} className="font-bold uppercase underline opacity-60">Skip Word</button>
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
      <div className="space-y-8 text-center w-full">
        <div className={`h-40 flex items-center justify-center rounded-2xl ${isNeo ? "border-8 border-black bg-gray-50" : "bg-black/5 border-2 border-dashed border-black/10"}`}>
          {show ? <span className="text-6xl font-black">{word}</span> : <div className="h-4 w-32 bg-current opacity-20 animate-pulse rounded-full" />}
        </div>
        
        {status === "ready" && <button onClick={flash} className={s.btnPrimary}>START FLASH</button>}
        
        {status === "input" && (
          <div className="space-y-4">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              className={`w-full p-4 text-3xl text-center uppercase focus:outline-none ${isNeo ? "border-4 border-black bg-white" : "border-2 border-black/10 rounded-xl bg-black/5"}`} 
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
      <div className="text-center space-y-8 w-full">
        <h3 className="text-2xl font-bold uppercase">FIND THE LETTER: <span className="text-6xl text-primary font-black ml-2">{target}</span></h3>
        <div className="grid grid-cols-2 gap-8">
          {pair.map(l => (
            <button key={l} onClick={() => click(l)} className={`${isNeo ? "h-40 border-8 border-black text-8xl font-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]" : "h-40 border-2 border-black/10 text-7xl font-bold bg-white/50 backdrop-blur-md rounded-3xl hover:border-primary hover:text-primary"} transition-all`}>
              {l}
            </button>
          ))}
        </div>
        <div className="text-xl font-bold opacity-60 uppercase">SCORE: {score}</div>
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
      <div className="text-center space-y-10 w-full">
        <div className="flex items-center justify-center gap-4">
           <h3 className="text-5xl font-black tracking-tighter uppercase">{item.word}</h3>
           <button onClick={() => speak(item.word)} className="p-2 bg-primary/10 rounded-full text-primary hover:bg-primary/20"><Volume2 /></button>
        </div>
        <div className="flex justify-center gap-4 min-h-[40px]">
           {[...Array(taps)].map((_, i) => (
             <motion.div initial={{scale:0}} animate={{scale:1}} key={i} className={`w-10 h-10 rounded-full border-2 ${isNeo ? "bg-black border-black" : "bg-primary border-primary"}`} />
           ))}
        </div>
        <div className="flex gap-4 justify-center">
           <button onClick={() => setTaps(t => t + 1)} className={`${isNeo ? "w-24 h-24 border-8 border-black rounded-full bg-white text-4xl font-black shadow-lg" : "w-24 h-24 border-2 border-black/10 rounded-full bg-white/50 backdrop-blur-md text-3xl font-bold hover:border-primary hover:text-primary"} transition-all`}>TAP</button>
           <button onClick={() => setTaps(0)} className="w-24 h-24 border-2 border-black/5 rounded-full bg-black/5 flex items-center justify-center"><RefreshCw className="opacity-40" /></button>
        </div>
        <button onClick={check} className={s.btnPrimary} disabled={taps === 0}>CHECK SYLLABLES</button>
        {status === "result" && (
          <div className="space-y-4 pt-4 border-t-2 border-black/5 mt-6">
             <p className="text-xl font-bold uppercase">{taps === item.count ? "CORRECT!" : "WRONG! IT HAS " + item.count}</p>
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
    const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing");

    const init = () => {
      const t = letters[Math.floor(Math.random() * letters.length)];
      setTarget(t);
      const opts = [t];
      while(opts.length < 3) {
        const o = letters[Math.floor(Math.random() * letters.length)];
        if (!opts.includes(o)) opts.push(o);
      }
      setOptions(opts.sort(() => Math.random() - 0.5));
      setStatus("playing");
    };

    useEffect(init, []);

    const click = (l: string) => {
      if (l === target) {
        setScore(s => s + 5);
        setStatus("correct");
        speak("Correct!");
        setTimeout(init, 1500);
      } else {
        setStatus("wrong");
        speak("Try another one.");
        setTimeout(() => setStatus("playing"), 1500);
      }
    };

    return (
      <div className="text-center space-y-12 w-full">
        <button onClick={() => speak(target)} className={`w-32 h-32 flex items-center justify-center mx-auto transition-all ${isNeo ? "border-8 border-black bg-white rounded-full shadow-xl" : "bg-primary/10 rounded-3xl hover:bg-primary/20 text-primary"}`}>
           <Volume2 className="h-16 w-16" />
        </button>
        <p className="text-xl font-bold uppercase opacity-60">LISTEN AND MATCH THE LETTER</p>
        <div className="grid grid-cols-3 gap-6">
          {options.map(l => (
            <button key={l} onClick={() => click(l)} className={`${isNeo ? "h-24 border-4 border-black bg-[#D8B4FE] text-4xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "h-24 border-2 border-black/10 bg-white/50 backdrop-blur-md rounded-2xl text-3xl font-bold hover:border-primary hover:text-primary"} transition-all`}>
              {l}
            </button>
          ))}
        </div>
        <div className="min-h-[30px]">
           {status === "correct" && <p className="text-green-500 font-black animate-bounce uppercase">GREAT! +5 POINTS</p>}
           {status === "wrong" && <p className="text-red-500 font-black uppercase">TRY AGAIN!</p>}
        </div>
        <div className="text-xl font-bold uppercase opacity-40">SCORE: {score}</div>
      </div>
    );
  };

  const PhonemeBuilderGame = () => {
    const data = [
      { word: "SHIP", phonemes: ["sh", "i", "p"] },
      { word: "CHAT", phonemes: ["ch", "a", "t"] },
      { word: "FISH", phonemes: ["f", "i", "sh"] },
      { word: "THIN", phonemes: ["th", "i", "n"] }
    ];
    const [item, setItem] = useState(data[0]);
    const [selected, setSelected] = useState<string[]>([]);
    const [status, setStatus] = useState<"playing" | "correct">("playing");

    const init = () => {
      const i = data[Math.floor(Math.random() * data.length)];
      setItem(i);
      setSelected([]);
      setStatus("playing");
    };

    useEffect(init, []);

    const add = (p: string) => {
      if (selected.length < item.phonemes.length) {
        setSelected([...selected, p]);
      }
    };

    const check = () => {
      if (selected.join("") === item.word.toLowerCase()) {
        setStatus("correct");
        speak("Correct! " + item.word);
      } else {
        speak("Try again.");
        setSelected([]);
      }
    };

    return (
      <div className="text-center space-y-10 w-full">
        <h3 className="text-3xl font-black uppercase">BUILD THE WORD: <span className="text-primary">{item.word}</span></h3>
        <div className="flex justify-center gap-4 min-h-[80px]">
           {selected.map((p, i) => (
             <motion.div 
               initial={{scale:0}} 
               animate={{scale:1}} 
               key={i} 
               onClick={() => setSelected(selected.filter((_, idx) => idx !== i))}
               className={`w-20 h-20 flex items-center justify-center text-3xl font-black cursor-pointer hover:bg-red-500 transition-colors ${isNeo ? "bg-black text-white border-4 border-black" : "bg-primary text-white rounded-2xl"}`}
               title="Click to remove"
             >
               {p}
             </motion.div>
           ))}
           {[...Array(item.phonemes.length - selected.length)].map((_, i) => (
             <div key={i} className={`w-20 h-20 border-4 border-dashed border-black/10 rounded-2xl`} />
           ))}
        </div>
        <div className="flex justify-center gap-4">
          {item.phonemes.sort(() => Math.random() - 0.5).map((p, i) => (
            <button key={i} onClick={() => add(p)} className={`${isNeo ? "w-20 h-20 border-4 border-black bg-white text-3xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "w-20 h-20 border-2 border-black/10 bg-white/50 backdrop-blur-md rounded-2xl text-2xl font-bold hover:border-primary"}`}>{p}</button>
          ))}
        </div>
        <div className="flex gap-4 justify-center">
           <button onClick={() => setSelected([])} className={s.btnSecondary}><RefreshCw /></button>
           <button onClick={check} className={s.btnPrimary} disabled={selected.length !== item.phonemes.length}>CHECK WORD</button>
        </div>
        {status === "correct" && <button onClick={init} className={s.btnPrimary}>NEXT WORD</button>}
      </div>
    );
  };

  const WordTracingGame = () => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const words = ["CAT", "DOG", "SUN", "BED", "HAT"];
    const [wordIndex, setWordIndex] = useState(0);
    const currentWord = words[wordIndex];

    const drawWordTemplate = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.font = "bold 150px Arial";
          ctx.fillStyle = isNeo ? "#f3f4f6" : "rgba(0,0,0,0.05)";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(currentWord, canvas.width / 2, canvas.height / 2);
          ctx.strokeStyle = isNeo ? "#e5e7eb" : "rgba(0,0,0,0.1)";
          ctx.lineWidth = 2;
          ctx.strokeText(currentWord, canvas.width / 2, canvas.height / 2);
          ctx.beginPath();
        }
      }
    };

    useEffect(() => {
      drawWordTemplate();
    }, [wordIndex]);

    const start = (e: React.MouseEvent | React.TouchEvent) => {
      setIsDrawing(true);
      draw(e);
    };
    const end = () => {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) canvas.getContext("2d")?.beginPath();
    };
    const draw = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.strokeStyle = isNeo ? "#000" : "#7c3aed";

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    return (
      <div className="text-center space-y-6 w-full">
        <p className="text-xl font-bold uppercase opacity-60">Trace the word: <span className="text-primary font-black">{currentWord}</span></p>
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={300} 
          onMouseDown={start}
          onMouseMove={draw}
          onMouseUp={end}
          onTouchStart={start}
          onTouchMove={draw}
          onTouchEnd={end}
          className={`mx-auto bg-white/50 backdrop-blur-md cursor-crosshair ${isNeo ? "border-4 border-black" : "border-2 border-black/5 rounded-3xl shadow-inner"}`}
        />
        <div className="flex gap-4 justify-center">
           <button onClick={drawWordTemplate} className={s.btnSecondary}>CLEAR CANVAS</button>
           <button onClick={() => setWordIndex((prev) => (prev + 1) % words.length)} className={s.btnPrimary}>NEXT WORD <ArrowRight /></button>
           <button onClick={() => speak(currentWord)} className={s.btnSecondary}><Volume2 /></button>
        </div>
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
      <div className="space-y-8 w-full">
        <div className={`p-8 relative overflow-hidden ${isNeo ? "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-3xl font-bold leading-[3em]" : "bg-white/40 backdrop-blur-md border border-black/5 rounded-3xl text-2xl font-medium leading-[2.5em]"}`}>
          {lines.map((l, i) => (
            <div key={i} className="relative z-10 px-4">
              {l}
              {line === i && (
                <motion.div 
                  layoutId="focus" 
                  className={`absolute inset-0 -z-10 ${isNeo ? "bg-yellow-200/50 border-y-4 border-yellow-400" : "bg-primary/20 rounded-xl"}`} 
                />
              )}
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
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-20 pt-20 border-t-8 border-dashed border-black/5"
        id="game-display"
      >
        <div className={`w-full max-w-4xl mx-auto p-10 relative ${isNeo ? "bg-white border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]" : "bg-white/80 backdrop-blur-lg border border-black/5 shadow-2xl rounded-[3rem]"}`}>
          <div className="flex justify-between items-center mb-10 pb-6 border-b-4 border-black/5">
            <div className="flex items-center gap-4">
               <div className={`w-14 h-14 flex items-center justify-center ${isNeo ? "bg-black text-white" : "bg-primary/10 text-primary rounded-2xl"}`}>
                  <Gamepad2 className="h-8 w-8" />
               </div>
               <h2 className="text-4xl font-black uppercase tracking-tighter">{activeGame.replace("-", " ")}</h2>
            </div>
            <button 
              onClick={() => { setActiveGame(null); stopReading(); }} 
              className={`w-12 h-12 flex items-center justify-center transition-all ${isNeo ? "border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-0 active:translate-x-1 active:translate-y-1" : "bg-black/5 rounded-full hover:bg-black/10"}`}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="min-h-[400px] flex items-center justify-center">
            {activeGame === "word-sort" && <WordSortingGame />}
            {activeGame === "audio-dictation" && <AudioDictationGame />}
            {activeGame === "flash-word" && <FlashWordGame />}
            {activeGame === "letter-match" && <LetterMatchGame />}
            {activeGame === "syllable-tap" && <SyllableTapGame />}
            {activeGame === "sound-match" && <LetterSoundMatchGame />}
            {activeGame === "focus-line" && <FocusLineGame />}
            {activeGame === "phoneme-builder" && <PhonemeBuilderGame />}
            {activeGame === "word-trace" && <WordTracingGame />}
            
            {/* Placeholder for other games */}
            {!["word-sort", "audio-dictation", "flash-word", "letter-match", "syllable-tap", "sound-match", "focus-line", "phoneme-builder", "word-trace"].includes(activeGame) && (
              <div className="text-center py-20">
                <Sparkles className="h-20 w-20 mx-auto mb-6 text-yellow-400" />
                <h3 className="text-3xl font-black uppercase">Coming Soon!</h3>
                <p className="font-bold opacity-60">We are building this game right now.</p>
                <button onClick={() => setActiveGame(null)} className={`${s.btnPrimary} mt-10`}>BACK TO MENU</button>
              </div>
            )}
          </div>
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
           <h2 className={`${s.sectionTitle} mb-4`}>
             <TTSText text={c.title}>{c.title}</TTSText>
           </h2>
           <p className={s.textMuted}>
             <TTSText text={`Games and activities for ${level} dyslexia symptoms`}>
               Games and activities for {level} dyslexia symptoms
             </TTSText>
           </p>
        </div>

        <div className={`${s.card} border-[6px] relative overflow-hidden`} style={{ borderColor: isNeo ? "black" : c.color, backgroundColor: isNeo ? undefined : "rgba(255,255,255,0.4)" }}>
          <div className="relative z-10">
            <h3 className={`text-2xl font-black uppercase mb-4 ${isNeo ? "" : "text-slate-800"}`} style={{ color: isNeo ? c.color : undefined }}>About {level} Level</h3>
            <p className={s.textBase}>{c.desc}</p>
          </div>
          {!isNeo && <div className="absolute top-0 right-0 w-32 h-32 opacity-10 -mr-8 -mt-8 rounded-full" style={{backgroundColor: c.color}} />}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {c.games.map((g, i) => (
            <motion.div 
              key={g.id} 
              initial={{ opacity:0, y:20 }} 
              animate={{ opacity:1, y:0 }} 
              transition={{ delay: i * 0.1 }}
              className={`${s.card} group flex flex-col justify-between h-full`}
              style={{ backgroundColor: isNeo ? undefined : "rgba(255,255,255,0.4)" }}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 flex items-center justify-center transition-colors ${isNeo ? "bg-black text-white border-4 border-black group-hover:bg-white group-hover:text-black" : "bg-black/5 text-slate-400 group-hover:bg-primary group-hover:text-white rounded-2xl"}`}>
                    <g.icon className="h-7 w-7" />
                  </div>
                  <span className={`${s.tag} bg-opacity-20`} style={{ backgroundColor: isNeo ? c.color : undefined, borderColor: isNeo ? "black" : undefined }}>{level}</span>
                </div>
                <h4 className={`text-2xl font-black uppercase mb-2 tracking-tighter ${isNeo ? "" : "text-slate-900"}`}>
                  <TTSText text={g.name}>{g.name}</TTSText>
                </h4>
                <p className={`${s.textMuted} text-sm`}>
                  <TTSText text={g.desc}>{g.desc}</TTSText>
                </p>
              </div>
              <button 
                onClick={() => {
                  setActiveGame(g.id as GameType);
                  setTimeout(() => {
                    document.getElementById('game-display')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }} 
                className={`${s.btnPrimary} mt-8 w-full`}
                style={{ backgroundColor: isNeo ? "#86EFAC" : undefined }}
              >
                PLAY GAME
              </button>
            </motion.div>
          ))}
        </div>

        {renderGame()}
      </div>
    );
  };

  return (
    <ScrollArea className="h-screen bg-transparent">
      <div className={`min-h-screen ${isNeo ? "font-bold bg-grid" : "font-sans"} pb-40`}>
        <Navbar />

        <div className={`container mx-auto ${settings.textToSpeech ? 'pt-36' : 'pt-20'} px-4 max-w-7xl`}>
          {currentLevel !== "home" && (
            <button 
              onClick={() => { setCurrentLevel("home"); setActiveGame(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`mb-8 flex items-center gap-2 font-black uppercase text-sm px-6 py-3 transition-all ${isNeo ? "border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1" : "bg-primary/10 text-primary hover:bg-primary/20 rounded-xl"}`}
            >
              <ArrowLeft className="h-5 w-5" /> Back to Overview
            </button>
          )}
          {currentLevel === "home" && (
            <div className="space-y-32 pb-40">
               {/* HERO SECTION */}
               <section className="relative py-20 overflow-hidden rounded-[4rem]">
                  {/* Abstract Background Shapes */}
                  {!isNeo && (
                    <div className="absolute inset-0 -z-10 opacity-20 overflow-hidden">
                       <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                       <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
                    </div>
                  )}
                  
                  <div className="text-center space-y-8 relative z-10">
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`inline-block px-6 py-2 rounded-full font-black uppercase tracking-widest text-sm ${isNeo ? "bg-black text-white" : "bg-primary/10 text-primary"}`}
                     >
                        <TTSText text="Scientifically Proven">Scientifically Proven</TTSText>
                     </motion.div>
                     <h1 className={`text-7xl md:text-9xl font-black tracking-tighter leading-none ${isNeo ? "text-black" : "text-slate-900"}`}>
                        <TTSText text="DyslexiaBoost">Dyslexia<span className="text-primary">Boost</span></TTSText>
                     </h1>
                     <p className={`text-xl md:text-2xl max-w-2xl mx-auto font-medium opacity-60`}>
                        <TTSText text="Scientifically proven games and activities to help improve reading skills through multi-sensory engagement.">
                          Scientifically proven games and activities to help improve reading skills through multi-sensory engagement.
                        </TTSText>
                     </p>
                     <div className="flex justify-center gap-6 pt-4">
                        <button 
                          onClick={() => {
                            document.getElementById('difficulty-selector')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`${s.btnPrimary} px-12 h-16 text-xl`}
                        >
                           GET STARTED
                        </button>
                     </div>
                  </div>
               </section>

               {/* FEATURES SECTION */}
               <section className="space-y-16">
                  <div className="text-center">
                     <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Designed for Every Learning Style</h2>
                     <p className="opacity-60 text-lg">Our approach combines engaging activities with science-backed techniques.</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                     {[
                       { title: "Cognitive Development", color: "#3B82F6", desc: "Activities designed to strengthen neural pathways involved in reading and word recognition.", icon: Sparkles },
                       { title: "Multi-Sensory Learning", color: "#F59E0B", desc: "Games that engage visual, auditory, and kinesthetic learning styles for deeper comprehension.", icon: AudioLines },
                       { title: "Progress Tracking", color: "#10B981", desc: "Detailed analytics and progress reports to track improvements and identify areas for growth.", icon: History }
                     ].map((f, i) => (
                       <motion.div 
                         key={f.title}
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ delay: i * 0.1 }}
                         className={`${s.card} border-t-8 h-full flex flex-col p-8`}
                         style={{ borderColor: f.color, backgroundColor: isNeo ? undefined : "rgba(255,255,255,0.4)" }}
                       >
                          <div className={`w-12 h-12 flex items-center justify-center mb-6 ${isNeo ? "bg-black text-white" : "bg-black/5 rounded-xl"}`} style={{ color: isNeo ? f.color : undefined }}>
                             <f.icon className="h-6 w-6" />
                          </div>
                          <h3 className="text-2xl font-black uppercase mb-3 tracking-tighter">{f.title}</h3>
                          <p className="opacity-60 leading-relaxed">{f.desc}</p>
                       </motion.div>
                     ))}
                  </div>
               </section>

               {/* BENEFITS SECTION */}
               <section className="space-y-16">
                  <div className="text-center">
                     <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Benefits of Our Approach</h2>
                     <p className="opacity-60 text-lg">Research-based activities designed to effectively improve reading skills.</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                     {[
                       { title: "Scientifically Proven", icon: CheckCircle2, desc: "Activities based on extensive research in cognitive psychology and reading development." },
                       { title: "Personalized Learning", icon: BookOpen, desc: "Activities that adapt to your specific needs and reading level." },
                       { id: "severe", title: "Engaging Format", icon: Sparkles, desc: "Fun, game-based activities that make learning enjoyable and motivating." }
                     ].map((b, i) => (
                        <div key={b.title} className="flex gap-6 items-start">
                           <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center ${isNeo ? "border-4 border-black bg-white" : "bg-primary/10 text-primary rounded-xl"}`}>
                              <b.icon className="h-6 w-6" />
                           </div>
                           <div>
                              <h4 className="text-xl font-black uppercase mb-2">{b.title}</h4>
                              <p className="opacity-60 text-sm leading-relaxed">{b.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

               {/* DIFFICULTY SELECTOR */}
               <section id="difficulty-selector" className="space-y-20">
                  <div className="text-center">
                     <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Ready to Begin?</h2>
                     <p className="opacity-60 text-xl">Select a level that matches your current learning journey.</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                     {[
                       { id: "mild", color: "#86EFAC", desc: "Basic reading challenges. Scrambled letters and recognition." },
                       { id: "moderate", color: "#FEF08A", desc: "Intermediate difficulties. Phonemes and audio dictation." },
                       { id: "severe", color: "#FDA4AF", desc: "Significant challenges. Letter-to-sound fundamental matching." }
                     ].map(l => (
                       <div key={l.id} className={`${s.card} border-[8px] flex flex-col justify-between`} style={{ borderColor: isNeo ? "black" : l.color, backgroundColor: isNeo ? undefined : "rgba(255,255,255,0.4)" }}>
                          <div>
                             <h2 className="text-4xl font-black uppercase mb-4">{l.id}</h2>
                             <p className={`${s.textBase} mb-8`}>{l.desc}</p>
                          </div>
                          <button 
                            onClick={() => {
                              setCurrentLevel(l.id as Level);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }} 
                            className={s.btnPrimary} 
                            style={{ backgroundColor: isNeo ? l.color : undefined }}
                          >
                            EXPLORE {l.id} ACTIVITIES
                          </button>
                       </div>
                     ))}
                  </div>
               </section>
            </div>
          )}

          {currentLevel !== "home" && <LevelSection level={currentLevel as any} />}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ImproveDyslexiaPage;
