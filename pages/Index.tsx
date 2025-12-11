import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Header } from "@/components/Header";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { CurrencyCard } from "@/components/CurrencyCard";
import { CurrencyTable } from "@/components/CurrencyTable";
import { CryptoSection } from "@/components/CryptoSection";
import { ForexSection } from "@/components/ForexSection";
import { Button } from "@/components/ui/button";
import { currencyData } from "@/data/currencies";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const { t, language } = useLanguage();

  const translatedCurrencyData = currencyData.map(currency => {
    const code = currency.pair.split('/')[0].toLowerCase();
    return {
      ...currency,
      pairLabel: t(code) || currency.pairLabel
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
     

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container py-12 md:py-20">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center">
                {language === "fa" 
                  ? <>نرخ لحظه‌ای اسعار در برابر <span className="text-primary">افغانی</span></>
                  : <>د <span className="text-primary">افغانۍ</span> په وړاندې د اسعارو ژوندی نرخونه</>
                }
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {language === "fa"
                  ? "مشاهده نرخ زنده ارزهای بین‌المللی در برابر افغانی با به‌روزرسانی لحظه‌ای"
                  : "د نړیوالو اسعارو ژوندی نرخونه د افغانۍ په وړاندې د ژوندي تازه کولو سره"
                }
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="rounded-lg bg-card border border-border p-4">
                  <p className="text-2xl font-bold text-primary">۱۲۰+</p>
                  <p className="text-xs text-muted-foreground">
                    {language === "fa" ? "اسعار" : "اسعار"}
                  </p>
                </div>
                <div className="rounded-lg bg-card border border-border p-4">
                  <p className="text-2xl font-bold text-chart-up">۲۴/۷</p>
                  <p className="text-xs text-muted-foreground">
                    {language === "fa" ? "بروزرسانی" : "تازه کول"}
                  </p>
                </div>
                <div className="rounded-lg bg-card border border-border p-4">
                  <p className="text-2xl font-bold">
                    {language === "fa" ? "رایگان" : "وړیا"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === "fa" ? "دسترسی" : "لاسرسی"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
          </div>
        </section>

        {/* Currency Section */}
        <section id="currencies" className="container py-8 md:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">{t("currency.title")}</h2>
              <p className="text-sm text-muted-foreground">
                {language === "fa" 
                  ? `قیمت لحظه‌ای ${currencyData.length} جفت ارز`
                  : `د ${currencyData.length} اسعارو جوړو ژوندی قیمتونه`
                }
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
              <Button 
                variant={viewMode === "grid" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("grid")} 
                className="gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {language === "fa" ? "کارت" : "کارت"}
                </span>
              </Button>
              <Button 
                variant={viewMode === "table" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("table")} 
                className="gap-2"
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {language === "fa" ? "جدول" : "جدول"}
                </span>
              </Button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {translatedCurrencyData.map((currency, index) => (
                <div 
                  key={currency.pair} 
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CurrencyCard {...currency} />
                </div>
              ))}
            </div>
          ) : (
            <CurrencyTable currencies={translatedCurrencyData} />
          )}
        </section>

        {/* Forex Section */}
        <ForexSection />

        {/* Crypto Section */}
        <CryptoSection />

        {/* About Section */}
        <section id="about" className="border-t border-border bg-card/30">
          <div className="container py-12 md:py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t("nav.about")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {language === "fa"
                  ? "هیواد یک پلتفرم و وبسایت آنلاین برای نمایش نرخ لحظه‌ای اسعار بین‌المللی و دیجیتال در برابر پول افغانی است. هدف ما ارائه اطلاعات دقیق و به‌روز برای کمک به تصمیم‌گیری بهتر در معاملات ارزی شماست."
                  : "هیواد یوه آنلاین پلیټفارم او ویبپاڼه ده چې د افغانۍ په وړاندې د نړیوالو او ډیجیټل اسعارو ژوندی نرخونه ښیي. زموږ موخه دا ده چې ستاسو د اسعارو معاملو کې د ښه پریکړو لپاره دقیق او تازه معلومات وړاندې کړو."
                }
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-chart-up" />
                  {language === "fa" ? "داده‌های لحظه‌ای" : "ژوندي معلومات"}
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {language === "fa" ? "رابط کاربری ساده" : "ساده انٹرفیس"}
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-chart-neutral" />
                  {language === "fa" ? "بدون نیاز به ثبت‌نام" : "د نوم لیکنې پرته"}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
