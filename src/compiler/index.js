import { parseHTML } from './parse'
function codelgen(ast){
    let code = `_c()`
    return code

}
// 对模板进行编译处理
export function compileToFunction(template) {
    // 1、就是将template转换成ast语法树
    let ast = parseHTML(template)
    // 2、生成render方法(render方法执行后的返回结果就是虚拟dom)
    console.log(ast);
    // codelgen(ast)
    // render(h){
    //     return h
    // }
}