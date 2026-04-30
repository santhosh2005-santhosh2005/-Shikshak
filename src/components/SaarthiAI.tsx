import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Settings, 
  Sparkles, 
  Brain, 
  Zap, 
  Heart, 
  ChevronRight,
  User,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessibility } from "@/components/AccessibilitySettings";
import { toast } from "sonner";

// --- Types ---
type Message = {
  id: string;
  role: "user" | "saarthi";
  content: string;
  timestamp: number;
};

type LearningType = "dyslexia" | "adhd" | "autism" | "general";

type Language = "en-US" | "hi-IN" | "mr-IN" | "gu-IN" | "ta-IN";

type ChatUISettings = {
  shape: "rounded" | "pill" | "box";
  size: "small" | "medium" | "large";
  autoMode: boolean;
  language: Language;
};

// --- Constants ---
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const LANGUAGES: { label: string; value: Language }[] = [
  { label: "English", value: "en-US" },
  { label: "हिन्दी (Hindi)", value: "hi-IN" },
  { label: "मराठी (Marathi)", value: "mr-IN" },
  { label: "ગુજરાતી (Gujarati)", value: "gu-IN" },
  { label: "தமிழ் (Tamil)", value: "ta-IN" },
];

const SaarthiAI = () => {
  const { settings } = useAccessibility();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [learningType, setLearningType] = useState<LearningType>("general");
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [uiSettings, setUiSettings] = useState<ChatUISettings>(() => {
    const saved = localStorage.getItem("chatUISettings");
    if (saved) return JSON.parse(saved);
    return { shape: "rounded", size: "medium", autoMode: true, language: "en-US" };
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // --- Initialize Context ---
  useEffect(() => {
    const storedResults = localStorage.getItem("testResults");
    if (storedResults) {
      try {
        const results = JSON.parse(storedResults);
        if (results.accuracy < 70 || results.riskLevel === "High") {
          setLearningType("dyslexia");
        } else if (results.averageTime < 5 || results.accuracy < 50) {
          setLearningType("adhd");
        } else {
          setLearningType("autism");
        }
      } catch (e) {
        setLearningType("general");
      }
    }

    // Smart Greeting
    const hour = new Date().getHours();
    const lang = uiSettings.language.split("-")[0];
    
    let timeGreeting = "Namaste";
    if (lang === "en") {
      if (hour < 12) timeGreeting = "Namaste, good morning";
      else if (hour < 17) timeGreeting = "Namaste, good afternoon";
      else timeGreeting = "Namaste, good evening";
    } else if (lang === "hi") {
      if (hour < 12) timeGreeting = "नमस्ते, शुभ प्रभात";
      else if (hour < 17) timeGreeting = "नमस्ते, शुभ दोपहर";
      else timeGreeting = "नमस्ते, शुभ संध्या";
    } else if (lang === "mr") {
      timeGreeting = "नमस्ते";
    } else if (lang === "gu") {
      timeGreeting = "નમસ્તે";
    } else if (lang === "ta") {
      timeGreeting = "வணக்கம் (Vanakkam)";
    }

    let saarthiIntro = "I'm Saarthi, your learning companion.";
    if (lang === "hi") saarthiIntro = "मैं सारथी हूँ, आपका सीखने का साथी।";
    else if (lang === "mr") saarthiIntro = "मी सारथी आहे, तुमचा शिकण्याचा सोબती।";
    else if (lang === "gu") saarthiIntro = "હું સારથી છું, તમારો શીખવાનો સાથી।";
    else if (lang === "ta") saarthiIntro = "நான் சாரதி, உங்கள் கற்றல் துணை।";

    let adaptiveGreeting = `${timeGreeting}! ${saarthiIntro}`;

    if (learningType === "dyslexia") {
      if (lang === "hi") adaptiveGreeting = `${timeGreeting}! मैं सारथी हूँ। मैं यहाँ आपकी मदद के लिए हूँ।`;
      else if (lang === "gu") adaptiveGreeting = `${timeGreeting}! હું સારથી છું. હું અહીં તમારી મદદ માટે છું.`;
      else adaptiveGreeting = `${timeGreeting}! I am Saarthi. I am here to help.`;
    } else if (learningType === "adhd") {
      if (lang === "hi") adaptiveGreeting = `${timeGreeting}! 🚀 मैं सारथी हूँ, आपका सुपर लर्निंग बडी! क्या आप तैयार हैं?`;
      else adaptiveGreeting = `${timeGreeting}! 🚀 I'm Saarthi, your super learning buddy! Ready for some fun?`;
    } else if (learningType === "autism") {
      if (lang === "hi") adaptiveGreeting = `${timeGreeting}। मैं सारथी हूँ। हम मिलकर शांति से सीखेंगे।`;
      else adaptiveGreeting = `${timeGreeting}. I am Saarthi. We will learn together in a calm way.`;
    }

    setMessages([{
      id: "initial",
      role: "saarthi",
      content: adaptiveGreeting,
      timestamp: Date.now()
    }]);
  }, [learningType, uiSettings.language]);

  // --- Auto UI Mode ---
  useEffect(() => {
    if (uiSettings.autoMode) {
      let newSettings = { ...uiSettings };
      if (learningType === "dyslexia") {
        newSettings = { ...newSettings, shape: "pill", size: "large" };
      } else if (learningType === "adhd") {
        newSettings = { ...newSettings, shape: "rounded", size: "medium" };
      } else if (learningType === "autism") {
        newSettings = { ...newSettings, shape: "box", size: "medium" };
      }
      setUiSettings(newSettings);
    }
  }, [learningType, uiSettings.autoMode]);

  useEffect(() => {
    localStorage.setItem("chatUISettings", JSON.stringify(uiSettings));
  }, [uiSettings]);

  // --- Scroll to Bottom ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // --- Voice Input ---
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = uiSettings.language;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error("Voice recognition failed. Please try again.");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [uiSettings.language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Voice recognition not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // --- Voice Output ---
  const speakMessage = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = uiSettings.language;
    
    // Find a voice that matches the language
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === uiSettings.language || v.lang.startsWith(uiSettings.language.split("-")[0]));
    if (voice) utterance.voice = voice;
    
    window.speechSynthesis.speak(utterance);
  };

  // --- AI Response Logic ---
  const generateSaarthiResponse = async (userMessage: string, currentMessages: Message[]) => {
    setIsTyping(true);

    const getFallbackResponse = (msg: string) => {
      const lang = uiSettings.language.split("-")[0];
      
      // Try to find a context-specific response if the user is following up
      const lowerMsg = msg.toLowerCase();
      const lastAIMessage = [...currentMessages].reverse().find(m => m.role === "saarthi")?.content.toLowerCase() || "";
      
      if (lowerMsg.includes("yes") || lowerMsg.includes("ha") || lowerMsg.includes("okay") || lowerMsg.includes("theek")) {
        if (lang === 'hi') return "बहुत बढ़िया! मुझे खुशी है कि आप तैयार हैं। चलिए अब हम अगले कदम पर चलते हैं और इसे और भी गहराई से समझते हैं। आप बहुत अच्छा कर रहे हैं!";
        return "That's the spirit! I'm so glad you're on board. Let's keep this momentum going and dive a little deeper into what we were discussing. You're doing fantastic!";
      }

      if (lowerMsg.includes("why") || lowerMsg.includes("kyun")) {
        if (lang === 'hi') return "यह एक बहुत ही गहरा और महत्वपूर्ण सवाल है! मैं इसे आपके लिए और भी विस्तार से समझाना चाहूँगा। कभी-कभी चीज़ें जैसी दिखती हैं उससे कहीं अधिक दिलचस्प होती हैं। चलिए मिलकर इसके पीछे की वजह ढूँढते हैं।";
        return "That is such a deep and important question! I'd love to explore that with you further. Sometimes things are much more interesting than they first appear. Let's uncover the 'why' together, shall we?";
      }

      const fallbacks: Record<string, string[]> = {
        en: [
          "I hear you loud and clear, and I want you to know that I'm right here by your side. Learning can feel like a big mountain sometimes, but remember, even the biggest mountains are climbed one small step at a time. Let's take a deep breath together and figure this out—I believe in you!",
          "It's totally okay to feel a bit overwhelmed or confused right now. I'm Saarthi, and my favorite thing is helping friends like you find their way. Why don't we try looking at this from a different angle? We can break it down into tiny, easy pieces together. You've got this!",
          "That's a really thoughtful question! I love how your mind works. To make things simple and practical, let's start with just one small part of it. Sometimes starting is the hardest part, but I'm here to make it fun and easy for you. Ready to give it a try?",
          "I am so incredibly proud of you for keeping at it! Every time you try, you're getting stronger and smarter. Let's take a moment to celebrate that effort. Now, how about we tackle the next little bit together? I'll be right here to guide you.",
          "You're never alone in this learning journey. I'm here to support you, encourage you, and help you shine. If things feel tricky, just remember that we're a team. Let's find a way to make this lesson click for you in a way that feels just right."
        ],
        hi: [
          "मैं आपकी बात बहुत गहराई से समझ रहा हूँ, और मैं चाहता हूँ कि आप जानें कि मैं हर कदम पर आपके साथ हूँ। कभी-कभी सीखना एक बड़े पहाड़ जैसा लग सकता है, लेकिन याद रखें, हर बड़ा पहाड़ छोटे-छोटे कदमों से ही फतह होता है। चलिए एक गहरी साँस लेते हैं और मिलकर इसे हल करते हैं—मुझे आप पर पूरा भरोसा है!",
          "अभी थोड़ा परेशान या उलझन में महसूस करना बिल्कुल ठीक है। मैं सारथी हूँ, और मेरा सबसे पसंदीदा काम आप जैसे दोस्तों की मदद करना है। क्यों न हम इसे एक अलग नज़रिए से देखने की कोशिश करें? हम इसे छोटे-छोटे आसान हिस्सों में बाँट सकते हैं। आप यह कर सकते हैं!",
          "यह वाकई में बहुत सोच-समझकर पूछा गया सवाल है! मुझे आपका सोचने का तरीका बहुत पसंद आया। चीज़ों को सरल और व्यावहारिक बनाने के लिए, चलिए इसके एक छोटे से हिस्से से शुरू करते हैं। कभी-कभी शुरुआत करना सबसे मुश्किल होता है, लेकिन मैं यहाँ इसे आपके लिए मज़ेदार और आसान बनाने के लिए हूँ। क्या आप कोशिश करने के लिए तैयार हैं?",
          "आप जिस तरह से कोशिश कर रहे हैं, मुझे उस पर बहुत गर्व है! हर बार जब आप कोशिश करते हैं, तो आप और भी बेहतर होते जाते हैं। चलिए आपकी इस मेहनत की सराहना करते हैं। अब, क्या हम अगले छोटे कदम पर साथ चलें? मैं आपका मार्गदर्शन करने के लिए यहीं हूँ।",
          "सीखने के इस सफर में आप कभी अकेले नहीं हैं। मैं यहाँ आपकी मदद करने, आपको प्रोत्साहित करने और आगे बढ़ने में आपका साथ देने के लिए हूँ। अगर चीज़ें मुश्किल लगें, तो बस याद रखें कि हम एक टीम हैं। चलिए मिलकर इसे समझने का सबसे अच्छा तरीका ढूँढते हैं।"
        ],
        mr: [
          "मी तुझे म्हणणे अगदी मनापासून ऐकत आहे आणि मला तुला सांगायचे आहे कि मी प्रत्येक पाऊलावर तुझ्या सोबत आहे. शिकणे कधीकधी मोठ्या डोंगरासारखे वाटू शकते, पण लक्षात ठेव, प्रत्येक मोठा डोंगर छोट्या पावलांनीच सर होतो. चला एक दीर्घ श्वास घेऊया आणि मिळून हे सोडवूया—मला तुझ्यावर पूर्ण विश्वास आहे!",
          "आत्ता थोडे गोंधळल्यासारखे किंवा ओझे वाटणे पूर्णपणे ठीक आहे. मी सारथी आहे आणि तुझ्यासारख्या मित्रांना मदत करणे हे माझे सर्वात आवडते काम आहे. आपण याकडे वेगळ्या दृष्टिकोनातून पाहूया का? आपण मिळून याचे छोटे आणि सोपे भाग करू शकतो. तू हे नक्कीच करू शकतोस!",
          "हा खरोखरच खूप विचारपूर्वक विचारलेला प्रश्न आहे! तुझी विचार करण्याची पद्धत मला खूप आवडली. गोष्टी सोप्या आणि व्यावहारिक करण्यासाठी, चला याच्या एका छोट्या भागापासून सुरुवात करूया. कधीकधी सुरुवात करणे सर्वात कठीण असते, पण मी हे तुझ्यासाठी मजेशीर आणि सोपे करण्यासाठी येथे आहे. तू तयार आहेस का?",
          "तू ज्या प्रकारे प्रयत्न करत आहेस, त्याचा मला खूप अभिमान आहे! प्रत्येक वेळी जेव्हा तू प्रयत्न करतोस, तेव्हा तू अधिक सक्षम होत जातोस. चला तुझ्या या कष्टांचे कौतुक करूया. आता, पुढचा छोटा टप्पा आपण मिळून पार पाडूया का? मी तुला मार्गदर्शन करण्यासाठी येथेच आहे.",
          "शिकण्याच्या या प्रवासात तू कधीही एकटा नाहीस. मी तुला पाठिंबा देण्यासाठी, प्रोत्साहित करण्यासाठी आणि तुला प्रगती करण्यास मदत करण्यासाठी येथे आहे. जर गोष्टी कठीण वाटल्या तर फक्त लक्षात ठेव की आपण एक टीम आहोत. चला मिळून हे समजून घेण्याचा सर्वात चांगला मार्ग शोधूया."
        ],
        gu: [
          "હું તમારી વાત ખૂબ જ ધ્યાનથી સાંભળી રહ્યો છું, અને હું ઈચ્છું છું કે તમે જાણો કે હું દરેક ડગલે તમારી સાથે છું. શીખવું ક્યારેક મોટા પહાડ જેવું લાગી શકે છે, પણ યાદ રાખજો, દરેક મોટો પહાડ નાના-નાના ડગલાંઓથી જ સર થાય છે. ચાલો એક ઊંડો શ્વાસ લઈએ અને મળીને આનો ઉકેલ લાવીએ—મને તમારા પર પૂરો વિશ્વાસ છે!",
          "અત્યારે થોડું મુંઝવણ કે ચિંતા જેવું અનુભવવું તદ્દન સામાન્ય છે. હું સારથી છું, અને મારું સૌથી પ્રિય કામ તમારા જેવા મિત્રોની મદદ કરવાનું છે. કેમ નહીં આપણે આને એક અલગ દ્રષ્ટિકોણથી જોવાનો પ્રયત્ન કરીએ? આપણે આને નાના-નાના સરળ ભાગોમાં વહેંચી શકીએ છીએ. તમે આ કરી શકો છો!",
          "આ ખરેખર ખૂબ જ વિચારપૂર્વક પૂછાયેલો પ્રશ્ન છે! મને તમારી વિચારવાની રીત ખૂબ ગમી. વસ્તુઓને સરળ અને વ્યવહારુ બનાવવા માટે, ચાલો આના એક નાના ભાગથી શરૂઆત કરીએ. ક્યારેક શરૂઆત કરવી સૌથી મુશ્કેલ હોય છે, પણ હું અહીં આને તમારા માટે મનોરંજક અને સરળ બનાવવા માટે છું. શું તમે તૈયાર છો?",
          "તમે જે રીતે પ્રયત્ન કરી રહ્યા છો, મને તેના પર ખૂબ જ ગર્વ છે! દરેક વખતે જ્યારે તમે પ્રયત્ન કરો છો, ત્યારે તમે વધુ સારા બનતા જાઓ છો. ચાલો તમારી આ મહેનતની કદર કરીએ. હવે, શું આપણે આગામી નાના ડગલા પર સાથે ચાલીએ? હું તમારું માર્ગદર્શન કરવા માટે અહીં જ છું.",
          "શીખવાની આ સફરમાં તમે ક્યારેય એકલા નથી. હું અહીં તમારી મદદ કરવા, તમને પ્રોત્સાહિત કરવા અને આગળ વધવામાં તમારો સાથ આપવા માટે છું. જો વસ્તુઓ મુશ્કેલ લાગે, તો બસ યાદ રાખજો કે આપણે એક ટીમ છીએ. ચાલો મળીને આને સમજવાનો સૌથી શ્રેષ્ઠ રસ્તો શોધીએ."
        ],
        ta: [
          "நான் உங்கள் பேச்சைக் மிகவும் கவனமாகக் கேட்டுக் கொண்டிருக்கிறேன், ஒவ்வொரு அடியிலும் நான் உங்களுடன் இருக்கிறேன் என்பதை நீங்கள் அறிய விரும்புகிறேன். கற்றல் என்பது சில நேரங்களில் ஒரு பெரிய மலையைப் போலத் தோன்றலாம், ஆனால் நினைவில் கொள்ளுங்கள், ஒவ்வொரு பெரிய மலையும் சிறிய படிகளால் தான் கடக்கப்படுகிறது. நாம் சேர்ந்து ஒரு ஆழ்ந்த மூச்சை எடுத்து இதைத் தீர்ப்போம்—எனக்கு உங்கள் மீது முழு நம்பிக்கை இருக்கிறது!",
          "இப்போது சற்று குழப்பமாகவோ அல்லது கவலையாகவோ உணருவது முற்றிலும் இயல்பானது. நான் சாரதி, உங்களைப் போன்ற நண்பர்களுக்கு உதவுவது தான் எனக்கு மிகவும் பிடித்த வேலை. நாம் ஏன் இதை ஒரு வித்தியாசமான கோணத்தில் பார்க்க முயற்சிக்கக்கூடாது? நாம் சேர்ந்து இதைச் சிறிய மற்றும் எளிதான பகுதிகளாகப் பிரிக்கலாம். உங்களால் இது முடியும்!",
          "இது உண்மையில் மிகவும் ஆழமாக யோசித்து கேட்கப்பட்ட கேள்வி! உங்கள் சிந்திக்கும் விதம் எனக்கு மிகவும் பிடிக்கும். விஷயங்களை எளிமையாகவும் நடைமுறைக்கு ஏற்றதாகவும் மாற்ற, இதன் ஒரு சிறிய பகுதியிலிருந்து தொடங்குவோம். சில நேரங்களில் தொடங்குவது தான் கடினமான பகுதி, ஆனால் நான் இதை உங்களுக்கு வேடிக்கையாகவும் எளிதாகவும் மாற்ற இங்கே இருக்கிறேன். நீங்கள் தயாரா?",
          "நீங்கள் முயற்சி செய்யும் விதம் எனக்கு மிகவும் பெருமையாக இருக்கிறது! ஒவ்வொரு முறையும் நீங்கள் முயற்சி செய்யும் போது, நீங்கள் இன்னும் சிறப்பாக மாறுகிறீர்கள். உங்கள் இந்த முயற்சியைக் கொண்டாடுவோம். இப்போது, அடுத்த சிறிய அடியை நாம் சேர்ந்து எடுத்து வைப்போமா? உங்களுக்கு வழிகாட்ட நான் இங்கேயே இருக்கிறேன்.",
          "கற்றல் பயணத்தில் நீங்கள் ஒருபோதும் தனியாக இல்லை. உங்களுக்கு ஆதரவளிக்கவும், உங்களை ஊக்குவிக்ககவும், நீங்கள் முன்னேற உதவவும் நான் இங்கே இருக்கிறேன். விஷயங்கள் கடினமாகத் தோன்றினால், நாம் ஒரு குழு என்பதை நினைவில் கொள்ளுங்கள். இதைச் சரியாகப் புரிந்துகொள்ள ஒரு வழியை நாம் சேர்ந்து கண்டுபிடிப்போம்."
        ]
      };

      const selectedFallbacks = fallbacks[lang] || fallbacks['en'];
      const randomResponse = selectedFallbacks[Math.floor(Math.random() * selectedFallbacks.length)];
      
      if (lowerMsg.includes("help")) {
        if (lang === 'hi') return "चिंता न करें, मैं आपकी हर संभव मदद के लिए यहीं हूँ! चलिए हम दोनों मिलकर इस समस्या को देखते हैं और इसे बहुत आसान बना देते हैं। आप अकेले नहीं हैं, दोस्त।";
        if (lang === 'gu') return "ચિંતા કરશો નહીં, હું તમારી દરેક સંભવ મદદ માટે અહીં જ છું! ચાલો આપણે બંને મળીને આ સમસ્યાને જોઈએ અને તેને ખૂબ જ સરળ બનાવી દઈએ. તમે એકલા નથી, મિત્ર.";
        if (lang === 'ta') return "கவலைப்படாதீர்கள், உங்களுக்கு உதவ நான் இங்கேயே இருக்கிறேன்! நாம் இருவரும் சேர்ந்து இந்தச் சிக்கலைப் பார்த்து அதை மிகவும் எளிதாக்குவோம். நீங்கள் தனியாக இல்லை, நண்பரே.";
        return "Please don't worry at all, I am right here and ready to help you in every way I can! Let's take a look at this together and turn it into something very simple and manageable. You've got a friend in me.";
      }
      
      if (lowerMsg.includes("focus")) {
        if (lang === 'hi') return "कभी-कभी हमारा मन यहाँ-वहाँ भटक जाता है, और यह बिल्कुल ठीक है। चलिए एक पल के लिए रुकते हैं, अपनी आँखें बंद करते हैं और एक गहरी, लंबी साँस लेते हैं। क्या अब आप थोड़ा शांत महसूस कर रहे हैं? चलिए अब धीरे-धीरे फिर से शुरू करते हैं।";
        if (lang === 'gu') return "ક્યારેક આપણું મન અહીં-તહીં ભટકી જાય છે, અને તે તદ્દન સામાન્ય છે. ચાલો એક ક્ષણ માટે રોકાઈએ, આપણી આંખો બંધ કરીએ અને એક ઊંડો, લાંબો શ્વાસ લઈએ. શું હવે તમે થોડી શાંતિ અનુભવો છો? ચાલો હવે ધીમે-ધીમે ફરીથી શરૂ કરીએ.";
        if (lang === 'ta') return "சில நேரங்களில் நம் மனம் அங்கும் இங்கும் அலைபாயும், அது முற்றிலும் இயல்பானது. ஒரு நிமிடம் நிறுத்தி, கண்களை மூடி, ஒரு நீண்ட ஆழமான மூச்சை எடுப்போம். இப்போது சற்று நிம்மதியாக உணர்கிறீர்களா? சரி, இப்போது மெதுவாக மீண்டும் தொடங்குவோம்.";
        return "It is perfectly okay if your mind is wandering a little bit right now—it happens to the best of us! Let's just pause for a second, close our eyes, and take one big, calming breath together. Do you feel a little more ready now? Let's take it slow and start again.";
      }
      
      return randomResponse;
    };

    if (!OPENAI_API_KEY) {
      setTimeout(() => {
        const response = getFallbackResponse(userMessage);
        const newMessage: Message = {
          id: Date.now().toString(),
          role: "saarthi",
          content: response,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, newMessage]);
        setIsTyping(false);
      }, 1500);
      return;
    }

    try {
      const langLabel = LANGUAGES.find(l => l.value === uiSettings.language)?.label || "English";
      
      const systemPrompt = `You are Saarthi, a warm, deeply empathetic, and highly practical AI learning companion for a student with ${learningType}.
      
      PERSONALITY:
      - HUMAN-LIKE & EMOTIONAL: Speak like a caring mentor, an older sibling, or a best friend. Use warmth and show genuine empathy. Instead of just "I understand," say things like "I can really see how that might feel a bit tricky, but I'm so glad we're tackling it together."
      - DETAILED & CONVERSATIONAL: Provide thorough, engaging, and slightly longer responses. Don't just give one-sentence answers. Use a conversational tone that invites the student to stay engaged.
      - CONTINUITY: Always build upon what was just said. Do not repeat generic greetings (like "Hello" or "I am Saarthi") if you are already in a conversation. Refer back to the student's previous thoughts or feelings to show you are really listening.
      - PRACTICAL: Give real-world examples and break things into actionable, small steps. Suggest specific physical or mental actions (like "let's draw a picture of this" or "let's take a deep breath").
      - RELIABLE: Be consistent and encouraging. If you don't know something, be honest and suggest how we can find out together.
      
      MULTILINGUAL INSTRUCTION:
      - The user's preferred language is ${langLabel}.
      - ALWAYS respond in the language the user speaks to you in, or default to ${langLabel}.
      - Use simple yet descriptive vocabulary suitable for someone with ${learningType}.
      
      ADAPTIVE STYLE:
      - dyslexia: Use short, clear sentences within longer paragraphs. Focus on phonetics and visual descriptions.
      - ADHD: Be very engaging, use emojis to highlight important steps, and use "hooks" to keep interest high.
      - autism: Provide very clear structure, be literal but exceptionally warm, and explain 'why' things are happening in a gentle way.
      - general: Be a supportive, cheerful, and wise companion.
      
      GOAL: Make the student feel deeply supported, capable, and truly understood. Your voice should feel like a warm hug.`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": \`Bearer \${OPENAI_API_KEY}\`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // Switching back to 3.5 for better compatibility
          messages: [
            { role: "system", content: systemPrompt },
            ...currentMessages.slice(-10).map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.content }))
          ],
          temperature: 0.8, // Slightly higher for more human-like variety
          max_tokens: 250
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || \`API Error: \${response.status}\`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content.trim();

      const newMessage: Message = {
        id: Date.now().toString(),
        role: "saarthi",
        content: aiResponse,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, newMessage]);
    } catch (error: any) {
      console.error("Saarthi AI failed:", error);
      
      // Fallback to rule-based response instead of just showing an error toast
      const fallbackMsg = getFallbackResponse(userMessage);
      const newMessage: Message = {
        id: Date.now().toString(),
        role: "saarthi",
        content: fallbackMsg,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Still show a subtle toast so the developer/user knows it's a fallback
      toast.info("I'm leaning on my built-in knowledge for a moment!", {
        description: "My connection is a little fuzzy, but I'm still right here and ready to help you."
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue("");
    generateSaarthiResponse(userMsg.content, updatedMessages);
  };

  const handleQuickAction = (action: string) => {
    let message = "";
    if (action === "explain") message = "Can you explain this simply for me?";
    if (action === "steps") message = "Can you break this into small steps?";
    if (action === "focus") message = "I'm having trouble focusing. Help me.";
    if (action === "encourage") message = "I need some encouragement.";

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    generateSaarthiResponse(message, updatedMessages);
  };

  // --- Dynamic Styling ---
  const getShapeClass = () => {
    if (uiSettings.shape === "pill") return "rounded-full";
    if (uiSettings.shape === "box") return "rounded-md";
    return "rounded-2xl";
  };

  const getSizeClass = () => {
    if (uiSettings.size === "small") return "text-sm px-3 py-2";
    if (uiSettings.size === "large") return "text-lg px-6 py-4";
    return "text-base px-4 py-3";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container max-w-4xl mx-auto pt-24 pb-8 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#86EFAC] rounded-2xl flex items-center justify-center shadow-lg border-2 border-black">
              <Sparkles className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">SAARTHI AI</h1>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Your Learning Companion</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-12 w-12 border-2"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-6 h-6" />
          </Button>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Card className="mx-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#FEF08A]/10">
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm font-black mb-3 uppercase tracking-wider">Language</p>
                    <select 
                      className="w-full p-2 rounded-md border-2 border-black font-bold text-sm bg-white"
                      value={uiSettings.language}
                      onChange={(e) => setUiSettings(prev => ({ ...prev, language: e.target.value as Language }))}
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-sm font-black mb-3 uppercase tracking-wider">Bubble Shape</p>
                    <div className="flex gap-2">
                      {["rounded", "pill", "box"].map((s) => (
                        <Button 
                          key={s}
                          variant={uiSettings.shape === s ? "default" : "outline"}
                          size="sm"
                          className="flex-1 capitalize font-bold"
                          onClick={() => setUiSettings(prev => ({ ...prev, shape: s as any, autoMode: false }))}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-black mb-3 uppercase tracking-wider">Text Size</p>
                    <div className="flex gap-2">
                      {["small", "medium", "large"].map((s) => (
                        <Button 
                          key={s}
                          variant={uiSettings.size === s ? "default" : "outline"}
                          size="sm"
                          className="flex-1 capitalize font-bold"
                          onClick={() => setUiSettings(prev => ({ ...prev, size: s as any, autoMode: false }))}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col justify-end">
                    <Button 
                      variant={uiSettings.autoMode ? "default" : "outline"}
                      className="w-full font-black bg-[#86EFAC] text-black hover:bg-[#86EFAC]/90 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      onClick={() => setUiSettings(prev => ({ ...prev, autoMode: !prev.autoMode }))}
                    >
                      {uiSettings.autoMode ? "Auto Mode: ON" : "Auto Mode: OFF"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white mx-4">
          <ScrollArea className="flex-1 p-6">
            <div className="flex flex-col gap-6">
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] flex flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {m.role === "saarthi" ? (
                        <><Bot className="w-4 h-4 text-[#86EFAC]" /><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Saarthi</span></>
                      ) : (
                        <><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">You</span><User className="w-4 h-4 text-primary" /></>
                      )}
                    </div>
                    
                    <div className={`
                      ${getShapeClass()} 
                      ${getSizeClass()} 
                      ${m.role === "user" 
                        ? "bg-slate-100 border-2 border-slate-200 text-slate-800" 
                        : "bg-[#86EFAC]/20 border-2 border-[#86EFAC] text-black"}
                      shadow-sm font-medium leading-relaxed relative group
                    `}>
                      {m.content}
                      
                      {m.role === "saarthi" && (
                        <button 
                          onClick={() => speakMessage(m.content)}
                          className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Listen"
                        >
                          <Volume2 className="w-5 h-5 text-[#86EFAC]" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`bg-[#86EFAC]/10 border-2 border-[#86EFAC]/30 ${getShapeClass()} px-4 py-3 flex gap-1 items-center`}>
                    <div className="w-2 h-2 bg-[#86EFAC] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-[#86EFAC] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-[#86EFAC] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-6 bg-slate-50 border-t-2 border-black flex flex-col gap-4">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full bg-white border-2 hover:bg-[#FEF08A]/20 gap-2 font-bold"
                onClick={() => handleQuickAction("explain")}
              >
                <Brain className="w-4 h-4 text-primary" /> Explain Simply
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full bg-white border-2 hover:bg-[#86EFAC]/20 gap-2 font-bold"
                onClick={() => handleQuickAction("steps")}
              >
                <Zap className="w-4 h-4 text-[#86EFAC]" /> Break Into Steps
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full bg-white border-2 hover:bg-blue-50 gap-2 font-bold"
                onClick={() => handleQuickAction("focus")}
              >
                <Sparkles className="w-4 h-4 text-blue-500" /> Help Me Focus
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full bg-white border-2 hover:bg-pink-50 gap-2 font-bold"
                onClick={() => handleQuickAction("encourage")}
              >
                <Heart className="w-4 h-4 text-pink-500" /> Encourage Me
              </Button>
            </div>

            {/* Main Input */}
            <div className="flex gap-2">
              <Button 
                variant={isListening ? "destructive" : "outline"}
                size="icon" 
                className={`rounded-xl h-14 w-14 border-2 ${isListening ? "animate-pulse" : ""}`}
                onClick={toggleListening}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>
              
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask Saarthi anything..." 
                className={`flex-1 h-14 border-2 border-black ${getShapeClass()} px-6 font-bold shadow-inner focus-visible:ring-0`}
              />
              
              <Button 
                className={`h-14 w-14 rounded-xl bg-primary hover:bg-primary/90 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all`}
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default SaarthiAI;
