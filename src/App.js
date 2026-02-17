import React from 'react';
import { FormularioPreventa } from './components/FormularioPreventa';

function App() {
  return (
    <div style={{ backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#000', color: '#fff', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>MakingPIT</h1>
        <small>Preventa Offline v1.0</small>
      </header>
      <FormularioPreventa />
    </div>
  );
}

export default App;