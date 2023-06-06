import { observe } from './observe/index'
export function initState(vm) {
    // 或得所有选项
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
    }
}
function proxy(vm, target, key){
    Object.defineProperty(vm, key, {
        get(){
            return vm[target][key]
        },
        set(newValue){
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