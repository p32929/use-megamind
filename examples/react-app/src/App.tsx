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
import RaceConditionExample from './components/RaceConditionExample';
import MemoryLeakExample from './components/MemoryLeakExample';
import EdgeCasesExample from './components/EdgeCasesExample';
import ValidationExample from './components/ValidationExample';

function App() {
  const [activeSection, setActiveSection] = useState<'basic' | 'api' | 'edge'>('basic');

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Clean, minimal header */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  use-megamind
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Comprehensive React hook testing suite
                </p>
              </div>
            </div>
            
            {/* Navigation tabs */}
            <nav className="flex space-x-1" aria-label="Tabs">
              <button
                onClick={() => setActiveSection('basic')}
                className={`${
                  activeSection === 'basic'
                    ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                } px-3 py-2 font-medium text-sm rounded-md transition-colors`}
                aria-current={activeSection === 'basic' ? 'page' : undefined}
              >
                Basic
              </button>
              <button
                onClick={() => setActiveSection('api')}
                className={`${
                  activeSection === 'api'
                    ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                } px-3 py-2 font-medium text-sm rounded-md transition-colors`}
                aria-current={activeSection === 'api' ? 'page' : undefined}
              >
                API
              </button>
              <button
                onClick={() => setActiveSection('edge')}
                className={`${
                  activeSection === 'edge'
                    ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                } px-3 py-2 font-medium text-sm rounded-md transition-colors`}
                aria-current={activeSection === 'edge' ? 'page' : undefined}
              >
                Edge Cases
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'basic' && (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
                Basic Examples
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Test core functionality with simple async functions. No server required.
              </p>
            </div>
            
            <BasicExample />
            <ParameterExample />
            <ButtonClickExample />
            <OptionsExample />
            <AppendExample />
            <CallbacksExample />
            <ClearResetExample />
            <ValidationExample />
            <GlobalValidationExample />
          </div>
        )}

        {activeSection === 'api' && (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
                API Examples
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Test with real HTTP requests and server responses.
              </p>
            </div>
            
            <ApiBasicExample />
            <ApiUsersExample />
            <ApiErrorExample />
          </div>
        )}

        {activeSection === 'edge' && (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
                Edge Cases & Advanced
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Test complex scenarios and edge cases to ensure robustness.
              </p>
            </div>
            
            <RaceConditionExample />
            <MemoryLeakExample />
            <EdgeCasesExample />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;