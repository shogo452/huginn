import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface ConfigEditorProps {
  initialKeywords: object;
  initialFeeds: object;
}

export function ConfigEditor({ initialKeywords, initialFeeds }: ConfigEditorProps) {
  const [keywordsJson, setKeywordsJson] = useState(
    JSON.stringify(initialKeywords, null, 2)
  );
  const [feedsJson, setFeedsJson] = useState(
    JSON.stringify(initialFeeds, null, 2)
  );
  const [copiedKeywords, setCopiedKeywords] = useState(false);
  const [copiedFeeds, setCopiedFeeds] = useState(false);
  const [keywordsError, setKeywordsError] = useState<string | null>(null);
  const [feedsError, setFeedsError] = useState<string | null>(null);

  const validateJson = (value: string): boolean => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleKeywordsChange = (value: string) => {
    setKeywordsJson(value);
    if (validateJson(value)) {
      setKeywordsError(null);
    } else {
      setKeywordsError("Invalid JSON format");
    }
  };

  const handleFeedsChange = (value: string) => {
    setFeedsJson(value);
    if (validateJson(value)) {
      setFeedsError(null);
    } else {
      setFeedsError("Invalid JSON format");
    }
  };

  const copyToClipboard = async (text: string, type: "keywords" | "feeds") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "keywords") {
        setCopiedKeywords(true);
        setTimeout(() => setCopiedKeywords(false), 2000);
      } else {
        setCopiedFeeds(true);
        setTimeout(() => setCopiedFeeds(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatJson = (type: "keywords" | "feeds") => {
    try {
      if (type === "keywords") {
        const parsed = JSON.parse(keywordsJson);
        setKeywordsJson(JSON.stringify(parsed, null, 2));
        setKeywordsError(null);
      } else {
        const parsed = JSON.parse(feedsJson);
        setFeedsJson(JSON.stringify(parsed, null, 2));
        setFeedsError(null);
      }
    } catch {
      // Already showing error
    }
  };

  return (
    <main className="p-6 lg:p-8 lg:pt-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl lg:text-4xl font-normal tracking-tight text-foreground">
          Configuration
        </h1>
        <p className="text-sm text-muted-foreground">
          Edit and copy JSON configuration files
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Keywords Editor */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-medium text-foreground">keywords.json</h2>
              {keywordsError && (
                <span className="text-xs text-red-500">{keywordsError}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => formatJson("keywords")}
                disabled={!!keywordsError}
              >
                Format
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(keywordsJson, "keywords")}
                className="flex items-center gap-1.5"
              >
                {copiedKeywords ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
          <textarea
            value={keywordsJson}
            onChange={(e) => handleKeywordsChange(e.target.value)}
            className={`w-full h-[400px] p-4 font-mono text-sm bg-muted border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring ${
              keywordsError ? "border-red-500" : "border-border"
            }`}
            spellCheck={false}
          />
        </div>

        {/* Feeds Editor */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-medium text-foreground">feeds.json</h2>
              {feedsError && (
                <span className="text-xs text-red-500">{feedsError}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => formatJson("feeds")}
                disabled={!!feedsError}
              >
                Format
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(feedsJson, "feeds")}
                className="flex items-center gap-1.5"
              >
                {copiedFeeds ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
          <textarea
            value={feedsJson}
            onChange={(e) => handleFeedsChange(e.target.value)}
            className={`w-full h-[300px] p-4 font-mono text-sm bg-muted border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring ${
              feedsError ? "border-red-500" : "border-border"
            }`}
            spellCheck={false}
          />
        </div>
      </div>
    </main>
  );
}
