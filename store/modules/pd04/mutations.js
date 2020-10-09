import _ from 'lodash'
import { PD04_CHANGE_PARAMS } from './keys'

export default {
  // 修改state参数
  [PD04_CHANGE_PARAMS] (state, params) {
    const { key, value } = params
    _.set(state, key, value)
  },
}
