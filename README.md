# use-megamind

A simple React hook for managing asynchronous function calls with ease on the client side, now with global validation, append functionality, and more.

## Installation

```bash
npm install use-megamind
```

or

```bash
yarn add use-megamind
```

## Motivation

The goal behind `use-megamind` was to build a custom solution for managing asynchronous operations that’s simple to implement, especially in existing projects. It works not only for data fetching but for any kind of async operation, making it a more lightweight alternative to React Query. While React Query is awesome, I wanted a solution that doesn't require extensive documentation to get started. `use-megamind` is small, efficient, and does the job without extra complexity.

## Global Configuration

You can now set global validation logic for all `useMegamind` instances via the following functions:

- `setGlobalValidateOnSuccess`: Define a global function to validate the result of a successful async call.
- `setGlobalValidateOnError`: Define a global function to validate errors during an async call.

These validations will run across all hooks unless overridden locally in individual hooks.

```ts
import { setGlobalValidateOnSuccess, setGlobalValidateOnError } from "use-megamind";

// Example: Set global validation for success
setGlobalValidateOnSuccess((data) => {
  // Return true to proceed with onSuccess, false otherwise
  return data !== null;
});

// Example: Set global validation for error
setGlobalValidateOnError((error) => {
  // Return true to proceed with onError, false otherwise
  return error !== 'IGNORE';
});
```

## How to Use

### Example 1: Async function without parameters

```ts
"use client";
import useMegamind from "use-megamind";

function testAsyncFunction1() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res("Hello world");
    }, 1000);
  });
}

export default function Home() {
  const { data, error, isLoading } = useMegamind(testAsyncFunction1);

  return <p>{JSON.stringify(data)}</p>;
}
```

### Example 2: Async function with parameters

> `functionParams`: The async function parameters, passed one by one (Default: `null`)

```ts
"use client";
import useMegamind from "use-megamind";

function testAsyncFunction2(ms: number) {
  return new Promise((res) => {
    setTimeout(() => res(`Waited ${ms} ms`), ms);
  });
}

export default function Home() {
  const { data, error, isLoading } = useMegamind(testAsyncFunction2, {
    functionParams: [1000],
  });

  return <p>{JSON.stringify(data)}</p>;
}
```

### Example 3: Async function call on a button click

> `callRightAway`: Whether the async function should be called when the component mounts (Default: `true`)

```ts
"use client";
import useMegamind from "use-megamind";

function testAsyncFunction3(ms: number) {
  return new Promise((res) => {
    setTimeout(() => res(`Hello after ${ms} ms`), ms);
  });
}

export default function Home() {
  const { data, call } = useMegamind(testAsyncFunction3, {
    options: {
      callRightAway: false,
    },
  });

  return (
    <>
      <p>{JSON.stringify(data)}</p>
      <button onClick={() => call(1000)}>Call</button>
    </>
  );
}
```

### Example 4: Adding options

`useMegamind` provides a variety of options to control behavior:

- `maxCalls`: Maximum number of times the async function can be called (Default: `'infinite'`)
- `minimumDelayBetweenCalls`: Minimum delay between two consecutive calls (Default: `0ms`)
- `debug`: Enable debug logging (Default: `false`)
- `callRightAway`: Whether to call the async function when the component mounts (Default: `true`)
- `cache`: Cache response until the page is reloaded (Default: `false`)

```ts
"use client";
import useMegamind from "use-megamind";

function testAsyncFunction4(ms: number) {
  return new Promise((res) => {
    setTimeout(() => res(`Hello after ${ms} ms`), ms);
  });
}

export default function Home() {
  const { data, call } = useMegamind(testAsyncFunction4, {
    options: {
      callRightAway: false,
      debug: true,
      maxCalls: 1,
      minimumDelayBetweenCalls: 1000,
    },
  });

  return (
    <>
      <p>{JSON.stringify(data)}</p>
      <button onClick={() => call(1000)}>Call</button>
    </>
  );
}
```

### Example 5: Append fetched data

You can now append the fetched data to the existing state using the `callToAppend` function.

```ts
"use client";
import useMegamind from "use-megamind";

function testAsyncFunction5(ms: number) {
  return new Promise((res) => {
    setTimeout(() => res(`Fetched after ${ms} ms`), ms);
  });
}

export default function Home() {
  const { data, callToAppend } = useMegamind(testAsyncFunction5, {
    options: {
      callRightAway: false,
    },
  });

  return (
    <>
      <p>{JSON.stringify(data)}</p>
      <button onClick={() => callToAppend(1000)}>Append Data</button>
    </>
  );
}
```

### Example 6: Event callbacks and validations

You can now define validations for both success and error callbacks, either locally or globally.

```ts
"use client";
import useMegamind from "use-megamind";

function testAsyncFunction6(ms: number) {
  return new Promise((res, rej) => {
    if (ms < 500) {
      rej("Error: Too fast!");
    } else {
      setTimeout(() => res(`Hello after ${ms} ms`), ms);
    }
  });
}

export default function Home() {
  const { data, error, isLoading, call } = useMegamind(testAsyncFunction6, {
    options: {
      callRightAway: false,
    },
    events: {
      validateOnSuccess(data) {
        // Proceed with onSuccess only if data is valid
        return data.includes("Hello");
      },
      onSuccess(data) {
        console.log("Success: ", data);
      },
      validateOnError(error) {
        // Proceed with onError only if the error is valid
        return error.includes("Error");
      },
      onError(error) {
        console.error("Error: ", error);
      },
    },
  });

  return (
    <>
      <p>{JSON.stringify(data)}</p>
      <p>{JSON.stringify(error)}</p>
      <button onClick={() => call(400)}>Call with Error</button>
      <button onClick={() => call(600)}>Call with Success</button>
    </>
  );
}
```

### Example 7: Clearing or resetting state

- `clear`: Clears the state but keeps the cache.
- `reset`: Resets everything, including the cache and call counter.

```ts
"use client";
import useMegamind from "use-megamind";

function testAsyncFunction7(ms: number) {
  return new Promise((res) => {
    setTimeout(() => res(`Hello after ${ms} ms`), ms);
  });
}

export default function Home() {
  const { data, call, clear, reset } = useMegamind(testAsyncFunction7, {
    options: {
      callRightAway: false,
    },
  });

  return (
    <>
      <p>{JSON.stringify(data)}</p>
      <button onClick={() => call(1000)}>Call</button>
      <button onClick={clear}>Clear</button>
      <button onClick={reset}>Reset</button>
    </>
  );
}
```

## Contribution

If you'd like to contribute by adding features or fixing bugs, please open an issue before submitting a pull request.

## License

```
MIT License

Copyright (c) 2024 Fayaz Bin Salam

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

