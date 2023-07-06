export function createElm(vnode){
    let {tag, data, children, text}  = vnode
    if (typeof tag === 'string') {
        // 这里是将真是节点和虚拟节点对应起来
        vnode.el = document.createElement(tag)
        patchProps(vnode.el, data)
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        })
    }else{
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}
export function patchProps(el, props){
    for (const key in props) { // style{color:'red'}
        if (key === 'style') {
            for (const styleName in props.style) {
                el.style[styleName] = props.style[styleName]
            }
        }else{
            el.setAttribute(key, props[key])
        }
        
    }
}
export function patch(oldVNode, vnode){
    const isRealELement = oldVNode.nodeType
    if (isRealELement) {
        const elm = oldVNode //获取真实元素
        const parentElm = elm.parentNode //获得父元素
        let newElm = createElm(vnode)
        parentElm.insertBefore(newElm, elm.nextSibling)
        parentElm.removeChild(elm)
        return newElm
    }else{
        // diff算法
    }
}