import tokensJson from "./tokens.json";

type Tokens = typeof tokensJson;

type Colors = Tokens["colors"];
type Spacing = Tokens["spacing"];
type Typography = Tokens["typography"];

export const tokens = tokensJson as Tokens;
export const colors: Colors = tokens.colors;
export const spacing: Spacing = tokens.spacing;
export const typography: Typography = tokens.typography;

export type { Colors, Spacing, Typography };
export default tokens;
