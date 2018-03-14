import React, {Component} from 'react'
import DOM from 'react-dom'
import styled from 'styled-components'
import Task from 'data.task'
import {List} from 'immutable-ext'

// constants
const X = 'X'
const O = 'O'

// position
const positionFromIndex = index => ({
  row: Math.floor(index / 3),
  col: index % 3
})
const indexFromPosition = ({row, col}) => row + col

// validations
const isTileTaken = (board, index) => !!board.get(index)
  ? Task.rejected()
  : Task.of(board)


// board
const count = target => board => board.filter(value => value === target).size
const countX = count(X)
const countO = count(O)
const getChip = board => countX(board) < countO(board) ? X : O

// actions
const makeMovement = (board, index) =>
  isTileTaken(board, index)
  .map(_ => getChip(board))
  .map(value => board.set(index, value))




  // .board.set(index, getChip(board))
    // .map(board => !!board[index] ? Left('not empty') : Right(board))
    // .chain(eitherToTask)

const Tile = styled.div`
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
      players: ['O', 'X'],
      board: List(Array(9).join(',').split(',').map(_ => null))
    }
  }
  
  move (index) {
    const { board } = this.state
    makeMovement(board, index)
      .fork(
        e => console.error('cant move there!'),
        board => this.setState({board})
      )
  }
  render () {
    const {players, board} = this.state
    return (
      <div>
        {board.map((tile, index) => {
          console.log(tile)
          return <Tile
            key={index}
            value={tile}
            {...positionFromIndex(index)}
            onClick={_ => this.move(index)}
          >{tile}</Tile>
        })}
      </div>
    )
  }
}

DOM.render(<App />, document.getElementById('root'))
