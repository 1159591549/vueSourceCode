let id = 0
class Dep{
    constructor(){
        this.id = id++ // 属性的dep要收集watcher
        this.subs = [] // 这里存放着当前属性对应的watcher有哪些
    }
    
    depend(){
        // 这里我们不希望放重复的watcher 而且刚才只是一个单向的关系 dep -> watcher
        // this.subs.push(Dep.target)
        Dep.target.addDep(this) // 让watcher记住dep
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        // 告诉watcher去更新了
        this.subs.forEach(watcher => watcher.update())
    }
}
Dep.target = null
export default Dep