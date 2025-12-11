/**
 * Language detection and utilities
 */

import { Language } from "../constants/company";

/**
 * Detect customer language from messages
 * Returns language code: en, bm, zh, ta
 */
export function detectCustomerLanguage(messages: Array<{ content: string }>): string {
  if (!messages || messages.length === 0) {
    return Language.ENGLISH;
  }

  // Get recent messages (last 5)
  const recentMessages = messages
    .slice(-5)
    .map((m) => m.content.toLowerCase())
    .join(" ");

  // Bahasa Malaysia detection
  if (
    recentMessages.match(
      /terima kasih|boleh|tak|betul|selamat|saya|awak|macam mana|berapa|murah|mahal|diskaun|ya|tidak|ok|baik/
    )
  ) {
    return Language.BAHASA_MALAYSIA;
  }

  // Chinese (Mandarin) detection
  if (
    recentMessages.match(
      /谢谢|你好|可以|多少钱|太贵|便宜|折扣|好的|是的|不是|怎么|什么|哪里|什么时候/
    )
  ) {
    return Language.MANDARIN;
  }

  // Tamil detection (optional)
  if (recentMessages.match(/நன்றி|ஆம்|இல்லை|எவ்வளவு|விலை/)) {
    return Language.TAMIL;
  }

  return Language.ENGLISH; // Default to English
}

