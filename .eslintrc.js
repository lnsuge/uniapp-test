// 规则说明 https://cn.eslint.org/docs/rules/

module.exports = {
  'env': {
      'browser': true,
      'es6': true
  },
  'extends': [
      'eslint:recommended',
      'plugin:vue/essential'
  ],
  'globals': {
      'require': 'readonly',
      'process': 'readonly',
      'wx': 'readonly',
      'uni': 'readonly',
      'getCurrentPages': 'readonly'
  },
  'parserOptions': {
      'ecmaVersion': 2018,
      'sourceType': 'module'
  },
  'plugins': [
      'vue'
  ],
  'rules': {
      'no-await-in-loop': [ 'error' ],
      'no-template-curly-in-string': [ 'error' ],
      'array-callback-return': [ 'error' ],
      'no-floating-decimal': [ 'error' ],
      'no-multi-spaces': [ 'error' ],
      'no-return-await': [ 'error' ],
      'no-throw-literal': [ 'error' ],
      'no-useless-return': [ 'error' ],
      'require-await': [ 'error' ],
      'no-undef-init': [ 'error' ],
      'indent': [ 'error', 2, { 'SwitchCase': 1 } ],
      'linebreak-style': [ 0, 'error', 'windows' ],
      'quotes': [ 'error', 'single' ],
      'semi': [ 'error', 'never' ],
      'comma-spacing': [ 'error' ],
      'comma-dangle': [ 'error', { 'objects': 'always-multiline' } ],
      'object-curly-spacing': [ 'error', 'always' ],
      'key-spacing': [ 'error' ],
      'space-infix-ops': [ 'error' ],
      'eqeqeq': [ 'error' ],
      'func-call-spacing': [ 'error' ],
      'space-before-function-paren': [ 'error' ],
      'prefer-arrow-callback': [ 'error' ],
      'no-multiple-empty-lines': [ 'error', { 'max': 1 } ]
  }
}
