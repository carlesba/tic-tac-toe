import React, {Component} from 'react'
import DOM from 'react-dom'
import styled from 'styled-components'
import {get, set} from 'immootable'
import TileView from './views/tile'
import {Valid, Invalid} from './monads/result'
import Tile from './monads/tile'
import Validation from './monads/validation'
import Board from './board'
import {getWinner, checkGameOver} from './game-over'

const validateMovement = ({board, index}) =>
  !get(index, board)
    ? Invalid()
    : Valid(board)

const makeMovement = ({board, winner}, index) =>
  Valid()
    .chain(_ => validateMovement({board, index}))
    .chain(_ => checkGameOver(winner))
    .map(_ => Board.getNextChip(board))
    .map(chip => set(index, Tile(chip), board))
    .map(board =>
      getWinner(board).fold(
        e => ({board, winner}),
        newWinner => ({board, winner: newWinner})
      )
    )

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      board: Board.createBoard(),
      winner: null
    }
  }
  
  move (index) {
    makeMovement(this.state, index)
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
            {...Board.positionFromIndex(index)}
            onClick={_ => this.move(index)}
          >{tile.value}</TileView>
        )}
        {winner && <div>{winner} won!</div>}
      </div>
    )
  }
}

DOM.render(<App />, document.getElementById('root'))
