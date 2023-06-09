const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// 他匹配到的分组是一个 名<xxx 匹配到的是开始 标签的名字
const startTagopen = new RegExp(`^<${qnameCapture}`);
// 匹配的是</xxxx> 最终匹配到的分组就是结束标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
// 第一个分组就是属性 key value 就是分组3/分组4/分组5
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性
const startTagClose = /^\s*(\/?)>/; // <div> <br />
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{ fss }} 匹配到的内容就是我们表达式的变量
// vue3采用的不是使用正则
// 采用解析一个删除一个的原则 以模板彻底结束为止 
export function parseHTML(html) {
    const ELEMENT_TYPE = 1
    const TEXT_TYPE = 3
    const stack = [] // 用于存放元素
    let currentParent // 指向的是栈中的最后一个元素
    let root
    // 最终需要转换成一颗抽象语法树
    function createAstElement(tag, attrs) {
        return {
            tag,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        }
    }
    // 录用栈形结构来构造一棵树
    function start(tag, attrs) {
        // 创造一个ast节点
        let node = createAstElement(tag, attrs)
        // 看一下是否是空树
        if (!root) {
            // 如果是空数则当前是树的根节点
            root = node
        }
        if (currentParent) {
            node.parent = currentParent
            currentParent.children.push(node)
        }
        stack.push(node)
        // currentParent为栈中的最后一个元素
        currentParent = node
    }
    function chars(text) {
        text = text.replace(/\s/g, '')
        text && currentParent.children.push({
            type: TEXT_TYPE,
            text,
            parent: currentParent
        })
    }
    function end() {
        // 弹出最后一个
        stack.pop()
        currentParent = stack[stack.length - 1]
    }
    function advance(n) {
        html = html.substring(n)
    }
    // 匹配标签的开始和标签的属性<div style='color: green;'>
    function parseStartTag() {
        // 注：startTagopen匹配的是开始标签。start匹配返回结果：start[0]匹配到标签的开始 <div; start[1]匹配标签名 div
        const start = html.match(startTagopen)
        if (start) {
            const match = {
                tagName: start[1], //标签名
                attrs: []
            }
            advance(start[0].length)
            let attr, end;
            // 注：attribute匹配的是属性
            // attr[0]匹配完整属性如 style="color: green;" 
            // attr[1]匹配的属性名style attr[2]匹配的= 
            // attr[3]匹配的属性值color:green
            // attr[3] attr[4] attr[5]匹配的属性值
            // startTagClose匹配的是开始标签的结束
            // end[0]匹配的是 >
            // end[1]匹配的是 ''
            // 如果不是开始标签的结束 就一直匹配下去
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length)
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                })
            }
            if (end) {
                advance(end[0].length)
            }
            return match
        }
        return false // 不是开始标签
    }
    while (html) {
        // 如果textEnd为0 说明是一个开始标签或者结束标签
        // 如果textEnd > 0说明就是文本的结束位置
        let textEnd = html.indexOf('<') // 如果indexOf中的索引是0 则说明是个标签
        if (textEnd === 0) {
            // 开始标签匹配结果 
            const startTagMatch = parseStartTag();
            if (startTagMatch) { // 解析到的开始标签
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end()
                continue
            }
        }
        if (textEnd > 0) {
            // 文本内容
            let text = html.substring(0, textEnd);// 解析到的文本标签
            if (text) {
                chars(text)
                advance(text.length)
            }
        }
    }
    return root
}