import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=AFN");

    if (!response.ok) throw new Error("Failed to fetch FX");

    const data = await response.json();
    res.status(200).json({ afnRate: data.rates.AFN });
  } catch (err) {
    res.status(500).json({ error: "خطا در دریافت نرخ تبدیل AFN" });
  }
}
