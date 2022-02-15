module.exports = {
  displayName: 'ng2-dragula',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/spec/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$'
    },
  },
  coverageDirectory: '../../coverage/ng2-dragula',
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment'
  ],
  transform: { '^.+.(ts|mjs|js|html)$': 'jest-preset-angular' },
  transformIgnorePatterns: ['../../node_modules/(?!.*.mjs$)'],
  moduleFileExtensions: ['mjs', 'ts', 'js', 'html']
};
