let currentComponent = null // 当前正在渲染的组件
let currentHook = 0 // 当前正在处理的 Hook
const __hooks = []

function useState(initialValue) {
  // 获取当前正在渲染的组件
  const component = currentComponent

  // 初始化或获取当前 Hook 的状态和更新函数
  let hook = __hooks[currentHook]
  if (!hook) {
    hook = {
      state: initialValue,
      setState(newValue) {
        if (typeof newValue === 'function') {
          hook.state = newValue(hook.state)
        } else {
          hook.state = newValue
        }
        // 触发重新渲染
        // 在真实的 React 中，这里会调用调度器来进行更新
        // 并在批处理过程中处理所有状态更新
        render(component)
      },
    }
    __hooks[currentHook++] = hook
  }

  return [hook.state, hook.setState]
}

function render(component) {
  // 模拟重新渲染组件
  console.log(
    'Render:',
    __hooks.map((h) => h.state),
  )
}
