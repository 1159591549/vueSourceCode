import { initMixin } from './init'
import { initLifeCylce } from './lifecycle'
function Vue(options) {
    this._init(options)
}

initMixin(Vue)
initLifeCylce(Vue)
export default Vue