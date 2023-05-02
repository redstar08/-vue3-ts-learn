/**
 * @description 享元模式
 * @example
 * @comments 享元模式是通过共享技术用于技术优化的设计模式
 * 它将内部状态与外部状态分离开，内部状态可供所有状态共享，外部状态在必要时与内部状态组装成为一个完整的对象
 * 通过组装可以避免创建大量重复的内部状态，利用时间换取空间
 * 通过工厂单例，可以维护一个对象池，从而减少不必要的创建开销
 */

// 通用的对象池实现

const ObjectPoolFactory = (createFunc: (...args: any[]) => any) => {
  // 对象池
  const objectPool: any = []

  return {
    create: function (src: string, ...args: any[]) {
      let object: any = null
      // 池中没有缓存的对象，则创建
      if (!objectPool.length) {
        object = createFunc.apply(this, [src, ...args])
        console.log('create -> object', object)
      } else {
        object = objectPool.shift()
        object.src = src
        console.log('reuse -> object', object)
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          object.onload()
          resolve(object)
        }, 100 * objectPool.length)
      })
    },
    recover: function (object: any) {
      objectPool.push(object)
      console.log('recover -> object', object)
    },
  }
}

const IFrameFactory = ObjectPoolFactory(function (src) {
  // console.log('IFrameFactory -> src', src)
  // const iframe = document.createElement('iframe')
  const iframe = {
    src: src,
    onload: function () {
      console.log('iframe -> loaded', this.src)
      IFrameFactory.recover(iframe)
    },
  }

  // document.body.append(iframe)
  // iframe.onload = function () {
  //   iframe.onload = null // ensure iframe not load infinite
  //   IFrameFactory.recover(iframe)
  // }
  return iframe
})

const startDemo = async () => {
  try {
    await IFrameFactory.create('https://baidu.com')
    await IFrameFactory.create('https://bing.com')
    setTimeout(() => {
      IFrameFactory.create('https://qq.com')
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}

startDemo()
