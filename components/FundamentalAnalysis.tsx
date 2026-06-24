"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/utils";
import { useLanguage, Translations } from "@/lib/LanguageContext";

interface FundamentalData {
  quote: {
    regularMarketPrice?: number;
    regularMarketChangePercent?: number;
    regularMarketVolume?: number;
    marketCap?: number;
    fiftyTwoWeekHigh?: number;
    fiftyTwoWeekLow?: number;
    averageDailyVolume3Month?: number;
  };
  summary: {
    summaryDetail?: {
      trailingPE?: number;
      forwardPE?: number;
      dividendYield?: number;
      beta?: number;
      priceToSalesTrailing12Months?: number;
    };
    financialData?: {
      totalRevenue?: number;
      grossProfits?: number;
      ebitda?: number;
      operatingCashflow?: number;
      revenueGrowth?: number;
      grossMargins?: number;
      operatingMargins?: number;
      profitMargins?: number;
      returnOnAssets?: number;
      returnOnEquity?: number;
      totalDebt?: number;
      debtToEquity?: number;
      currentRatio?: number;
    };
    defaultKeyStatistics?: {
      enterpriseValue?: number;
      enterpriseToRevenue?: number;
      enterpriseToEbitda?: number;
      priceToBook?: number;
      bookValue?: number;
      earningsQuarterlyGrowth?: number;
      sharesOutstanding?: number;
    };
    assetProfile?: {
      sector?: string;
      industry?: string;
      country?: string;
      website?: string;
      fullTimeEmployees?: number;
    };
  };
}

type Sentiment = "bullish" | "caution" | "bearish";

interface BulletItem {
  sentiment: Sentiment;
  metric: string;
  interpretation: string;
}

function generateBullets(
  fd: FundamentalData["summary"]["financialData"],
  sd: FundamentalData["summary"]["summaryDetail"],
  ks: FundamentalData["summary"]["defaultKeyStatistics"],
  t: Translations
): BulletItem[] {
  const bullets: BulletItem[] = [];

  // P/E
  const pe = sd?.trailingPE;
  if (pe != null) {
    if (pe < 15) bullets.push({ sentiment: "bullish", metric: `P/E: ${pe.toFixed(1)}x`, interpretation: t.bulletPEBullish });
    else if (pe <= 30) bullets.push({ sentiment: "caution", metric: `P/E: ${pe.toFixed(1)}x`, interpretation: t.bulletPECaution });
    else bullets.push({ sentiment: "bearish", metric: `P/E: ${pe.toFixed(1)}x`, interpretation: t.bulletPEBearish });
  }

  // Net Margin
  const margin = fd?.profitMargins;
  if (margin != null) {
    const pct = formatPercent(margin);
    if (margin > 0.20) bullets.push({ sentiment: "bullish", metric: `${t.labelNetMargin}: ${pct}`, interpretation: t.bulletMarginBullish });
    else if (margin >= 0.05) bullets.push({ sentiment: "caution", metric: `${t.labelNetMargin}: ${pct}`, interpretation: t.bulletMarginCaution });
    else bullets.push({ sentiment: "bearish", metric: `${t.labelNetMargin}: ${pct}`, interpretation: t.bulletMarginBearish });
  }

  // Debt/Equity
  const de = fd?.debtToEquity;
  if (de != null) {
    if (de < 0.5) bullets.push({ sentiment: "bullish", metric: `${t.labelDE}: ${de.toFixed(2)}x`, interpretation: t.bulletDEBullish });
    else if (de <= 2.0) bullets.push({ sentiment: "caution", metric: `${t.labelDE}: ${de.toFixed(2)}x`, interpretation: t.bulletDECaution });
    else bullets.push({ sentiment: "bearish", metric: `${t.labelDE}: ${de.toFixed(2)}x`, interpretation: t.bulletDEBearish });
  }

  // ROE
  const roe = fd?.returnOnEquity;
  if (roe != null) {
    const pct = formatPercent(roe);
    if (roe > 0.15) bullets.push({ sentiment: "bullish", metric: `${t.labelROE}: ${pct}`, interpretation: t.bulletROEBullish });
    else if (roe >= 0.05) bullets.push({ sentiment: "caution", metric: `${t.labelROE}: ${pct}`, interpretation: t.bulletROECaution });
    else bullets.push({ sentiment: "bearish", metric: `${t.labelROE}: ${pct}`, interpretation: t.bulletROEBearish });
  }

  // Revenue Growth
  const growth = fd?.revenueGrowth;
  if (growth != null) {
    const pct = formatPercent(growth);
    if (growth > 0.10) bullets.push({ sentiment: "bullish", metric: `${t.labelRevenueGrowth}: ${pct}`, interpretation: t.bulletGrowthBullish });
    else if (growth >= 0) bullets.push({ sentiment: "caution", metric: `${t.labelRevenueGrowth}: ${pct}`, interpretation: t.bulletGrowthCaution });
    else bullets.push({ sentiment: "bearish", metric: `${t.labelRevenueGrowth}: ${pct}`, interpretation: t.bulletGrowthBearish });
  }

  // Beta
  const beta = sd?.beta;
  if (beta != null) {
    if (beta < 0.8) bullets.push({ sentiment: "bullish", metric: `${t.labelBeta}: ${beta.toFixed(2)}`, interpretation: t.bulletBetaBullish });
    else if (beta <= 1.3) bullets.push({ sentiment: "caution", metric: `${t.labelBeta}: ${beta.toFixed(2)}`, interpretation: t.bulletBetaCaution });
    else bullets.push({ sentiment: "bearish", metric: `${t.labelBeta}: ${beta.toFixed(2)}`, interpretation: t.bulletBetaBearish });
  }

  // Current Ratio
  const cr = fd?.currentRatio;
  if (cr != null) {
    if (cr > 2.0) bullets.push({ sentiment: "bullish", metric: `${t.labelCurrentRatio}: ${cr.toFixed(2)}`, interpretation: t.bulletCRBullish });
    else if (cr >= 1.0) bullets.push({ sentiment: "caution", metric: `${t.labelCurrentRatio}: ${cr.toFixed(2)}`, interpretation: t.bulletCRCaution });
    else bullets.push({ sentiment: "bearish", metric: `${t.labelCurrentRatio}: ${cr.toFixed(2)}`, interpretation: t.bulletCRBearish });
  }

  return bullets;
}

