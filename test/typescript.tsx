import * as React from "react";

export interface Props {
  /**
   * 这里是属性的说明,必须用多行注释
   */
  name: string;
  /**
   * 这里是我的说明，必须用多行注释
   */
  enthusiasmLevel?: number;
}

interface State {
  currentEnthusiasm: number;
}

class App extends React.Component<Props, State> {

  /**
   * 这里的注释可以不写，但是默认值一定要写才能在规范站点有效展示
   * https://github.com/Microsoft/TypeScript/issues/23812
   */
  static defaultProps: {
    name: string;
    sex: string;
    enthusiasmLevel?: number;
  } = {
    name: "罄天",
    enthusiasmLevel: 100,
    sex: "男"
  };

  constructor(props: Props) {
    super(props);
    this.state = { currentEnthusiasm: props.enthusiasmLevel || 1 };
  }

  public onIncrement = () => this.updateEnthusiasm(this.state.currentEnthusiasm + 1);
  public onDecrement = () => this.updateEnthusiasm(this.state.currentEnthusiasm - 1);

  public render() {
    const { name } = this.props;

    if (this.state.currentEnthusiasm <= 0) {
      throw new Error("You could be a little more enthusiastic. :D");
    }
    return (
      <div className="App">
        <div className="greeting">
          App {name + getExclamationMarks(this.state.currentEnthusiasm)}
        </div>
        <button onClick={this.onDecrement}>-</button>
        <button onClick={this.onIncrement}>+</button>
      </div>
    );
  }

  public updateEnthusiasm(currentEnthusiasm: number) {
    this.setState({ currentEnthusiasm });
  }
}

export default App;

function getExclamationMarks(numChars: number) {
  return Array(numChars + 1).join("!");
}
