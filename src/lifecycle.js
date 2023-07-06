import { createElementVNode, createTextVNode } from './vdom'
import Watcher from './observe/watcher'
import {patch} from './vdom/patch'

export function initLifeCylce(Vue){
    // 虚拟都没转换成真实dom
    Vue.prototype._update = function(vnode){
        const vm = this
        const el = vm.$el
        // patch既有初始化功能也有更新功能
        vm.$el = patch(el, vnode)
    }
    // _c('div', {}, ...children)
    Vue.prototype._c = function(){
        return createElementVNode(this, ...arguments)
    }
    // _v(text)
    Vue.prototype._v = function(){
        return createTextVNode(this, ...arguments)

    }
    Vue.prototype._s = function(value){
        if (typeof value !== 'object') {
            return value
        }
        return JSON.stringify(value)
    }
    // 渲染虚拟dom
    Vue.prototype._render = function(){
        // 当渲染的时候回去实例中取值 我们就可以将属性和视图绑定到一起
        const vm = this
        // 让with中的this指向vm
        return vm.$options.render.call(vm) // 通过ast语法转义后生成的render方法
    }
}

export function mountComponent(vm, el){
    vm.$el = el
    // 1、调用render方法产生虚拟节点 虚拟dom
    const updateComponent = () => {
        vm._update(vm._render())  //vm.$options.render()
    }
    // true用来标识是一个渲染watcher
    new Watcher(vm, updateComponent, true)
    // 2、根据虚拟dom产生真实dom
    // 3、插入到el元素中
} 
// vue 核心流程 
// 1、创造响应式数据
// 2、模板转换成ast语法树
// 3、将ast语法树转换成render函数
// 4、后续每次数据更新可以只执行render函数 无需再执行艾特转换过程
// render函数会去产生虚拟节点 使用响应式数据
// 根据生成的虚拟节点创造真实的dom