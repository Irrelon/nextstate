import React from "react";

class Provider extends React.PureComponent {
	constructor (props) {
		super(props);
		
		this.state = {
			val: props.state.value()
		};
		
		this.handleChange = () => {
			this.setState({
				val: props.state.value()
			});
		};
		
		props.state.on("change", this.handleChange);
	}
	
	componentWillUnmount () {
		this.props.state.off("change", this.handleChange);
	}
	
	render () {
		const Context = this.props.state.context();
		
		return (
			<Context.Provider value={this.state.val}>
				{this.props.children}
			</Context.Provider>
		);
	}
}

export default Provider;