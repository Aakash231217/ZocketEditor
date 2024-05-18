import React from 'react';
import CanvasEditor from './CanvasEditor';

const App = () => {
  return (
    <div className="App flex flex-col items-center p-4 min-h-screen bg-gray-100">
      <header className="App-header mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Zocket Canvas Editor</h1>
      </header>
      <CanvasEditor />
    </div>
  );
};

export default App;
