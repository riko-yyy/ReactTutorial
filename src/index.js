import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

//コンポーネント
//クラスで記述する。render()を実装することでJSXとして利用できる
//自身でstateを持たなず、親へイベントを伝えるのみの「制御されたコンポーネント」
class Square extends React.Component {
  render() {
    //親コンポーネントからのpropsを受け取る
    return (
      <button
        className="square"
        onClick={() => {
          //親コンポーネントからprops経由で渡ってきた関数を子で実行する
          this.props.onClick();
        }}
      >
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  //コンストラクタでstateを初期化
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null)
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
    //配列のコピーを作成
    const squeres = this.state.squares.slice();
    squeres[i] = "X";
    //stateを更新
    this.setState({ squares: squeres });
  }

  render() {
    const status = "Next player: X";

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
