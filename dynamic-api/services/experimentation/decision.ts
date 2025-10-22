// services/experimentation/decision.ts
export type VariantMetrics = { exposures: number; conversions: number; clicks: number; };
export type Variant = { key: string; assets: any; };
export type Arm = { variant: Variant; metrics: VariantMetrics; };

// Simple Beta sampling for conversion-rate optimization
function betaSample(a: number, b: number) {
  // Using Math.random() approximation for demo; in production use a proper beta sampler or approximate with gamma
  // Poor-man's beta via sum of uniforms (not exact) but acceptable for demo purposes
  const n = 12;
  let x = 0;
  for (let i = 0; i < n; i++) x += Math.random();
  const u = x / n;
  // Invert incomplete beta is complex; fallback: Thompson-like index = (a)/(a+b) + noise
  const mean = a / (a + b);
  return mean + (u - 0.5) * 0.1; // small noise
}

export function thompsonPick(arms: Arm[]): Arm {
  if (arms.length === 0) throw new Error("No arms");
  // ensure each arm has at least pseudo counts
  const scored = arms.map(a => {
    const alpha = 1 + (a.metrics.conversions || 0);
    const beta = 1 + Math.max(0, a.metrics.exposures - (a.metrics.conversions || 0));
    const score = betaSample(alpha, beta);
    return { arm: a, score };
  });
  scored.sort((x, y) => y.score - x.score);
  return scored[0].arm;
}
