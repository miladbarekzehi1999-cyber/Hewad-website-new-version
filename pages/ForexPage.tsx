import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// Extended forex pairs list
const allForexPairs: ForexPair[] = [
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
  // Additional pairs
  { id: "eurchf", symbol: "EUR/CHF", name: "Euro / Swiss Franc", nameFa: "یورو / فرانک سوئیس", namePs: "یورو / سویسي فرانک", rate: 0.9592, change24h: 0.03, high24h: 0.9612, low24h: 0.9568, sparklineData: generateSparkline(0.9592) },
  { id: "euraud", symbol: "EUR/AUD", name: "Euro / Australian Dollar", nameFa: "یورو / دالر آسترالیا", namePs: "یورو / آسترالیایي ډالر", rate: 1.6695, change24h: -0.17, high24h: 1.6752, low24h: 1.6635, sparklineData: generateSparkline(1.6695, 0.003) },
  { id: "eurcad", symbol: "EUR/CAD", name: "Euro / Canadian Dollar", nameFa: "یورو / دالر کانادا", namePs: "یورو / کاناډایي ډالر", rate: 1.5105, change24h: -0.03, high24h: 1.5142, low24h: 1.5065, sparklineData: generateSparkline(1.5105, 0.003) },
  { id: "gbpchf", symbol: "GBP/CHF", name: "British Pound / Swiss Franc", nameFa: "پوند / فرانک سوئیس", namePs: "پونډ / سویسي فرانک", rate: 1.1235, change24h: -0.04, high24h: 1.1268, low24h: 1.1198, sparklineData: generateSparkline(1.1235, 0.003) },
  { id: "gbpaud", symbol: "GBP/AUD", name: "British Pound / Australian Dollar", nameFa: "پوند / دالر آسترالیا", namePs: "پونډ / آسترالیایي ډالر", rate: 1.9555, change24h: -0.24, high24h: 1.9625, low24h: 1.9485, sparklineData: generateSparkline(1.9555, 0.003) },
  { id: "gbpcad", symbol: "GBP/CAD", name: "British Pound / Canadian Dollar", nameFa: "پوند / دالر کانادا", namePs: "پونډ / کاناډایي ډالر", rate: 1.7692, change24h: -0.10, high24h: 1.7745, low24h: 1.7638, sparklineData: generateSparkline(1.7692, 0.003) },
  { id: "audcad", symbol: "AUD/CAD", name: "Australian Dollar / Canadian Dollar", nameFa: "دالر آسترالیا / دالر کانادا", namePs: "آسترالیایي ډالر / کاناډایي ډالر", rate: 0.9045, change24h: 0.14, high24h: 0.9078, low24h: 0.9012, sparklineData: generateSparkline(0.9045) },
  { id: "audjpy", symbol: "AUD/JPY", name: "Australian Dollar / Japanese Yen", nameFa: "دالر آسترالیا / ین جاپان", namePs: "آسترالیایي ډالر / جاپاني ین", rate: 97.35, change24h: 0.09, high24h: 97.82, low24h: 96.88, sparklineData: generateSparkline(97.35, 0.003) },
  { id: "audnzd", symbol: "AUD/NZD", name: "Australian Dollar / New Zealand Dollar", nameFa: "دالر آسترالیا / دالر نیوزیلند", namePs: "آسترالیایي ډالر / نیوزیلنډي ډالر", rate: 1.0993, change24h: 0.11, high24h: 1.1025, low24h: 1.0958, sparklineData: generateSparkline(1.0993) },
  { id: "nzdjpy", symbol: "NZD/JPY", name: "New Zealand Dollar / Japanese Yen", nameFa: "دالر نیوزیلند / ین جاپان", namePs: "نیوزیلنډي ډالر / جاپاني ین", rate: 88.55, change24h: -0.02, high24h: 88.98, low24h: 88.12, sparklineData: generateSparkline(88.55, 0.003) },
  { id: "cadjpy", symbol: "CAD/JPY", name: "Canadian Dollar / Japanese Yen", nameFa: "دالر کانادا / ین جاپان", namePs: "کاناډایي ډالر / جاپاني ین", rate: 107.62, change24h: -0.05, high24h: 108.05, low24h: 107.18, sparklineData: generateSparkline(107.62, 0.003) },
  { id: "chfjpy", symbol: "CHF/JPY", name: "Swiss Franc / Japanese Yen", nameFa: "فرانک سوئیس / ین جاپان", namePs: "سویسي فرانک / جاپاني ین", rate: 169.45, change24h: -0.11, high24h: 170.02, low24h: 168.88, sparklineData: generateSparkline(169.45, 0.003) },
  { id: "usdsgd", symbol: "USD/SGD", name: "US Dollar / Singapore Dollar", nameFa: "دالر / دالر سنگاپور", namePs: "ډالر / سنګاپوري ډالر", rate: 1.3425, change24h: -0.08, high24h: 1.3458, low24h: 1.3392, sparklineData: generateSparkline(1.3425, 0.003) },
  { id: "usdhkd", symbol: "USD/HKD", name: "US Dollar / Hong Kong Dollar", nameFa: "دالر / دالر هنگ‌کنگ", namePs: "ډالر / هانګ کانګ ډالر", rate: 7.8125, change24h: 0.01, high24h: 7.8145, low24h: 7.8105, sparklineData: generateSparkline(7.8125, 0.001) },
  { id: "usdcny", symbol: "USD/CNY", name: "US Dollar / Chinese Yuan", nameFa: "دالر / یوان چین", namePs: "ډالر / چینایي یوان", rate: 7.2458, change24h: -0.06, high24h: 7.2512, low24h: 7.2398, sparklineData: generateSparkline(7.2458, 0.002) },
];

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

const ForexPage = () => {
  const [pairs, setPairs] = useState<ForexPair[]>(allForexPairs);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const { language, t } = useLanguage();

  // Filter based on search
  const filteredPairs = pairs.filter(pair =>
    pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pair.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pair.nameFa.includes(searchQuery) ||
    pair.namePs.includes(searchQuery)
  );

  // Pagination
  const totalPages = Math.ceil(filteredPairs.length / itemsPerPage);
  const paginatedPairs = filteredPairs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <TopBar />

      <main className="flex-1 container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">
            {t("nav.home")}
          </Link>
          <ArrowRight className="h-4 w-4 rotate-180" />
          <span className="text-foreground">{t("forex.title")}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{t("forex.title")}</h1>
            <p className="text-muted-foreground">
              {language === "fa" 
                ? `نرخ لحظه‌ای ${filteredPairs.length} جفت ارز فارکس`
                : `د ${filteredPairs.length} فارکس جوړو ژوندی نرخونه`
              }
            </p>
          </div>
          <Input
            placeholder={language === "fa" ? "جستجوی جفت ارز..." : "د جوړې لټون..."}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-xs"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">#</th>
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
              {paginatedPairs.map((pair, index) => {
                const isPositive = pair.change24h >= 0;
                return (
                  <tr key={pair.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
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
          {paginatedPairs.map((pair, index) => {
            const isPositive = pair.change24h >= 0;
            return (
              <div key={pair.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </span>
                    <div>
                      <p className="font-bold">{pair.symbol}</p>
                      <p className="text-xs text-muted-foreground">
                        {language === "fa" ? pair.nameFa : pair.namePs}
                      </p>
                    </div>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              {language === "fa" ? "قبلی" : "مخکینی"}
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              {language === "fa" ? "بعدی" : "راتلونکی"}
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ForexPage;
