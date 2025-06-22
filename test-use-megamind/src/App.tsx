import React from 'react';
import './App.css';
import BasicExample from './components/BasicExample';
import ParameterExample from './components/ParameterExample';
import ButtonClickExample from './components/ButtonClickExample';
import OptionsExample from './components/OptionsExample';
import AppendExample from './components/AppendExample';
import CallbacksExample from './components/CallbacksExample';
import ClearResetExample from './components/ClearResetExample';
import GlobalValidationExample from './components/GlobalValidationExample';
import ApiBasicExample from './components/ApiBasicExample';
import ApiUsersExample from './components/ApiUsersExample';
import ApiErrorExample from './components/ApiErrorExample';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🧠 use-megamind Hook Testing</h1>
        <p>Comprehensive testing suite for the use-megamind React hook</p>
      </header>
      
      <main className="App-main">
        {/* Basic Examples */}
        <BasicExample />
        <ParameterExample />
        <ButtonClickExample />
        <OptionsExample />
        <AppendExample />
        <CallbacksExample />
        <ClearResetExample />
        <GlobalValidationExample />
        
        {/* API Examples */}
        <div className="api-section">
          <h1>🌐 API Testing Section</h1>
          <p>Testing with real API endpoints (requires test server running on port 3001)</p>
          <ApiBasicExample />
          <ApiUsersExample />
          <ApiErrorExample />
        </div>
      </main>
    </div>
  );
}

export default App;
