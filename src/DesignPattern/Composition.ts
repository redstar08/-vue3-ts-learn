/**
 * @description 组合模式
 * @example 文件夹扫描、React 组件渲染
 */

class MyFile {
  name: string
  parent!: Folder
  constructor(name: string) {
    this.name = name
  }

  scan() {
    console.log('file:', this.name)
  }
}

class Folder {
  name: string
  parent!: Folder
  files: Array<MyFile>
  constructor(name: string) {
    this.name = name
    this.files = []
  }

  add(file: MyFile) {
    file.parent = this
    this.files.push(file)
  }

  scan() {
    console.log('Start scaning folder...', this?.parent?.name || 'global', '->', this.name)
    this.files.forEach((item) => {
      item.scan()
    })
  }
}

const root = new Folder('downloads')

const images = new Folder('images')
const musics = new Folder('musics')
const books = new Folder('books')

const images1 = new MyFile('background.png')
const musics1 = new MyFile('500 miles.mp3')
const musics2 = new MyFile('Canon 卡农 D大调.mp3')
const book1 = new MyFile('C++ 从入门到放弃')
const book2 = new MyFile('PHP 世界上最好的编程语言')
const book3 = new MyFile('JavaScript 百炼成仙')

root.add(images)
root.add(musics)
root.add(books)

images.add(images1)
musics.add(musics1)
musics.add(musics2)
books.add(book1)
books.add(book2)
books.add(book3)

root.scan()
