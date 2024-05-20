import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["dist/"]
  },

  {
    rules: {
      "no-unused-vars": 'error',
      "no-console": "warn",
      "no-unused-expressions": "error",
      "prefer-const": "error",
      "no-undef": "error",
    }
  },
  eslintConfigPrettier,
];