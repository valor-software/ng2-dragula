/* eslint-disable */
export default {
  displayName: 'ng2-dragula',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/spec/test-setup.ts'],
  globals: {},
  coverageDirectory: '../../coverage/libs/ng2-dragula',
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  transform: {
    '^.+.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  transformIgnorePatterns: ['../../node_modules/(?!.*.mjs$)'],
  moduleFileExtensions: ['mjs', 'ts', 'js', 'html'],
};
