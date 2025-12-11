import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Loader2, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: { price: number[] };
  market_cap_rank: number;
}

// Persian names
const cryptoNamesPersian: Record<string, string> = {
  bitcoin: "بیت‌کوین",
  ethereum: "اتریوم",
  tether: "تتر",
  binancecoin: "بایننس کوین",
  solana: "سولانا",
  ripple: "ریپل",
  "usd-coin": "یو‌اس‌دی کوین",
  dogecoin: "دوج‌کوین",
  cardano: "کاردانو",
  tron: "ترون",
};

function toPersianDigits(num: string | number): string {
  const map = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return String(num).replace(/[0-9]/g, (d) => map[parseInt(d)]);
}

function MiniSparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  if (!data || data.length < 2) return null;

  const samples = data.filter((_, i) => i % Math.ceil(data.length / 20) === 0).slice(-20);
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const range = max - min || 1;

  const width = 80;
  const height = 24;

  const points = samples
    .map((value, index) => {
      const x = (index / (samples.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height}>
      <polyline
        points={points}
        fill="none"
        strokeWidth={1.5}
        className={isPositive ? "stroke-chart-up" : "stroke-chart-down"}
      />
    </svg>
  );
}

const CryptoPage = () => {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [usdToAfn, setUsdToAfn] = useState(70.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1); // For API pagination
  const perPage = 25; // Coins per page

  // Fetch coins from CoinGecko with dynamic page
  const fetchCryptos = async (pageNum: number = 1) => {
    try {
      setLoading(true);

      const cryptoRes = await fetch(
        `/api/crypto/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${pageNum}&sparkline=true`
      );
      const fxRes = await fetch(`/api/fx/latest?base=USD&symbols=AFN`);

      if (!cryptoRes.ok || !fxRes.ok) throw new Error("Failed to fetch");

      const cryptoData: CryptoData[] = await cryptoRes.json();
      const fxData = await fxRes.json();

      setUsdToAfn(fxData?.rates?.AFN || 70.5);

      // Append new data if page > 1
      setCryptos(prev => pageNum === 1 ? cryptoData : [...prev, ...cryptoData]);

      setError(null);
    } catch (err) {
      setError("خطا در دریافت داده‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptos(page);

    const interval = setInterval(() => fetchCryptos(page), 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [page]);

  const filteredCryptos = cryptos.filter(
    c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasMore = filteredCryptos.length % perPage === 0; // show more if current page full

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <TopBar />

      <main className="flex-1">
        <section className="container py-8 md:py-12">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">اسعار دیجیتال</h1>
              <p className="text-sm text-muted-foreground">قیمت لحظه‌ای رمزارزها</p>
            </div>

            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="جستجوی رمزارز..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-12 text-muted-foreground">{error}</div>
          )}

          {/* Desktop Table */}
          {!loading && !error && (
            <>
              <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/30 border-b">
                    <tr>
                      <th className="px-4 py-3 text-right text-muted-foreground">#</th>
                      <th className="px-4 py-3 text-right text-muted-foreground">رمزارز</th>
                      <th className="px-4 py-3 text-right text-muted-foreground">USD</th>
                      <th className="px-4 py-3 text-right text-muted-foreground">AFN</th>
                      <th className="px-4 py-3 text-right text-muted-foreground">تغییر</th>
                      <th className="px-4 py-3 text-right text-muted-foreground">نمودار</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCryptos.map((crypto) => {
                      const isPositive = crypto.price_change_percentage_24h >= 0;
                      const afnPrice = crypto.current_price * usdToAfn;

                      return (
                        <tr key={crypto.id} className="border-b hover:bg-muted/20">
                          <td className="px-4 py-3">{toPersianDigits(crypto.market_cap_rank)}</td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={crypto.image} className="w-8 h-8 rounded-full" />
                              <div>
                                <p>{cryptoNamesPersian[crypto.id] || crypto.name}</p>
                                <span className="text-xs text-muted-foreground">
                                  {crypto.symbol.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3 font-bold">
                            ${crypto.current_price.toLocaleString()}
                          </td>

                          <td className="px-4 py-3">
                            {toPersianDigits(afnPrice.toFixed(0))} ؋
                          </td>

                          <td className="px-4 py-3">
                            <div className={`flex items-center gap-1 ${isPositive ? "text-chart-up" : "text-chart-down"}`}>
                              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                              {toPersianDigits(Math.abs(crypto.price_change_percentage_24h).toFixed(2))}%
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <MiniSparkline
                              data={crypto.sparkline_in_7d?.price || []}
                              isPositive={isPositive}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {filteredCryptos.map((crypto) => {
                  const isPositive = crypto.price_change_percentage_24h >= 0;
                  const afnPrice = crypto.current_price * usdToAfn;

                  return (
                    <div key={crypto.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{toPersianDigits(crypto.market_cap_rank)}</span>
                          <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="font-medium">{cryptoNamesPersian[crypto.id] || crypto.name}</p>
                            <p className="text-xs text-muted-foreground uppercase">{crypto.symbol}</p>
                          </div>
                        </div>

                        <div className={`flex items-center gap-1 ${isPositive ? 'text-chart-up' : 'text-chart-down'}`}>
                          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          <span className="font-medium text-sm">{toPersianDigits(Math.abs(crypto.price_change_percentage_24h).toFixed(2))}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">USD</p>
                          <p className="font-bold">${crypto.current_price.toLocaleString()}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-muted-foreground">AFN</p>
                          <p className="font-medium">{toPersianDigits(afnPrice.toFixed(0))} ؋</p>
                        </div>
                      </div>

                      {/* Mini Sparkline */}
                      <div className="mt-2">
                        <MiniSparkline data={crypto.sparkline_in_7d?.price || []} isPositive={isPositive} />
                      </div>
                    </div>
                  );
                })}

                {/* Show More Button */}
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={() => {
                        const nextPage = page + 1;
                        setPage(nextPage);
                        fetchCryptos(nextPage);
                      }}
                      className="bg-chart-up text-white px-8"
                    >
                      نمایش بیشتر
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CryptoPage;
