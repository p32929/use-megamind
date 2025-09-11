import React, { useState } from 'react';
import useMegamind from 'use-megamind';
import CodeModal from './CodeModal';

function dataGeneratorFunction(size: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate large data to test memory usage
      const largeData = {
        id: Date.now(),
        size: size,
        data: new Array(size).fill(0).map((_, i) => ({
          index: i,
          value: `Item ${i}`,
          timestamp: new Date().toISOString(),
          randomData: Math.random().toString(36).substring(7)
        }))
      };
      resolve(largeData);
    }, 500);
  });
}

const MemoryLeakExample: React.FC = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [memoryStats, setMemoryStats] = useState<any[]>([]);
  const [callCount, setCallCount] = useState(0);

  // Hook with caching enabled to test cache cleanup
  const { data, isLoading, call, clear, reset } = useMegamind(dataGeneratorFunction, {
    options: {
      callRightAway: false,
      cache: true,
      debug: true,
    },
    events: {
      onSuccess: () => {
        setCallCount(prev => prev + 1);
        recordMemoryStats();
      }
    }
  });

  const recordMemoryStats = () => {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      setMemoryStats(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        usedJSHeapSize: memInfo.usedJSHeapSize,
        totalJSHeapSize: memInfo.totalJSHeapSize,
        jsHeapSizeLimit: memInfo.jsHeapSizeLimit,
        callCount: callCount + 1
      }]);
    } else {
      setMemoryStats(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        message: 'Memory API not available in this browser',
        callCount: callCount + 1
      }]);
    }
  };

  const generateSmallData = () => call(100);
  const generateMediumData = () => call(1000);
  const generateLargeData = () => call(10000);
  const generateMassiveData = () => call(50000);

  const clearMemoryStats = () => {
    setMemoryStats([]);
    setCallCount(0);
  };

  const codeExample = `// Test memory usage and potential leaks
function dataGeneratorFunction(size: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const largeData = {
        id: Date.now(),
        size: size,
        data: new Array(size).fill(0).map((_, i) => ({
          index: i,
          value: \`Item \${i}\`,
          timestamp: new Date().toISOString(),
          randomData: Math.random().toString(36).substring(7)
        }))
      };
      resolve(largeData);
    }, 500);
  });
}

const { data, call, clear, reset } = useMegamind(dataGeneratorFunction, {
  options: {
    callRightAway: false,
    cache: true, // Test cache cleanup
    debug: true,
  },
  events: {
    onSuccess: () => {
      // Record memory stats after each call
      if ('memory' in performance) {
        const memInfo = performance.memory;
        console.log('Memory usage:', memInfo.usedJSHeapSize);
      }
    }
  }
});

// Test different data sizes
call(100);    // Small: 100 items
call(1000);   // Medium: 1K items  
call(10000);  // Large: 10K items
call(50000);  // Massive: 50K items

// Test cleanup
clear(); // Should clear state but keep cache
reset(); // Should clear everything including cache`;

  return (
    <>
      <div className="example-section">
        <h2>🧠 Memory & Performance Testing</h2>
        <p>Tests memory usage, cache behavior, and cleanup with large data sets.</p>
        
        <div className="example-controls">
          <button 
            onClick={() => setShowCodeModal(true)}
            className="code-toggle-button"
          >
            📝 View Code
          </button>
          <button 
            onClick={generateSmallData} 
            disabled={isLoading}
            className="test-button"
          >
            📦 Small (100 items)
          </button>
          <button 
            onClick={generateMediumData} 
            disabled={isLoading}
            className="test-button"
          >
            📦 Medium (1K items)
          </button>
          <button 
            onClick={generateLargeData} 
            disabled={isLoading}
            className="test-button"
          >
            📦 Large (10K items)
          </button>
          <button 
            onClick={generateMassiveData} 
            disabled={isLoading}
            className="test-button"
          >
            📦 Massive (50K items)
          </button>
        </div>

        <div className="example-controls">
          <button onClick={clear} className="test-button">
            🧹 Clear State (Keep Cache)
          </button>
          <button onClick={reset} className="test-button">
            ♻️ Reset Everything
          </button>
          <button onClick={clearMemoryStats} className="test-button">
            📊 Clear Stats
          </button>
        </div>
        
        <div className="result-box">
          <div className={isLoading ? 'loading-indicator' : ''}>
            <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Data Size:</strong> {data ? (data as any).data?.length : 0} items
          </div>
          <div>
            <strong>Last ID:</strong> {data ? (data as any).id : 'None'}
          </div>
          <div>
            <strong>Total Calls:</strong> {callCount}
          </div>
        </div>

        <div className="logs-section">
          <h4>📊 Memory Usage Stats:</h4>
          <p><em>Note: Memory API only available in Chrome-based browsers. Check console for cache logs!</em></p>
          <div className="logs-container memory-stats">
            {memoryStats.length === 0 ? (
              <p><em>No memory stats yet. Generate some data!</em></p>
            ) : (
              memoryStats.map((stat, index) => (
                <div key={index} className="log-entry memory-entry">
                  <strong>{stat.timestamp}</strong> - Call #{stat.callCount}
                  {stat.message ? (
                    <span> - {stat.message}</span>
                  ) : (
                    <div>
                      <span>Used: {(stat.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB</span>
                      <span> | Total: {(stat.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB</span>
                      <span> | Limit: {(stat.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <CodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        title="Memory & Performance Testing"
        code={codeExample}
      />
    </>
  );
};

export default MemoryLeakExample;