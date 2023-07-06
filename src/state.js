import { observe } from './observe/index'
import Dep from './observe/dep'
import Watcher, { nextTick } from './observe/watcher'
export function initState(vm) {
    // 或得所有选项
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
    }
    if (opts.computed) {
        initComputed(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }
}
// 初始化watch
function initWatch(vm) {
    let watch = vm.$options.watch
    // 字符串 数组 函数 对象的形式  对象的形式暂未包含
    for (const key in watch) {
        const handler = watch[key]
        if (Array.isArray(handler)) {
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i])
            }
        } else {
            createWatcher(vm, key, handler)
        }

    }
}
function createWatcher(vm, key, handler) {
    // 字符串 数组 函数 对象的形式 对象的形式暂未包含
    if (typeof handler === 'string') {
        handler = vm[handler]
    }
    return vm.$watch(key, handler)
}
// 使用闭包，内部函数使用外部函数的参数
function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[target][key]
        },
        set(newValue) {
            vm[target][key] = newValue
        }
    })
}
function initData(vm) {
    // data可能是函数和对象
    let data = vm.$options.data
    data = typeof data === 'function' ? data.call(vm) : data

    vm._data = data
    // 对数据进行劫持 vue2 里面采用了一个api defineProperty
    observe(data)
    // 这个时候取值是vm._data.name很麻烦，将vm._data用vm来代理就可以了
    for (const key in data) {
        proxy(vm, '_data', key)
    }
}
// 初始化计算属性
function initComputed(vm) {
    const computed = vm.$options.computed
    // 将计算属性watchers保存到vm上
    const watchers = vm._computedWatchers = {}
    for (const key in computed) {
        let userDef = computed[key]
        // 我们需要监控计算属性中get的变化
        let fn = typeof userDef === 'function' ? userDef : userDef.get
        // 如果直接new Watcher 默认就会执行fn 将属性和watcher对应起来
        watchers[key] = new Watcher(vm, fn, { lazy: true })
        defineComputed(vm, key, userDef)
    }
}
function defineComputed(target, key, userDef) {
    // 两种形式的computed
    // const getter = typeof userDef === 'function' ? userDef : userDef.get
    const setter = userDef.set || (() => { })
    // 可以通过实例达到对应的属性
    Object.defineProperty(target, key, {
        get: createComputedGetter(key),
        set: setter
    })
}
// 计算属性根本不会收集依赖 只会让自己的依赖属性去收集依赖
function createComputedGetter(key) {
    // 我们需要监测是否要执行这个getter
    return function () {
        const watcher = this._computedWatchers[key]
        if (watcher.dirty) {
            // 如果是脏的就去执行用户执行的函数
            // 求值后dirty变成了false，下次就不求值了
            watcher.evaluate()
        }
        // 计算属性出栈后 还有渲染watcher 应该让计算属性的watcher里面的属性也去收集上层watcher
        if (Dep.target) {
            watcher.depend()
        }
        // 最后返回的是watcher上面的value
        return watcher.value
    }
}
export function initStateMixin(Vue) {
    Vue.prototype.$nextTick = nextTick
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
}