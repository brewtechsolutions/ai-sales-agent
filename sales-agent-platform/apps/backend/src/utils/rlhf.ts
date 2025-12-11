/**
 * RLHF (Reinforcement Learning from Human Feedback) utilities
 */

import { ROBOTIC_PHRASES } from "../constants/ai";

/**
 * Detect robotic phrases in text
 */
export function detectRoboticPhrases(text: string): string[] {
  const textLower = text.toLowerCase();
  return ROBOTIC_PHRASES.filter((phrase) =>
    textLower.includes(phrase.toLowerCase())
  );
}

/**
 * Calculate edit distance (Levenshtein distance)
 */
export function calculateEditDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2[i - 1] === str1[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate human-likeness score (0-1)
 * Higher score = more human-like
 */
export function calculateHumanLikenessScore(text: string): number {
  let score = 0.5; // base score

  const textLower = text.toLowerCase();

  // Positive signals
  if (textLower.match(/\b(sure|got it|no problem|absolutely|of course)\b/)) {
    score += 0.2;
  }
  if (text.match(/[!?]/)) {
    score += 0.1; // Natural punctuation
  }
  if (text.length < 100) {
    score += 0.1; // Concise
  }
  if (textLower.match(/\b(i'm|you're|that's|it's)\b/)) {
    score += 0.1; // Contractions
  }

  // Negative signals
  const roboticPhrases = detectRoboticPhrases(text);
  if (roboticPhrases.length > 0) {
    score -= 0.3;
  }
  if (textLower.match(/\b(understand|assist|inquire|utilize)\b/)) {
    score -= 0.1; // Formal words
  }
  if (text.length > 200) {
    score -= 0.1; // Too long
  }

  return Math.max(0, Math.min(1, score));
}

/**
 * Calculate natural language score (0-1)
 */
export function calculateNaturalLanguageScore(text: string): number {
  let score = 0.5;

  const sentences = text.split(/[.!?]/).filter((s) => s.trim().length > 0);

  if (sentences.length > 0) {
    const avgLength =
      sentences.reduce((sum, s) => sum + s.split(" ").length, 0) /
      sentences.length;
    if (avgLength >= 8 && avgLength <= 20) {
      score += 0.2; // Natural sentence length
    }
  }

  // Check for variety in sentence structure
  const lengths = sentences.map((s) => s.split(" ").length);
  const uniqueLengths = new Set(lengths).size;
  if (uniqueLengths > 2) {
    score += 0.2;
  }

  // Check for conversational markers
  if (text.match(/\b(yeah|yep|nope|hmm|oh|well)\b/i)) {
    score += 0.1;
  }

  return Math.max(0, Math.min(1, score));
}

/**
 * Check if agent response is a manual override
 * (completely different from AI suggestion)
 */
export function isManualOverride(
  aiSuggestion: string,
  agentResponse: string,
  threshold: number = 0.7
): boolean {
  const editDistance = calculateEditDistance(aiSuggestion, agentResponse);
  const maxDistance = aiSuggestion.length * threshold;
  return editDistance > maxDistance;
}

