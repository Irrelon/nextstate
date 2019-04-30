import React from "react";
import nextStateStore from "./stateStore";

export default (App) => {
	return class AppWithNextState extends React.Component {
		static async getInitialProps (appContext) {
			const store = nextStateStore.getStore();
			console.log("getInitialProps: The store state is", store.getState());
			
			// Provide the store to getInitialProps of pages
			appContext.ctx.store = store;
			
			let appProps = {};
			
			if (typeof App.getInitialProps === "function") {
				appProps = await App.getInitialProps(appContext);
			}
			
			return {
				...appProps,
				"initialNextStateStore": store.getState()
			};
		}
		
		constructor (props) {
			super(props);
			
			this.store = nextStateStore.getStore(props.initialNextStateStore);
			this.state = this.store.getState();
			
			console.log("constructor: The store state is", this.state);
			
			this.handleChange = () => {
				this.setState(this.store.getState());
			};
			
			this.store.on("change", this.handleChange);
		}
		
		componentWillUnmount () {
			this.store.off("change", this.handleChange);
		}
		
		render () {
			return (<App {...this.props} nextStateData={this.state} />);
		}
	};
};