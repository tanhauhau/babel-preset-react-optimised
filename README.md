# babel-preset-react-optimised

Replaces `React.createElement` and `React.createFragment` to a minifier-friendly variable to squeeze the extra bytes out of your [React](http://reactjs.org/) code.

## Example

### Input

_From the [create-react-app](https://github.com/facebook/create-react-app) template._

```js
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

### Before (521 bytes minified)

```js
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return React.createElement(
    'div',
    {
      className: 'App',
    },
    React.createElement(
      'header',
      {
        className: 'App-header',
      },
      React.createElement('img', {
        src: logo,
        className: 'App-logo',
        alt: 'logo',
      }),
      React.createElement(
        'p',
        null,
        'Edit ',
        React.createElement('code', null, 'src/App.js'),
        ' and save to reload.'
      ),
      React.createElement(
        'a',
        {
          className: 'App-link',
          href: 'https://reactjs.org',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        'Learn React'
      )
    )
  );
}

export default App;
```

### After (469 bytes minified, 9.98% reduction)

```js
import React from 'react';

/*Injected by babel-preset-react-optimised*/
const __jsx = React.createElement;
import logo from './logo.svg';
import './App.css';

function App() {
  return __jsx(
    'div',
    {
      className: 'App',
    },
    __jsx(
      'header',
      {
        className: 'App-header',
      },
      __jsx('img', {
        src: logo,
        className: 'App-logo',
        alt: 'logo',
      }),
      __jsx(
        'p',
        null,
        'Edit ',
        __jsx('code', null, 'src/App.js'),
        ' and save to reload.'
      ),
      __jsx(
        'a',
        {
          className: 'App-link',
          href: 'https://reactjs.org',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        'Learn React'
      )
    )
  );
}

export default App;
```

## Usage

To install:

```sh
# using npm
npm install --save-dev babel-preset-react-optimised
# using yarn
yarn add --dev babel-preset-react-optimised
```

`babel-plugin-preset-react-optimised` is a drop-in replacement of [@babel/babel-preset-react](https://babeljs.io/docs/en/babel-preset-react)

```diff
{
-  "presets": ["@babel/preset-react"],
+  "presets": ["babel-preset-react-optimised"],
 "env": {
    "development": {
-      "presets": [["@babel/preset-react", {
+      "presets": [["babel-preset-react-optimised", {
          "development": true
        }]]
    }
  }
}
```

The preset will inject

- `const __jsx = React.createElement` and
- `const __jsxFrag = React.Fragment`

if used in the code, and replace all the usages of `React.createElement` -> `__jsx` and `React.Fragment` -> `__jsxFrag` respectively.

Therefore, `__jsx` and `__jsxFrag` is a reserved variable name, and can't be used in anywhere of the code.

You can rename the variable `__jsx` and `__jsxFrag` via the [`pragmaAs`](#pragmaAs) and [`pragmaFragAs`](#pragmaFragAs) options to avoid conflict.

## Options

### `pragma`

`string`, defaults to `React.createElement`.

Replace the function used when compiling JSX expressions.

See [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react)

### `pragmaFrag`

`string`, defaults to `React.Fragment`.

Replace the component used when compiling JSX fragments.

See [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react)

### `useBuiltIns`

`boolean`, defaults to `false`.

Will use the native built-in instead of trying to polyfill behavior for any plugins that require one.

See [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react)

### `useSpread`

`boolean`, defaults to `false`.

When spreading props, use inline object with spread elements directly instead of Babel's extend helper or `Object.assign`.

See [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react)

### `development`

`boolean`, defaults to `false`.

Toggles plugins that aid in development, such as [`@babel/plugin-transform-react-jsx-self`](plugin-transform-react-jsx-self.md) and [`@babel/plugin-transform-react-jsx-source`](plugin-transform-react-jsx-source.md).

This is useful when combined with the [env option](options.md#env) configuration or [js config files](config-files.md#javascript).

See [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react)

### `throwIfNamespace`

`boolean`, defaults to `true`.

Toggles whether or not to throw an error if a XML namespaced tag name is used. For example:

```jsx
<f:image />
```

Though the JSX spec allows this, it is disabled by default since React's JSX does not currently have support for it.

See [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react)

### `pragmaAs`

`string`, defaults to `__jsx`

Replace the variable used to replace the `pragma` function

### `pragmaFragAs`

`string`, defaults to `__jsxFrag`

Replace the variable used to replace the `pragmaFrag` function

#### .babelrc

```json
{
  "presets": ["babel-preset-react-optimised"]
}
```

> You can read more about configuring preset options [here](https://babeljs.io/docs/en/presets#preset-options)

## License

MIT
