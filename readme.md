# Irrelon NextState
A clean and easy to use state management system that doesn't require you
to pepper your project with horrible action constants and reducer code.

## Install
```bash
npm i @irrelon/nextstate
```

## Usage

### Define States
> states/projectState.js

```js
import {State} from "@irrelon/nextstate";

// "project" is the name of the state and the object in
// the second argument is the initial / default state
const projectState = new State("project", {
	name: "My First Project"
});

export default projectState;
```

### Next.js / React Pages and Components
> pages/MyPage.js

```js
import {irrelonNextState} from "@irrelon/nextstate";
import projectState from "../states/projectState";

const MyPage = (props) => {
    const {project, patchProject} = props;

    return (
        <div>
            <div>{project.name}</div>
            <button onClick={() => {
            	patchProject({
            	    name: "New Name"
                });
            }}>Do a patch</button>
        </div>
    );
};

export default irrelonNextState({
    "project": projectState, // Use the state data and assign to the prop "project"
    "patchProject": projectState.patch // Set prop "patchProject" to a function that patches the state
}, MyPage);
```

# State Methods
State methods can be used to provide a function as a prop to your page or component
that allows you to operate on the state inside your component code.

All methods operate on data in an immutable fashion. For more information see the
@irrelon/path package which does the store object modification under the hood.

## patch
> state.patch(newValue<*>);

Patches the current state with the new data passed. If the current state is an
array or an object and the new value is also an array or object, the new data
is spread on top of the old data.

### Get It
```js
export default irrelonNextState({
    "somePropName": myState.patch
}, MyPage);
```

### Use It
```js
somePropName.patch("hello");
```

When updating objects or arrays, new data is spread on top of old data:

```js
newData = {...oldData, ...newData};
```

If you don't want to spread data and would prefer to completely overwrite it,
please use the `put` or `set` methods instead of `patch`.

## put
> state.put(newValue<*>);

Changes the current value in the state to the new passed value, overwriting
any previous state data.

If you want to update your state and maintain existing structures then
see the `patch` method instead.

### Get It
```js
export default irrelonNextState({
    "somePropName": myState.put
}, MyPage);
```

### Use It
```js
somePropName.put({
	foo: {
		bar: true
	}
});
```

## set
> state.set(path<String>, newValue<*>);

Changes the current value in the specified path of the current state object
to the new value. Paths are dot-notation based. This operates in the same way
to the `put` method but is directed at a path within the current state.

### Get It
```js
export default irrelonNextState({
    "somePropName": myState.set
}, MyPage);
```

### Use It
```js
// Assuming a state that has been defined like this:
somePropName.put({
	foo: {
		bar: true
	}
});

// You can directly modify the value of foo's bar value via:
propName.set("foo.bar", false);
```

## get
> state.get([path<String>], [defaultVal<*>]);

Gets the current value in the specified path of the current state object.
If the value at the specified path is undefined and a defaultVal argument
is provided, it is returned instead.

### Get It
```js
export default irrelonNextState({
    "somePropName": myState.get
}, MyPage);
```

### Use It
```js
// Assuming a state that has been updated to this object:
somePropName.put({
	foo: {
		bar: true
	}
});

// You can get foo's bar value via:
const val = somePropName.get("foo.bar"); // val will equal: `true`
const otherVal = somePropName.get("this.path.does.not.exist", "myDefaultVal"); // otherVal will equal: `myDefaultVal`
const all = somePropName.get(); // all will equal: `{foo: {bar: true}}`
```

## Accessor Methods
When passing your state instance as a named prop such as:

```js
export default irrelonNextState({
    "project": projectState, // This is an accessor method
    "patchProject": projectState.patch // This is a state method
}, MyPage);
```

You can simply pass the state instance (e.g. `projectState` as above) and the current
state will be assigned to the prop name you specify (`project` in the code above)
however if you prefer a more explicit way of doing the same thing you can also use the
`read` accessor method:

```js
export default irrelonNextState({
    "project": projectState.read, // Use the state data and assign to the prop "project"
    "patchProject": projectState.patch // Set prop "patchProject" to a function that patches the state
}, MyPage);
```

Accessor methods like `read` don't pass themselves as functions into your component, 
they are called when your component is rendered and their result is passed as the
value of the specified prop `project`, unlike the state methods such as `patch` which
provide a function to the prop `patchProject`.

# Debugging & Logs
### Server Side
If you want to see debug output showing all the stuff Irrelon NextState is
doing while it is running, set an environment variable:

```bash
IRRELON_LOG="ProvideState=*,Store=*,useState=*"
```

### Client Side
On the client-side use the `setLogLevel()` function exported from
the module:

```js
const {setLogLevel} = require("@irrelon/nextstate");
setLogLevel("ProvideState=*,Store=*,useState=*");
```

# Internals
Internally Irrelon NextState uses a couple of other Irrelon modules that
you may find interesting:

* https://github.com/Irrelon/irrelon-path (npm i @irrelon/path)
* https://github.com/Irrelon/emitter (npm i @irrelon/emitter)

