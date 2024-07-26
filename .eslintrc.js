module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:perfectionist/recommended-natural',
    'prettier',
  ],
  ignorePatterns: [
    '.eslintrc.js',
    'dist/*',
    'node_modules/*',
    'prettier.config.js',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'import',
    'perfectionist',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'comma-dangle': [ 'error', {
      'arrays': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'always-multiline',
      'imports': 'always-multiline',
      'objects': 'always-multiline',
    } ],
    'import/named': "error",
    'import/newline-after-import': [ 'error', { 'count': 1 } ],
    'import/no-anonymous-default-export': 'off',
    'import/no-cycle': 1,
    'import/no-self-import': 1,
    'import/order': [ 'error', {
      'alphabetize': {
        'caseInsensitive': true,
        'order': 'asc',
      },
      'newlines-between': 'always',
      'groups': [
        'type',
        'builtin',
        'external',
        'parent',
        'sibling',
        'index',
      ],
    },
    ],
    'no-console': ['error'],
    'no-process-env': 2,
    'no-unused-expressions': 2,
    'object-curly-spacing': [ 'error', 'always' ],
    'perfectionist/sort-imports': 'off',
    'prettier/prettier': ['error'],
    'quotes': [ 'error', 'single', { 'allowTemplateLiterals': true } ],
    'semi': [ 'error', 'never' ],
  },
}