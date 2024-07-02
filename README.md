# use-megamind

A simple react hook for managing asynchronous function calls with ease on the client side

## Installation

```bash
npm install use-megamind
```

or

```bash
yarn add use-megamind
```

## Motivation

I wanted to make a custom solution specially/not only for data fetching but also for any kinds of async operation. Of course, React Query ( https://github.com/tanstack/query ) is awesome ( even though I haven't tried it yet ) but I wanted to make something thats easier to implement, specially on an existing project & also doesn't need a lot of documentations to follow. Something that's small but does the job.

## How to use

### Example 1: Async function without parameters

```
"use client"

import useMegamind from "use-megamind"

function testAsyncFunction1() {
  return new Promise((res, rej) => {
    try {
      setTimeout(() => {
        res("Hello world")
      }, 1000);
    }
    catch (e) {
      rej(e)
    }
  })
}

export default function Home() {
  const { data, error, isLoading, call, clear } = useMegamind(testAsyncFunction1)

  return <div className="flex flex-col gap-y-10">
    <p>{JSON.stringify(data)}</p>
  </div>
}

```

### Example 2: Async function with parameter(s)

> functionParams: The async function parameters, one by one ( Default: null ) 

Yes, You will get intellisense like this

![Screenshot (132)](https://github.com/p32929/use-megamind/assets/6418354/d7d10894-4be9-41fb-a2c8-0902289783c2)


```
"use client"

import useMegamind from "use-megamind"

function testAsyncFunction1(ms: number) {
  return new Promise((res, rej) => {
    try {
      setTimeout(() => {
        res("Hello world")
      }, ms);
    }
    catch (e) {
      rej(e)
    }
  })
}

export default function Home() {
  const { data, error, isLoading, call, clear } = useMegamind(testAsyncFunction1, {
    functionParams: [1000]
  })

  return <div className="flex flex-col gap-y-10">
    <p>{JSON.stringify(data)}</p>
  </div>
}

```

### Example 3: Async function call on a button click

> callRighAway: Whether the async function should be called on component mount ( Default: true )

```
"use client"

import useMegamind from "use-megamind"

function testAsyncFunction1(ms: number) {
  return new Promise((res, rej) => {
    try {
      setTimeout(() => {
        res("Hello world")
      }, ms);
    }
    catch (e) {
      rej(e)
    }
  })
}

export default function Home() {
  const { data, error, isLoading, call, clear } = useMegamind(testAsyncFunction1, {
    options: {
      callRighAway: false,
    }
  })

  return <div className="flex flex-col gap-y-10">
    <p>{JSON.stringify(data)}</p>
    <button onClick={() => {
      call(1000)
    }}>
      Call
    </button>
  </div>
}

```

> Yes, passing `functionParams` is optional, unless you want to call the function on component mount

### Example 4: Adding options

> maxCalls: Maximum how many times the async function can be called ( Default: 'infinite' )

> minimumDelayBetweenCalls: Minimum delay between two calls for the async function ( Default: 0 ms )

> debug: Show/hide logs ( Default: false )

> callRighAway: Whether the async function should be called on component mount ( Default: true )

```
"use client"

import useMegamind from "use-megamind"

function testAsyncFunction1(ms: number) {
  return new Promise((res, rej) => {
    try {
      setTimeout(() => {
        res("Hello world")
      }, ms);
    }
    catch (e) {
      rej(e)
    }
  })
}

export default function Home() {
  const { data, error, isLoading, call, clear } = useMegamind(testAsyncFunction1, {
    options: {
      callRighAway: false,
      debug: false,
      maxCalls: 1,
      minimumDelayBetweenCalls: 1000 // ms
    }
  })

  return <div className="flex flex-col gap-y-10">
    <p>{JSON.stringify(data)}</p>
    <button onClick={() => {
      call(1000)
    }}>
      Call
    </button>
  </div>
}

```

### Example 5: Listening to the async function events

```
"use client"

import useMegamind from "use-megamind"

function testAsyncFunction1(ms: number) {
  return new Promise((res, rej) => {
    try {
      setTimeout(() => {
        res("Hello world")
      }, ms);
    }
    catch (e) {
      rej(e)
    }
  })
}

export default function Home() {
  const { data, error, isLoading, call, clear } = useMegamind(testAsyncFunction1, {
    options: {
      callRighAway: false,
      debug: false,
      maxCalls: 1,
      minimumDelayBetweenCalls: 1000 // ms
    },
    events: {
      onError(error) {
          // set your states here if needed
      },
      onLoadingChange(isLoading) {
          // set your states here if needed
      },
      onLoadingFinished() {
          // set your states here if needed
      },
      onLoadingStart() {
          // set your states here if needed
      },
      onSuccess(data) {
          // set your states here if needed
      },
    }
  })

  return <div className="flex flex-col gap-y-10">
    <p>{JSON.stringify(data)}</p>
    <button onClick={() => {
      call(1000)
    }}>
      Call
    </button>
  </div>
}

```

**& Finaly**, If you're using TypeScipt, if you define the return types in the async function, you will get better intellisense like this:

![Screenshot (133)](https://github.com/p32929/use-megamind/assets/6418354/c81e1a7e-2ccf-4e97-972d-81aac1a382e2)

## Contribution
If you want to contribute to this project like adding feature, fixing bugs etc, please open an issue before submitting any pull requests.

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

