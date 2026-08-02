import { colors } from "./colors";
import { typography } from "./typography";
import { shadows } from "./shadows";
import * as animations from "./animations";

export const tokens = {
  colors,
  typography,
  shadows,
  animations,
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    full: "9999px",
  },
  spacing: {
    container: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1400px",
    },
    padding: {
      xs: "0.5rem",   // 8px
      sm: "0.75rem",  // 12px
      md: "1rem",     // 16px
      lg: "1.5rem",   // 24px
      xl: "2rem",     // 32px
      "2xl": "3rem",  // 48px
    },
  },
  icons: {
    sizes: {
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32,
    },
  },
} as const;

export type DesignTokens = typeof tokens;
export { colors, typography, shadows, animations };
