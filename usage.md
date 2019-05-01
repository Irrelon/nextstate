> ./state/counter.js
```js
const {State} = require('irrelon-nextstate');
const React = require('react');

let counterState = new State("counter", {val: 0});

setInterval(() => {
	counterState.update({val: counterState.value().val + 1});
});
```

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
			<ProvideState stateArr={[counterState]}>
				<MyCounterOutput />
			</ProvideState>
		);
	}
}

export default MyApp;
```