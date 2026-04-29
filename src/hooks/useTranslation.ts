import { useAccessibility } from "@/components/AccessibilitySettings";
import { translations, Language, Translation } from "@/lib/translations";

/**
 * Hook to get current language translations
 * Usage: const { t, language } = useTranslation();
 */
export const useTranslation = (): { t: Translation; language: Language } => {
  const { settings } = useAccessibility();
  const language = (settings.language as Language) || 'en';
  
  return {
    t: translations[language],
    language,
  };
};
