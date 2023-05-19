/**
 * CommonJS 规范实现
 */

// 初始化：定义了一个对象modules， key为模块的路径 value是一个函数，函数里面是我们编写的源代码
const modules = {
  'name.js': (module, exports, require) => {
    const demo = require('demo.js')

    //给该模块设置tag：标识这是一个ES Module
    require.setModuleTag(exports)
    //通过代理给exports设置属性值
    require.defineProperty(exports, {
      age: () => age,
      default: () => DEFAULT_EXPORT,
    })

    const age = '18'
    const DEFAULT_EXPORT = {
      format: 'CommonJS',
      value: 'name.js',
      demo,
    }
  },
  'demo.js': (module, exports, require) => {
    //给该模块设置tag：标识这是一个ES Module
    require.setModuleTag(exports)
    //通过代理给exports设置属性值
    require.defineProperty(exports, {
      default: () => DEFAULT_EXPORT,
    })

    const DEFAULT_EXPORT = {
      format: 'CommonJS',
      value: 'demo.js',
    }
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

// 对 exports 对象做代理
require.defineProperty = (exports, definition) => {
  for (var key in definition) {
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: definition[key],
    })
  }
}

// 给 export 对象打上 __esModule flag
require.setModuleTag = function (exports) {
  Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module',
  })

  Object.defineProperty(exports, '__esModule', {
    value: true,
  })
}

/**
 * test
 */
;(() => {
  const nameModule = require('name.js')
  console.log('nameModule', nameModule, Object.prototype.toString.call(nameModule))
})()

debugger
