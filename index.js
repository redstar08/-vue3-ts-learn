/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function (board, word) {
  const m = board.length
  const n = board[0].length
  const len = word.length
  let ans = false
  const path = []
  const dfs = (deepth, i, j) => {
    if (deepth === len) {
      return (ans = true)
    }
    if (i < 0 || i >= m || j < 0 || j >= n) {
      return
    }
    const letter = board[i][j]
    if (letter === word[deepth]) {
      path.push(letter)
      dfs(deepth + 1, i + 1, j)
      dfs(deepth + 1, i - 1, j)
      dfs(deepth + 1, i, j + 1)
      dfs(deepth + 1, i, j - 1)
      path.pop()
    }
  }
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === word[0]) {
        dfs(0, i, j)
      }
    }
  }
  return ans
}

exist(
  [
    ['A', 'B', 'C', 'E'],
    ['S', 'F', 'C', 'S'],
    ['A', 'D', 'E', 'E'],
  ],
  'ABCCED',
)
