
const Tile = value => ({
  value,
  map: f => Tile(f(value)),
  concat: ({value: other}) => other === value
    ? Tile(value)
    : Tile(),
  isTaken: _ => !!value
})

export default Tile
