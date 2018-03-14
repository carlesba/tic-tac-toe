import Tile from './monads/tile'

const X = 'X'
const O = 'O'

const createBoard = _ => Array(9)
  .join(',')
  .split(',')
  .map(_ => Tile())

const count = target => board =>
  board.filter(tile => tile.value === target).length

const countX = count(X)
const countO = count(O)

const getNextChip = board => countX(board) < countO(board) ? X : O

const positionFromIndex = index => ({
  row: Math.floor(index / 3),
  col: index % 3
})

const indexFromPosition = ({row, col}) => row + col



export default {
  createBoard,
  getNextChip,
  positionFromIndex
}
