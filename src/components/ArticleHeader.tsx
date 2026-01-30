import { RefreshCw } from "lucide-react";

interface ArticleHeaderProps {
  lastUpdated: string;
  filter: "all" | "unread";
  onFilterChange: (filter: "all" | "unread") => void;
}

export function ArticleHeader({
  lastUpdated,
  filter,
  onFilterChange,
}: ArticleHeaderProps) {

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 w-full">
      {/* Title Group - Left */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-normal tracking-tight text-foreground">
          Latest Articles
        </h1>
        <p className="text-sm text-muted-foreground">
          Curated from your RSS feeds
        </p>
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw className="w-3 h-3" />
          <span className="text-xs">Last updated: {lastUpdated}</span>
        </div>
      </div>

      {/* Filter Group - Right */}
      <div className="flex items-center gap-4">
        {/* Filter Tabs (All/Unread) */}
        <div className="flex items-center bg-muted rounded-md p-1" role="tablist" aria-label="記事フィルター">
          <button
            onClick={() => onFilterChange("all")}
            role="tab"
            aria-selected={filter === "all"}
            aria-label="すべての記事を表示"
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              filter === "all"
                ? "bg-background text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange("unread")}
            role="tab"
            aria-selected={filter === "unread"}
            aria-label="未読の記事のみ表示"
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              filter === "unread"
                ? "bg-background text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Unread
          </button>
        </div>

      </div>
    </div>
  );
}
