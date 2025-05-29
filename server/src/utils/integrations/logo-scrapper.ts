import axios from "axios";
import { JSDOM } from "jsdom";

export const scrapeLogoUrl = async (
  websiteUrl: string
): Promise<string | null> => {
  try {
     const response = await axios.get(websiteUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 5000,
    });
    const html = response.data;

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const icons = document.querySelectorAll(
      'link[rel*="icon"], link[rel="shortcut icon"]'
    );
    for (const icon of icons) {
      const href = (icon as HTMLLinkElement).href;
      if (href) {
        return new URL(href, websiteUrl).href;
      }
    }

    const logoImg = document.querySelector(
      'img[alt*="logo"]'
    ) as HTMLImageElement | null;
    if (logoImg?.src) {
      return new URL(logoImg.src, websiteUrl).href;
    }

    return null;
  } catch (err) {
    console.error("Failed to fetch logo:", err);
    return null;
  }
};
