import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

/**
 * Thin ESLint pass alongside oxlint (`pnpm lint`).
 * Covers rules-of-hooks, exhaustive-deps, and React Compiler rules
 * (purity, refs, set-state-in-effect, …) via recommended-latest.
 * TypeScript is parsed only — type-aware TS rules stay with tsc/oxlint.
 */
export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  // Parser only — disable all TS stylistic/type rules from the base preset.
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    ...reactHooks.configs.flat["recommended-latest"],
  },
);
