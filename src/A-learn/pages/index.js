import { a } from './a.js'

const modules = import.meta.glob('./*.*?url', { eager: true })

console.log('modules', modules, a)
const lis = __HTML_PAGES__.map((path) => {
  const li = document.createElement('li')
  const a = document.createElement('a')
  a.href = './' + path
  a.innerText = path
  li.appendChild(a)
  return li
})

const pages = document.querySelector('#pages')
pages.append(...lis)
