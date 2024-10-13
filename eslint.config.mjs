import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierConfig from 'eslint-plugin-prettier/recommended';
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierConfig
);