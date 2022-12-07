let offlines = [1, 2, 3]
offlines.forEach((fn) => {
  console.log('offlines -> fn', fn, offlines.shift())
})
