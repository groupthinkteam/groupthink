import React from 'react';
import AppRoutes from './Router'
import AppContext from './contexts/AppContext';
const App = () => {
  return (
    <div className="App">
      <AppContext.Provider value={{ appname: "groupthink" }}>
        <AppRoutes />
      </AppContext.Provider>
    </div>
  );
}

export default App;
