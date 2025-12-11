import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface ForexPair {
  id: string;
  symbol: string;
  name: string;
  nameFa: string;
  namePs: string;
  rate: number;
  change24h: number;
  high24h: number;
  low24h: number;
  sparklineData: number[];
}

function generateSparkline(base: number, volatility: number = 0.005): number[] {
  const data: number[] = [];
  let current = base;
  for (let i = 0; i < 24; i++) {
    const change = (Math.random() - 0.5) * 2 * volatility * current;
    current += change;
    data.push(current);
  }
  return data;
}

// Major forex pairs with mock data
const forexPairs: ForexPair[] = [
  { id: "eurusd", symbol: "EUR/USD", name: "Euro / US Dollar", nameFa: "یورو / دالر", namePs: "یورو / ډالر", rate: 1.0872, change24h: 0.15, high24h: 1.0895, low24h: 1.0845, sparklineData: generateSparkline(1.0872) },
  { id: "usdjpy", symbol: "USD/JPY", name: "US Dollar / Japanese Yen", nameFa: "دالر / ین جاپان", namePs: "ډالر / جاپاني ین", rate: 149.52, change24h: -0.23, high24h: 150.12, low24h: 149.05, sparklineData: generateSparkline(149.52, 0.003) },
  { id: "gbpusd", symbol: "GBP/USD", name: "British Pound / US Dollar", nameFa: "پوند / دالر", namePs: "پونډ / ډالر", rate: 1.2734, change24h: 0.08, high24h: 1.2768, low24h: 1.2698, sparklineData: generateSparkline(1.2734) },
  { id: "usdchf", symbol: "USD/CHF", name: "US Dollar / Swiss Franc", nameFa: "دالر / فرانک سوئیس", namePs: "ډالر / سویسي فرانک", rate: 0.8823, change24h: -0.12, high24h: 0.8856, low24h: 0.8798, sparklineData: generateSparkline(0.8823) },
  { id: "audusd", symbol: "AUD/USD", name: "Australian Dollar / US Dollar", nameFa: "دالر آسترالیا / دالر", namePs: "آسترالیایي ډالر / ډالر", rate: 0.6512, change24h: 0.32, high24h: 0.6545, low24h: 0.6478, sparklineData: generateSparkline(0.6512) },
  { id: "usdcad", symbol: "USD/CAD", name: "US Dollar / Canadian Dollar", nameFa: "دالر / دالر کانادا", namePs: "ډالر / کاناډایي ډالر", rate: 1.3892, change24h: -0.18, high24h: 1.3928, low24h: 1.3856, sparklineData: generateSparkline(1.3892, 0.003) },
  { id: "nzdusd", symbol: "NZD/USD", name: "New Zealand Dollar / US Dollar", nameFa: "دالر نیوزیلند / دالر", namePs: "نیوزیلنډي ډالر / ډالر", rate: 0.5923, change24h: 0.21, high24h: 0.5956, low24h: 0.5889, sparklineData: generateSparkline(0.5923) },
  { id: "eurgbp", symbol: "EUR/GBP", name: "Euro / British Pound", nameFa: "یورو / پوند", namePs: "یورو / پونډ", rate: 0.8538, change24h: 0.05, high24h: 0.8562, low24h: 0.8512, sparklineData: generateSparkline(0.8538) },
  { id: "eurjpy", symbol: "EUR/JPY", name: "Euro / Japanese Yen", nameFa: "یورو / ین جاپان", namePs: "یورو / جاپاني ین", rate: 162.58, change24h: -0.09, high24h: 163.12, low24h: 162.05, sparklineData: generateSparkline(162.58, 0.003) },
  { id: "gbpjpy", symbol: "GBP/JPY", name: "British Pound / Japanese Yen", nameFa: "پوند / ین جاپان", namePs: "پونډ / جاپاني ین", rate: 190.34, change24h: 0.14, high24h: 191.02, low24h: 189.68, sparklineData: generateSparkline(190.34, 0.003) },
];

function toPersianDigits(num: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, d => persianDigits[parseInt(d)]);
}

function MiniSparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  if (!data || data.length < 2) return null;
  const samples = data.filter((_, i) => i % Math.ceil(data.length / 20) === 0).slice(-20);
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  const points = samples.map((value, index) => {
    const x = index / (samples.length - 1) * width;
    const y = height - (value - min) / range * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline 
        points={points} 
        fill="none" 
        strokeWidth={1.5} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={isPositive ? "stroke-chart-up" : "stroke-chart-down"} 
      />
    </svg>
  );
}

export function ForexSection() {
  const [pairs, setPairs] = useState<ForexPair[]>(forexPairs);
  const [loading, setLoading] = useState(false);
  const { language, t } = useLanguage();

  // Simulate data refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setPairs(prev => prev.map(pair => ({
        ...pair,
        rate: pair.rate * (1 + (Math.random() - 0.5) * 0.001),
        change24h: pair.change24h + (Math.random() - 0.5) * 0.1,
        sparklineData: [...pair.sparklineData.slice(1), pair.rate * (1 + (Math.random() - 0.5) * 0.001)]
      })));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section id="forex" className="container py-8 md:py-12">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="forex" className="container py-8 md:py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">{t("forex.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {language === "fa" ? "نرخ لحظه‌ای ۱۰ جفت ارز اصلی فارکس" : "د غوره ۱۰ فارکس جوړو ژوندی نرخونه"}
          </p>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                {language === "fa" ? "جفت ارز" : "د اسعارو جوړه"}
              </th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                {language === "fa" ? "نرخ فعلی" : "اوسنی نرخ"}
              </th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                {language === "fa" ? "تغییر ۲۴ ساعته" : "۲۴ ساعته بدلون"}
              </th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                {language === "fa" ? "بالاترین" : "لوړ"}
              </th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                {language === "fa" ? "پایین‌ترین" : "ټیټ"}
              </th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                {language === "fa" ? "نمودار" : "چارټ"}
              </th>
            </tr>
          </thead>
          <tbody>
            {pairs.map(pair => {
              const isPositive = pair.change24h >= 0;
              return (
                <tr key={pair.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-bold">{pair.symbol}</p>
                      <p className="text-xs text-muted-foreground">
                        {language === "fa" ? pair.nameFa : pair.namePs}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold tabular-nums">
                    {pair.rate.toFixed(pair.rate > 100 ? 2 : 4)}
                  </td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1 ${isPositive ? 'text-chart-up' : 'text-chart-down'}`}>
                      {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="font-medium tabular-nums">
                        {isPositive ? "+" : ""}{pair.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-chart-up tabular-nums">
                    {pair.high24h.toFixed(pair.high24h > 100 ? 2 : 4)}
                  </td>
                  <td className="px-4 py-3 text-chart-down tabular-nums">
                    {pair.low24h.toFixed(pair.low24h > 100 ? 2 : 4)}
                  </td>
                  <td className="px-4 py-3">
                    <MiniSparkline data={pair.sparklineData} isPositive={isPositive} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {pairs.map(pair => {
          const isPositive = pair.change24h >= 0;
          return (
            <div key={pair.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold">{pair.symbol}</p>
                  <p className="text-xs text-muted-foreground">
                    {language === "fa" ? pair.nameFa : pair.namePs}
                  </p>
                </div>
                <div className={`flex items-center gap-1 ${isPositive ? 'text-chart-up' : 'text-chart-down'}`}>
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-medium text-sm tabular-nums">
                    {isPositive ? "+" : ""}{pair.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{language === "fa" ? "نرخ" : "نرخ"}</p>
                  <p className="font-bold tabular-nums">{pair.rate.toFixed(pair.rate > 100 ? 2 : 4)}</p>
                </div>
                <div className="flex gap-4 text-left">
                  <div>
                    <p className="text-xs text-muted-foreground">{language === "fa" ? "بالا" : "لوړ"}</p>
                    <p className="text-sm text-chart-up tabular-nums">{pair.high24h.toFixed(pair.high24h > 100 ? 2 : 4)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{language === "fa" ? "پایین" : "ټیټ"}</p>
                    <p className="text-sm text-chart-down tabular-nums">{pair.low24h.toFixed(pair.low24h > 100 ? 2 : 4)}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* More Button */}
      <div className="flex justify-center mt-8">
        <Button asChild className="bg-chart-up hover:bg-chart-up/90 text-background font-medium px-8">
          <Link to="/forex">{t("forex.more")}</Link>
        </Button>
      </div>
    </section>
  );
}
