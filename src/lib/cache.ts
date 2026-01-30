import fs from "node:fs";
import path from "node:path";

const CACHE_DIR = ".cache";
const CACHE_FILE = "tags.json";

type TagCache = Record<string, string[]>;

function getCachePath(): string {
  return path.join(process.cwd(), CACHE_DIR, CACHE_FILE);
}

export function loadCache(): TagCache {
  const cachePath = getCachePath();

  try {
    if (fs.existsSync(cachePath)) {
      const data = fs.readFileSync(cachePath, "utf-8");
      return JSON.parse(data) as TagCache;
    }
  } catch (error) {
    console.warn("Failed to load cache:", error);
  }

  return {};
}

export function saveCache(cache: TagCache): void {
  const cachePath = getCachePath();
  const cacheDir = path.dirname(cachePath);

  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf-8");
  } catch (error) {
    console.warn("Failed to save cache:", error);
  }
}

export function clearCache(): void {
  const cachePath = getCachePath();

  try {
    if (fs.existsSync(cachePath)) {
      fs.unlinkSync(cachePath);
    }
  } catch (error) {
    console.warn("Failed to clear cache:", error);
  }
}
