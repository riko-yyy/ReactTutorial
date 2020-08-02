import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

//コンポーネント
//クラスで記述する。render()を実装することでJSXとして利用できる
//自身でstateを持たなず、親へイベントを伝えるのみの「制御されたコンポーネント」
//この場合renderメソッドのみ所有しているので、classでなくfunctionで事足りる。これを「関数コンポーネント」と呼ぶ
function Square(props) {
  //親コンポーネントからのpropsを受け取る
  return (
    <button
      className="square"
      //親コンポーネントからprops経由で渡ってきた関数を子で実行する
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  //親のstateを更新したいため、そういう関数をprops(onclick)として渡す
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => {
          this.props.onClick(i);
        }}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {" "}
          {this.renderSquare(0)} {this.renderSquare(1)} {this.renderSquare(2)}{" "}
        </div>{" "}
        <div className="board-row">
          {" "}
          {this.renderSquare(3)} {this.renderSquare(4)} {this.renderSquare(5)}{" "}
        </div>{" "}
        <div className="board-row">
          {" "}
          {this.renderSquare(6)} {this.renderSquare(7)} {this.renderSquare(8)}{" "}
        </div>{" "}
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
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    //movesにゲーム履歴をReactオブジェクトとして格納
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        //Vueと同じように、keyが必要
        //配列のindexは挿入、ソート時に変わるため非推奨
        <li key={move}>
          <button
            onClick={() => {
              this.jumpTo(move);
            }}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => {
              this.handleClick(i);
            }}
          />
        </div>{" "}
        <div className="game-info">
          <div> {status} </div> <ol> {moves} </ol>{" "}
        </div>{" "}
      </div>
    );
  }

  //
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  //state(squares)を更新
  handleClick(i) {
    //イミュータブルにstateを書き換える
    //利点①：ヒストリを保って再利用できる
    //利点②：書き換えが行われたかどうかがオブジェクトレベルで判定できるため容易
    //利点③：書き換えのタイミング＝再レンダリングと認識できる

    //配列のコピーを作成
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squeres = current.squares.slice();

    //既に勝負がついてたらreturn
    if (calculateWinner(squeres) || squeres[i]) {
      return;
    }

    squeres[i] = this.state.xIsNext ? "X" : "O";
    //stateを更新
    this.setState({
      history: history.concat([{ squares: squeres }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

//勝者判定関数
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
