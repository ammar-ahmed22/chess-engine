<div align="center">
<h1>@ammar-ahmed22/chess-engine</h1>
<p>Custom built chess engine built as a learning exercise!</p>
</div>

## What is this?
To start, I would like to note that this is not an actual chess engine. It is merely a valid move calculator/game state handler. You can find valid moves for given chess positions and track games using this API. 

If you do stumble across this, I would like to mention that this project doesn't do anything differently or better than any of the existing chess valid move calculators like `chess.js`. In fact, it's probably a lot worse in terms of efficiency and complexity. I built this as a personal learning exercise as building a chess move calculator seemed like a complex project for me to undertake. 

I may also potentially use this in my personal website as a fun interactive experience. Since my website is completely designed and implemented by myself, I wanted to take this on myself as well. 

## Features
- **FEN Positions**: Chess positions are set and provided as FEN strings.
- **Valid Moves**: Calculate valid moves for any given FEN position.
- **Game History**: Games history (moves) are stored internally and state is calculated using the state (castling ability, etc.)
- **Square ID's**: Squares can be accessed using a robust `SquareID` object that can be initialized in many ways.
- **Checks, CheckMate, Stalemate**: The various game ending states are calculated and available.
- **En Passant, Half Move**: Complex Chess rules such as En Passant and half move count are implemented as well.
- **Rigorous Testing**: All code is rigorously unit tested to ensure correctness.

## Installation
```bash
npm install --save @ammar-ahmed22/chess-engine
```

## Usage
### Basic Game Usage
Below I will show the classic Scholar's mate game with checkmate in 4 moves:
```typescript
import { Chess } from "@ammar-ahmed22/chess-engine";
import type { FullMove, HalfMove, MoveType } from "@ammar-ahmed22/chess-engine";

// Initialization
const chess = new Chess();

// The starting fen position
console.log(chess.fen())
// >> rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR

// Color to move to start is white
console.log(chess.colorToMove())
// >> white

// Calculates ALL of the valid moves as white in the starting position.
const moves: HalfMove[] = chess.validMoves();
console.log(moves);
// >> [
// >>  { color: 'white', from: 'a2', to: 'a3', piece: 'pawn' },
// >>  { color: 'white', from: 'a2', to: 'a4', piece: 'pawn' },
// >>  { color: 'white', from: 'b2', to: 'b3', piece: 'pawn' },
// >>  { color: 'white', from: 'b2', to: 'b4', piece: 'pawn' },
// >>  { color: 'white', from: 'c2', to: 'c3', piece: 'pawn' },
// >>  ... all the other moves  
// ]

// Trying to execute an invalid move
let result = chess.execute({ from: "e2", to: "e7"}, { validate: true })
// logs a warning
// >> Move is not valid!
console.log(result);
// >> null

// Executing a move (you can also use the HalfMove object to execute moves)
// returns the executed move
result = chess.execute({ from: "e2", to: "e4"}, { validate: true })
console.log(result);
// >> {
// >>  from: 'e2',
// >>  to: 'e4',
// >>  color: 'white',
// >>  piece: 'pawn',
// >>  take: undefined,
// >>  castle: undefined,
// >>  check: undefined,
// >>  promotion: undefined
// >> }

console.log(chess.colorToMove());
// >> black

const scholarsMate: MoveType[] = [
  // black pawn to e5
  {
    from: "e7", to: "e5"
  },
  // white bishop to c4
  {
    from: "f1", to: "c4"
  },
  // black knight to c6
  {
    from: "b8", to: "c6"
  },
  // white queen to h5
  {
    from: "d1", to: "h5"
  },
  // black knight to f6
  {
    from: "g8", to: "f6"
  },
  // white queen to f7, checkmate
  {
    from: "h5", to: "f7"
  }
]

for (let move of scholarsMate) {
  chess.execute(move, { validate: true });
}

console.log(chess.validMoves());
// >> []
console.log(chess.checkmate());
// >> true

// History shows all the moves played
const history: FullMove[] = chess.history();
// >> [
// >>   {
// >>     white: {
// >>       from: 'e2',
// >>       to: 'e4',
// >>       color: 'white',
// >>       piece: 'pawn',
// >>       take: undefined,
// >>       castle: undefined,
// >>       check: undefined,
// >>       promotion: undefined
// >>     },
// >>     black: {
// >>       from: 'e7',
// >>       to: 'e5',
// >>       color: 'black',
// >>       piece: 'pawn',
// >>       take: undefined,
// >>       castle: undefined,
// >>       check: undefined,
// >>       promotion: undefined
// >>     }
// >>   },
// >>   {
// >>     white: {
// >>       from: 'f1',
// >>       to: 'c4',
// >>       color: 'white',
// >>       piece: 'bishop',
// >>       take: undefined,
// >>       castle: undefined,
// >>       check: undefined,
// >>       promotion: undefined
// >>     },
// >>     black: {
// >>       from: 'b8',
// >>       to: 'c6',
// >>       color: 'black',
// >>       piece: 'knight',
// >>       take: undefined,
// >>       castle: undefined,
// >>       check: undefined,
// >>       promotion: undefined
// >>     }
// >>   },
// >>   {
// >>     white: {
// >>       from: 'd1',
// >>       to: 'h5',
// >>       color: 'white',
// >>       piece: 'queen',
// >>       take: undefined,
// >>       castle: undefined,
// >>       check: undefined,
// >>       promotion: undefined
// >>     },
// >>     black: {
// >>       from: 'g8',
// >>       to: 'f6',
// >>       color: 'black',
// >>       piece: 'knight',
// >>       take: undefined,
// >>       castle: undefined,
// >>       check: undefined,
// >>       promotion: undefined
// >>     }
// >>   },
// >>   {
// >>     white: {
// >>       from: 'h5',
// >>       to: 'f7',
// >>       color: 'white',
// >>       piece: 'queen',
// >>       take: 'pawn',
// >>       castle: undefined,
// >>       check: 'black',
// >>       promotion: undefined
// >>     }
// >>   }
// >> ]
```

## License
[MIT](./LICENSE)