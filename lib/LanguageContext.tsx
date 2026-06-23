"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "zh";

export interface Translations {
  // App / nav
  appName: string;
  navFinancials: string;
  navFinancialsDesc: string;
  navFundamentals: string;
  navFundamentalsDesc: string;
  navPrediction: string;
  navPredictionDesc: string;
  navNews: string;
  navNewsDesc: string;
  homeTitle: string;
  homeSubtitle: string;
  breadcrumb: string;
  // SearchBox
  searchPlaceholder: string;
  noResultsStart: string;
  noResultsEnd: string;
  // FinancialReports
  loadingFinancials: string;
  incomeStatement: string;
  colMetric: string;
  metricRevenue: string;
  metricGrossProfit: string;
  metricRandD: string;
  metricEBIT: string;
  metricNetIncome: string;
  sectionEarningsBeatMiss: string;
  colQuarter: string;
  colEPSActual: string;
  colEPSEstimate: string;
  colSurprise: string;
  colResult: string;
  beat: string;
  miss: string;
  dataSourceAnnual: string;
  // FundamentalAnalysis
  loadingFundamentals: string;
  sectionValuation: string;
  sectionProfitability: string;
  sectionHealth: string;
  sectionTrading: string;
  sectionRecommendation: string;
  verdictBuy: string;
  verdictHold: string;
  verdictSell: string;
  verdictBullishCount: string;
  verdictBearishCount: string;
  labelMarketCap: string;
  labelEV: string;
  labelPETrailing: string;
  labelPEForward: string;
  labelPS: string;
  labelPB: string;
  labelEVRevenue: string;
  labelEVEBITDA: string;
  labelRevenue: string;
  labelGrossProfit: string;
  labelEBITDA: string;
  labelOpCashFlow: string;
  labelGrossMargin: string;
  labelOpMargin: string;
  labelNetMargin: string;
  labelRevenueGrowth: string;
  labelROA: string;
  labelROE: string;
  labelTotalDebt: string;
  labelDE: string;
  labelCurrentRatio: string;
  labelBookValue: string;
  labelSharesOut: string;
  labelBeta: string;
  labelBetaSub: string;
  label52High: string;
  label52Low: string;
  labelVolume: string;
  labelAvgVolume: string;
  labelDivYield: string;
  labelSector: string;
  labelIndustry: string;
  labelCountry: string;
  labelEmployees: string;
  todaySuffix: string;
  dataSourceAdvice: string;
  // Bullets
  bulletPEBullish: string;
  bulletPECaution: string;
  bulletPEBearish: string;
  bulletMarginBullish: string;
  bulletMarginCaution: string;
  bulletMarginBearish: string;
  bulletDEBullish: string;
  bulletDECaution: string;
  bulletDEBearish: string;
  bulletROEBullish: string;
  bulletROECaution: string;
  bulletROEBearish: string;
  bulletGrowthBullish: string;
  bulletGrowthCaution: string;
  bulletGrowthBearish: string;
  bulletBetaBullish: string;
  bulletBetaCaution: string;
  bulletBetaBearish: string;
  bulletCRBullish: string;
  bulletCRCaution: string;
  bulletCRBearish: string;
  // StockPrediction
  loadingPrediction: string;
  technicalSignalLabel: string;
  basedOn: string;
  technicalIndicatorsSuffix: string;
  lastPrice: string;
  bullishSignals: string;
  bearishSignals: string;
  neutralSignals: string;
  disclaimerText: string;
  chartTitle: string;
  chartPrice: string;
  chartRSI: string;
  chartVolume: string;
  legendPrice: string;
  legendSMA20: string;
  legendSMA50: string;
  legendBBUpper: string;
  legendBBLower: string;
  legendRSI: string;
  legendVolume: string;
  overbought: string;
  oversold: string;
  // RecentNews
  loadingNews: string;
  noNews: string;
  dataSourceNews: string;
}

