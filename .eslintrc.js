module.exports = {
  env: {
    jest: true,
  },
  extends: [
    'graphity',
    'graphity/typescript',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
}
