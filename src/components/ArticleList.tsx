import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { ArticleCard } from "./ArticleCard";
import { ArticleHeader } from "./ArticleHeader";
import { FeedSidebar } from "./FeedSidebar";
import { SettingsDialog } from "./SettingsDialog";
import { Loader2 } from "lucide-react";

// ソースの色を定義
const SOURCE_COLORS: Record<string, string> = {
  Zenn: "#3EA8FF",
  Qiita: "#55C500",
  Hatena: "#00A4DE",
  "Hacker News": "#FF6600",
  TechCrunch: "#4ECDC4",
  "The Verge": "#9B59B6",
  "Ars Technica": "#3498DB",
  Wired: "#E74C3C",
};

function getSourceColor(sourceName: string): string {
  return SOURCE_COLORS[sourceName] || "#64748B";
}

interface Article {
  title: string;
  content?: string;
  link: string;
  pubDate: string;
  pubDateFormatted: string;
  sourceName: string;
  sourceUrl: string;
  tags: string[];
  thumbnail?: string;
  bookmarkCount?: number;
}

interface ArticleListProps {
  articles: Article[];
  sources: { name: string; url: string; siteUrl: string }[];
}

export function ArticleList({ articles, sources }: ArticleListProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(20);
  const [readArticles, setReadArticles] = useState<Set<string>>(new Set());

  // Source options for settings
  const [enabledSources, setEnabledSources] = useState<Set<string>>(
    () => new Set(sources.map((s) => s.name))
  );

  // Load read articles from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("huginn-read-articles");
    if (stored) {
      try {
        setReadArticles(new Set(JSON.parse(stored)));
      } catch (e) {
        console.error("Failed to parse read articles", e);
      }
    }
  }, []);

  // Mark article as read
  const markAsRead = (link: string) => {
    setReadArticles((prev) => {
      const newSet = new Set(prev);
      newSet.add(link);
      localStorage.setItem("huginn-read-articles", JSON.stringify([...newSet]));
      return newSet;
    });
  };

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let result = articles.filter((article) => {
      // Filter by enabled sources
      if (!enabledSources.has(article.sourceName)) return false;

      // Filter by active sidebar source
      if (activeSource && article.sourceName !== activeSource) return false;

      // Filter by read status
      if (filter === "unread" && readArticles.has(article.link)) return false;

      return true;
    });

    // Sort by date
    result.sort((a, b) => {
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    });

    return result;
  }, [articles, filter, activeSource, enabledSources, readArticles]);

  const displayedArticles = filteredArticles.slice(0, displayCount);
  const hasMore = displayCount < filteredArticles.length;

  // Sidebar sources
  const sidebarSources = sources.map((s) => ({
    name: s.name,
    color: getSourceColor(s.name),
    isActive: activeSource === s.name,
  }));

  // Settings sources
  const settingsSources = sources.map((s) => ({
    name: s.name,
    color: getSourceColor(s.name),
    checked: enabledSources.has(s.name),
  }));

  const handleSourceClick = (sourceName: string) => {
    setActiveSource((prev) => (prev === sourceName ? null : sourceName));
  };

  const handleSourceToggle = (sourceName: string) => {
    setEnabledSources((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sourceName)) {
        newSet.delete(sourceName);
      } else {
        newSet.add(sourceName);
      }
      return newSet;
    });
  };

  const handleSettingsReset = () => {
    setEnabledSources(new Set(sources.map((s) => s.name)));
  };

  const handleSettingsSave = () => {
    setSettingsOpen(false);
  };

  // Infinite scroll with IntersectionObserver
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    setDisplayCount((prev) => prev + 20);
  }, []);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const lastUpdated = new Date().toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <FeedSidebar
        sources={sidebarSources}
        onSourceClick={handleSourceClick}
        activeSource={activeSource}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <ArticleHeader
            lastUpdated={lastUpdated}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>

        {/* Article List */}
        <ul className="flex flex-col" role="list" aria-label="記事一覧">
          {displayedArticles.map((article) => (
            <li
              key={article.link}
              onClick={() => markAsRead(article.link)}
            >
              <ArticleCard
                title={article.title}
                description={article.content}
                sourceName={article.sourceName}
                sourceColor={getSourceColor(article.sourceName)}
                pubDate={article.pubDateFormatted}
                tags={article.tags}
                thumbnail={article.thumbnail}
                link={article.link}
                isRead={readArticles.has(article.link)}
                bookmarkCount={article.bookmarkCount}
              />
            </li>
          ))}
        </ul>

        {/* Infinite scroll sentinel */}
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-8" role="status" aria-label="読み込み中">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" aria-hidden="true" />
          </div>
        )}

        {/* End of list message */}
        {!hasMore && filteredArticles.length > 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <div className="w-12 h-px bg-border" />
            <p className="text-sm">すべての記事を表示しました</p>
          </div>
        )}

        {filteredArticles.length === 0 && (
          <div className="text-center py-16 text-muted-foreground" role="status">
            記事が見つかりませんでした
          </div>
        )}
      </main>

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        sources={settingsSources}
        onSourceToggle={handleSourceToggle}
        onReset={handleSettingsReset}
        onSave={handleSettingsSave}
      />
    </div>
  );
}
