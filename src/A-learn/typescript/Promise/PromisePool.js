export default function pLimit(concurrency) {
  const queue = []
  let activeCount = 0

  const run = async (task, resolve, reject) => {
    try {
      activeCount++
      console.log('activeCount', activeCount)
      const result = task()
      resolve(result)
      await result
    } catch (error) {
      reject(error)
      // throw error
      // console.log(error)
    } finally {
      activeCount--
      if (queue.length > 0) {
        queue.shift()()
      }
    }
  }

  const addTask = (task, resolve, reject) => {
    queue.push(() => run(task, resolve, reject))
    ;(async () => {
      await Promise.resolve()
      console.log('addTask -> activeCount', activeCount)
      if (activeCount < concurrency && queue.length > 0) {
        queue.shift()()
      }
    })()
  }

  const generator = (task) => new Promise((resolve, reject) => addTask(task, resolve, reject))

  return generator
}
