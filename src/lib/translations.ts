export type Language = 'en' | 'kn' | 'ta';

export interface Translation {
  // Navigation
  nav: {
    home: string;
    startLearning: string;
    progress: string;
    aiChat: string;
    dashboard: string;
    report: string;
    support: string;
    about: string;
    settings: string;
    signIn: string;
    signOut: string;
  };
  
  // Home Page
  home: {
    tag1: string;
    tag2: string;
    heroTitle1: string;
    heroTitle2: string;
    heroTitle3: string;
    heroSubtitle: string;
    startScreening: string;
    ourMission: string;
    researchBacked: string;
    builtOnScience: string;
    scienceDescription: string;
    years: string;
    accuracy: string;
    users: string;
    quick: string;
    signsOfDyslexia: string;
    undiagnosed: string;
    fastResult: string;
    ourMissionTitle: string;
    empoweringMinds: string;
    missionDescription: string;
    readFullStory: string;
    features: {
      earlyDetection: string;
      earlyDetectionDesc: string;
      personalized: string;
      personalizedDesc: string;
      educator: string;
      educatorDesc: string;
    };
    letLearn: string;
    letLearnDesc: string;
    continueSession: string;
    testimonials: {
      title: string;
      quote1: string;
      author1: string;
      quote2: string;
      author2: string;
      quote3: string;
      author3: string;
    };
    contact: {
      title: string;
      subtitle: string;
      name: string;
      email: string;
      message: string;
      send: string;
      sent: string;
      sentDesc: string;
    };
    footer: {
      rights: string;
      privacy: string;
      terms: string;
      github: string;
    };
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    back: string;
    next: string;
    submit: string;
    upload: string;
    download: string;
  };
  
  // Accessibility
  accessibility: {
    textToSpeech: string;
    largeText: string;
    highContrast: string;
    reduceMotion: string;
    dyslexiaFont: string;
    uiTheme: string;
    calmTheme: string;
    neoTheme: string;
    language: string;
    english: string;
    kannada: string;
    tamil: string;
  };
}

