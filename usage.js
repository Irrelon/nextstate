const {StateController} = require('irrelon-nextstate');
const React = require('react');

let counter = new StateController(0);

setInterval(() => {
	counter.update(counter.value() + 1);
});

class MyClass extends React.PureComponent {
	render () {
		return (
			<div>{counter}</div>
		);
	}
}

export default MyClass;