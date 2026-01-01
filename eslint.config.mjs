import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import eslint from '@eslint/js';
import { readGitignoreFiles } from 'eslint-gitignore';
import eslintPluginPrettierConfig from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

const __dirname = dirname(fileURLToPath(import.meta.url));
export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	eslintPluginPrettierConfig,
	{
		ignores: readGitignoreFiles({ cwd: __dirname }),
	},
);
