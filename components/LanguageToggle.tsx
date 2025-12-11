import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "fa" ? "ps" : "fa");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
      aria-label={language === "fa" ? "Switch to Pashto" : "Switch to Dari"}
    >
      <Globe className="h-[18px] w-[18px]" />
      <span className="font-amiri">
        {language === "fa" ? "پښتو" : "دری"}
      </span>
    </button>
  );
}
