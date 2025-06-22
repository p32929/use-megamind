# 🧠 Use-Megamind Test Suite

This is a comprehensive test application for the **use-megamind** React hook library. It demonstrates all the features and capabilities of the hook through interactive examples.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to view the test suite.

## 📋 Test Cases Covered

### 1. **Basic Async Function** 📝
- Tests async function without parameters
- Automatic execution on component mount
- Basic loading state management

### 2. **Function with Parameters** ⚙️
- Tests async function with parameters
- Parameter passing functionality
- Delayed execution (1500ms)

### 3. **Manual Function Call** 🔘
- Tests manual function calls with `callRightAway: false`
- Multiple button triggers with different parameters
- On-demand execution control

### 4. **Options Testing** ⚡
- **maxCalls**: Limits function calls to 3
- **minimumDelayBetweenCalls**: 1000ms delay between calls
- **debug**: Console logging (check browser console)
- **cache**: Caches results for identical parameters

### 5. **Append Data** 📋
- Tests `callToAppend` functionality
- Appends new data to existing state
- Useful for pagination and incremental loading

### 6. **Event Callbacks & Validation** 🔔
- **Loading callbacks**: onLoadingStart, onLoadingFinished, onLoadingChange
- **Success validation**: validateOnSuccess with custom logic
- **Error validation**: validateOnError with custom logic
- **Event logging**: Real-time event tracking

### 7. **Clear & Reset** 🔄
- **clear()**: Clears state but keeps cache
- **reset()**: Clears everything including cache and call counter
- State management testing

### 8. **Global Validation** 🌐
- Tests global validation functions
- **setGlobalValidateOnSuccess**: Applied to all hook instances
- **setGlobalValidateOnError**: Global error validation
- Toggle between global and local validation

## 🎯 How to Test

1. **Interactive Testing**: Click buttons to trigger different scenarios
2. **Console Logging**: Enable debug mode and check browser console
3. **Real-time Feedback**: Watch loading states and data changes
4. **Validation Testing**: Test success/error validations
5. **Global Features**: Toggle global validation to see effects across hooks

## 🔍 What to Look For

- ✅ **Loading States**: Should show/hide correctly
- ✅ **Data Updates**: Data should update in real-time
- ✅ **Error Handling**: Errors should be caught and displayed
- ✅ **Cache Functionality**: Identical calls should use cached results
- ✅ **Validation Logic**: Callbacks should only fire when validation passes
- ✅ **Global Configuration**: Global settings should affect all hooks
- ✅ **State Management**: Clear/reset should work as expected

## 🐛 Debugging

- **Check Browser Console**: Debug logs are enabled in Example 4
- **Network Tab**: No actual network requests, but timing is realistic
- **React DevTools**: Inspect hook state changes
- **Event Logs**: Real-time event tracking in Example 6

## 🏗️ Project Structure

```
src/
├── components/
│   ├── BasicExample.tsx
│   ├── ParameterExample.tsx
│   ├── ButtonClickExample.tsx
│   ├── OptionsExample.tsx
│   ├── AppendExample.tsx
│   ├── CallbacksExample.tsx
│   ├── ClearResetExample.tsx
│   └── GlobalValidationExample.tsx
├── App.tsx
├── App.css
└── index.tsx
```

## 📚 Use-Megamind Features Tested

| Feature | Example | Description |
|---------|---------|-------------|
| Basic Usage | 1 | Simple async function calls |
| Parameters | 2 | Function with parameters |
| Manual Calls | 3 | `callRightAway: false` |
| Options | 4 | `maxCalls`, `debug`, `cache`, `minimumDelayBetweenCalls` |
| Append Data | 5 | `callToAppend` functionality |
| Event Callbacks | 6 | All event callbacks and validations |
| State Management | 7 | `clear()` and `reset()` methods |
| Global Config | 8 | Global validation functions |

## 🤝 Contributing

This test suite is designed to be comprehensive and user-friendly. If you find any issues or want to add more test cases:

1. Create new components in the `components/` directory
2. Add them to the main `App.tsx`
3. Update this README with new test descriptions

## 📝 Notes

- All async functions use realistic delays (300ms - 2000ms)
- Error scenarios are built-in to test error handling
- Console logging is available for debugging
- Responsive design works on mobile devices
- TypeScript support is fully implemented

---

**Happy Testing!** 🚀
