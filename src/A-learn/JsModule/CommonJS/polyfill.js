/**
 * CommonJS 规范实现
 */

// 初始化：定义了一个对象modules， key为模块的路径 value是一个函数，函数里面是我们编写的源代码
const modules = {
  'name.js': (module, exports, require) => {
    const demo = require('demo.js')

    module.exports = {
      format: 'CommonJS',
      value: '123',
      demo,
    }

    return module.exports
  },
  'demo.js': (module, exports, require) => {
    module.exports = {
      format: 'CommonJS',
      value: 'demo.js',
    }

    return module.exports
  },
}

const cache = {}

function require(modulePath) {
  var cachedModule = cache[modulePath] //获取模块缓存
  if (cachedModule !== undefined) {
    //如果有缓存则不允许模块内容，直接retuen导出的值
    return cachedModule.exports
  }

  const module = (cache[modulePath] = {
    exports: {},
  })

  modules[modulePath](module, module.exports, require)

  return module.exports
}

/**
 * test
 */
;(() => {
  const nameModule = require('name.js')
  console.log('nameModule', nameModule)
})()

debugger
