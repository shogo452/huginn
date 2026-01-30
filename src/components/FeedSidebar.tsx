import { ScrollArea } from "@/components/ui/scroll-area";

interface FeedSource {
  name: string;
  color: string;
  isActive?: boolean;
}

interface FeedSidebarProps {
  sources: FeedSource[];
  onSourceClick?: (sourceName: string) => void;
  activeSource?: string | null;
}

export function FeedSidebar({
  sources,
  onSourceClick,
  activeSource,
}: FeedSidebarProps) {
  return (
    <aside className="w-[280px] border-r border-border flex-shrink-0 hidden lg:block" aria-label="フィードソース">
      <nav className="p-6 pt-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Feed Sources
        </h2>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <ul className="flex flex-col" role="list" aria-label="ソース一覧">
            {sources.map((source) => (
              <li key={source.name}>
                <button
                  onClick={() => onSourceClick?.(source.name)}
                  aria-pressed={activeSource === source.name}
                  aria-label={`${source.name}の記事をフィルター${activeSource === source.name ? "（選択中）" : ""}`}
                  className={`w-full flex items-center gap-3 py-3 border-b border-border text-left transition-colors hover:bg-muted/50 ${
                    activeSource === source.name
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: source.color }}
                    aria-hidden="true"
                  />
                  <span className="text-sm">{source.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </nav>
    </aside>
  );
}
