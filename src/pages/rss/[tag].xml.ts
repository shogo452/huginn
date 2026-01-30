import type { GetStaticPaths } from "astro";
import rss from "@astrojs/rss";
import { fetchAllFeeds } from "../../lib/feed-fetcher";
import keywordsData from "../../data/keywords.json";

export const getStaticPaths: GetStaticPaths = async () => {
  return keywordsData.keywords.map((keyword) => ({
    params: { tag: keyword.name },
  }));
};

export async function GET({ params, site }: { params: { tag: string }; site: URL | undefined }) {
  const tag = params.tag;
  if (!tag) {
    return new Response("Tag not found", { status: 404 });
  }

  const allItems = await fetchAllFeeds();

  // タグでフィルタリング（大文字小文字を無視）
  const filteredItems = allItems.filter((item) =>
    item.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );

  return rss({
    title: `Huginn - ${tag}`,
    description: `${tag}に関する記事のRSSフィード`,
    site: site ?? "https://your-username.github.io/huginn/",
    items: filteredItems.map((item) => ({
      title: item.title,
      pubDate: new Date(item.pubDate),
      link: item.link,
      description: item.content,
      categories: item.tags,
    })),
    customData: `<language>ja</language>`,
  });
}
