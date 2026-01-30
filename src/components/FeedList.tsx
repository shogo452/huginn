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

interface FeedSource {
  name: string;
  url: string;
  siteUrl: string;
}

interface FeedListProps {
  sources: FeedSource[];
}

export function FeedList({ sources }: FeedListProps) {
  return (
    <main className="p-6 lg:p-8 lg:pt-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl lg:text-4xl font-normal tracking-tight text-foreground">
            RSS Feeds
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your subscribed feeds
          </p>
        </div>
        <span className="text-sm text-muted-foreground">
          {sources.length} feeds
        </span>
      </div>

      {/* Feed Table */}
      {sources.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          フィードが登録されていません
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center bg-muted/50 px-5 py-4 border-b border-border">
            <span className="w-[200px] text-xs font-semibold text-muted-foreground">
              Site Name
            </span>
            <span className="flex-1 text-xs font-semibold text-muted-foreground">
              Feed URL
            </span>
          </div>

          {/* Table Body */}
          {sources.map((source, index) => (
            <div
              key={source.url}
              className={`flex items-center px-5 py-4 ${
                index < sources.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="w-[200px] flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getSourceColor(source.name) }}
                />
                <a
                  href={source.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {source.name}
                </a>
              </div>
              <span className="flex-1 text-sm text-muted-foreground font-mono truncate">
                {source.url}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
