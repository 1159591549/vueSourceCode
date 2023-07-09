import { initMixin } from './init'
import { initLifeCylce } from './lifecycle'
import { initStateMixin } from './state'
import { patch } from './vdom/patch'
function Vue(options) {
    this._init(options)
}
initMixin(Vue) // 扩展了init方法
initLifeCylce(Vue) // vm._update vm._render
initStateMixin(Vue) // 实现了nextTick和$watch
// --------------------为了方便观察前后的虚拟节点 测试使用
let render1 = `<div>{{name}}</div>`
export default Vue