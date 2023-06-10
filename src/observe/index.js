import { newArrayProto } from './array.js'
class Observer {
    constructor(data) {
        // Object.defineProperty只能劫持已经存在的属性 后增的 删除的无法劫持(vue里面因此存着这样的bug, 因此专门写了一些api $set和$delete来监测数据)
        // 给数据加了一个标识 如果数据上有__ob__则说明这个属性被监测过
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false
        })
        // data.__ob__ = this 
        if (Array.isArray(data)) {
            // 这里我们可以重写数组中的 7个变异方法 是可以修改数组本身的
            // 需要保留数组原有的特性 并且可以重写部分方法
            data.__proto__ = newArrayProto
            // 如果数组中放的是对象，可以被监测到数据的变化
            this.observeArray(data)
        } else {
            this.walk(data)
        }
    }
    // 循环对象 对属性依次劫持
    walk(data) {
        // 重新定义属性
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
    }
    // 观测数组
    observeArray(data) {
        data.forEach(item => observe(item))
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
            // data.address = {name: 'hzy'} 设置的值时对象的时候要进行再次代理
            observe(newValue)
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
    if (data.__ob__ instanceof Observer) {
        return data.__ob__
    }
    // 如果一个对象被劫持过了，就不需要被劫持了 (判断对象是否被劫持，可以增添一个实例，用来判断是否被劫持过)
    return new Observer(data)
}   