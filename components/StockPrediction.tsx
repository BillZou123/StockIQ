"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

interface ChartPoint {
  date: string;
  close: number;
  volume: number;
  sma20: number | null;
  sma50: number | null;
  bbUpper: number | null;
  bbMiddle: number | null;
  bbLower: number | null;
  rsi: number | null;
}

interface Signal {
  indicator: string;
  signal: string;
  value: string;
  interpretation: string;
}

interface PredictionData {
  chartData: ChartPoint[];
  signals: Signal[];
  overallSignal: string;
  latestClose: number;
}

const signalColors: Record<string, string> = {
  BULLISH: "text-green-600 dark:text-green-400",
  OVERSOLD: "text-green-600 dark:text-green-400",
  BEARISH: "text-red-500 dark:text-red-400",
  OVERBOUGHT: "text-orange-500 dark:text-orange-400",
  NEUTRAL: "text-gray-500 dark:text-gray-400",
  BUY: "text-green-600 dark:text-green-400",
  SELL: "text-red-500 dark:text-red-400",
};

const signalBg: Record<string, string> = {
  BULLISH: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  OVERSOLD: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  BEARISH: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  OVERBOUGHT: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
  NEUTRAL: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
};

function SignalIcon({ signal }: { signal: string }) {
  if (signal === "BULLISH" || signal === "OVERSOLD") return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
  if (signal === "BEARISH" || signal === "OVERBOUGHT") return <TrendingDown className="w-4 h-4 text-red-500 dark:text-red-400" />;
  return <Minus className="w-4 h-4 text-gray-400 dark:text-gray-500" />;
}

function formatXAxis(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function StockPrediction({ symbol }: { symbol: string }) {
  const { t } = useLanguage();
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChart, setActiveChart] = useState<"price" | "rsi" | "volume">("price");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/prediction?symbol=${symbol}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [symbol]);

  if (loading) return (
    <div className="flex items-center justify-center py-16 gap-3 text-gray-500 dark:text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" />
      {t.loadingPrediction}
    </div>
  );

  if (error) return <div className="py-10 text-center text-red-500 text-sm">{error}</div>;
  if (!data) return null;

  const { chartData, signals, overallSignal, latestClose } = data;
  const overallBg = overallSignal === "BUY" ? "from-green-500 to-green-600" : overallSignal === "SELL" ? "from-red-500 to-red-600" : "from-gray-500 to-gray-600";

  const thinData = chartData.filter((_, i) => i % Math.max(1, Math.floor(chartData.length / 60)) === 0 || i === chartData.length - 1);

  const chartTabs = [
    { key: "price" as const, label: t.chartPrice },
    { key: "rsi" as const, label: t.chartRSI },
    { key: "volume" as const, label: t.chartVolume },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Signal Banner */}
      <div className={`bg-gradient-to-r ${overallBg} rounded-xl p-5 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80 font-medium">{t.technicalSignalLabel}</p>
            <p className="text-4xl font-bold mt-1">{overallSignal}</p>
            <p className="text-white/70 text-sm mt-1">
              {t.basedOn} {signals.length} {t.technicalIndicatorsSuffix} ${latestClose.toFixed(2)}
            </p>
          </div>
          <div className="flex flex-col gap-1 text-right text-sm text-white/80">
            <span>{signals.filter(s => s.signal === "BULLISH" || s.signal === "OVERSOLD").length} {t.bullishSignals}</span>
            <span>{signals.filter(s => s.signal === "BEARISH" || s.signal === "OVERBOUGHT").length} {t.bearishSignals}</span>
            <span>{signals.filter(s => s.signal === "NEUTRAL").length} {t.neutralSignals}</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-300">{t.disclaimerText}</p>
      </div>

      {/* Signal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {signals.map((s) => (
          <div key={s.indicator} className={`border rounded-xl p-4 ${signalBg[s.signal] ?? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{s.indicator}</p>
              <div className="flex items-center gap-1">
                <SignalIcon signal={s.signal} />
                <span className={`text-xs font-bold ${signalColors[s.signal] ?? "text-gray-600 dark:text-gray-400"}`}>{s.signal}</span>
              </div>
            </div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">{s.value}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{s.interpretation}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t.chartTitle}</h3>
          <div className="flex gap-2">
            {chartTabs.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveChart(c.key)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  activeChart === c.key ? "bg-blue-600 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {activeChart === "price" && (
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={thinData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="date" tickFormatter={formatXAxis} tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11 }} tickLine={false} tickFormatter={(v) => `$${v.toFixed(0)}`} />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any) => [`$${(value as number)?.toFixed(2) ?? "N/A"}`, name as string]}
                labelFormatter={(l) => new Date(l).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              />
              <Legend />
              <Line type="monotone" dataKey="close" stroke="#2563eb" strokeWidth={2} dot={false} name={t.legendPrice} />
              <Line type="monotone" dataKey="sma20" stroke="#f59e0b" strokeWidth={1.5} dot={false} name={t.legendSMA20} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="sma50" stroke="#8b5cf6" strokeWidth={1.5} dot={false} name={t.legendSMA50} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="bbUpper" stroke="#d1d5db" strokeWidth={1} dot={false} name={t.legendBBUpper} />
              <Line type="monotone" dataKey="bbLower" stroke="#d1d5db" strokeWidth={1} dot={false} name={t.legendBBLower} />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {activeChart === "rsi" && (
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={thinData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="date" tickFormatter={formatXAxis} tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [(value as number)?.toFixed(1), t.legendRSI]}
                labelFormatter={(l) => new Date(l).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              />
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ value: t.overbought, position: "right", fontSize: 10, fill: "#ef4444" }} />
              <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" label={{ value: t.oversold, position: "right", fontSize: 10, fill: "#22c55e" }} />
              <Line type="monotone" dataKey="rsi" stroke="#2563eb" strokeWidth={2} dot={false} name={t.legendRSI} />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {activeChart === "volume" && (
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={thinData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="date" tickFormatter={formatXAxis} tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`${((value as number) / 1e6).toFixed(2)}M`, t.legendVolume]}
                labelFormatter={(l) => new Date(l).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              />
              <Bar dataKey="volume" fill="#3b82f6" opacity={0.7} name={t.legendVolume} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-right">{t.dataSourceAdvice}</p>
    </div>
  );
}
