export function initState(vm){
    // 或得所有选项
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
    }
}
function initData(vm){
    // data可能是函数和对象
    let data = vm.$options.data
    data = typeof data === 'function' ? data.call(vm) : data
    console.log(data);
}