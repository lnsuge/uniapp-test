import _ from 'lodash'

const files = require.context('.', true, /index\.js$/)
const modules = {}

files.keys().forEach(key => {
  if (key === './index.js') return
  const moduleName = _.camelCase(key.replace(/(\.\/|\/index\.js)/g, ''))
  modules[moduleName] = files(key).default
})

export default modules
