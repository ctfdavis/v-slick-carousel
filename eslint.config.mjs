import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
export default [
  // add more generic rulesets here, such as:
  // js.configs.recommended,
  eslintConfigPrettier,
  ...pluginVue.configs['flat/recommended'],
  // ...pluginVue.configs['flat/vue2-recommended'], // Use this if you are using Vue.js 2.x.
  {
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
      }
    }
  },
  {
    rules: {
      // override/add rules settings here, such as:
      // 'vue/no-unused-vars': 'error'
    }
  }
]
