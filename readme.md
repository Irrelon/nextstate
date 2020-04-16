# Irrelon NextState
A clean and easy to use state management system that doesn't require you
to pepper your project with horrible action constants and reducer code.

## Install
```bash
npm i irrelon-nextstate
```

## Usage

```js


export default irrelonNextState({
    "project": projectState
}, MyComponentOrPage);
```

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
const {setLogLevel} = require("irrelon-nextstate");
setLogLevel("ProvideState=*,Store=*,useState=*");
```

# Internals
Internally Irrelon NextState uses a couple of other Irrelon modules that
you may find interesting:

* https://github.com/Irrelon/irrelon-path (npm i irrelon-path)
* https://github.com/Irrelon/emitter (npm i irrelon-emitter)

