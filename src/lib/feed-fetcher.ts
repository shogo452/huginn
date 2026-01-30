import Parser from "rss-parser";
import dayjs from "dayjs";
import feedsConfig from "../data/feeds.json";
import { generateTags } from "./tag-generator";

export interface FeedSource {
  name: string;
  url: string;
  siteUrl: string;
}

export interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  pubDateFormatted: string;
  sourceName: string;
  sourceUrl: string;
  content?: string;
  thumbnail?: string;
  tags: string[];
  bookmarkCount?: number;
}

// カスタムフィールドを含むパーサー設定
type CustomFeed = {
  image?: { url?: string };
};

type CustomItem = {
  enclosure?: { url?: string; type?: string };
  "media:thumbnail"?: { $?: { url?: string } };
  "media:content"?: { $?: { url?: string; medium?: string } };
  "content:encoded"?: string;
  "hatena:bookmarkcount"?: string;
  "hatena:imageurl"?: string;
  "dc:subject"?: string | string[];
};

const parser: Parser<CustomFeed, CustomItem> = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "RSS Feed Reader/1.0",
  },
  customFields: {
    item: [
      ["enclosure", "enclosure"],
      ["media:thumbnail", "media:thumbnail"],
      ["media:content", "media:content"],
      ["content:encoded", "content:encoded"],
      ["hatena:bookmarkcount", "hatena:bookmarkcount"],
      ["hatena:imageurl", "hatena:imageurl"],
      ["dc:subject", "dc:subject"],
    ],
  },
});

// HTMLからimg srcを抽出
function extractImageFromHtml(html: string | undefined): string | undefined {
  if (!html) return undefined;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
}

// 様々なソースからサムネイルを取得
function extractThumbnail(item: CustomItem & Parser.Item): string | undefined {
  // 0. hatena:imageurl (はてなブックマーク)
  if (item["hatena:imageurl"]) {
    return item["hatena:imageurl"];
  }

  // 1. enclosure (Zenn, はてな等)
  if (item.enclosure?.url && item.enclosure.type?.startsWith("image/")) {
    return item.enclosure.url;
  }
  if (item.enclosure?.url && /\.(jpg|jpeg|png|gif|webp)/i.test(item.enclosure.url)) {
    return item.enclosure.url;
  }

  // 2. media:thumbnail
  if (item["media:thumbnail"]?.$?.url) {
    return item["media:thumbnail"].$.url;
  }

  // 3. media:content (画像の場合)
  if (item["media:content"]?.$?.url && item["media:content"]?.$?.medium === "image") {
    return item["media:content"].$.url;
  }

  // 4. content:encoded からimg抽出
  const fromContent = extractImageFromHtml(item["content:encoded"]);
  if (fromContent) return fromContent;

  // 5. content からimg抽出
  const fromContentSnippet = extractImageFromHtml(item.content);
  if (fromContentSnippet) return fromContentSnippet;

  return undefined;
}

// タグをサニタイズ（URL非互換文字を置換）
function sanitizeTag(tag: string): string {
  return tag
    .replace(/\//g, "-")  // スラッシュをハイフンに
    .replace(/\\/g, "-")  // バックスラッシュをハイフンに
    .replace(/[?#%]/g, "") // クエリ文字を削除
    .trim();
}

// dc:subjectからタグを抽出
function extractSubjectTags(item: CustomItem): string[] {
  const subject = item["dc:subject"];
  if (!subject) return [];
  const tags = Array.isArray(subject) ? subject : [subject];
  return tags.map(sanitizeTag).filter(tag => tag.length > 0);
}

interface RawFeedItem {
  title: string;
  link: string;
  pubDate: string;
  pubDateFormatted: string;
  sourceName: string;
  sourceUrl: string;
  content: string;
  thumbnail?: string;
  bookmarkCount?: number;
  subjectTags: string[];
}

async function fetchFeed(source: FeedSource): Promise<RawFeedItem[]> {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items || []).map((item) => {
      const customItem = item as CustomItem & Parser.Item;
      const bookmarkCountStr = customItem["hatena:bookmarkcount"];
      const bookmarkCount = bookmarkCountStr ? parseInt(bookmarkCountStr, 10) : undefined;

      const dateStr = item.pubDate || item.isoDate || "";
      return {
        title: item.title || "No Title",
        link: item.link || "",
        pubDate: dateStr,
        pubDateFormatted: dateStr
          ? dayjs(dateStr).format("YYYY/MM/DD HH:mm")
          : "",
        sourceName: source.name,
        sourceUrl: source.siteUrl,
        content: item.contentSnippet?.slice(0, 200) || "",
        thumbnail: extractThumbnail(customItem),
        bookmarkCount: Number.isNaN(bookmarkCount) ? undefined : bookmarkCount,
        subjectTags: extractSubjectTags(customItem),
      };
    });
  } catch (error) {
    console.error(`Failed to fetch feed from ${source.name}:`, error);
    return [];
  }
}

export type SortOrder = "date" | "bookmarks";

export async function fetchAllFeeds(sortOrder: SortOrder = "date"): Promise<FeedItem[]> {
  const sources: FeedSource[] = feedsConfig.feeds;
  const results = await Promise.all(sources.map(fetchFeed));
  const rawItems = results.flat();

  // タグを生成（並列処理、ただしレート制限考慮で5件ずつ）
  const items: FeedItem[] = [];
  const batchSize = 5;

  for (let i = 0; i < rawItems.length; i += batchSize) {
    const batch = rawItems.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        // dc:subjectタグがあればそれを優先、なければキーワードマッチング/AI生成
        // ただし、はてなブックマークのカテゴリは汎用的すぎるので除外
        let tags: string[];
        if (item.subjectTags.length > 0 && item.sourceName !== "はてなブックマーク") {
          tags = item.subjectTags.slice(0, 5);
        } else {
          tags = await generateTags(item.link, item.title, item.content);
        }
        return {
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          pubDateFormatted: item.pubDateFormatted,
          sourceName: item.sourceName,
          sourceUrl: item.sourceUrl,
          content: item.content,
          thumbnail: item.thumbnail,
          tags,
          bookmarkCount: item.bookmarkCount,
        };
      })
    );
    items.push(...batchResults);
  }

  // ソート
  if (sortOrder === "bookmarks") {
    items.sort((a, b) => (b.bookmarkCount || 0) - (a.bookmarkCount || 0));
  } else {
    items.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime() || 0;
      const dateB = new Date(b.pubDate).getTime() || 0;
      return dateB - dateA;
    });
  }

  return items;
}

export function getFeedSources(): FeedSource[] {
  return feedsConfig.feeds;
}
