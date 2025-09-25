import { Injectable, Logger } from '@nestjs/common';
import { Language, LanguageDetectionResult } from './interfaces/conversation.interface';

@Injectable()
export class LanguageDetectionService {
  private readonly logger = new Logger(LanguageDetectionService.name);

  // Language detection patterns
  private readonly languagePatterns = {
    [Language.MS]: {
      keywords: [
        'saya', 'anda', 'terima kasih', 'selamat', 'bagaimana', 'boleh', 'tidak',
        'ya', 'tidak', 'minta', 'tolong', 'maaf', 'sila', 'jika', 'bila',
        'mana', 'kenapa', 'mengapa', 'apa', 'siapa', 'bila', 'di mana'
      ],
      characters: /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/,
      commonWords: ['dan', 'atau', 'dengan', 'untuk', 'dari', 'pada', 'yang', 'ini', 'itu']
    },
    [Language.ZH]: {
      keywords: [
        '你好', '谢谢', '请问', '可以', '不可以', '是的', '不是', '什么',
        '哪里', '什么时候', '为什么', '怎么', '谁', '多少', '几个'
      ],
      characters: /[\u4e00-\u9fff]/,
      commonWords: ['的', '了', '在', '是', '我', '你', '他', '她', '它', '们']
    },
    [Language.EN]: {
      keywords: [
        'hello', 'hi', 'thank you', 'please', 'can', 'cannot', 'yes', 'no',
        'what', 'where', 'when', 'why', 'how', 'who', 'how many', 'how much'
      ],
      characters: /[a-zA-Z]/,
      commonWords: ['the', 'and', 'or', 'with', 'for', 'from', 'on', 'in', 'at', 'to']
    }
  };

  /**
   * Detect language from input text
   */
  detectLanguage(text: string): LanguageDetectionResult {
    const cleanText = text.trim().toLowerCase();
    
    if (!cleanText) {
      return {
        language: Language.EN,
        confidence: 0,
        detectedText: text,
      };
    }

    const scores = this.calculateLanguageScores(cleanText);
    const detectedLanguage = this.getHighestScoringLanguage(scores);
    const confidence = this.calculateConfidence(scores, detectedLanguage);

    this.logger.debug(`Language detection: "${text}" -> ${detectedLanguage} (${confidence})`);

    return {
      language: detectedLanguage,
      confidence,
      detectedText: text,
    };
  }

  /**
   * Check if text contains mixed languages (Manglish)
   */
  isMixedLanguage(text: string): boolean {
    const cleanText = text.trim().toLowerCase();
    const languageCounts = this.countLanguageIndicators(cleanText);
    const languagesPresent = Object.values(languageCounts).filter(count => count > 0).length;
    
    return languagesPresent > 1;
  }

  /**
   * Get primary language from mixed language text
   */
  getPrimaryLanguageFromMixed(text: string): Language {
    const cleanText = text.trim().toLowerCase();
    const scores = this.calculateLanguageScores(cleanText);
    return this.getHighestScoringLanguage(scores);
  }

  /**
   * Mirror customer's language choice immediately
   */
  shouldMirrorLanguage(customerText: string, currentLanguage: Language): boolean {
    const detection = this.detectLanguage(customerText);
    
    // Mirror if confidence is high and different from current language
    return detection.confidence > 0.7 && detection.language !== currentLanguage;
  }

  private calculateLanguageScores(text: string): Record<Language, number> {
    const scores: Record<Language, number> = {
      [Language.EN]: 0,
      [Language.MS]: 0,
      [Language.ZH]: 0,
    };

    for (const [language, patterns] of Object.entries(this.languagePatterns)) {
      const lang = language as Language;
      
      // Check for character patterns
      if (patterns.characters.test(text)) {
        scores[lang] += 10;
      }

      // Check for keywords
      const keywordMatches = patterns.keywords.filter(keyword => 
        text.includes(keyword.toLowerCase())
      ).length;
      scores[lang] += keywordMatches * 5;

      // Check for common words
      const commonWordMatches = patterns.commonWords.filter(word => 
        text.includes(word.toLowerCase())
      ).length;
      scores[lang] += commonWordMatches * 2;

      // Check for specific patterns
      if (lang === Language.MS) {
        // Malay specific patterns
        if (/\b(saya|anda|kita|kami|mereka)\b/.test(text)) scores[lang] += 3;
        if (/\b(terima kasih|selamat|maaf)\b/.test(text)) scores[lang] += 3;
        if (/\b(bagaimana|boleh|tidak|ya)\b/.test(text)) scores[lang] += 2;
      } else if (lang === Language.ZH) {
        // Chinese specific patterns
        if (/\b(你好|谢谢|请问|可以)\b/.test(text)) scores[lang] += 3;
        if (/\b(什么|哪里|为什么|怎么)\b/.test(text)) scores[lang] += 2;
        if (/\b(是的|不是|好的|不好)\b/.test(text)) scores[lang] += 2;
      } else if (lang === Language.EN) {
        // English specific patterns
        if (/\b(hello|hi|thank you|please)\b/.test(text)) scores[lang] += 3;
        if (/\b(what|where|when|why|how)\b/.test(text)) scores[lang] += 2;
        if (/\b(yes|no|can|cannot)\b/.test(text)) scores[lang] += 2;
      }
    }

    return scores;
  }

  private getHighestScoringLanguage(scores: Record<Language, number>): Language {
    let maxScore = 0;
    let detectedLanguage = Language.EN;

    for (const [language, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedLanguage = language as Language;
      }
    }

    return detectedLanguage;
  }

  private calculateConfidence(scores: Record<Language, number>, detectedLanguage: Language): number {
    const maxScore = scores[detectedLanguage];
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    if (totalScore === 0) return 0;
    
    const confidence = maxScore / totalScore;
    return Math.min(confidence, 1); // Cap at 1.0
  }

  private countLanguageIndicators(text: string): Record<Language, number> {
    const counts: Record<Language, number> = {
      [Language.EN]: 0,
      [Language.MS]: 0,
      [Language.ZH]: 0,
    };

    for (const [language, patterns] of Object.entries(this.languagePatterns)) {
      const lang = language as Language;
      
      // Count character pattern matches
      const charMatches = (text.match(patterns.characters) || []).length;
      counts[lang] += charMatches;

      // Count keyword matches
      const keywordMatches = patterns.keywords.filter(keyword => 
        text.includes(keyword.toLowerCase())
      ).length;
      counts[lang] += keywordMatches;

      // Count common word matches
      const commonWordMatches = patterns.commonWords.filter(word => 
        text.includes(word.toLowerCase())
      ).length;
      counts[lang] += commonWordMatches;
    }

    return counts;
  }
}
