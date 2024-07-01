
# use-megamind
A React hook for managing asynchronous function calls with ease, including loading state management, error handling, and customizable options for delayed or repeated calls.

## Installation

```bash
npm install use-megamind
```

or

```bash
yarn add use-megamind
```

## Usage

### Example 1: Basic Usage with Immediate Call

```tsx
import React, { useEffect } from 'react';
import useMegamind from 'use-megamind';

const fetchData = async () => {
  // Simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data fetched successfully");
    }, 2000);
  });
};

const MyComponent = () => {
  const { data, call, isLoading, error, clear } = useMegamind(fetchData);

  useEffect(() => {
    call();
  }, [call]);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Data: {data}</p>}
      <button onClick={clear}>Clear</button>
    </div>
  );
};

export default MyComponent;
```

### Example 2: Call with Parameters

```tsx
import React from 'react';
import useMegamind from 'use-megamind';

const fetchDataWithParams = async (id) => {
  // Simulate an API call with parameters
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Data fetched for ID: ${id}`);
    }, 2000);
  });
};

const MyComponent = () => {
  const { data, call, isLoading, error, clear } = useMegamind(fetchDataWithParams, { functionParams: [1] });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Data: {data}</p>}
      <button onClick={() => call(2)}>Fetch Data for ID 2</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
};

export default MyComponent;
```

### Example 3: Delayed Call

```tsx
import React from 'react';
import useMegamind from 'use-megamind';

const fetchData = async () => {
  // Simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data fetched successfully");
    }, 2000);
  });
};

const MyComponent = () => {
  const { data, call, isLoading, error, clear } = useMegamind(fetchData, { options: { callRighAway: false } });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Data: {data}</p>}
      <button onClick={call}>Fetch Data</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
};

export default MyComponent;
```

### Example 4: Using Event Callbacks

```tsx
import React from 'react';
import useMegamind from 'use-megamind';

const fetchData = async () => {
  // Simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data fetched successfully");
    }, 2000);
  });
};

const MyComponent = () => {
  const { data, call, isLoading, error, clear } = useMegamind(fetchData, {
    events: {
      onLoadingStart: () => console.log("Loading started"),
      onLoadingFinished: () => console.log("Loading finished"),
      onSuccess: (data) => console.log("Success:", data),
      onError: (error) => console.log("Error:", error),
    }
  });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Data: {data}</p>}
      <button onClick={call}>Fetch Data</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
};

export default MyComponent;
```

### Example 5: Comprehensive Configuration

```tsx
import React from 'react';
import useMegamind from 'use-megamind';

const fetchDataWithParams = async (id) => {
  // Simulate an API call with parameters
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Data fetched for ID: ${id}`);
    }, 2000);
  });
};

const MyComponent = () => {
  const { data, call, isLoading, error, clear } = useMegamind(fetchDataWithParams, {
    functionParams: [1],
    options: {
      minimumDelayBetweenCalls: 1000,
      maxCalls: 5,
      callRighAway: false,
      debug: true
    },
    events: {
      onLoadingStart: () => console.log("Loading started"),
      onLoadingFinished: () => console.log("Loading finished"),
      onSuccess: (data) => console.log("Success:", data),
      onError: (error) => console.log("Error:", error),
    }
  });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Data: {data}</p>}
      <button onClick={() => call(2)}>Fetch Data for ID 2</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
};

export default MyComponent;
```

## Changelogs
### 0.0.1
Initial release

## License

```
MIT License

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


## Disclaimer

This README was generated by ChatGPT. I'll update the readme later. For now, I hope it will be helpful enough for anybody to use. 
