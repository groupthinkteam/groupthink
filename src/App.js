import React from 'react';
import AppRoutes from './router/index'
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
