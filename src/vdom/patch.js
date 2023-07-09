import { isSameVnode } from "./index"

export function createElm(vnode) {
    let { tag, data, children, text } = vnode
    if (typeof tag === 'string') {
        // 这里是将真是节点和虚拟节点对应起来
        vnode.el = document.createElement(tag)
        patchProps(vnode.el, {}, data)
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}
export function patchProps(el, oldProps, props) {
    // 老的属性中有 新的没有 要删除老的
    let oldStyles = oldProps.style || {}
    let newStyles = props.style || {}
    for (const key in oldStyles) { // 老的样式中有 新的没有则删除
        if (!newStyles[key]) {
            el.style[key] = ''
        }
    }
    for (const key in props) { // 老的属性中有
        if (!props[key]) { // 新的没有删除属性
            el.removeAttribute(key)
        }
    }
    for (const key in props) { // 用新的覆盖老的
        if (key === 'style') {// style{color:'red'}
            for (const styleName in props.style) {
                el.style[styleName] = props.style[styleName]
            }
        } else {
            el.setAttribute(key, props[key])
        }
    }


}
export function patch(oldVNode, vnode) {
    const isRealELement = oldVNode.nodeType
    if (isRealELement) {
        const elm = oldVNode //获取真实元素
        const parentElm = elm.parentNode //获得父元素
        let newElm = createElm(vnode)
        parentElm.insertBefore(newElm, elm.nextSibling)
        parentElm.removeChild(elm)
        return newElm
    } else {
        // diff算法
        // diff算法是一个平级比较的算法
        // 1、两个节点不是同一个节点 直接删除老的节点换上新的节点(不需要比对)
        // 2、两个节点是同一个节点(节点的tag和节点的key) 比较两个节点的属性是否有差异(复用老的节点 将差异的属性更新到老的节点)
        // 3、节点比较完毕后就需要比较两个儿子
        patchVnode(oldVNode, vnode)
    }
}
function patchVnode(oldVNode, vnode) {
    if (!isSameVnode(oldVNode, vnode)) {
        // 用老节点的父亲进行替换
        let el = createElm(vnode)
        oldVNode.el.parentNode.replaceChild(el, oldVNode.el)
        return el
    }
    // 文本的情况 文本我们期望比较一下文本内容
    let el = vnode.el = oldVNode.el // 复用老节点的元素
    if (!oldVNode.tag) { // 是文本
        if (oldVNode.text !== vnode.text) {
            el.textContent = vnode.text //用新的文本覆盖老的文本
        }
    }
    // 是标签 是标签我们需要比对标签的属性
    patchProps(el, oldVNode.data, vnode.data)
    // 比较儿子节点 比较的时候 一方有儿子 一放没儿子
    // 两方都有儿子
    let oldChildren = oldVNode.children || {}
    let newChildren = vnode.children || {}
    if (oldChildren.length > 0 && newChildren.length > 0) {
        // 完整的diff算法 需要比较两个人的儿子
        updateChildren(el, oldChildren, newChildren)
    } else if (newChildren.length > 0) { // 老的没有 新的有
        mountChildren(el, newChildren)
    } else if (oldChildren.length > 0) { // 新的没有老的有要删除
        el.innerHTML = ''
    }
    return el
}
function mountChildren(el, newChildren) {
    for (let i = 0; i < newChildren.length; i++) {
        let child = newChildren[i]
        el.appendChild(createElm(child))
    }
}
function updateChildren(el, oldChildren, newChildren) {
    // 我们操作列表 经常会有push shift pop unshift reverse sort这些方法做一些优化 
    // vue2中采用双指针的方式 比较两个节点
    let oldStartIndex = 0
    let newStartIdnex = 0
    let oldEndIndex = oldChildren.length - 1
    let newEndIndex = newChildren.length - 1

    let oldStartVnode = oldChildren[0]
    let newStartVnode = newChildren[0]

    let oldEndVnode = oldChildren[oldEndIndex]
    let newEndVnode = newChildren[newEndIndex]

    // 双方又一放头指针大于尾部指针则停止
    while (oldStartIndex <= oldEndIndex && newStartIdnex <= newEndIndex) {
        
    }
}