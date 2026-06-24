"use client";

import { useState } from "react";
import { BarChart2, FileText, TrendingUp, ChevronRight, Newspaper, Moon, Sun } from "lucide-react";
import SearchBox from "@/components/SearchBox";
import FinancialReports from "@/components/FinancialReports";
import FundamentalAnalysis from "@/components/FundamentalAnalysis";
import StockPrediction from "@/components/StockPrediction";
import RecentNews from "@/components/RecentNews";
import { LanguageProvider, useLanguage } from "@/lib/LanguageContext";
import { ThemeProvider, useTheme } from "@/lib/ThemeContext";

type View = "financials" | "fundamentals" | "prediction" | "news";

export default function Home() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <HomeInner />
      </ThemeProvider>
    </LanguageProvider>
  );
}

function HomeInner() {
  const { lang, toggle, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>("fundamentals");

  const navItems = [
    {
      id: "financials" as View,
      label: t.navFinancials,
      icon: <FileText className="w-5 h-5" />,
      description: t.navFinancialsDesc,
    },
    {
      id: "fundamentals" as View,
      label: t.navFundamentals,
      icon: <BarChart2 className="w-5 h-5" />,
      description: t.navFundamentalsDesc,
    },
    {
      id: "prediction" as View,
      label: t.navPrediction,
      icon: <TrendingUp className="w-5 h-5" />,
      description: t.navPredictionDesc,
    },
    {
      id: "news" as View,
      label: t.navNews,
      icon: <Newspaper className="w-5 h-5" />,
      description: t.navNewsDesc,
    },
  ];

  function handleSelect(symbol: string, name: string) {
    setSelectedSymbol(symbol);
    setSelectedName(name);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-6">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">{t.appName}</span>
          </div>
          <div className="flex-1 max-w-xl">
            <SearchBox onSelect={handleSelect} />
          </div>
          <button
            onClick={toggleTheme}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all bg-white dark:bg-gray-900"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={toggle}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all bg-white dark:bg-gray-900"
          >
            {lang === "en" ? "中文" : "EN"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!selectedSymbol ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t.homeTitle}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">{t.homeSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-3xl mt-4">
              {navItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-left">
                  <div className="text-blue-600 dark:text-blue-400 mb-2">{item.icon}</div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Company header */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{t.breadcrumb}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 dark:text-gray-100 font-semibold">{selectedName}</span>
              <span className="ml-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded-md">{selectedSymbol}</span>
            </div>

            {/* View selector */}
            <div className="flex gap-2 flex-wrap">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    activeView === item.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            {/* Active view content */}
            <div>
              {activeView === "financials" && <FinancialReports key={`${selectedSymbol}-fin`} symbol={selectedSymbol} />}
              {activeView === "fundamentals" && <FundamentalAnalysis key={`${selectedSymbol}-fund`} symbol={selectedSymbol} />}
              {activeView === "prediction" && <StockPrediction key={`${selectedSymbol}-pred`} symbol={selectedSymbol} />}
              {activeView === "news" && <RecentNews key={`${selectedSymbol}-news`} symbol={selectedSymbol} />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
