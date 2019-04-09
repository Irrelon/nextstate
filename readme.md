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
const {StateController} = require("irrelon-nextstate");

// The argument for the StateController is the state's
// initial value, in this case an empty object {}
const state = new StateController({});

module.exports = state;
```

You can use your new state in various ways:

#### Setting and Updating State Data
```js
import myAwesomeState from "./store/state/myAwesomeState";

// Call to update the state. This data is spread internally
// so it's like doing:
//
// state = {
// 	...currentState,
// 	...JSON.parse(
// 		JSON.stringify(newState)
// 	)
// }
myAwesomeState.update({
	loading: true,
	show: {
		app1: true,
		app2: false
	}
});

// You can also completely overwrite the state data, in this
// case, resetting it to an empty object
myAwesomeState.overwrite({});
```

#### Reading State Data
```js
import myAwesomeState from "./store/state/myAwesomeState.js";

// Via dot path notation (see https://github.com/Irrelon/irrelon-path)
const app1Val = myAwesomeState.get('show.app1');

// The whole state object
const stateData = myAwesomeState.value();
```

#### Usage in a React Component
You can wrap your component in the higher-order-component "useProps"
provided with Irrelon NextState and include as many states as you
like. These will be passed into your component as props, accessible
via this.props.

```js
import React from 'react';
import myAwesomeState from "./store/state/myAwesomeState";
import {useProps} from "irrelon-nextstate";

class MyComponent extends React.PureComponent {
	render () {
		toggleLoading () {
			const newVal = !myAwesomeState.get('loading');
			
			myAwesomeState.update({
				loading: newVal			
			});
		}
		
		return (
			<div onClick={this.toggleLoading.bind(this)}>{this.props.myAwesomeStateData.loading}</div>
		);
	}
}

// The name of the state data prop will be the key the state is
// assigned to in the object passed to useProps as the first argument
export default useProps({
	myAwesomeStateData: myAwesomeState,
	someOtherStateData: someOtherState
}, MyComponent);
```

> Keep in mind that when you provide a react component the state data as
props by using the useProps HOC, the props contain the *data object* the
state instance contains, not the state instance itself. If you want to use
the state instance from your react component code, call a method like the
above example with toggleLoading().

# Conventions
While we try to be unopinionated in our modules we have found that some
conventions seem to work well for us.

In the case of Irrelon NextState we have found that maintaining a ./store
folder in the root of the project and keeping state objects in the
./store/state folder is a faily clean pattern.

We put any global actions related to the states in the ./store/actions
folder. For instance if you wanted to maintain actions that modified
a user session state object you could have two files:

* ./store/state/session.js
* ./store/actions/session.js

Here are the theoretical files:

> ./store/state/session.js
```js
const {StateController} = require("irrelon-nextstate");

const state = new StateController({
	loggedIn: false
});

module.exports = state;
```

> ./store/actions/session.js
```js
const state = require('../state/session');

const login = () => {
	fetch('some-login-url')
		.then((userData) => {
			state.update({
				...userData,
				loggedIn: true
			});
		})
		.catch((err) => {
			state.update({
				sessionErr: err
			});
		});
};

const logout = () => {
	state.overwrite({
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

# Internals
Internally Irrelon NextState uses a couple of other Irrelon modules that
you may find interesting:

* https://github.com/Irrelon/irrelon-path (npm i irrelon-path)
* https://github.com/Irrelon/emitter (npm i irrelon-emitter)

