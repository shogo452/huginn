import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface TagShowProps {
  tag: string;
  articles: Article[];
  baseUrl: string;
}

export function TagShow({ tag, articles, baseUrl }: TagShowProps) {
  const [sortOrder, setSortOrder] = useState<"date" | "bookmarks">("date");

  const sortedArticles = useMemo(() => {
    const result = [...articles];
    result.sort((a, b) => {
      if (sortOrder === "bookmarks") {
        return (b.bookmarkCount || 0) - (a.bookmarkCount || 0);
      }
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    });
    return result;
  }, [articles, sortOrder]);

  return (
    <main className="p-6 lg:p-8 lg:pt-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-6 text-xs text-muted-foreground" aria-label="パンくずリスト">
        <a
          href={`${baseUrl}tags/`}
          className="hover:text-foreground transition-colors"
        >
          Tags
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-foreground" aria-current="page">{tag}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold text-foreground">
            {tag}
          </h1>
          <p className="text-sm text-muted-foreground">
            {articles.length} articles tagged with {tag}
          </p>
        </div>

        {/* Sort Buttons */}
        <div className="flex items-center gap-2" role="group" aria-label="並び替え">
          <Button
            variant={sortOrder === "date" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortOrder("date")}
            aria-pressed={sortOrder === "date"}
            aria-label="新着順で並び替え"
            className="text-sm"
          >
            Latest
          </Button>
          <Button
            variant={sortOrder === "bookmarks" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortOrder("bookmarks")}
            aria-pressed={sortOrder === "bookmarks"}
            aria-label="人気順で並び替え"
            className="text-sm"
          >
            Popular
          </Button>
        </div>
      </div>

      {/* Article List */}
      {sortedArticles.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground" role="status">
          記事が見つかりませんでした
        </div>
      ) : (
        <ul className="flex flex-col" role="list" aria-label={`${tag}の記事一覧`}>
          {sortedArticles.map((article) => (
            <li key={article.link}>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${article.title}を読む（${article.sourceName}）`}
              className="flex gap-4 px-4 py-5 border-b border-border hover:bg-muted/50 transition-colors group"
            >
              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                {/* Meta */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getSourceColor(article.sourceName) }}
                    />
                    {article.sourceName}
                  </span>
                  <span className="text-muted-foreground">{article.pubDateFormatted}</span>
                  {article.bookmarkCount !== undefined && article.bookmarkCount > 0 && (
                    <span className="text-muted-foreground flex items-center gap-1">
                      <span className="text-[10px] font-bold text-[#00A4DE]">B!</span>
                      {article.bookmarkCount}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-medium text-foreground leading-snug">
                  {article.title}
                </h3>

                {/* Description */}
                {article.content && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.content}
                  </p>
                )}
              </div>

              {/* Thumbnail */}
              {article.thumbnail && (
                <div className="flex-shrink-0 self-start w-[120px] aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={article.thumbnail}
                    alt={`${article.title}のサムネイル画像`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

            </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
