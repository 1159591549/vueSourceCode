
import { initState } from './state'
import { compileToFunction } from './compiler/index'
import { mountComponent } from './lifecycle'
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
        if (options.el) {
            vm.$mount(options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this
        el = document.querySelector(el)
        let ops = vm.$options
        // 此查找有没有render函数
        if (!ops.render) {
            let template
            // 没有render看有没有template，没有template采用外部的template
            if (!ops.template && el) {
                template = el.outerHTML
            } else {
                // 如果有el 则采用模板的内容
                if (el) {
                    template = ops.template
                }
            }
            // 写了template 就用写了的template
            if (template) {
                // 这里需要对模板进行编译
                const render = compileToFunction(template);
                console.log(render, "----------render----------");
                // jsx 最终会被编译成h('xxx')
                ops.render = render
            }
        }
        // 组建的挂载
        mountComponent(vm, el)
        // 最终可以获取render方法
        // script 标签引用的global.js这个编译过程是在浏览器运行的
        // runtime是不包含模板编译的 整个编译是打包的时候通过loader来转义.vue文件的，用runtime的时候不能使用template
    }
}
