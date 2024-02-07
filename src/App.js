import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home2 from './Home2';
import Dash2 from './Dash2';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Your header or common components can go here */}
        <Routes>
          <Route path="/" element={<Home2 />} />
          <Route path="/dashboard" element={<Dash2 />} />
          {/* Add more routes for additional pages if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
