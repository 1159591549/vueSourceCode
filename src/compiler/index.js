import { parseHTML } from './parse'
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{ fss }} 匹配到的内容就是我们表达式的变量
function genProps(attrs) {
    let str = '' // {name, value}
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i]
        if (attr.name === 'style') {
            // color:red;background:red => {color:'red'}
            let obj = {}
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':')
                obj[key] = value
            })
            attr.value = obj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},` //  a:b c:d
    }
    return `{${str.slice(0, -1)}}`
}
function gen(node) {
    // 如果是元素
    if (node.type === 1) {
        return codelgen(node)
    } else {
        // 如果是文本 纯文本和差值表达式情况 
        let text = node.text
        if (!defaultTagRE.test(text)) { // 纯文本
            return `_v(${JSON.stringify(text)})`
        } else { // 差值表达式
            // _v(_s(name) + 'hello' + _s(name)))
            let tokens = []
            let match
            // 正则表达式每次匹配都要重新0开始
            defaultTagRE.lastIndex = 0
            let lastIndex = 0
            while (match = defaultTagRE.exec(text)) {
                let index = match.index // 匹配的开始位置
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)))
                }
                tokens.push(`_s(${match[1].trim()})`)
                lastIndex = index + match[0].length
            }
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)))
            }
            return `_v(${tokens.join('+')})`
        }
    }
}
function genChildren(children = []) {
    return children.map(child => gen(child)).join(',')
}
function codelgen(ast) {
    let children = genChildren(ast.children)
    let code = (`_c('${ast.tag}',${ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'
        }${ast.children.length ? `,${children}` : ''
        })`)
    return code
}
// 对模板进行编译处理
export function compileToFunction(template) {
    // 1、就是将template转换成ast语法树
    let ast = parseHTML(template)
    // 2、生成render方法(render方法执行后的返回结果就是虚拟dom)
    // 模板引擎的实现原理 就是 with + new Function()
    let code = codelgen(ast)
    code = `with(this){return ${code}}`
    // 根据代码生成render函数
    let render = new Function(code)
    return render
    // ast属性组装成 标签名 属性 儿子
    // render(){
    //     return _c('div', { id: 'app' },
    //         _c('div', { style: { color: 'red' } }, _v(_s(name) + 'hello'))),
    //         _c('span', undefined, _v(_s(age)))
    // }
}