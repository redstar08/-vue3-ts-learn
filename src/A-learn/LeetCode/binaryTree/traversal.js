/**
 * Definition for a binary tree node.
 */
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val
  this.left = left === undefined ? null : left
  this.right = right === undefined ? null : right
}

/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {
  const n = preorder.length
  const index = new Map()
  for (let i = 0; i < n; i++) {
    index.set(inorder[i], i)
  }

  function dfs(preL, preR, inL, inR) {
    if (preL === preR) {
      // 空节点
      return null
    }
    const leftSize = index.get(preorder[preL]) - inL // 左子树的大小
    const left = dfs(preL + 1, preL + 1 + leftSize, inL, inL + leftSize)
    const right = dfs(preL + 1 + leftSize, preR, inL + 1 + leftSize, inR)
    return new TreeNode(preorder[preL], left, right)
  }
  return dfs(0, n, 0, n) // 左闭右开区间
}

// 中序构建树
const root = buildTree([1, 'a', 3, 4, 'b', 6, 7], [3, 'a', 4, 1, 6, 'b', 7])

/**
 * @param {TreeNode} root
 * @return {number []}
 * @description 先序遍历
 */
const preorder = (root) => {
  if (!root) {
    return []
  }

  const ans = []
  const stack = [root]
  while (stack.length) {
    const node = stack.pop()
    ans.push(node.val)
    node.right && stack.push(node.right)
    node.left && stack.push(node.left)
  }

  return ans
}

console.log(preorder(root))

/**
 * @param {TreeNode} root
 * @return {number []}
 * @description 中序遍历
 */
const inorder = (root) => {
  if (!root) {
    return []
  }

  const ans = []
  const stack = []
  let p = root
  while (stack.length || p) {
    while (p) {
      stack.push(p)
      p = p.left
    }
    const node = stack.pop()
    ans.push(node.val)
    p = node.right
  }

  return ans
}

console.log(inorder(root))

/**
 * @param {TreeNode} root
 * @return {number []}
 * @description 后序遍历
 */
const postorder = (root) => {
  if (!root) {
    return []
  }

  const ans = []
  const stack = [root]
  while (stack.length) {
    const node = stack.pop()
    ans.unshift(node.val)
    node.right && stack.push(node.right)
    node.left && stack.push(node.left)
  }

  return ans
}

console.log(postorder(root))

function levelBFS(root) {
  if (!root) return [] // 处理根节点为空的情况

  const result = []
  const queue = [root] // 初始化队列并将根节点入队列

  while (queue.length) {
    const levelSize = queue.length // 当前层的节点数
    const currentLevel = [] // 存放当前层的节点值
    // 遍历当前层的所有节点
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift() // 出队列
      currentLevel.push(node.val) // 存放节点值
      // 将当前节点的左右子节点入队列
      if (node.left) {
        queue.push(node.left)
      }
      if (node.right) {
        queue.push(node.right)
      }
    }

    result.push(currentLevel) // 将当前层的节点值存入结果数组
  }

  return result
}

console.log(levelBFS(root))
