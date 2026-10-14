import baseConfig from '../../eslint.config.mjs';
import nx from '@nx/eslint-plugin';

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['libs/ng2-dragula/tsconfig.*?.json'],
      },
    },
    rules: {
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/prefer-inject': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      // the Angular 22 migration pins existing components to ChangeDetectionStrategy.Eager to keep their behaviour
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    },
  },
  ...nx.configs['flat/angular-template'],
];
