import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button 
            className={props.active ? "square-winner" : "square"} 
            onClick={props.onClick}
        >
          {props.value}
        </button>
    );
}

  
class Board extends React.Component {
    renderSquare(i) {
        const [a, b, c] = this.props.lines;
        return (
            <Square key={i} 
                active={(a === i || b === i || c === i) ? true : false}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderWithTwoLoops(){
        let counter = 0;
        let row = [];
        let column = [];

        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                row.push(this.renderSquare(counter));
                counter++;
            }
            column.push(
                <div key={i} className="board-row">
                    {row}
                </div>
            );
            row = [];
        }
        return column;
    }
  
    render() {   
        return (
            <div>
                {this.renderWithTwoLoops()}
            </div>
        );
    }
}
  
class Game extends React.Component {4
    constructor(props){
        super(props);
        this.state = {
            history : [{
                squares: Array(9).fill(null),
                position: null
            }],
            stepNumber: 0,
            xIsNext: true
        }
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        const lin = parseInt(i / 3) + 1;
        const col = (i % 3) + 1;

        this.setState({
            history: history.concat([{
                squares: squares,
                position: '(' + lin + ',' + col + ')'
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            position: i
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    toggleSelect(option){
        let step;
        if (option === 'up'){
            if(this.state.stepNumber === 0)
                return
            else
                step = this.state.stepNumber - 1;

        } else if(option === 'down'){
            if(this.state.stepNumber === this.state.history.length - 1)
                return
            else
                step = this.state.stepNumber + 1;
        }
        this.jumpTo(step);
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move # ' + move + history[move].position :
                'Go game start';

            return(
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {move === this.state.stepNumber ? <b>{desc}</b> : desc}
                    </button>
                </li>
            );
        });

        let status;
        if(winner){
            status = 'Winner: ' + winner.winner;
        } else if (this.state.stepNumber === 9){
            status = 'Result being a draw!';
        } else {
            status = 'Next player: ' +  (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
            <div className="game-board">
                <Board 
                    lines={winner ? winner.lines : [null, null, null]}
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>   
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            <div>
                <button onClick={() => this.toggleSelect('up')}>&uarr;</button>
                <button onClick={() => this.toggleSelect('down')}>&darr;</button>
            </div> 
            </div>
        );
    }
}
  
// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                lines : lines[i]
            };
        }
    }
    return null;
  }