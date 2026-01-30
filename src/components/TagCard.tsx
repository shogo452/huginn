import { Card } from "@/components/ui/card";

interface TagCardProps {
  name: string;
  count: number;
  href: string;
  rssUrl?: string;
}

export function TagCard({ name, count, href, rssUrl }: TagCardProps) {
  return (
    <Card className="p-5 hover:border-primary transition-colors">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <a href={href}>
            <h3 className="text-lg font-semibold text-foreground hover:underline">{name}</h3>
          </a>
          {rssUrl && (
            <a
              href={rssUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              title={`${name}のRSSフィード`}
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 11a9 9 0 0 1 9 9"></path>
                <path d="M4 4a16 16 0 0 1 16 16"></path>
                <circle cx="5" cy="19" r="1"></circle>
              </svg>
              <span>RSS</span>
            </a>
          )}
        </div>
        <a href={href}>
          <p className="text-xs text-muted-foreground">{count} articles</p>
        </a>
      </div>
    </Card>
  );
}
