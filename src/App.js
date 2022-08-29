import React from 'react';
import RouteList from './RouteList';
import Navibar from './components/NaviBar';
console.log(process.env.REACT_APP_NUTRITION_API_KEY);

const App = () => {
  return (
    <div>
      <Navibar />
      <RouteList />
    </div>
  );
};

export default App;
