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

class BoardRow extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                isWinner={this.props.winnerSquares[i]}
            />
        );
    }
    loop(n) {
        let arr = [];
        for(let i = n; i < n + 3; i++) {
            arr.push(this.renderSquare(i));
        }
    }
    render() {
        return (
            <div className="board-row">{this.props.loop}</div>
        )
    }
}

class Board extends React.Component {
   /*  renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    } */
    render() {
        /* let result = [];
        [0,3,6].forEach(a =>  result.push("<div className='board-row'>" + loop(a) + "</div>")); */
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
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
        };
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
    jumpTo(step) {
        if(step === 0) {
            this.setState({
                history: [
                    {
                        squares: Array(9).fill(null),
                        winnerSquares: Array(9).fill(null),
                        pos: "",
                    }
                ],
            })
        }
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        console.log(current);
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move + " on position: " + step.pos : 'Restart Game';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        let status;
        if (winner) {
            let player = winner.pop();
            current.winnerSquares[winner[0]] = true;
            current.winnerSquares[winner[1]] = true;
            current.winnerSquares[winner[2]] = true;
            status = "Winner: " + player;
        } else if (history.length === 10) {
            status = "It's a draw";
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
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
                    <div>{status}</div>
                    <ol>{moves}</ol>
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
            let winner = [];
            winner.push(a,b,c,squares[a]);
            return winner;
            //return squares[a];
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

function loop(n) {
    let arr = [];
    for(let i = n; i < n + 3; i++){
        arr.push("{this.renderSquare(" + i + ")}")
    }
    return arr;
}