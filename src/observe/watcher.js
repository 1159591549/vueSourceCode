import Dep from './dep'
let id = 0
// 当我们创建渲染watcher时候 我们会把当前渲染的watcher放到Dep.target上
// 调用_render() 会取值走到get上

// 不同组件有不同的watcher 目前只有一个渲染根实例
// 组件作用：复用 方便维护 局部更新
// 每个属性都有一个dep 属性就是被观察者 watcher就是观察者 属性变化了就会通知watcher来更新 观察者模式
class Watcher {
    constructor(vm, fn, options) {
        this.id = id++
        this.renderWatcher = options // 是一个渲染watcher
        this.getter = fn // 意味着调用这个函数可以发生取值操作
        this.deps = [] // 后续我们实现计算属性和清理功能做需要用到
        this.desId = new Set()
        this.get()
    }
    addDep(dep) { // 一个组件对应多个属性 重复的属性也不用记录
        let id = dep.id
        if (!this.desId.has(id)) {
            this.deps.push(dep)
            this.desId.add(id)
            dep.addSub(this) // watcher已经记住dep切已经去重 此刻让dep也记住watcher
        }
    }
    get() {
        Dep.target = this // 静态属性只有一份
        this.getter() // 会上vm上取值 模板里面的变量
        Dep.target = null // 渲染完后，变量就不需要在页面使用了，因此可以释放依赖
    }
    update() {
        // 把当前的watcher暂存起来
        queueWatcher(this)
        // 重新渲染
        // this.get()
    }
    run() {
        this.get()
    }
}
let queue = []
let has = {}
let pending = false
function flushSchedulerQueue() {
    let flushQueue = queue.slice(0)
    queue = [] 
    has = {}
    pending = false
    flushQueue.forEach(q => q.run()) // 在刷新的过程中可能还有新的watcher 重新放到queue
}
function queueWatcher(watcher) {
    const id = watcher.id
    if (!has[id]) {
        queue.push(watcher)
        has[id] = true
        // 不管我们的update执行多少次 最终只执行一次刷新操作
        if (!pending) {
            setTimeout(flushSchedulerQueue, 0)
            pending = true
        }
    }
}

export function nextTick(cb){

}
// 需要给每个属性增加一个dep 目的就是收集watcher
// 一个组件中有多少个属性 (n个属性会对应一个组件) n个dep对应一个watcher
// 1个属性对应多个组件 1个dep对应多个watcher
// 多对多关系

export default Watcher