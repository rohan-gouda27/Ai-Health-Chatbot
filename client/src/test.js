// Simple test to check if React can import properly
import React from 'react';
import ReactDOM from 'react-dom/client';

console.log('React version:', React.version);
console.log('ReactDOM available:', !!ReactDOM);

const TestApp = () => {
  return React.createElement('div', null, 'Test successful!');
};

export default TestApp;