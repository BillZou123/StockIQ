import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });

  try {
    const data = await yahooFinance.quoteSummary(symbol, {
      modules: [
        "incomeStatementHistory",
        "earningsHistory",
      ],
    });

    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch financials";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
