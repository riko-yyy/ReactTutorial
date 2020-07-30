import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

//コンポーネント
//クラスで記述する。render()を実装することでJSXとして利用できる
class Square extends React.Component {
  //コンストラクタでstateを初期化
  //サブクラスのコンストラクタでは親のコンストラクタを必ず呼ぶ
  constructor(props) {
    super(props);
    this.state = { value: null };
  }

  render() {
    //親コンポーネントからのpropsを受け取る
    return (
      <button
        className="square"
        onClick={() => {
          //setStateを呼び出すことで、再renderする
          this.setState({ value: "X" });
        }}
      >
        {this.state.value}
      </button>
    );
  }
}

class Board extends React.Component {
  //props(value)で子コンポーネントへ値を渡す
  renderSquare(i) {
    return <Square value={i} />;
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
