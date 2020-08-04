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
      className={"square" + " " + props.className}
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
        value={this.props.current.squares[i]}
        className={
          this.props.current.isGameOver && this.props.current.pointIndex === i
            ? "highlight"
            : ""
        }
        onClick={() => {
          this.props.onClick(i);
        }}
      />
    );
  }

  render() {
    const boardSize = 3;
    let rows = [];
    for (let row = 0; row < boardSize; row++) {
      let cols = [];
      for (let col = 0; col < boardSize; col++) {
        cols.push(this.renderSquare(boardSize * row + col));
      }
      rows.push(<div className="board-row"> {cols} </div>);
    }
    return <div>{rows}</div>;
  }
}

function Toggle(props) {
  return (
    <button onClick={props.onClick}>{props.isToggleOn ? "ASC" : "DESC"}</button>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          pointIndex: -1,
          isGameOver: false
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isToggleOn: true
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    //movesにゲーム履歴をReactオブジェクトとして格納
    const moves = history.map((step, move) => {
      const point = this.calculatePointByIndex(step.pointIndex);
      const desc = move
        ? "Go to move #" + move + " (" + point.col + "," + point.row + ")"
        : "Go to game start";
      return (
        //Vueと同じように、keyが必要
        //配列のindexは挿入、ソート時に変わるため非推奨
        <li key={move}>
          <button
            className={move === this.state.stepNumber ? "highlight" : ""}
            onClick={() => {
              this.jumpTo(move);
            }}
          >
            {desc}
          </button>
        </li>
      );
    });
    const sortedMoves = this.state.isToggleOn ? moves : moves.reverse();

    let status;
    if (current.isGameOver) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            current={current}
            onClick={i => {
              this.handleClick(i);
            }}
          />
        </div>{" "}
        <div className="game-info">
          <div> {status} </div>
          <Toggle
            onClick={() => {
              this.switchToggle();
            }}
            isToggleOn={this.state.isToggleOn}
          />
          <ol> {sortedMoves} </ol>{" "}
        </div>{" "}
      </div>
    );
  }

  switchToggle() {
    this.setState({
      isToggleOn: !this.state.isToggleOn
    });
  }

  //indexから座標を計算する
  calculatePointByIndex(i) {
    return {
      col: i % 3,
      row: Math.floor(i / 3)
    };
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

    //盤の状態を更新
    squeres[i] = this.state.xIsNext ? "X" : "O";

    //今回の番手で勝負がついているか判定
    let isGameOver = false;
    if (calculateWinner(squeres)) {
      isGameOver = true;
    }

    //stateを更新
    this.setState({
      history: history.concat([
        { squares: squeres, pointIndex: i, isGameOver: isGameOver }
      ]),
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
