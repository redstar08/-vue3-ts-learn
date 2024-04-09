const babel = require('@babel/core')

// 源代码
const code = `
const hello = () => {};
const str: string = "";
const x: number = 0;
`

// 1. 源代码解析成 ast
const ast = babel.parse(code, {
  plugins: ['@babel/plugin-transform-typescript'],
})

// 2. 转换
const visitor = {
  // traverse 会遍历树节点，只要节点的 type 在 visitor 对象中出现，变化调用该方法
  Identifier(path) {
    const { node } = path //从path中解析出当前 AST 节点
    if (node.name === 'hello') {
      node.name = 'world' //找到hello的节点，替换成world
    }
  },
}
babel.traverse(ast, visitor)

// 3. 生成
const result = babel.transformFromAst(ast, code, {
  plugins: ['@babel/plugin-transform-typescript'],
})

console.log(result.code) //const world = () => {};
