import { GoogleGenerativeAI } from "@google/generative-ai";
import keywordsConfig from "../data/keywords.json";
import { loadCache, saveCache } from "./cache";

interface Keyword {
  name: string;
  aliases: string[];
}

const keywords: Keyword[] = keywordsConfig.keywords;

// API key チェック（起動時に一度だけ警告）
const apiKey = process.env.GOOGLE_API_KEY;
const isProduction = import.meta.env.PROD;
let apiKeyWarned = false;

/**
 * キーワードマッチングでタグを検出
 */
function matchKeywords(title: string, content: string): string[] {
  const text = `${title} ${content}`.toLowerCase();
  const matched: string[] = [];

  for (const keyword of keywords) {
    const patterns = [keyword.name, ...keyword.aliases];
    for (const pattern of patterns) {
      // 大文字小文字を区別しないマッチング
      if (text.includes(pattern.toLowerCase())) {
        if (!matched.includes(keyword.name)) {
          matched.push(keyword.name);
        }
        break;
      }
    }
  }

  return matched;
}

/**
 * Gemini APIでタグを生成（ビルド時のみ実行）
 */
async function generateTagsWithAI(
  title: string,
  content: string
): Promise<string[]> {
  // 開発時はAI生成をスキップ
  if (!isProduction) {
    return [];
  }

  if (!apiKey) {
    if (!apiKeyWarned) {
      console.warn("GOOGLE_API_KEY not set, skipping AI tag generation");
      apiKeyWarned = true;
    }
    return [];
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const keywordNames = keywords.map((k) => k.name).join(", ");

    const prompt = `以下の技術記事に関連するタグを、提供されたキーワードリストから3〜5個選んでください。
リストにない場合は、適切な技術キーワードを提案しても構いません。

キーワードリスト: ${keywordNames}

記事タイトル: ${title}
記事概要: ${content}

JSON配列形式で返してください（例: ["React", "TypeScript", "フロントエンド"]）。
JSON配列のみを返し、他の説明は不要です。`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    // JSON配列をパース
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const tags = JSON.parse(jsonMatch[0]) as string[];
      return tags.slice(0, 5);
    }

    return [];
  } catch (error) {
    console.error("AI tag generation failed:", error);
    return [];
  }
}

/**
 * ハイブリッドタグ生成（マッチング優先、0件ならAI）
 */
export async function generateTags(
  url: string,
  title: string,
  content: string
): Promise<string[]> {
  // キャッシュ確認
  const cache = loadCache();
  if (cache[url]) {
    return cache[url];
  }

  // 1. キーワードマッチング
  let tags = matchKeywords(title, content);

  // 2. マッチ0件ならAIで生成
  if (tags.length === 0) {
    tags = await generateTagsWithAI(title, content);
  }

  // キャッシュ保存
  if (tags.length > 0) {
    cache[url] = tags;
    saveCache(cache);
  }

  return tags;
}
