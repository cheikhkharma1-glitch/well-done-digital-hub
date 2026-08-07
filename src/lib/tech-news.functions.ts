import { createServerFn } from "@tanstack/react-start";

export type TechNewsItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  category: "IA" | "Cybersécurité" | "Dev Web & Mobile" | "Tech";
  excerpt: string;
  publishedAt: string | null;
  image: string | null;
};

const FEEDS: { url: string; source: string; category: TechNewsItem["category"] }[] = [
  { url: "https://feeds.arstechnica.com/arstechnica/technology-lab", source: "Ars Technica", category: "Tech" },
  { url: "https://www.theverge.com/rss/index.xml", source: "The Verge", category: "Tech" },
  { url: "https://venturebeat.com/category/ai/feed/", source: "VentureBeat AI", category: "IA" },
  { url: "https://www.technologyreview.com/topic/artificial-intelligence/feed", source: "MIT Tech Review", category: "IA" },
  { url: "https://www.bleepingcomputer.com/feed/", source: "BleepingComputer", category: "Cybersécurité" },
  { url: "https://feeds.feedburner.com/TheHackersNews", source: "The Hacker News", category: "Cybersécurité" },
  { url: "https://dev.to/feed/tag/webdev", source: "DEV Community", category: "Dev Web & Mobile" },
  { url: "https://css-tricks.com/feed/", source: "CSS-Tricks", category: "Dev Web & Mobile" },
];

function decode(str: string) {
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/\s+/g, " ")
    .trim();
}

function pick(block: string, tag: string) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? decode(m[1]) : "";
}

function pickLink(block: string) {
  const rss = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
  if (rss && rss[1].trim()) return decode(rss[1]);
  const atom = block.match(/<link[^>]*href="([^"]+)"[^>]*\/?>/i);
  return atom ? atom[1] : "";
}

function pickImage(block: string) {
  const patterns = [
    /<media:content[^>]*url="([^"]+)"/i,
    /<media:thumbnail[^>]*url="([^"]+)"/i,
    /<enclosure[^>]*url="([^"]+)"[^>]*type="image/i,
    /<img[^>]*src="([^"]+)"/i,
  ];
  for (const p of patterns) {
    const m = block.match(p);
    if (m) return m[1];
  }
  return null;
}

function parseFeed(xml: string, source: string, category: TechNewsItem["category"]): TechNewsItem[] {
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/(item|entry)>/gi) ?? [];
  return blocks.slice(0, 8).map((b, i) => {
    const title = pick(b, "title");
    const link = pickLink(b);
    const raw =
      pick(b, "description") || pick(b, "summary") || pick(b, "content:encoded") || pick(b, "content");
    const date = pick(b, "pubDate") || pick(b, "published") || pick(b, "updated");
    const parsed = date ? new Date(date) : null;
    return {
      id: `${source}-${i}-${link || title}`,
      title,
      link,
      source,
      category,
      excerpt: raw.slice(0, 220),
      publishedAt: parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : null,
      image: pickImage(b),
    };
  });
}

let cache: { at: number; items: TechNewsItem[] } | null = null;
const TTL = 10 * 60 * 1000;

export const getTechNews = createServerFn({ method: "GET" }).handler(async () => {
  if (cache && Date.now() - cache.at < TTL) {
    return { items: cache.items, updatedAt: new Date(cache.at).toISOString() };
  }

  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(feed.url, {
          signal: controller.signal,
          headers: { "User-Agent": "WellDoneServicesBot/1.0", Accept: "application/rss+xml, application/xml, text/xml, */*" },
        });
        if (!res.ok) return [] as TechNewsItem[];
        const xml = await res.text();
        return parseFeed(xml, feed.source, feed.category);
      } finally {
        clearTimeout(timer);
      }
    }),
  );

  const items = results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .filter((i) => i.title && i.link)
    .sort((a, b) => (new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()))
    .slice(0, 36);

  if (items.length) cache = { at: Date.now(), items };

  return { items, updatedAt: new Date().toISOString() };
});
