# Irrelon NextState
A clean and easy to use state management system that doesn't require you
to pepper your project with horrible action constants and reducer code.

## Install
```bash
npm i irrelon-nextstate
```

## Usage

#### Creating a State Instance
You can create state for your component / page / whatever very easily:

> ./store/state/myAwesomeState.js

```js
const {State} = require("irrelon-nextstate");

// The arguments for State are the state name and the state's
// initial value, in this case an empty object {}
const state = new State("myAwesomeState", {});

module.exports = state;
```

#### Wrap Your App in The Store Provider
```js
import MyApp from './MyApp';
import {getStore, ProvideState} from "irrelon-nextstate";

class MyApp extends React.Component {
	static getInitialProps = () => {
		const myStore = getStore({
			"session": {
				"loggedIn": false
			},
			"lang": "th",
			"currency": "thb"
		});
		
		return {
			_storeData: myStore.exportData()
		};
	};
	
	constructor (props) {
		super(props);
		this.stateStore = getStore(props._storeData);
	}
	
	render() {
		return <ProvideState stateStore={this.stateStore}>
			<MyApp />
		</ProvideState>
	}
}

export default MyApp;
```

#### Usage in a React Component
Before you can use the state system you must instantiate a store that
all state is kept in. This store is passed into the React component
tree via a React context much like react-redux does.



You can wrap your component in the higher-order-component "useState"
provided with Irrelon NextState and include as many states as you
like. These will be passed into your component as props, accessible
via this.props.

```js
import React from 'react';
import myAwesomeState from "./store/state/myAwesomeState.js";
import {useState} from "irrelon-nextstate";

class MyComponent extends React.PureComponent {
	toggleLoading = () => {
		const newVal = !this.props.myAwesomeStateData.loading;
		
		myAwesomeState.update(this.props.stateStore, {
			loading: newVal			
		});
	};
    		
	render () {
		return (
			<div onClick={this.toggleLoading}>{this.props.myAwesomeStateData.loading}</div>
		);
	}
}

// useState takes an object with key/value pairs. You are mapping the state by the name
// of (key) to the prop name (value) that the component will be passed.
// e.g. if you pass { "foo": "bar" } you are telling NextState to map the data in
// the state called "foo" to a prop in the component called "bar" which can then
// be accessed in the component via "this.props.bar".
export default useState({
	"myAwesomeState": "myAwesomeStateData",
	"someOtherState": "someOtherStateData"
}, MyComponent);
```

> Keep in mind that when you provide a react component the state data as
props by using the useState HOC, the props contain the *data* the
state instance contains, not the state instance itself. If you want to use
the state instance from your react component code, call a method like the
above example with toggleLoading().

When using useState() the target component will also automatically receive a prop called
"stateStore". This is very useful for modifying state inside components as it must be 
passed with any CRUD method calls.

> WARNING do not cache stateStore or maintain a reference to it. Doing so could cause
memory leaks and potential cross-contamination of state data between renders.

# Conventions
While we try to be unopinionated in our modules we have found that some
conventions seem to work well for us.

In the case of Irrelon NextState we have found that maintaining a ./store
folder in the root of the project and keeping state objects in the
./store/state folder is a fairly clean pattern.

We put any actions related to the states in the ./store/actions folder.
For instance if you wanted to maintain actions that modified a user session
state object you could have two files:

* ./store/state/session.js
* ./store/actions/session.js

Here are the theoretical files:

> ./store/state/session.js
```js
const {State} = require("irrelon-nextstate");

const state = new State("session", {
	loggedIn: false
});

module.exports = state;
```

> ./store/actions/session.js
```js
const state = require('../state/session');

const login = (stateStore) => {
	fetch('some-login-url')
		.then((userData) => {
			state.update(stateStore, {
				...userData,
				loggedIn: true
			});
		})
		.catch((err) => {
			state.update(stateStore, {
				sessionErr: err
			});
		});
};

const logout = (stateStore) => {
	state.overwrite(stateStore, {
		loggedIn: false
	});
};

module.exports = {
	login,
	logout
};
```

This convention allows us to create some actions that modify the state
data for us. If you want, you can centrally locate all your "actions" into
these sorts of files related to the state data they modify.

# State
## Methods
### update
>state.update(store<Store>, newValue<*>);

Changes the current value of the state to the new value passed.

#### Usage
```js
state.update(stateStore, "hello");
```

### set
>state.set(store<Store>, path<String>, newValue<*>);

Changes the current value in the specified path of the current state object
to the new value.

#### Usage
```js
state.update(stateStore, {
	foo: {
		bar: true
	}
});

state.set(store, path, newValue);
```

# Debugging & Logs
If you want to see debug output showing all the stuff Irrelon NextState is
doing while it is running, set an environment variable:

```bash
IRRELON_LOG="ProvideState=*,Store=*,useState=*"
```


# Internals
Internally Irrelon NextState uses a couple of other Irrelon modules that
you may find interesting:

* https://github.com/Irrelon/irrelon-path (npm i irrelon-path)
* https://github.com/Irrelon/emitter (npm i irrelon-emitter)

