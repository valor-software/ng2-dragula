import baseConfig from '../../eslint.config.mjs';
import nx from '@nx/eslint-plugin';

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/prefer-inject': 'off',
      // the Angular 22 migration pins existing components to ChangeDetectionStrategy.Eager to keep their behaviour
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    },
  },
  ...nx.configs['flat/angular-template'],
  {
    // accessibility rules added to angular-eslint 22's recommended set; this example intentionally
    // demonstrates (click) on draggable divs and predates them
    files: ['**/08-click.component.html'],
    rules: {
      '@angular-eslint/template/label-has-associated-control': 'off',
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
    },
  },
];
