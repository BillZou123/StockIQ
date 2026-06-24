"use client";

import { useEffect, useState } from "react";
import { Loader2, Newspaper, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface NewsItem {
  uuid: string;
  title: string;
  publisher: string;
  link: string;
  providerPublishTime: string | number | Date;
  relatedTickers: string[];
}

function formatNewsDate(raw: string | number | Date): string {
  const d = new Date(raw as string);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function RecentNews({ symbol }: { symbol: string }) {
  const { t } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/news?symbol=${symbol}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setNews(d.news ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [symbol]);

  if (loading) return (
    <div className="flex items-center justify-center py-16 gap-3 text-gray-500 dark:text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" />
      {t.loadingNews}
    </div>
  );

  if (error) return <div className="py-10 text-center text-red-500 text-sm">{error}</div>;

  return (
    <div className="space-y-3">
      {news.length === 0 ? (
        <div className="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">{t.noNews}</div>
      ) : (
        news.map((item) => (
          <a
            key={item.uuid}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mt-0.5">
                <Newspaper className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.publisher}</span>
                  <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{formatNewsDate(item.providerPublishTime)}</span>
                  <ExternalLink className="w-3 h-3 text-gray-300 dark:text-gray-600 ml-auto flex-shrink-0 group-hover:text-blue-400 transition-colors" />
                </div>
              </div>
            </div>
          </a>
        ))
      )}
      <p className="text-xs text-gray-400 dark:text-gray-500 text-right">{t.dataSourceNews}</p>
    </div>
  );
}
