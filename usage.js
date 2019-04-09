const NextState = require('irrelon-nextstate');
const React = require('react');

let counter = new NextState(0);

setInterval(() => {
	counter++;
});

class MyClass extends React.PureComponent {
	render () {
		return (
			<div>{counter}</div>
		);
	}
}

export default MyClass;