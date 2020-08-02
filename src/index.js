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
  //コンストラクタでstateを初期化
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true
    };
  }

  //親のstateを更新したいため、そういう関数をprops(onclick)として渡す
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => {
          this.handleClick(i);
        }}
      />
    );
  }

  //state(squares)を更新
  handleClick(i) {
    //イミュータブルにstateを書き換える
    //利点①：ヒストリを保って再利用できる
    //利点②：書き換えが行われたかどうかがオブジェクトレベルで判定できるため容易
    //利点③：書き換えのタイミング＝再レンダリングと認識できる

    //配列のコピーを作成
    const squeres = this.state.squares.slice();
    squeres[i] = this.state.xIsNext ? "X" : "O";
    //stateを更新
    this.setState({
      squares: squeres,
      xIsNext: !this.state.xIsNext
    });
  }

  render() {
    const status = "Next player: " + (this.state.xIsNext ? "X" : "O");

    return (
      <div>
        <div className="status"> {status} </div>{" "}
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
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>{" "}
        <div className="game-info">
          <div> {/* status */} </div> <ol> {/* TODO */} </ol>{" "}
        </div>{" "}
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
