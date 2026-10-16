import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  {
    rules: {},
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  ...nx.configs['flat/typescript'],
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // typescript-eslint v8 removed its `semi` / `no-extra-semi` extension rules; the core rules take over
      semi: ['error'],
      '@typescript-eslint/ban-ts-comment': 'off',
      // new in typescript-eslint 8's recommended set; keep allowing the `a && a.b()` idiom used in the library
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true }],
      'no-extra-semi': 'error',
      '@angular-eslint/prefer-inject': 'off',
    },
  },
  ...nx.configs['flat/javascript'],
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      'no-extra-semi': 'error',
    },
  },
];
