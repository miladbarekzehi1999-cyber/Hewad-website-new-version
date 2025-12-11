import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface AssetData {
  id: string;
  nameFa: string;
  namePs: string;
  price: number;
  change: number;
  changePercent: number;
}

// Mock data for 5 main assets
const initialAssets: AssetData[] = [
  { id: "gold_ounce", nameFa: "انس طلا", namePs: "د سرو زرو اونس", price: 4197.13, change: 0.12, changePercent: 0 },
  { id: "usd", nameFa: "دالر", namePs: "ډالر", price: 70.50, change: 0.15, changePercent: 0.21 },
  { id: "bitcoin", nameFa: "بیت کوین", namePs: "بټ کوین", price: 89541.04, change: 114.17, changePercent: 0.13 },
  { id: "tether", nameFa: "تتر", namePs: "تیتر", price: 70.45, change: 0.02, changePercent: 0.03 },
  { id: "brent", nameFa: "نفت برنت", namePs: "برینټ تېل", price: 63.75, change: 0.46, changePercent: 0.73 },
];

// Convert number to Persian digits
const toPersianDigits = (num: string | number): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
};

const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Convert Gregorian to Solar Hijri (Jalali)
const toJalali = (gy: number, gm: number, gd: number): [number, number, number] => {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy = gy <= 1600 ? gy - 621 : gy - 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days = 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  jy += Math.floor((days - 1) / 365);
  if (days > 365) days = (days - 1) % 365;
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
};

const jalaliMonthsFarsi = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const jalaliMonthsPashto = [
  'وری', 'غویی', 'غبرګولی', 'چنګاښ', 'زمری', 'وږی',
  'تله', 'لړم', 'لیندۍ', 'مرغومی', 'سلواغه', 'کب'
];

const persianWeekdays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
const pashtoWeekdays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'څلورشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
const englishWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const englishMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const TopBar = () => {
  const [assets, setAssets] = useState<AssetData[]>(initialAssets);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { language } = useLanguage();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => {
        const changeAmount = (Math.random() - 0.5) * asset.price * 0.001;
        const newPrice = asset.price + changeAmount;
        const newChangePercent = asset.changePercent + (Math.random() - 0.5) * 0.02;
        return {
          ...asset,
          price: newPrice,
          change: asset.change + changeAmount * 0.1,
          changePercent: newChangePercent
        };
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Format time
  const hours = toPersianDigits(currentTime.getHours().toString().padStart(2, '0'));
  const minutes = toPersianDigits(currentTime.getMinutes().toString().padStart(2, '0'));
  const seconds = toPersianDigits(currentTime.getSeconds().toString().padStart(2, '0'));
  const timeString = `${hours}:${minutes}:${seconds}`;

  // Solar Hijri date
  const [jy, jm, jd] = toJalali(
    currentTime.getFullYear(),
    currentTime.getMonth() + 1,
    currentTime.getDate()
  );
  
  const jalaliMonths = language === "fa" ? jalaliMonthsFarsi : jalaliMonthsPashto;
  const weekdays = language === "fa" ? persianWeekdays : pashtoWeekdays;
  const jalaliWeekday = weekdays[currentTime.getDay()];
  const jalaliDate = `${jalaliWeekday}، ${toPersianDigits(jd)} ${jalaliMonths[jm - 1]} ${toPersianDigits(jy)}`;

  // Gregorian date
  const gregorianWeekday = englishWeekdays[currentTime.getDay()];
  const gregorianDay = currentTime.getDate().toString().padStart(2, '0');
  const gregorianMonth = englishMonths[currentTime.getMonth()];
  const gregorianYear = currentTime.getFullYear();
  const gregorianDate = `${gregorianWeekday}, ${gregorianDay} ${gregorianMonth} ${gregorianYear}`;

  const cityLabel = language === "fa" ? "کابل" : "کابل";

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />;
    if (change < 0) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-chart-up";
    if (change < 0) return "text-chart-down";
    return "text-muted-foreground";
  };

  return (
    <div className="sticky top-[57px] z-40">
      {/* Date/Time Bar */}
      <div className="h-9 bg-[#0f172a] dark:bg-[#0f172a] border-b border-[#1e293b] flex items-center justify-center text-xs">
        <div className="flex items-center gap-0 text-[#e2e8f0]">
          {/* Desktop view */}
          <div className="hidden sm:flex items-center">
            <span>{cityLabel}: <span className="text-white font-medium">{timeString}</span></span>
            <span className="mx-3 text-[#475569]">│</span>
            <span className="text-white">{jalaliDate}</span>
            <span className="mx-3 text-[#475569]">│</span>
            <span className="text-white" dir="ltr">{gregorianDate}</span>
          </div>
          
          {/* Mobile view */}
          <div className="flex sm:hidden items-center gap-2 text-[11px]">
            <span>{cityLabel}: <span className="text-white font-medium">{timeString}</span></span>
            <span className="text-[#475569]">│</span>
            <span className="text-white">{jalaliDate}</span>
          </div>
        </div>
      </div>

      {/* Asset Ticker */}
      <div className="bg-card border-b border-border">
        <div className="container">
          <div className="flex items-stretch justify-between overflow-x-auto scrollbar-hide">
            {assets.map((asset, index) => (
              <div 
                key={asset.id} 
                className={`flex-1 min-w-[120px] py-2.5 px-3 flex flex-col items-center justify-center ${
                  index !== assets.length - 1 ? "border-l border-border" : ""
                }`}
              >
                {/* Asset Name with Icon */}
                <div className={`flex items-center gap-1 text-xs mb-0.5 ${getChangeColor(asset.changePercent)}`}>
                  {getChangeIcon(asset.changePercent)}
                  <span className="font-medium">
                    {language === "fa" ? asset.nameFa : asset.namePs}
                  </span>
                </div>
                
                {/* Price */}
                <div className="text-base font-bold tabular-nums text-foreground">
                  {toPersianDigits(formatPrice(asset.price))}
                </div>
                
                {/* Change */}
                <div className={`flex items-center gap-1.5 text-[10px] ${getChangeColor(asset.changePercent)}`}>
                  <span className="tabular-nums">
                    ({asset.changePercent >= 0 ? "" : "-"}{toPersianDigits(Math.abs(asset.changePercent).toFixed(2))}%)
                  </span>
                  <span className="tabular-nums">
                    {asset.change >= 0 ? "" : "-"}{toPersianDigits(Math.abs(asset.change).toFixed(2))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
