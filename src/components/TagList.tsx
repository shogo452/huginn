import { TagCard } from "./TagCard";

interface Tag {
  name: string;
  count: number;
}

interface TagListProps {
  tags: Tag[];
  baseUrl: string;
  keywordNames: string[];
}

export function TagList({ tags, baseUrl, keywordNames }: TagListProps) {
  // キーワード名のSetを作成（大文字小文字を無視して比較用）
  const keywordSet = new Set(keywordNames.map((k) => k.toLowerCase()));

  return (
    <main className="p-6 lg:p-8 lg:pt-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl lg:text-4xl font-normal tracking-tight text-foreground">
            Tags
          </h1>
          <p className="text-sm text-muted-foreground">
            Organize your articles with tags
          </p>
        </div>
        <span className="text-sm text-muted-foreground">
          {tags.length} tags
        </span>
      </div>

      {/* Tag Grid */}
      {tags.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          タグが見つかりませんでした
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => {
            const hasRss = keywordSet.has(tag.name.toLowerCase());
            return (
              <TagCard
                key={tag.name}
                name={tag.name}
                count={tag.count}
                href={`${baseUrl}tags/${encodeURIComponent(tag.name)}/`}
                rssUrl={hasRss ? `${baseUrl}rss/${encodeURIComponent(tag.name)}.xml` : undefined}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
