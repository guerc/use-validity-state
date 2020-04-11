# use-validity-state

[![Build Status](https://travis-ci.com/guerc/use-validity-state.svg?branch=master)](https://travis-ci.com/guerc/use-validity-state) [![codecov](https://codecov.io/gh/guerc/use-validity-state/branch/master/graph/badge.svg)](https://codecov.io/gh/guerc/use-validity-state) [![Known Vulnerabilities](https://snyk.io//test/github/guerc/use-validity-state/badge.svg?targetFile=package.json)](https://snyk.io//test/github/guerc/use-validity-state?targetFile=package.json) [![Dev Dependencies Status](https://david-dm.org/guerc/use-validity-state/dev-status.svg)](https://david-dm.org/guerc/use-validity-state?type=dev) [![Minified Bundle Size](https://badgen.net/bundlephobia/min/use-validity-state)](https://bundlephobia.com/result?p=use-validity-state)

A React hook for form validation leveraging HTML5 ValidityState API.

[`ValidityState`](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) is generally widely [supported](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) but its supported features may be limited depending on the browser used.

## Installation

```
npm install use-validity-state
```

or

```
yarn add use-validity-state
```

## Usage

In your component, initialize the Hook using `use-validity-state` like so:

```js
const MyComponent = () => {
  const [inputState, setInputState] = useState('');
  const [textareaState, setTextareaState] = useState('');

  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  const validity = useValidityState({
    input: inputRef,
    textarea: textareaRef,
  });

  return (
    <form>
      <input
        type="text"
        value={inputState}
        onChange={(e) => setInputState(e.target.value)}
        required
        pattern="[0-9]+"
        ref={inputRef}
      />

      <textarea
        value={textareaState}
        onChange={(e) => setTextareaState(e.target.value)}
        required
        ref={textareaRef}
      />
    </form>
  );
}
```

Simply provide a `ref` for each form element that you want to validate to `useValidityState` as a key/value pair with the value being the `ref` and an arbitrary key.

As the return value of `useValidityState` you will receive an object containing a [`ValidityState`](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) for each previously provided element. The key for each element will match the respective key you provided during the initialization of `useValidityState`.
Additionally, you will get an element with the key `every` containing the overall validation result. It will be `false` unless every single element validation yields `true`.

Use your own logic to update the value of the form element. Add the desired validation props to the element such as `required`, `minLength`, or `pattern`. When the component is updated, the validity values get updated, reflecting the current validation state.

## License

- MIT (see [LICENSE](/LICENSE))
