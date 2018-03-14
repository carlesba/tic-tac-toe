import React, {Component} from 'react'
import DOM from 'react-dom'
import styled from 'styled-components'
import {get, set} from 'immootable'

//
// utils
//
const trace = title => x => {
  console.log(title, x)
  return x
}

//
// functors
//
// Result
const Invalid = value => ({
  chain: f => f(value),
  map: _ => Invalid(value),
  fold: f => f(value)
})
const Valid = value => ({
  chain: f => f(value),
  map: f => Valid(f(value)),
  fold: (_, f) => f(value)
})
const Result = fn => fn(Invalid, Valid)
Result.of = Valid
Result.Valid = Valid
Result.Invalid = Invalid

// Tile
const Tile = value => ({
  value,
  map: f => Tile(f(value)),
  concat: ({value: other}) => other === value ? Tile(value) : Tile(),
  isTaken: _ => !!value
})

// Validation
const Failure = value => ({
  chain: f => f(value),
  concat: v => Failure([].concat(value).concat(v.errors)),
  errors: [].concat(value),
  map: _ => Failure(value),
  fold: f => f(value)
})
const Success = value => ({
  chain: f => f(value),
  concat: v => v.errors ? Failure.concat(v) : Success(v),
  map: f => Success(f(value)),
  fold: (_, f) => f(value)
})
const Validation = fn => fn(Failure, Success)
Validation.of = Success
Validation.Success = Success
Validation.Failure = Failure

//
// constants
//
const X = 'X'
const O = 'O'

//
// position
//
const positionFromIndex = index => ({
  row: Math.floor(index / 3),
  col: index % 3
})
const indexFromPosition = ({row, col}) => row + col

//
// validations
//
const validateMovement = ({board, index}) => !get(index, board)
  ? Result.Invalid()
  : Result.Valid(board)

const winStripes = [
  Array.of(0, 1, 2),
  Array.of(3, 4, 5),
  Array.of(6, 7, 8),
  Array.of(0, 3, 6),
  Array.of(1, 4, 7),
  Array.of(2, 5, 8),
  Array.of(0, 4, 8),
  Array.of(2, 4, 6)
]

const getStripeOwner = board => stripe =>
  stripe.reduce(
    (prevTile, boardIndex) => prevTile === null
      ? board[boardIndex]
      : prevTile.concat(board[boardIndex]),
    null
  )

const stripeWithOwner = board => stripe => getStripeOwner(board)(stripe).isTaken()

const checkCandidates = candidates => !candidates.length
  ? Failure('no winner')
  : Success(candidates)

// board -> Validation(Tile(x))
const getWinner = board => Success()
  .map(_ => winStripes.filter(stripeWithOwner(board)))
  .map(trace('candidates'))
  .chain(checkCandidates)
  .map(trace('failure?'))
  .map(candidates => candidates[0])
  .map(stripe => getStripeOwner(board)(stripe))
  .map(tile => tile.value)

const checkGameOver = winner => Valid()
  .chain(_ => !!winner ? Invalid('game over') : Valid())


//
// board
//
const count = target => board =>
  board.filter(tile => tile.value === target).length

const countX = count(X)
const countO = count(O)
const getChip = board => countX(board) < countO(board) ? X : O

//
// actions
//
const makeMovement = ({board, winner}, index) =>
  Valid()
    .chain(_ => validateMovement({board, index}))
    .chain(_ => checkGameOver(winner))
    .map(_ => getChip(board))
    .map(value => set(index, Tile(value), board))
    .map(board =>
      getWinner(board).fold(
        e => ({board, winner}),
        newWinner => ({board, winner: newWinner})
      )
    )


const TileView = styled.div`
  width: 100px;
  height: 100px;
  outline: 2px solid #333;
  background-color: #777;
  float: left;
  ${p => p.col === 0 && 'clear: left;'}
`

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      board: Array(9).join(',').split(',').map(_ => Tile()),
      winner: null
    }
  }
  
  move (index) {
    const { board, winner } = this.state
    makeMovement({board, winner}, index)
      .fold(
        e => console.error('cant move there!'),
        ({board, winner}) => this.setState({board, winner})
      )
  }
  render () {
    const {board, winner} = this.state
    return (
      <div>
        {board.map((tile, index) =>
          <TileView
            key={index}
            value={tile.value}
            {...positionFromIndex(index)}
            onClick={_ => this.move(index)}
          >{tile.value}</TileView>
        )}
        {winner && <div>{winner} won!</div>}
      </div>
    )
  }
}

DOM.render(<App />, document.getElementById('root'))
