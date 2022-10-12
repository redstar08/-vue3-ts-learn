// 函数的柯里化

// let count = 0
// const cost = (money) => {
//   count += money
// }

// cost(100)
// cost(200)
// cost(300)

// console.log(count)

const cost = (() => {
  const args = []

  return function () {
    // 计算当前花销
    if (arguments.length === 0) {
      // let count = 0
      // args.forEach((money) => (count += money))
      return args.reduce((pre, cur) => (pre += cur), 0)
    } else {
      // [].push.apply(args, arguments)
      // args.push(...arguments)
      Array.prototype.push.apply(args, arguments)
    }
  }
})()

cost(100)
cost(200)
cost(300)

console.log(cost())

// uncurrying 让入参的首项 调用原函数并将剩余的项作为参数传递
Function.prototype.uncurrying = function () {
  let self = this
  return function () {
    const item = Array.prototype.shift(arguments) // 取出首项作为 item
    return self.apply(item, arguments) // 让 item 调用原函数
  }
}
// 类似效果
// const uncurrying = (fn, ...args) => {
//   fn(...args)
// }
