// 我们希望重写数组中的部分方法
let oldArrayProto = Array.prototype
// newArrayProto
export let newArrayProto = Object.create(oldArrayProto)
// 找到所有的编译方法
let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
] // contact slice都不会改变原数组
methods.forEach(method => {
    // 这里重写了数组的方法
    newArrayProto[method] = function (...args) {
        // 内部调用原来的方法 函数的劫持 切片编程
        const result = oldArrayProto[method].call(this, ...args)
        // 我们需要对数组新增的数据再次进行劫持
        let inserted; // inserted表示新增的数据
        // 这里面的this表示的是数据 this.__ob__表示在数据身上挂载的监测数据的方法
        let ob  = this.__ob__
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
            default:
                break;
        }
        if (inserted) {
            // 对新增的内容再次进行观测
            ob.observeArray(inserted)
        }
        // 数组变化
        ob.dep.notify()
        return result
    }
})