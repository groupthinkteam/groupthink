import React from 'react';
import AppRoutes from './Router'
import { StoreProvider } from './store/provider';
const App = () => {
  return (
    <div className="App">
      <StoreProvider>
        <AppRoutes />
      </StoreProvider>
    </div>
  );
}

export default App;