const translations: Record<Lang, Translations> = {
  en: {
    appName: "StockIQ",
    navFinancials: "Financial Reports",
    navFinancialsDesc: "Income statement & earnings history",
    navFundamentals: "Fundamental Analysis",
    navFundamentalsDesc: "Valuation, profitability & health metrics",
    navPrediction: "Price Prediction",
    navPredictionDesc: "Technical indicators & signal analysis",
    navNews: "Recent News",
    navNewsDesc: "Latest headlines that may affect the stock",
    homeTitle: "Stock Analysis Platform",
    homeSubtitle: "Search for any company or ticker symbol above to get started. Access financial reports, fundamental analysis, and technical price signals.",
    breadcrumb: "Stock Analysis",
    searchPlaceholder: "Search company or ticker symbol...",
    noResultsStart: 'No results found for "',
    noResultsEnd: '"',
    loadingFinancials: "Loading financial reports...",
    incomeStatement: "Income Statement",
    colMetric: "Metric",
    metricRevenue: "Total Revenue",
    metricGrossProfit: "Gross Profit",
    metricRandD: "R&D Expense",
    metricEBIT: "EBIT",
    metricNetIncome: "Net Income",
    sectionEarningsBeatMiss: "Earnings Beat / Miss History",
    colQuarter: "Quarter",
    colEPSActual: "EPS Actual",
    colEPSEstimate: "EPS Estimate",
    colSurprise: "Surprise %",
    colResult: "Result",
    beat: "Beat",
    miss: "Miss",
    dataSourceAnnual: "Data sourced from Yahoo Finance. Annual figures.",
    loadingFundamentals: "Loading fundamental data...",
    sectionValuation: "Valuation",
    sectionProfitability: "Profitability & Growth",
    sectionHealth: "Financial Health",
    sectionTrading: "Trading",
    sectionRecommendation: "Investment Recommendation",
    verdictBuy: "BUY",
    verdictHold: "HOLD",
    verdictSell: "SELL",
    verdictBullishCount: "bullish signals",
    verdictBearishCount: "bearish signals",
    labelMarketCap: "Market Cap",
    labelEV: "Enterprise Value",
    labelPETrailing: "P/E (Trailing)",
    labelPEForward: "P/E (Forward)",
    labelPS: "Price/Sales",
    labelPB: "Price/Book",
    labelEVRevenue: "EV/Revenue",
    labelEVEBITDA: "EV/EBITDA",
    labelRevenue: "Revenue",
    labelGrossProfit: "Gross Profit",
    labelEBITDA: "EBITDA",
    labelOpCashFlow: "Operating Cash Flow",
    labelGrossMargin: "Gross Margin",
    labelOpMargin: "Operating Margin",
    labelNetMargin: "Net Margin",
    labelRevenueGrowth: "Revenue Growth (YoY)",
    labelROA: "Return on Assets",
    labelROE: "Return on Equity",
    labelTotalDebt: "Total Debt",
    labelDE: "Debt/Equity",
    labelCurrentRatio: "Current Ratio",
    labelBookValue: "Book Value/Share",
    labelSharesOut: "Shares Outstanding",
    labelBeta: "Beta",
    labelBetaSub: "Market risk",
    label52High: "52W High",
    label52Low: "52W Low",
    labelVolume: "Volume",
    labelAvgVolume: "Avg Volume (3M)",
    labelDivYield: "Dividend Yield",
    labelSector: "Sector",
    labelIndustry: "Industry",
    labelCountry: "Country",
    labelEmployees: "Employees",
    todaySuffix: "today",
    dataSourceAdvice: "Data sourced from Yahoo Finance. Not financial advice.",
    bulletPEBullish: "Low P/E — trading at a discount, potential value opportunity",
    bulletPECaution: "Fair P/E — reasonably valued, monitor earnings growth",
    bulletPEBearish: "High P/E — premium valuation, high growth expectations priced in",
    bulletMarginBullish: "Strong net margin — highly profitable business",
    bulletMarginCaution: "Moderate net margin — room to improve profitability",
    bulletMarginBearish: "Thin net margin — vulnerable to cost pressures",
    bulletDEBullish: "Low leverage — strong, conservative balance sheet",
    bulletDECaution: "Moderate debt — obligations are manageable",
    bulletDEBearish: "High leverage — watch debt obligations closely",
    bulletROEBullish: "Strong ROE — efficient use of shareholder capital",
    bulletROECaution: "Average ROE — moderate capital efficiency",
    bulletROEBearish: "Weak ROE — poor returns on shareholder equity",
    bulletGrowthBullish: "Strong revenue growth — robust top-line expansion",
    bulletGrowthCaution: "Slow revenue growth — limited top-line momentum",
    bulletGrowthBearish: "Declining revenue — significant headwinds ahead",
    bulletBetaBullish: "Low beta — defensive stock, less sensitive to market swings",
    bulletBetaCaution: "Beta near 1 — moves in line with the broad market",
    bulletBetaBearish: "High beta — amplified volatility relative to market",
    bulletCRBullish: "Strong current ratio — solid short-term liquidity",
    bulletCRCaution: "Adequate current ratio — sufficient short-term coverage",
    bulletCRBearish: "Low current ratio — potential short-term cash constraints",
    loadingPrediction: "Running technical analysis...",
    technicalSignalLabel: "Technical Analysis Signal",
    basedOn: "Based on",
    technicalIndicatorsSuffix: "technical indicators · Last price:",
    lastPrice: "Last price:",
    bullishSignals: "Bullish signals",
    bearishSignals: "Bearish signals",
    neutralSignals: "Neutral signals",
    disclaimerText: "This is a technical analysis only, not a financial prediction or investment advice. Past patterns do not guarantee future results. Always do your own research before making investment decisions.",
    chartTitle: "Price Chart (6 months)",
    chartPrice: "Price",
    chartRSI: "RSI",
    chartVolume: "Volume",
    legendPrice: "Price",
    legendSMA20: "SMA 20",
    legendSMA50: "SMA 50",
    legendBBUpper: "BB Upper",
    legendBBLower: "BB Lower",
    legendRSI: "RSI (14)",
    legendVolume: "Volume",
    overbought: "Overbought (70)",
    oversold: "Oversold (30)",
    loadingNews: "Loading recent news...",
    noNews: "No recent news found for this stock.",
    dataSourceNews: "Data sourced from Yahoo Finance.",
  },
  zh: {
    appName: "股票智析",
    navFinancials: "财务报告",
    navFinancialsDesc: "损益表及盈利历史",
    navFundamentals: "基本面分析",
    navFundamentalsDesc: "估值、盈利能力与健康指标",
    navPrediction: "价格预测",
    navPredictionDesc: "技术指标与信号分析",
    navNews: "最新新闻",
    navNewsDesc: "可能影响股价的最新头条",
    homeTitle: "股票分析平台",
    homeSubtitle: "在上方搜索任意公司或股票代码。访问财务报告、基本面分析和技术价格信号。",
    breadcrumb: "股票分析",
    searchPlaceholder: "搜索公司或股票代码...",
    noResultsStart: '未找到"',
    noResultsEnd: '"的相关结果',
    loadingFinancials: "正在加载财务报告...",
    incomeStatement: "利润表",
    colMetric: "指标",
    metricRevenue: "总营收",
    metricGrossProfit: "毛利润",
    metricRandD: "研发费用",
    metricEBIT: "息税前利润",
    metricNetIncome: "净利润",
    sectionEarningsBeatMiss: "盈利超预期 / 未达预期历史",
    colQuarter: "季度",
    colEPSActual: "实际每股盈利",
    colEPSEstimate: "预期每股盈利",
    colSurprise: "超预期幅度",
    colResult: "结果",
    beat: "超预期",
    miss: "未达预期",
    dataSourceAnnual: "数据来源：雅虎财经。年度数据。",
    loadingFundamentals: "正在加载基本面数据...",
    sectionValuation: "估值",
    sectionProfitability: "盈利能力与增长",
    sectionHealth: "财务健康",
    sectionTrading: "交易信息",
    sectionRecommendation: "投资建议",
    verdictBuy: "买入",
    verdictHold: "持有",
    verdictSell: "卖出",
    verdictBullishCount: "看涨信号",
    verdictBearishCount: "看跌信号",
    labelMarketCap: "市值",
    labelEV: "企业价值",
    labelPETrailing: "市盈率（滚动）",
    labelPEForward: "市盈率（预期）",
    labelPS: "市销率",
    labelPB: "市净率",
    labelEVRevenue: "企业价值/营收",
    labelEVEBITDA: "企业价值/EBITDA",
    labelRevenue: "营收",
    labelGrossProfit: "毛利润",
    labelEBITDA: "EBITDA",
    labelOpCashFlow: "经营现金流",
    labelGrossMargin: "毛利率",
    labelOpMargin: "营业利润率",
    labelNetMargin: "净利率",
    labelRevenueGrowth: "营收增长（同比）",
    labelROA: "资产回报率",
    labelROE: "股权回报率",
    labelTotalDebt: "总债务",
    labelDE: "负债/股权比",
    labelCurrentRatio: "流动比率",
    labelBookValue: "每股账面价值",
    labelSharesOut: "流通股数",
    labelBeta: "贝塔值",
    labelBetaSub: "市场风险",
    label52High: "52周高点",
    label52Low: "52周低点",
    labelVolume: "成交量",
    labelAvgVolume: "平均成交量（3个月）",
    labelDivYield: "股息收益率",
    labelSector: "行业",
    labelIndustry: "细分行业",
    labelCountry: "国家",
    labelEmployees: "员工人数",
    todaySuffix: "今日",
    dataSourceAdvice: "数据来源：雅虎财经。非投资建议。",
    bulletPEBullish: "低市盈率——折价交易，具有潜在价值机会",
    bulletPECaution: "合理市盈率——估值合理，需关注盈利增长",
    bulletPEBearish: "高市盈率——溢价估值，已反映高增长预期",
    bulletMarginBullish: "净利率高——盈利能力强劲",
    bulletMarginCaution: "净利率适中——盈利能力有提升空间",
    bulletMarginBearish: "净利率低——易受成本压力影响",
    bulletDEBullish: "低杠杆——资产负债表稳健保守",
    bulletDECaution: "适度债务——负债水平可控",
    bulletDEBearish: "高杠杆——需密切关注债务负担",
    bulletROEBullish: "高股权回报率——有效利用股东资本",
    bulletROECaution: "平均股权回报率——资本效率一般",
    bulletROEBearish: "低股权回报率——股东资本回报不佳",
    bulletGrowthBullish: "营收高速增长——营收扩张强劲",
    bulletGrowthCaution: "营收增长缓慢——增长动力有限",
    bulletGrowthBearish: "营收下滑——前景面临重大阻力",
    bulletBetaBullish: "低贝塔——防御性强，受市场波动影响小",
    bulletBetaCaution: "贝塔接近1——与大盘走势基本一致",
    bulletBetaBearish: "高贝塔——相对市场波动幅度更大",
    bulletCRBullish: "高流动比率——短期流动性充足",
    bulletCRCaution: "流动比率适中——短期覆盖率尚可",
    bulletCRBearish: "低流动比率——短期资金可能紧张",
    loadingPrediction: "正在运行技术分析...",
    technicalSignalLabel: "技术分析信号",
    basedOn: "基于",
    technicalIndicatorsSuffix: "项技术指标 · 最新价格：",
    lastPrice: "最新价格：",
    bullishSignals: "看涨信号",
    bearishSignals: "看跌信号",
    neutralSignals: "中性信号",
    disclaimerText: "这仅是技术分析，并非金融预测或投资建议。历史规律不保证未来结果。投资前请自行充分研究。",
    chartTitle: "价格走势图（近6个月）",
    chartPrice: "价格",
    chartRSI: "相对强弱指标",
    chartVolume: "成交量",
    legendPrice: "价格",
    legendSMA20: "20日均线",
    legendSMA50: "50日均线",
    legendBBUpper: "布林上轨",
    legendBBLower: "布林下轨",
    legendRSI: "RSI (14)",
    legendVolume: "成交量",
    overbought: "超买 (70)",
    oversold: "超卖 (30)",
    loadingNews: "正在加载最新新闻...",
    noNews: "未找到该股票的最新新闻。",
    dataSourceNews: "数据来源：雅虎财经。",
  },
};

interface LanguageContextValue {
  lang: Lang;
  toggle: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const toggle = () => setLang((l) => (l === "en" ? "zh" : "en"));
  return (
    <LanguageContext.Provider value={{ lang, toggle, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
