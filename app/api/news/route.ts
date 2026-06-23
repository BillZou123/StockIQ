import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any = await yahooFinance.search(symbol, {
      quotesCount: 0,
      newsCount: 10,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const news = (results.news ?? []).map((n: any) => ({
      uuid: n.uuid as string,
      title: n.title as string,
      publisher: n.publisher as string,
      link: n.link as string,
      providerPublishTime: n.providerPublishTime,
      relatedTickers: (n.relatedTickers ?? []) as string[],
    }));
    return NextResponse.json({ news });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch news";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
