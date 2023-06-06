// rollup 默认可以导出一个对象 作为打包的配置文件
import babel from 'rollup-plugin-babel'
export default {
    // 入口
    input: './src/index.js',
    // 出口
    output: {
        // 打包出来的文件
        file: './dist/vue.js',
        // 打包完之后会生成一个全局变量global.vue
        name: 'Vue',
        // esm es6模块 commonjs模块 life自执行函数 umd (common.js amd)
        format: 'umd',
        // 希望可以调试源代码
        sourcemap: true
    },
    plugins: [
        babel({
            // 排除node_modules所有文件
            exclude: 'node_modules/**'
        })
    ]
}