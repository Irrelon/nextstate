> ./components/MyCounterOutput.js
```js
const React = require('react');
import {useState} from "irrelon-nextstate";
import counterState from "./state/counter";

class MyCounterOutput extends React.PureComponent {
	render () {
		return (
			<div>{counter.val}</div>
		);
	}
}

export default useState({
	"counter": counterState
}, MyCounterOutput);
```

> ./pages/MyApp.js
```js
const React = require('react');
import {ProvideState} from "irrelon-nextstate";
import counterState from "./state/counter";
import MyCounterOutput from "./components/MyCounterOutput";

class MyApp extends React.PureComponent {
	render () {
		return (
			<ProvideState stateStore={this.props.stateStore}>
				<MyCounterOutput />
			</ProvideState>
		);
	}
}

export default MyApp;
```