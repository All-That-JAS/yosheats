import React from 'react';
import RouteList from './RouteList';
import Navibar from './components/NaviBar';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Navibar />
        <RouteList />
      </AuthProvider>
    </div>
  );
};

export default App;
