"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { formatNumber, formatPercent, cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

interface IncomeEntry {
  endDate?: string;
  totalRevenue?: number;
  grossProfit?: number;
  ebit?: number;
  netIncome?: number;
  researchDevelopment?: number;
}

interface EarningsEntry {
  epsActual?: number | null;
  epsEstimate?: number | null;
  epsDifference?: number | null;
  surprisePercent?: number | null;
  quarter?: string | null;
  period?: string;
}

interface FinancialData {
  incomeStatementHistory?: { incomeStatementHistory?: IncomeEntry[] };
  earningsHistory?: { history?: EarningsEntry[] };
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function formatQuarter(dateStr?: string | null) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `Q${q} ${d.getFullYear()}`;
}

function MetricRow({ label, values }: { label: string; values: (number | null | undefined)[] }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-2 pr-4 text-sm text-gray-600 font-medium whitespace-nowrap">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="py-2 px-3 text-sm text-right text-gray-800 tabular-nums">
          {formatNumber(v)}
        </td>
      ))}
    </tr>
  );
}

export default function FinancialReports({ symbol }: { symbol: string }) {
  const { t } = useLanguage();
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/financials?symbol=${symbol}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [symbol]);

  if (loading) return (
    <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
      <Loader2 className="w-5 h-5 animate-spin" />
      {t.loadingFinancials}
    </div>
  );

  if (error) return (
    <div className="py-10 text-center text-red-500 text-sm">{error}</div>
  );

  if (!data) return null;

  const income = data.incomeStatementHistory?.incomeStatementHistory ?? [];
  const earnings = data.earningsHistory?.history ?? [];

  return (
    <div className="space-y-6">
      {/* Income Statement */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{t.incomeStatement}</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 pr-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pl-5">{t.colMetric}</th>
              {income.map((e, i) => (
                <th key={i} className="py-3 px-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {formatDate(e.endDate)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <MetricRow label={t.metricRevenue} values={income.map((e) => e.totalRevenue)} />
            <MetricRow label={t.metricGrossProfit} values={income.map((e) => e.grossProfit)} />
            <MetricRow label={t.metricRandD} values={income.map((e) => e.researchDevelopment)} />
            <MetricRow label={t.metricEBIT} values={income.map((e) => e.ebit)} />
            <MetricRow label={t.metricNetIncome} values={income.map((e) => e.netIncome)} />
          </tbody>
        </table>
      </div>

      {/* Earnings Beat / Miss */}
      {earnings.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{t.sectionEarningsBeatMiss}</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 pl-5 pr-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.colQuarter}</th>
                <th className="py-3 px-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.colEPSActual}</th>
                <th className="py-3 px-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.colEPSEstimate}</th>
                <th className="py-3 px-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.colSurprise}</th>
                <th className="py-3 px-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.colResult}</th>
              </tr>
            </thead>
            <tbody>
              {earnings.map((e, i) => {
                const beat = (e.epsDifference ?? 0) >= 0;
                return (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 pl-5 pr-4 text-sm text-gray-700 font-medium">{formatQuarter(e.quarter)}</td>
                    <td className="py-2.5 px-3 text-sm text-right text-gray-800 tabular-nums">
                      {e.epsActual != null ? `$${e.epsActual.toFixed(2)}` : "N/A"}
                    </td>
                    <td className="py-2.5 px-3 text-sm text-right text-gray-800 tabular-nums">
                      {e.epsEstimate != null ? `$${e.epsEstimate.toFixed(2)}` : "N/A"}
                    </td>
                    <td className={cn(
                      "py-2.5 px-3 text-sm text-right tabular-nums font-medium",
                      beat ? "text-green-600" : "text-red-500"
                    )}>
                      {e.surprisePercent != null
                        ? `${e.surprisePercent >= 0 ? "+" : ""}${formatPercent(e.surprisePercent)}`
                        : "N/A"}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={cn(
                        "inline-block text-xs font-bold px-2 py-0.5 rounded-full",
                        beat ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      )}>
                        {beat ? t.beat : t.miss}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-400 text-right">{t.dataSourceAnnual}</p>
    </div>
  );
}
