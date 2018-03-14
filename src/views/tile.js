import styled from 'styled-components'

const Tile = styled.div`
  width: 100px;
  height: 100px;
  outline: 2px solid #333;
  background-color: #777;
  float: left;
  ${p => p.col === 0 && 'clear: left;'}
`

export default Tile
