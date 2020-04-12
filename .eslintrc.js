module.exports = {
  extends: [
    'graphity',
    'graphity/typescript',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
}
