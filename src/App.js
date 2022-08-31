import React from 'react';
import RouteList from './RouteList';
import Navibar from './components/NaviBar';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Navibar />
        <RouteList />
        <Footer />
      </AuthProvider>
    </div>
  );
};

export default App;
