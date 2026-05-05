import tseslint from "typescript-eslint";

const jsTsFiles = "**/*.{ts,js}";
const typescriptParserOptions = {
  ecmaVersion: "latest",
  sourceType: "module",
};

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/node_modules/**",
      "back/node_modules/**",
    ],
  },
  ...tseslint.configs.recommended.map((c) => ({
    ...c,
    files: [jsTsFiles],
  })),
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      parserOptions: typescriptParserOptions,
    },
  },
);