function getVerdict(bullets: BulletItem[]): "BUY" | "HOLD" | "SELL" {
  const score = bullets.reduce((sum, b) => {
    if (b.sentiment === "bullish") return sum + 2;
    if (b.sentiment === "bearish") return sum - 2;
    return sum;
  }, 0);
  if (score >= 4) return "BUY";
  if (score <= -4) return "SELL";
  return "HOLD";
}

function SentimentIcon({ sentiment }: { sentiment: Sentiment }) {
  if (sentiment === "bullish") return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />;
  if (sentiment === "bearish") return <TrendingDown className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />;
  return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />;
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{children}</div>
    </div>
  );
}

export default function FundamentalAnalysis({ symbol }: { symbol: string }) {
  const { t } = useLanguage();
  const [data, setData] = useState<FundamentalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/fundamentals?symbol=${symbol}`)
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
      {t.loadingFundamentals}
    </div>
  );

  if (error) return <div className="py-10 text-center text-red-500 text-sm">{error}</div>;
  if (!data) return null;

  const { quote, summary } = data;
  const sd = summary?.summaryDetail;
  const fd = summary?.financialData;
  const ks = summary?.defaultKeyStatistics;
  const ap = summary?.assetProfile;

  const priceChange = quote.regularMarketChangePercent ?? 0;
  const PriceIcon = priceChange > 0 ? TrendingUp : priceChange < 0 ? TrendingDown : Minus;

  const bullets = generateBullets(fd, sd, ks, t);
  const verdict = getVerdict(bullets);
  const verdictGradient =
    verdict === "BUY" ? "from-green-500 to-green-600" :
    verdict === "SELL" ? "from-red-500 to-red-600" :
    "from-gray-500 to-gray-600";
  const verdictLabel = verdict === "BUY" ? t.verdictBuy : verdict === "SELL" ? t.verdictSell : t.verdictHold;

  return (
    <div className="space-y-6">
      {/* Price Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-sm font-medium">{symbol}</p>
            <p className="text-3xl font-bold mt-1">${(quote.regularMarketPrice ?? 0).toFixed(2)}</p>
            <div className={`flex items-center gap-1 mt-1 ${priceChange >= 0 ? "text-green-300" : "text-red-300"}`}>
              <PriceIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}% {t.todaySuffix}
              </span>
            </div>
          </div>
          <div className="text-right text-sm text-blue-200 space-y-1">
            {ap?.sector && <p>{t.labelSector}: <span className="text-white font-medium">{ap.sector}</span></p>}
            {ap?.industry && <p>{t.labelIndustry}: <span className="text-white font-medium">{ap.industry}</span></p>}
            {ap?.country && <p>{t.labelCountry}: <span className="text-white font-medium">{ap.country}</span></p>}
            {ap?.fullTimeEmployees && (
              <p>{t.labelEmployees}: <span className="text-white font-medium">{ap.fullTimeEmployees.toLocaleString()}</span></p>
            )}
          </div>
        </div>
      </div>

      {/* Valuation */}
      <Section title={t.sectionValuation}>
        <MetricCard label={t.labelMarketCap} value={formatNumber(quote.marketCap)} />
        <MetricCard label={t.labelEV} value={formatNumber(ks?.enterpriseValue)} />
        <MetricCard label={t.labelPETrailing} value={sd?.trailingPE?.toFixed(1) ?? "N/A"} />
        <MetricCard label={t.labelPEForward} value={sd?.forwardPE?.toFixed(1) ?? "N/A"} />
        <MetricCard label={t.labelPS} value={sd?.priceToSalesTrailing12Months?.toFixed(2) ?? "N/A"} />
        <MetricCard label={t.labelPB} value={ks?.priceToBook?.toFixed(2) ?? "N/A"} />
        <MetricCard label={t.labelEVRevenue} value={ks?.enterpriseToRevenue?.toFixed(2) ?? "N/A"} />
        <MetricCard label={t.labelEVEBITDA} value={ks?.enterpriseToEbitda?.toFixed(2) ?? "N/A"} />
      </Section>

      {/* Profitability */}
      <Section title={t.sectionProfitability}>
        <MetricCard label={t.labelRevenue} value={formatNumber(fd?.totalRevenue)} />
        <MetricCard label={t.labelGrossProfit} value={formatNumber(fd?.grossProfits)} />
        <MetricCard label={t.labelEBITDA} value={formatNumber(fd?.ebitda)} />
        <MetricCard label={t.labelOpCashFlow} value={formatNumber(fd?.operatingCashflow)} />
        <MetricCard label={t.labelGrossMargin} value={formatPercent(fd?.grossMargins)} />
        <MetricCard label={t.labelOpMargin} value={formatPercent(fd?.operatingMargins)} />
        <MetricCard label={t.labelNetMargin} value={formatPercent(fd?.profitMargins)} />
        <MetricCard label={t.labelRevenueGrowth} value={formatPercent(fd?.revenueGrowth)} />
      </Section>

      {/* Financial Health */}
      <Section title={t.sectionHealth}>
        <MetricCard label={t.labelROA} value={formatPercent(fd?.returnOnAssets)} />
        <MetricCard label={t.labelROE} value={formatPercent(fd?.returnOnEquity)} />
        <MetricCard label={t.labelTotalDebt} value={formatNumber(fd?.totalDebt)} />
        <MetricCard label={t.labelDE} value={fd?.debtToEquity?.toFixed(2) ?? "N/A"} />
        <MetricCard label={t.labelCurrentRatio} value={fd?.currentRatio?.toFixed(2) ?? "N/A"} />
        <MetricCard label={t.labelBookValue} value={ks?.bookValue != null ? `$${ks.bookValue.toFixed(2)}` : "N/A"} />
        <MetricCard label={t.labelSharesOut} value={formatNumber(ks?.sharesOutstanding).replace("$", "")} />
        <MetricCard label={t.labelBeta} value={sd?.beta?.toFixed(2) ?? "N/A"} sub={t.labelBetaSub} />
      </Section>

      {/* Trading */}
      <Section title={t.sectionTrading}>
        <MetricCard label={t.label52High} value={`$${(quote.fiftyTwoWeekHigh ?? 0).toFixed(2)}`} />
        <MetricCard label={t.label52Low} value={`$${(quote.fiftyTwoWeekLow ?? 0).toFixed(2)}`} />
        <MetricCard label={t.labelVolume} value={formatNumber(quote.regularMarketVolume).replace("$", "")} />
        <MetricCard label={t.labelAvgVolume} value={formatNumber(quote.averageDailyVolume3Month).replace("$", "")} />
        <MetricCard label={t.labelDivYield} value={formatPercent(sd?.dividendYield)} />
      </Section>

      {/* Investment Recommendation */}
      {bullets.length > 0 && (
        <div className="space-y-3">
          {/* Verdict banner */}
          <div className={`bg-gradient-to-r ${verdictGradient} rounded-xl p-5 text-white`}>
            <p className="text-white/80 text-sm font-medium">{t.sectionRecommendation}</p>
            <p className="text-4xl font-bold mt-1">{verdictLabel}</p>
            <p className="text-white/70 text-sm mt-1">
              {bullets.filter((b) => b.sentiment === "bullish").length} {t.verdictBullishCount} ·{" "}
              {bullets.filter((b) => b.sentiment === "bearish").length} {t.verdictBearishCount}
            </p>
          </div>

          {/* Bullet list */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-3">
            {bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <SentimentIcon sentiment={b.sentiment} />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{b.metric}</span>
                  {" — "}
                  {b.interpretation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 text-right">{t.dataSourceAdvice}</p>
    </div>
  );
}
