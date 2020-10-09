import { ORDER_PROCESS } from './keys'

export default {
  [ORDER_PROCESS] (state, payload) {
    state.orderProcess = payload
  },
}
