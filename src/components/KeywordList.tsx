import { Badge } from "@/components/ui/badge";

interface Keyword {
  name: string;
  aliases: string[];
}

interface KeywordListProps {
  keywords: Keyword[];
  baseUrl: string;
}

export function KeywordList({ keywords, baseUrl }: KeywordListProps) {
  return (
    <main className="p-6 lg:p-8 lg:pt-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl lg:text-4xl font-normal tracking-tight text-foreground">
          Keywords
        </h1>
        <p className="text-sm text-muted-foreground">
          {keywords.length} keywords used for tag filtering
        </p>
      </div>

      {/* Keyword List */}
      <div className="flex flex-col gap-4">
        {keywords.map((keyword) => (
          <div
            key={keyword.name}
            className="flex flex-col gap-2 p-4 border border-border rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-base font-medium text-foreground">
                  {keyword.name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {keyword.aliases.length} aliases
                </Badge>
              </div>
              <a
                href={`${baseUrl}rss/${encodeURIComponent(keyword.name)}.xml`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                title={`${keyword.name}のRSSフィード`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 11a9 9 0 0 1 9 9"></path>
                  <path d="M4 4a16 16 0 0 1 16 16"></path>
                  <circle cx="5" cy="19" r="1"></circle>
                </svg>
                <span>RSS</span>
              </a>
            </div>
            {keyword.aliases.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keyword.aliases.map((alias) => (
                  <span
                    key={alias}
                    className="text-sm text-muted-foreground px-2 py-0.5 bg-muted rounded"
                  >
                    {alias}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
