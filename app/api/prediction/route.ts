import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

function sma(prices: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);
    result.push(slice.reduce((a, b) => a + b, 0) / period);
  }
  return result;
}

function rsi(prices: number[], period = 14): number[] {
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? -diff : 0);
  }
  const result: number[] = [];
  for (let i = period - 1; i < gains.length; i++) {
    const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    result.push(100 - 100 / (1 + rs));
  }
  return result;
}

function bollingerBands(prices: number[], period = 20, stdDev = 2) {
  const middle = sma(prices, period);
  const upper: number[] = [];
  const lower: number[] = [];
  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);
    const avg = middle[i - (period - 1)];
    const variance = slice.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / period;
    const sd = Math.sqrt(variance);
    upper.push(avg + stdDev * sd);
    lower.push(avg - stdDev * sd);
  }
  return { middle, upper, lower };
}

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });

  try {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 6);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const historical: any[] = await (yahooFinance.historical as any)(symbol, {
      period1: fromDate.toISOString().split("T")[0],
      period2: toDate.toISOString().split("T")[0],
      interval: "1d",
    });

    const sorted = [...historical].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const closes: number[] = sorted.map((d) => d.close as number);
    const dates: string[] = sorted.map((d) => new Date(d.date).toISOString().split("T")[0]);
    const volumes: number[] = sorted.map((d) => d.volume as number);

    const sma20 = sma(closes, 20);
    const sma50 = sma(closes, 50);
    const rsiValues = rsi(closes);
    const bb = bollingerBands(closes, 20);

    const latestClose = closes[closes.length - 1];
    const latestSma20 = sma20[sma20.length - 1];
    const latestSma50 = sma50.length > 0 ? sma50[sma50.length - 1] : null;
    const latestRsi = rsiValues[rsiValues.length - 1];
    const latestBbUpper = bb.upper[bb.upper.length - 1];
    const latestBbLower = bb.lower[bb.lower.length - 1];

    const signals: { indicator: string; signal: string; value: string; interpretation: string }[] = [];

    if (latestSma50 !== null) {
      signals.push({
        indicator: "SMA 20/50 Crossover",
        signal: latestSma20 > latestSma50 ? "BULLISH" : "BEARISH",
        value: `SMA20: $${latestSma20.toFixed(2)} | SMA50: $${latestSma50.toFixed(2)}`,
        interpretation:
          latestSma20 > latestSma50
            ? "Short-term average above long-term — upward momentum"
            : "Short-term average below long-term — downward pressure",
      });
    }

    let rsiSignal = "NEUTRAL";
    let rsiInterp = "RSI in neutral zone";
    if (latestRsi < 30) {
      rsiSignal = "OVERSOLD";
      rsiInterp = "RSI below 30 — potential buying opportunity";
    } else if (latestRsi > 70) {
      rsiSignal = "OVERBOUGHT";
      rsiInterp = "RSI above 70 — potential selling pressure";
    }
    signals.push({
      indicator: "RSI (14)",
      signal: rsiSignal,
      value: latestRsi.toFixed(1),
      interpretation: rsiInterp,
    });

    let bbSignal = "NEUTRAL";
    let bbInterp = "Price within normal range";
    if (latestClose > latestBbUpper) {
      bbSignal = "OVERBOUGHT";
      bbInterp = "Price above upper band — potential reversal or continuation of strong trend";
    } else if (latestClose < latestBbLower) {
      bbSignal = "OVERSOLD";
      bbInterp = "Price below lower band — potential bounce or continued weakness";
    }
    signals.push({
      indicator: "Bollinger Bands (20,2)",
      signal: bbSignal,
      value: `Lower: $${latestBbLower.toFixed(2)} | Upper: $${latestBbUpper.toFixed(2)}`,
      interpretation: bbInterp,
    });

    const momentum20 =
      closes.length > 20
        ? ((latestClose - closes[closes.length - 21]) / closes[closes.length - 21]) * 100
        : 0;
    signals.push({
      indicator: "20-Day Momentum",
      signal: momentum20 > 0 ? "BULLISH" : "BEARISH",
      value: `${momentum20 > 0 ? "+" : ""}${momentum20.toFixed(2)}%`,
      interpretation: `Price has ${momentum20 > 0 ? "gained" : "lost"} ${Math.abs(momentum20).toFixed(2)}% over the last 20 trading days`,
    });

    const bullishCount = signals.filter((s) => s.signal === "BULLISH" || s.signal === "OVERSOLD").length;
    const bearishCount = signals.filter((s) => s.signal === "BEARISH" || s.signal === "OVERBOUGHT").length;
    let overallSignal = "NEUTRAL";
    if (bullishCount > bearishCount) overallSignal = "BUY";
    else if (bearishCount > bullishCount) overallSignal = "SELL";

    const offset50 = closes.length - sma50.length;
    const offsetBb = closes.length - bb.middle.length;
    const offsetRsi = closes.length - rsiValues.length;

    const chartData = dates.map((date, i) => ({
      date,
      close: closes[i],
      volume: volumes[i],
      sma20: i >= closes.length - sma20.length ? sma20[i - (closes.length - sma20.length)] : null,
      sma50: i >= offset50 ? sma50[i - offset50] : null,
      bbUpper: i >= offsetBb ? bb.upper[i - offsetBb] : null,
      bbMiddle: i >= offsetBb ? bb.middle[i - offsetBb] : null,
      bbLower: i >= offsetBb ? bb.lower[i - offsetBb] : null,
      rsi: i >= closes.length - 1 - (rsiValues.length - 1) ? rsiValues[i - (closes.length - rsiValues.length)] : null,
    }));

    return NextResponse.json({ chartData, signals, overallSignal, latestClose });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch prediction data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
