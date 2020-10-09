import _ from 'lodash'
import { COMMONS_CHANGE_PARAMS, COMMONS_PARKING } from './keys'

export default {
  // 修改state参数
  [COMMONS_CHANGE_PARAMS] (state, params) {
    const { key, value } = params
    _.set(state, key, value)
  },

  [COMMONS_PARKING] (state, payload) {
    state.commonsParkings = payload
  },
}
