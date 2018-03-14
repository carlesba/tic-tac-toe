import {Valid, Invalid} from './monads/result'
import {Success, Failure} from './monads/validation'

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
export const getWinner = board => Success()
  .map(_ => winStripes.filter(stripeWithOwner(board)))
  .chain(checkCandidates)
  .map(candidates => candidates[0])
  .map(stripe => getStripeOwner(board)(stripe))
  .map(tile => tile.value)


export const checkGameOver = winner => Valid()
  .chain(_ => !!winner ? Invalid('game over') : Valid())
