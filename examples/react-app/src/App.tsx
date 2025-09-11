import React, { useState } from 'react';
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
  const [activeSection, setActiveSection] = useState<'basic' | 'api'>('basic');

  return (
    <div className="App">
      <header className="App-header">
        <h1>🧠 use-megamind Hook Testing</h1>
        <p>Comprehensive testing suite for the use-megamind React hook</p>
        
        <div className="section-tabs">
          <button 
            className={`tab-button ${activeSection === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveSection('basic')}
          >
            📝 Basic Examples (8)
          </button>
          <button 
            className={`tab-button ${activeSection === 'api' ? 'active' : ''}`}
            onClick={() => setActiveSection('api')}
          >
            🌐 API Examples (3)
          </button>
        </div>
      </header>
      
      <main className="App-main">
        {activeSection === 'basic' && (
          <div className="examples-grid">
            <div className="section-intro">
              <h2>📝 Basic Examples</h2>
              <p>Test core functionality with simple async functions. No server required.</p>
            </div>
            
            <BasicExample />
            <ParameterExample />
            <ButtonClickExample />
            <OptionsExample />
            <AppendExample />
            <CallbacksExample />
            <ClearResetExample />
            <GlobalValidationExample />
          </div>
        )}
        
        {activeSection === 'api' && (
          <div className="examples-grid">
            <div className="section-intro api-intro">
              <h2>🌐 API Examples</h2>
              <p>Test with real HTTP requests. Requires test server running on port 3001.</p>
              <div className="server-status">
                <strong>Setup:</strong> Run <code>yarn setup</code> then <code>yarn test</code>
              </div>
            </div>
            
            <ApiBasicExample />
            <ApiUsersExample />
            <ApiErrorExample />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
