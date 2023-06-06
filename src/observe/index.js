class Observer {
    constructor(data) {
        // Object.defineProperty只能劫持已经存在的属性 后增的 删除的无法劫持(vue里面因此存着这样的bug, 因此专门写了一些api $set和$delete来监测数据)
        this.walk(data)
    }
    // 循环对象 对属性依次劫持
    walk(data) {
        // 重新定义属性
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
    }
}
// 闭包 属性劫持
export function defineReactive(target, key, value) {
    // 属性引用类型时候，进行递归劫持
    observe(value)
    Object.defineProperty(target, key, {
        // 取值的时候会执行get
        get() {
            return value
        },
        // 修改的时候 会执行set
        set(newValue) {
            if (newValue === value) return
            value = newValue
        }
    })
}
export function observe(data) {
    // 对这个对象进行劫持
    if (typeof data !== 'object' || data === null) {
        // 只对对象进行劫持
        return
    }
    // 如果一个对象被劫持过了，就不需要被劫持了 (判断对象是否被劫持，可以增添一个实例，用来判断是否被劫持过)
    return new Observer(data)
}   