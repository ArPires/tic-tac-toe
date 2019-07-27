import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
    return (
        <button 
            className="square" 
            onClick={props.onClick}
            style={ props.isWinner ? {backgroundColor: "#00FF00"} : { backgroundColor: "#FFFFFF"}}
        >
            {props.value}
            {props.isWinner}
        </button> 
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                isWinner={this.props.winnerSquares[i]}
            />
        );
    }
    loop(n) {
        let arr = [];
        for(let i = n; i < n + 3; i++) {
            arr.push(this.renderSquare(i))
        }
        return arr;
    }
    render() {
        let res = [0,3,6].map(a => {
            return <div key={a} className='board-row'>{this.loop(a)}</div>
        })
        return res;
    }
}

function Status(props) {
    let status;
    if (props.winner) {
        let player = props.winner.pop();
        status = "Winner: " + player;
        return status;
    } else if (!props.current.squares.includes(null)) {
        status = "It's a draw";
        return status;
    } else {
        status = "Next player: " + (props.xIsNext ? "X" : "O");
        return status;
    }
}

function RestartGame(props) {
    return (
        <button 
            className="restart-button" 
            onClick={() => props.onClickRestart()}
        >
            {"Restart Game"}
        </button>
    )
}

function InvertMoves(props) {
    return(
        <button
            onClick={() => props.onClickInvert()}
        >
            { props.isInverted ? "Descending Order" : "Ascending Order"}
        </button>
    )
}

function MovesList(props) {
    let moves = props.history.map((step, move) => {
        const desc = move ? 'Go to move #' + move + " on position: " + step.pos : "Game Begining";
        return (
            <li key={move}>
                <button onClick={() => props.jumpTo(move)}>{desc}</button>
            </li>
        )
    })
    if(props.isInverted) {
        moves = moves.reverse();
        return moves;
    }
    return moves;
}

class GameInfo extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <Status 
                        winner={this.props.winner}
                        current={this.props.current}
                        xIsNext={this.props.xIsNext}
                    />
                </div>
                <div>
                    <RestartGame
                        onClickRestart={() => this.props.onClickRestart()}
                    />
                </div>
                <div>
                    <InvertMoves 
                        onClickInvert={() => this.props.onClickInvert()}
                        isInverted={this.props.isInverted}
                    />
                </div>
                <div>
                    <ol>
                        <MovesList 
                            history={this.props.history}
                            jumpTo={(move) => this.props.jumpTo(move)}
                            isInverted={this.props.isInverted}
                        />
                    </ol>
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    winnerSquares: Array(9).fill(null),
                    pos: "",
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            isInverted: false,
        };
    }
    handleInvertMovesClick() {
        this.setState({
            isInverted: !this.state.isInverted,
        });
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winnerSquares = current.winnerSquares.slice();
        const pos = mapPosition(i);

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ?  "X" : "O";
        winnerSquares[i] = false;

        this.setState({
            history: history.concat([{
                squares: squares,
                winnerSquares: winnerSquares,
                pos: pos,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    cleanHistory() {
        this.setState({
            history: [
                {
                    squares: Array(9).fill(null),
                    winnerSquares: Array(9).fill(null),
                    pos: "",
                }
            ],
            stepNumber: 0,
            xIsNext: true,
        })
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        if(winner) {
            winner.map(i => current.winnerSquares[i] = true)
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        winnerSquares={current.winnerSquares}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <GameInfo 
                        history={history}
                        current={current}
                        winner={winner}
                        xIsNext={this.state.xIsNext}
                        isInverted={this.state.isInverted}
                        onClickRestart={() => this.cleanHistory()}
                        onClickInvert={() => this.handleInvertMovesClick()}
                        jumpTo={(move) => this.jumpTo(move)}
                    />
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return [a,b,c,squares[a]];
        }
    }
    return null;
}

function mapPosition(i) {
    let arrOfPositions = [
        "(1,1)",
        "(2,1)",
        "(3,1)",
        "(1,2)",
        "(2,2)",
        "(3,2)",
        "(1,3)",
        "(2,3)",
        "(3,3)"
    ]
    return arrOfPositions[i];
}