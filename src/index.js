import { initMixin } from './init'
import { initLifeCylce } from './lifecycle'
import Watcher, { nextTick } from './observe/watcher'
function Vue(options) {
    this._init(options)
}
Vue.prototype.$nextTick = nextTick
initMixin(Vue)
initLifeCylce(Vue)
/**
 * 
 * @param {*} exprOrFn 监控的变量可能是字符串 可能是函数
 * @param {*} cb 执行的回调
 * @param {*} options 参数
 */
Vue.prototype.$watch = function (exprOrFn, cb) {
    // firstname
    // () => vm.firstname
    // firstname值变化了直接执行cb函数即可
    new Watcher(this, exprOrFn, { user: true }, cb)
}
export default Vue