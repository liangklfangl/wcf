import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./typescript.tsx";
console.log('App==',App);
ReactDOM.render(<App name="罄天" />, document.getElementById(
  "app"
) as HTMLElement);
