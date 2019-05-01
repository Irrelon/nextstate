import {PsrovideState, useState} from "./src";

const {State} = require('irrelon-nextstate');
const React = require('react');

let counterState = new State("counter", {val: 0});

setInterval(() => {
	counterState.update({val: counterState.value().val + 1});
});

class MyClass extends React.PureComponent {
	render () {
		return (
			<PsrovideState stateArr={[counterState]}>
				<div>{counter.val}</div>
			</PsrovideState>
		);
	}
}

export default useState({
	"counter": counterState
}, MyClass);