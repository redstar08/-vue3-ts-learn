function action(koaInstance, ctx) {
  const middlewares = koaInstance.middlewares
  let nextMiddlewareIndex = 1

  function next() {
    const nextMiddleware = middlewares[nextMiddlewareIndex]

    if (nextMiddleware) {
      nextMiddlewareIndex++
      // 这里还添加了一个return
      // 为了让中间件函数的执行 可以使用promise 从后往前串联执行
      //（建议反复理解这个return）!!!
      return Promise.resolve(nextMiddleware(ctx, next))
    } else {
      // 当最后一个中间件的前置逻辑执行完毕后
      // 返回完全填充的promise，并开始执行next之后的后置逻辑
      return Promise.resolve()
    }
  }

  //从第一个中间件函数开始执行，传入ctx和next函数
  middlewares[0](ctx, next)
}

class Koa {
  middlewares = []
  use(mid) {
    this.middlewares.push(mid)
  }
  listen(port) {
    // 伪代码模拟接收请求
    action(this, { ctx: true })
  }
}

const app = new Koa()
app.use(async (ctx, next) => {
  console.log('a-start')
  await next()
  console.log('a-end')
})
app.use(async (ctx, next) => {
  console.log('b-start')
  await next()
  console.log('b-end')
})
app.use(async (ctx, next) => {
  console.log('c-start')
  await next()
  console.log('c-end')
})
app.listen(3000)
