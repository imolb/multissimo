import globals from 'globals'
import pluginJs from '@eslint/js'
import neostandard from 'neostandard'

export default neostandard(
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'script' }
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended
)
