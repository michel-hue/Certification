export default {
  '*.{ts,mts,mjs,vue}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,css,yml,yaml}': 'prettier --write',
}
