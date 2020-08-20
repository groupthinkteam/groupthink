import React, { useState } from 'react';
import AppRoutes from './Router'
import AppContext from './contexts/AppContext';
const App = () => {
  const [uid, setUid] = useState();
  return (
    <div className="App">
      <AppContext.Provider value={{ appname: "groupthink" , setUid : setUid, uid: uid }}>
        <AppRoutes />
      </AppContext.Provider>
    </div>
  );
}

export default App;
