<template>
  <div class="about">
    <h1>This is an about page</h1>
    <my-popup-box a="1" data-text="data-text.data-text.data-text12312312312312312312312">
      popup-box-content
    </my-popup-box>
  </div>
</template>

<script>
// import pLimit from 'p-limit'
import pLimit from '@/A-learn/typescript/Promise/PromisePool.js'

const delayPromise = (wait = 300, success = true, value = { msg: 'ok' }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve(value)
      } else {
        reject(value)
      }
    }, wait)
  })
}

const runner = async () => {
  const limit = pLimit(3)

  const input = [
    limit(() => delayPromise(100, true, '100-foo')),
    limit(() => delayPromise(300, true, '200-bar')),
    limit(() => delayPromise(200, false, '100-false')),
    limit(() => delayPromise(200, false, '100-false')),
    limit(() => delayPromise(2000, false, '100-false')),
    limit(() => {
      throw new Error('Error -> false')
    }),
  ]

  // Only one promise is run at once
  const result = await Promise.allSettled(input)
  console.log(result)
}

runner()
</script>

<style>
@media (min-width: 1024px) {
  .about {
    display: flex;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
