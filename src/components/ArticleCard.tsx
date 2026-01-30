import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  title: string;
  description?: string;
  sourceName: string;
  sourceColor: string;
  pubDate: string;
  tags: string[];
  thumbnail?: string;
  link: string;
  isRead?: boolean;
  bookmarkCount?: number;
}

export function ArticleCard({
  title,
  description,
  sourceName,
  sourceColor,
  pubDate,
  tags,
  thumbnail,
  link,
  isRead = false,
  bookmarkCount,
}: ArticleCardProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title}を読む（${sourceName}）`}
      className="flex gap-4 px-4 py-5 border-b border-border hover:bg-muted/50 transition-colors group"
    >
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        {/* Meta */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: sourceColor }}
            />
            <span className="text-xs text-muted-foreground">{sourceName}</span>
          </div>
          <span className="text-xs text-muted-foreground">{pubDate}</span>
          {bookmarkCount !== undefined && bookmarkCount > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-[10px] font-bold text-[#00A4DE]">B!</span>
              {bookmarkCount}
            </span>
          )}
          {isRead && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              既読
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3
          className={`text-base font-medium leading-snug ${
            isRead ? "text-muted-foreground" : "text-foreground"
          }`}
        >
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail */}
      {thumbnail && (
        <div
          className={`flex-shrink-0 self-start w-[120px] aspect-video rounded-lg overflow-hidden bg-muted ${
            isRead ? "opacity-50" : ""
          }`}
        >
          <img
            src={thumbnail}
            alt={`${title}のサムネイル画像`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

    </a>
  );
}
