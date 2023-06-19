import { initMixin } from './init'
import { initLifeCylce } from './lifecycle'
import { nextTick } from './observe/watcher'
function Vue(options) {
    this._init(options)
}
Vue.prototype.$nextTick = nextTick
initMixin(Vue)
initLifeCylce(Vue)
export default Vue