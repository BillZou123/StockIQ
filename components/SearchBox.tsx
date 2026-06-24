"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

interface Props {
  onSelect: (symbol: string, name: string) => void;
}

export default function SearchBox({ onSelect }: Props) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(r: SearchResult) {
    setQuery(`${r.symbol} — ${r.name}`);
    setOpen(false);
    onSelect(r.symbol, r.name);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
        {loading ? (
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin flex-shrink-0" />
        ) : (
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={t.searchPlaceholder}
          className="flex-1 outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm bg-transparent"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
          {results.map((r) => (
            <button
              key={r.symbol}
              onClick={() => handleSelect(r)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left transition-colors"
            >
              <div className="flex-shrink-0 w-12 text-center">
                <span className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded-md">
                  {r.symbol}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{r.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{r.exchange} · {r.type}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {open && results.length === 0 && !loading && query.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
          {t.noResultsStart}{query}{t.noResultsEnd}
        </div>
      )}
    </div>
  );
}
