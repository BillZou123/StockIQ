import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });

  try {
    const [quote, summary] = await Promise.all([
      yahooFinance.quote(symbol, {}),
      yahooFinance.quoteSummary(symbol, {
        modules: [
          "summaryDetail",
          "financialData",
          "defaultKeyStatistics",
          "assetProfile",
        ],
      }),
    ]);

    return NextResponse.json({ quote, summary });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch fundamentals";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
