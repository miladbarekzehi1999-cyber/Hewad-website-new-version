import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const page = req.query.page || "1";
    const perPage = req.query.per_page || "25";

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true`
    );

    if (!response.ok) throw new Error("Failed to fetch CoinGecko");

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "خطا در دریافت داده‌های رمزارز" });
  }
}
