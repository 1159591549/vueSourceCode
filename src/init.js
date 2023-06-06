
import { initState } from './initState'
// 就是给Vue增加init方法的
export function initMixin(Vue) {
    // 用于初始化操作
    Vue.prototype._init = function (options) {
        //  vue vm.$options  就是获取用户的配置
        // 我们使用Vue的时候 $nectTick $data $attr
        const vm = this
        // 将用户的选项挂载到实例上
        this.$options = options
        // 初始化状态
        initState(vm)
    }
}
