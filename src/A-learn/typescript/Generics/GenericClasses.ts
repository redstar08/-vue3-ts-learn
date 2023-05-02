class GenericNumber<NumType> {
  zeroValue: NumType
  add: (x: NumType, y: NumType) => NumType
}

const myGenericNumber = new GenericNumber<number>()
console.log(myGenericNumber)

myGenericNumber.zeroValue = 0
myGenericNumber.add = function (x, y) {
  return x + y
}

const stringNumeric = new GenericNumber<string>()
stringNumeric.zeroValue = ''
stringNumeric.add = function (x, y) {
  return x + y
}

console.log(stringNumeric.add(stringNumeric.zeroValue, 'test'))
