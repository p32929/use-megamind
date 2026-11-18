# use-megamind

A small React hook that runs any async function for you and gives back `data`, `error` and `isLoading`, with options like call limits, delays, caching and appending results.

Libraries like React Query are great, but they are big and take time to learn. use-megamind does the everyday part in one hook you can drop into an existing project in minutes, and it works for any async call, not only data fetching. It has no dependencies of its own, only React.

On npm: **[use-megamind](https://www.npmjs.com/package/use-megamind)**

## Installation

```bash
npm install use-megamind
```

or

```bash
yarn add use-megamind
```

## Global Configuration

You can now set global validation logic for all `useMegamind` instances via the following functions:

1. `setGlobalValidateOnSuccess`: Define a global function to validate the result of a successful async call.
2. `setGlobalValidateOnError`: Define a global function to validate errors during an async call.

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

1. `maxCalls`: Maximum number of times the async function can be called (Default: `'infinite'`)
2. `minimumDelayBetweenCalls`: Minimum delay between two consecutive calls (Default: `0ms`)
3. `debug`: Enable debug logging (Default: `false`)
4. `callRightAway`: Whether to call the async function when the component mounts (Default: `true`)
5. `cache`: Cache response until the page is reloaded (Default: `false`)

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

1. `clear`: Clears the state but keeps the cache.
2. `reset`: Resets everything, including the cache and call counter.

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

## License

MIT License — Copyright (c) Fayaz Bin Salam. See [LICENSE](LICENSE) for the full text.

## Contributing

Contributions are very welcome, thank you! Before you start on a pull request, please open an issue and tell me what you would like to add or change. That way we can agree on it first, and your time is not wasted on something that might not fit. Thanks for helping make use-megamind better.

## You might also like

<p><a href="https://openstore.pfay.workers.dev/cards/p32929/0?n=4&amp;repo=use-megamind"><picture><source media="(prefers-color-scheme: dark)" srcset="https://openstore.pfay.workers.dev/cards/p32929/0.svg?n=4&amp;repo=use-megamind&amp;theme=dark"><img src="https://openstore.pfay.workers.dev/cards/p32929/0.svg?n=4&amp;repo=use-megamind&amp;theme=light" width="50%" align="top" alt="More apps by p32929 on OpenStore (1)"></picture></a><a href="https://openstore.pfay.workers.dev/cards/p32929/1?n=4&amp;repo=use-megamind"><picture><source media="(prefers-color-scheme: dark)" srcset="https://openstore.pfay.workers.dev/cards/p32929/1.svg?n=4&amp;repo=use-megamind&amp;theme=dark"><img src="https://openstore.pfay.workers.dev/cards/p32929/1.svg?n=4&amp;repo=use-megamind&amp;theme=light" width="50%" align="top" alt="More apps by p32929 on OpenStore (2)"></picture></a><br><a href="https://openstore.pfay.workers.dev/cards/p32929/2?n=4&amp;repo=use-megamind"><picture><source media="(prefers-color-scheme: dark)" srcset="https://openstore.pfay.workers.dev/cards/p32929/2.svg?n=4&amp;repo=use-megamind&amp;theme=dark"><img src="https://openstore.pfay.workers.dev/cards/p32929/2.svg?n=4&amp;repo=use-megamind&amp;theme=light" width="50%" align="top" alt="More apps by p32929 on OpenStore (3)"></picture></a><a href="https://openstore.pfay.workers.dev/cards/p32929/3?n=4&amp;repo=use-megamind"><picture><source media="(prefers-color-scheme: dark)" srcset="https://openstore.pfay.workers.dev/cards/p32929/3.svg?n=4&amp;repo=use-megamind&amp;theme=dark"><img src="https://openstore.pfay.workers.dev/cards/p32929/3.svg?n=4&amp;repo=use-megamind&amp;theme=light" width="50%" align="top" alt="More apps by p32929 on OpenStore (4)"></picture></a></p>

<p><a href="https://p32929.github.io/share/?repo=use-megamind"><picture><source media="(prefers-color-scheme: dark)" srcset="https://p32929.github.io/readme/footer-share-dark.svg"><img src="https://p32929.github.io/readme/footer-share-light.svg" width="50%" align="top" alt="Share this project with your friends in one click"></picture></a><a href="https://p32929.github.io/support/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://p32929.github.io/readme/footer-support-dark.svg"><img src="https://p32929.github.io/readme/footer-support-light.svg" width="50%" align="top" alt="If you like my work and want to support me, feel free to support"></picture></a><br><a href="https://openstore.pfay.workers.dev/add"><picture><source media="(prefers-color-scheme: dark)" srcset="https://p32929.github.io/readme/footer-join-dark.svg"><img src="https://p32929.github.io/readme/footer-join-light.svg" width="100%" align="top" alt="Put your own apps on OpenStore: free, your listing lives in your own repo"></picture></a></p>
