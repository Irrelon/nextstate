import React, {Component} from "react";
import {NextStateStoreContext} from "./Context";

class StoreProvider extends Component {
	constructor (props) {
		super(props);
		
		const {data} = props;
		
		this.state = {
			data
		};
	}
	
	componentDidUpdate (prevProps) {
		if (this.props.data !== prevProps.data) {
			this.setState({
				"data": this.props.data
			});
		}
	}
	
	render () {
		return (
			<NextStateStoreContext.Provider value={this.state.data}>
				{this.props.children}
			</NextStateStoreContext.Provider>
		);
	}
}

export default StoreProvider;