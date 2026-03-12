export function calculateRICE(scores: {
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
}): number {
  if (scores.effort === 0) return 0;
  return (scores.reach * scores.impact * scores.confidence) / scores.effort;
}

export function calculateICE(
  impact: number,
  confidence: number,
  ease: number
): number {
  return (impact * confidence * ease) / 3;
}