export const translations: Record<Language, Translation> = {
  // English
  en: {
    nav: {
      home: "Home",
      startLearning: "Start Learning",
      progress: "Progress",
      aiChat: "AI Chat",
      dashboard: "Dashboard",
      report: "Report",
      support: "Support",
      about: "About",
      settings: "Settings",
      signIn: "Sign In",
      signOut: "Sign Out",
    },
    home: {
      tag1: "NEURO-ADAPTIVE",
      tag2: "SHIKSHAK 2.0",
      heroTitle1: "PERSONALIZED",
      heroTitle2: "LEARNING",
      heroTitle3: "FOR EVERY",
      heroSubtitle: "We understand how your child learns and adapt education to match.",
      startScreening: "START SCREENING",
      ourMission: "OUR MISSION",
      researchBacked: "RESEARCH-BACKED",
      builtOnScience: "BUILT ON SCIENCE.",
      scienceDescription: "We combine cognitive science with modern, inclusive technology to create screening tools that don't overwhelm.",
      years: "Years",
      accuracy: "Accuracy",
      users: "Users",
      quick: "Quick",
      signsOfDyslexia: "Signs of Dyslexia",
      undiagnosed: "Undiagnosed",
      fastResult: "Fast Result",
      ourMissionTitle: "OUR MISSION",
      empoweringMinds: "EMPOWERING EVERY MIND.",
      missionDescription: "We believe technology should adapt to the user. Our goal is to make identification accessible and provide neuro-friendly tools.",
      readFullStory: "READ FULL STORY",
      features: {
        earlyDetection: "Early Detection",
        earlyDetectionDesc: "Identify learning differences early with evidence-based screening.",
        personalized: "Personalized Learning",
        personalizedDesc: "Adaptive exercises tailored to individual learning styles.",
        educator: "Educator Resources",
        educatorDesc: "Tools and dashboards to support student growth.",
      },
      letLearn: "Let's Learn Your Way 🚀",
      letLearnDesc: "We adapt learning based on how you understand best.",
      continueSession: "CONTINUE SESSION",
      testimonials: {
        title: "COMMUNITY VOICES",
        quote1: "Understanding my style made everything easier. Stress-free design.",
        author1: "santhosh",
        quote2: "A safe, supportive environment for my daughter.",
        author2: "harshvardan",
        quote3: "Finally feel understood without the fatigue.",
        author3: "bhuvi",
      },
      contact: {
        title: "GET IN TOUCH",
        subtitle: "We'd love to hear from you.",
        name: "Name",
        email: "Email",
        message: "Message",
        send: "SEND",
        sent: "Message sent!",
        sentDesc: "We'll get back to you soon.",
      },
      footer: {
        rights: "All rights reserved.",
        privacy: "Privacy",
        terms: "Terms",
        github: "GitHub",
      },
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      back: "Back",
      next: "Next",
      submit: "Submit",
      upload: "Upload",
      download: "Download",
    },
    accessibility: {
      textToSpeech: "Text-to-Speech",
      largeText: "Large Text",
      highContrast: "High Contrast",
      reduceMotion: "Reduce Motion",
      dyslexiaFont: "Dyslexia-Friendly Font",
      uiTheme: "UI Theme",
      calmTheme: "Calm",
      neoTheme: "Neo-Brutalism",
      language: "Language",
      english: "English",
      kannada: "ಕನ್ನಡ",
      tamil: "தமிழ்",
    },
  },
  
  // Kannada
  kn: {
    nav: {
      home: "ಮುಖಪುಟ",
      startLearning: "ಕಲಿಕೆ ಪ್ರಾರಂಭಿಸಿ",
      progress: "ಪ್ರಗತಿ",
      aiChat: "AI ಚಾಟ್",
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      report: "ವರದಿ",
      support: "ಬೆಂಬಲ",
      about: "ನಮ್ಮ ಬಗ್ಗೆ",
      settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      signIn: "ಸೈನ್ ಇನ್",
      signOut: "ಸೈನ್ ಔಟ್",
    },
    home: {
      tag1: "ನ್ಯೂರೋ-ಅಡಾಪ್ಟಿವ್",
      tag2: "ಶಿಕ್ಷಕ್ 2.0",
      heroTitle1: "ವೈಯಕ್ತಿಕ",
      heroTitle2: "ಕಲಿಕೆ",
      heroTitle3: "ಪ್ರತಿ ಮಗುವಿಗೆ",
      heroSubtitle: "ನಿಮ್ಮ ಮಗು ಹೇಗೆ ಕಲಿಯುತ್ತದೆ ಎಂದು ಅರ್ಥಮಾಡಿಕೊಂಡು ಶಿಕ್ಷಣವನ್ನು ಹೊಂದಿಸುತ್ತೇವೆ.",
      startScreening: "ಸ್ಕ್ರೀನಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ",
      ourMission: "ನಮ್ಮ ಧ್ಯೇಯ",
      researchBacked: "ಸಂಶೋಧನೆ ಆಧಾರಿತ",
      builtOnScience: "ವಿಜ್ಞಾನದ ಮೇಲೆ ನಿರ್ಮಿತ.",
      scienceDescription: "ಜ್ಞಾನಶಾಸ್ತ್ರ ಮತ್ತು ಆಧುನಿಕ ತಂತ್ರಜ್ಞಾನವನ್ನು ಸಂಯೋಜಿಸಿ ಸುಲಭ ಸ್ಕ್ರೀನಿಂಗ್ ಸಾಧನಗಳನ್ನು ರಚಿಸುತ್ತೇವೆ.",
      years: "ವರ್ಷಗಳು",
      accuracy: "ನಿಖರತೆ",
      users: "ಬಳಕೆದಾರರು",
      quick: "ವೇಗವಾಗಿ",
      signsOfDyslexia: "ಡಿಸ್ಲೆಕ್ಸಿಯಾ ಲಕ್ಷಣಗಳು",
      undiagnosed: "ರೋಗನಿರ್ಣಯಿಸದಿದ್ದವು",
      fastResult: "ವೇಗದ ಫಲಿತಾಂಶ",
      ourMissionTitle: "ನಮ್ಮ ಧ್ಯೇಯ",
      empoweringMinds: "ಪ್ರತಿ ಮನಸ್ಸನ್ನು ಸಬಲೀಕರಣ.",
      missionDescription: "ತಂತ್ರಜ್ಞಾನ ಬಳಕೆದಾರರಿಗೆ ಹೊಂದಿಕೊಳ್ಳಬೇಕು ಎಂದು ನಾವು ನಂಬುತ್ತೇವೆ. ಗುರುತಿಸುವಿಕೆಯನ್ನು ಸುಲಭಗೊಳಿಸುವುದು ನಮ್ಮ ಗುರಿ.",
      readFullStory: "ಸಂಪೂರ್ಣ ಕಥೆ ಓದಿ",
      features: {
        earlyDetection: "ಆರಂಭಿಕ ಪತ್ತೆ",
        earlyDetectionDesc: "ಸಾಕ್ಷ್ಯಾಧಾರಿತ ಸ್ಕ್ರೀನಿಂಗ್ ಮೂಲಕ ಕಲಿಕೆಯ ವ್ಯತ್ಯಾಸಗಳನ್ನು ಆರಂಭದಲ್ಲಿ ಗುರುತಿಸಿ.",
        personalized: "ವೈಯಕ್ತಿಕ ಕಲಿಕೆ",
        personalizedDesc: "ವೈಯಕ್ತಿಕ ಕಲಿಕೆ ಶೈಲಿಗಳಿಗೆ ಹೊಂದಿಕೊಂಡ ಅಭ್ಯಾಸಗಳು.",
        educator: "ಶಿಕ್ಷಕರ ಸಂಪನ್ಮೂಲಗಳು",
        educatorDesc: "ವಿದ್ಯಾರ್ಥಿ ಬೆಳವಣಿಗೆಗೆ ಬೆಂಬಲ ನೀಡುವ ಸಾಧನಗಳು.",
      },
      letLearn: "ನಿಮ್ಮ ರೀತಿಯಲ್ಲಿ ಕಲಿಯೋಣ 🚀",
      letLearnDesc: "ನೀವು ಅತ್ಯುತ್ತಮವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವ ರೀತಿಯಲ್ಲಿ ಕಲಿಕೆಯನ್ನು ಹೊಂದಿಸುತ್ತೇವೆ.",
      continueSession: "ಸೆಷನ್ ಮುಂದುವರಿಸಿ",
      testimonials: {
        title: "ಸಮುದಾಯದ ಅಭಿಪ್ರಾಯಗಳು",
        quote1: "ನನ್ನ ಶೈಲಿಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದು ಎಲ್ಲವನ್ನೂ ಸುಲಭಗೊಳಿಸಿತು.",
        author1: "ಸಂತೋಷ್",
        quote2: "ನನ್ನ ಮಗಳಿಗೆ ಸುರಕ್ಷಿತ, ಬೆಂಬಲಿತ ಪರಿಸರ.",
        author2: "ಹರ್ಷವರ್ಧನ್",
        quote3: "ಅಂತಿಮವಾಗಿ ಆಯಾಸವಿಲ್ಲದೆ ಅರ್ಥವಾದಂತೆ feels.",
        author3: "ಭುವಿ",
      },
      contact: {
        title: "ಸಂಪರ್ಕಿಸಿ",
        subtitle: "ನಿಮ್ಮಿಂದ ಕೇಳಲು ಇಷ್ಟಪಡುತ್ತೇವೆ.",
        name: "ಹೆಸರು",
        email: "ಇಮೇಲ್",
        message: "ಸಂದೇಶ",
        send: "ಕಳುಹಿಸಿ",
        sent: "ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ!",
        sentDesc: "ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.",
      },
      footer: {
        rights: "ಎಲ್ಲಾ ಹಕ್ಕುಗಳು ಕಾಯ್ದಿರಿಸಲಾಗಿವೆ.",
        privacy: "ಗೋಪ್ಯತೆ",
        terms: "ನಿಯಮಗಳು",
        github: "GitHub",
      },
    },
    common: {
      loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      error: "ದೋಷ",
      success: "ಯಶಸ್ವಿ",
      cancel: "ರದ್ದುಗೊಳಿಸಿ",
      save: "ಉಳಿಸಿ",
      delete: "ಅಳಿಸಿ",
      edit: "ಸಂಪಾದಿಸಿ",
      close: "ಮುಚ್ಚಿ",
      back: "ಹಿಂದೆ",
      next: "ಮುಂದೆ",
      submit: "ಸಲ್ಲಿಸಿ",
      upload: "ಅಪ್‌ಲೋಡ್",
      download: "ಡೌನ್‌ಲೋಡ್",
    },
    accessibility: {
      textToSpeech: "ಪಠ್ಯದಿಂದ-ಮಾತಿಗೆ",
      largeText: "ದೊಡ್ಡ ಪಠ್ಯ",
      highContrast: "ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್",
      reduceMotion: "ಚಲನೆ ಕಡಿಮೆ ಮಾಡಿ",
      dyslexiaFont: "ಡಿಸ್ಲೆಕ್ಸಿಯಾ-ಸ್ನೇಹಿ ಫಾಂಟ್",
      uiTheme: "UI ಥೀಮ್",
      calmTheme: "ಶಾಂತ",
      neoTheme: "ನಿಯೋ-ಬ್ರೂಟಲಿಸಂ",
      language: "ಭಾಷೆ",
      english: "English",
      kannada: "ಕನ್ನಡ",
      tamil: "தமிழ்",
    },
  },
  
  // Tamil
  ta: {
    nav: {
      home: "முகப்பு",
      startLearning: "கற்றலைத் தொடங்குங்கள்",
      progress: "முன்னேற்றம்",
      aiChat: "AI சாட்",
      dashboard: "டாஷ்போர்ட்",
      report: "அறிக்கை",
      support: "ஆதரவு",
      about: "எங்களைப் பற்றி",
      settings: "அமைப்புகள்",
      signIn: "உள்நுழை",
      signOut: "வெளியேறு",
    },
    home: {
      tag1: "நியூரோ-அடாப்டிவ்",
      tag2: "ஷிக்ஷக் 2.0",
      heroTitle1: "தனிப்பயன்",
      heroTitle2: "கற்றல்",
      heroTitle3: "ஒவ்வொரு குழந்தைக்கும்",
      heroSubtitle: "உங்கள் குழந்தை எப்படி கற்கிறது என்பதைப் புரிந்து கல்வியை மாற்றியமைக்கிறோம்.",
      startScreening: "ஸ்க்ரீனிங் தொடங்குங்கள்",
      ourMission: "எங்கள் நோக்கம்",
      researchBacked: "ஆராய்ச்சி ஆதரித்தது",
      builtOnScience: "அறிவியலில் கட்டமைக்கப்பட்டது.",
      scienceDescription: "அறிவாற்றல் அறிவியல் மற்றும் நவீன தொழில்நுட்பத்தை இணைத்து எளிய ஸ்க்ரீனிங் கருவிகளை உருவாக்குகிறோம்.",
      years: "ஆண்டுகள்",
      accuracy: "துல்லியம்",
      users: "பயனர்கள்",
      quick: "வேகமாக",
      signsOfDyslexia: "டிஸ்லெக்ஸியா அறிகுறிகள்",
      undiagnosed: "கண்டறியப்படாதவை",
      fastResult: "வேகமான முடிவு",
      ourMissionTitle: "எங்கள் நோக்கம்",
      empoweringMinds: "ஒவ்வொரு மனதையும் வலுப்படுத்துதல்.",
      missionDescription: "தொழில்நுட்பம் பயனருக்கு ஏற்ப மாற வேண்டும் என்று நம்புகிறோம். அடையாளம் காண்பதை எளிதாக்குவதே எங்கள் இலக்கு.",
      readFullStory: "முழு கதையைப் படியுங்கள்",
      features: {
        earlyDetection: "ஆரம்ப கண்டறிதல்",
        earlyDetectionDesc: "சான்று சார்ந்த ஸ்க்ரீனிங் மூலம் கற்றல் வேறுபாடுகளை ஆரம்பத்திலேயே கண்டறியுங்கள்.",
        personalized: "தனிப்பயன் கற்றல்",
        personalizedDesc: "தனிப்பட்ட கற்றல் பாணிகளுக்கு ஏற்ப பயிற்சிகள்.",
        educator: "ஆசிரியர் வளங்கள்",
        educatorDesc: "மாணவர் வளர்ச்சிக்கு ஆதரவளிக்கும் கருவிகள்.",
      },
      letLearn: "உங்கள் வழியில் கற்போம் 🚀",
      letLearnDesc: "நீங்கள் சிறப்பாக புரிந்துகொள்ளும் வழியில் கற்றலை மாற்றியமைக்கிறோம்.",
      continueSession: "அமர்வைத் தொடரவும்",
      testimonials: {
        title: "சமூக கருத்துகள்",
        quote1: "என் பாணியை புரிந்துகொண்டது எல்லாவற்றையும் எளிதாக்கியது.",
        author1: "சந்தோஷ்",
        quote2: "என் மகளுக்கு பாதுகாப்பான, ஆதரவான சூழல்.",
        author2: "ஹர்ஷ்வர்தன்",
        quote3: "களைப்பில்லாமல் புரிந்துகொண்டதாக உணர்கிறேன்.",
        author3: "புவனேஸ்வரி",
      },
      contact: {
        title: "தொடர்பு கொள்ளுங்கள்",
        subtitle: "உங்களிடமிருந்து கேட்க விரும்புகிறோம்.",
        name: "பெயர்",
        email: "மின்னஞ்சல்",
        message: "செய்தி",
        send: "அனுப்பு",
        sent: "செய்தி அனுப்பப்பட்டது!",
        sentDesc: "விரைவில் உங்களை தொடர்புகொள்வோம்.",
      },
      footer: {
        rights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
        privacy: "தனியுரிமை",
        terms: "விதிமுறைகள்",
        github: "GitHub",
      },
    },
    common: {
      loading: "ஏற்றுகிறது...",
      error: "பிழை",
      success: "வெற்றி",
      cancel: "ரத்துசெய்",
      save: "சேமி",
      delete: "நீக்கு",
      edit: "திருத்து",
      close: "மூடு",
      back: "பின்",
      next: "அடுத்து",
      submit: "சமர்ப்பி",
      upload: "பதிவேற்று",
      download: "பதிவிறக்கு",
    },
    accessibility: {
      textToSpeech: "உரையிலிருந்து-பேச்சு",
      largeText: "பெரிய உரை",
      highContrast: "உயர் காண்ட்ராஸ்ட்",
      reduceMotion: "இயக்கத்தை குறை",
      dyslexiaFont: "டிஸ்லெக்ஸியா-நட்பு எழுத்துரு",
      uiTheme: "UI தீம்",
      calmTheme: "அமைதி",
      neoTheme: "நியோ-பிரூட்டலிசம்",
      language: "மொழி",
      english: "English",
      kannada: "ಕನ್ನಡ",
      tamil: "தமிழ்",
    },
  },
};
