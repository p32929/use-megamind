# use-megamind

A simple React hook for managing asynchronous function calls with ease on the client side, now with global validation, append functionality, and more.

On npm: **[use-megamind](https://www.npmjs.com/package/use-megamind)**

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

## License

MIT License — Copyright (c) Fayaz Bin Salam. See [LICENSE](LICENSE) for the full text.

## Contributing

Contributions are warmly welcomed and greatly appreciated! Whether it's a bug fix, new feature, or improvement, your input helps make this project better for everyone.

Before submitting a pull request, please:

1. Create an issue describing the feature or bug fix you'd like to work on
2. Wait for discussion and approval to ensure alignment with project goals
3. Fork the repository and create your feature branch
4. Submit your pull request with a clear description of changes

This approach helps avoid duplicate efforts and ensures smooth collaboration. Thank you for considering contributing!

## Share

Sharing this repository with your friends is just one click away from here

[![facebook](https://user-images.githubusercontent.com/6418354/179013321-ac1d1452-0689-493f-9066-940cf2302b6e.png)](https://www.facebook.com/sharer/sharer.php?u=https://github.com/p32929/use-megamind/)
[![twitter](https://user-images.githubusercontent.com/6418354/179013351-7d8d6d1c-4ce2-46ab-bef8-4c4765a1b888.png)](https://twitter.com/intent/tweet?url=https://github.com/p32929/use-megamind/)
[![tumblr](https://user-images.githubusercontent.com/6418354/179013343-3111f55a-3b90-40c7-8487-9777348672b0.png)](https://www.tumblr.com/share?v=3&u=https://github.com/p32929/use-megamind/)
[![pocket](https://user-images.githubusercontent.com/6418354/179013334-b095c45f-becf-49f4-9ee1-5a731a9b1f85.png)](https://getpocket.com/save?url=https://github.com/p32929/use-megamind/)
[![pinterest](https://user-images.githubusercontent.com/6418354/179013331-44cd9206-11b1-4b65-becb-5863b61c828f.png)](https://pinterest.com/pin/create/button/?url=https://github.com/p32929/use-megamind/)
[![reddit](https://user-images.githubusercontent.com/6418354/179013338-7416ae3f-73ba-4522-86e1-1374d7082d22.png)](https://www.reddit.com/submit?url=https://github.com/p32929/use-megamind/)
[![linkedin](https://user-images.githubusercontent.com/6418354/179013327-ca7b7102-1da8-4b1c-858f-1a6e5f21bd70.png)](https://www.linkedin.com/shareArticle?mini=true&url=https://github.com/p32929/use-megamind/)
[![whatsapp](https://user-images.githubusercontent.com/6418354/179013353-f477fa0b-3e6f-4138-a357-c9991b23ff88.png)](https://api.whatsapp.com/send?text=https://github.com/p32929/use-megamind/)

<!-- hire-block -->

---

## 💼 Using this at a company?

I do fixed-price delivery work on my own projects. One invoice, one date, no hourly billing:

| | |
|---|---|
| **White-label build** — this project rebranded, extended and deployed as yours | **$6,500** · 3 weeks |
| **Custom app from scratch** on my own stack, signed and auto-updating | **$12,500** · 6 weeks |
| **Production-hardening sprint** — 72 hours on this project, for your load and your security review | **$999** |
| **Ongoing capacity** — one project-week of my time reserved every month | **$9,000 / month** |

Full details → **[p32929.github.io/hire](https://p32929.github.io/hire/)** · Email **[fayazdevinbox@uberip.com](mailto:fayazdevinbox@uberip.com)** — scoping and quotes are free and I answer within one business day.
