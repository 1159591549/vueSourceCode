// h() _c()
export function createElementVNode(vm, tag, data = {}, ...children) {
    if (data == null) {
        data = {}
    }
    let key = data.key
    if (key) {
        delete data.key
    }
    return vnode(vm, tag, key, data, children)
}
// _v()
export function createTextVNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text)
}
// 创建虚拟节点的方法
// 这不是和ast一样吗？ ast做的是语法层面的转换 他描述的书语法本身(可以描述 JS CSS html)
// 虚拟dom是描述dom元素 可以增加一些自定义属性(描述dom)
function vnode(vm, tag, key, data, children, text) {
    return {
        vm,
        tag,
        key,
        data,
        children,
        text
    }
}