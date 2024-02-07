import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Dash from './Dash';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Your header or common components can go here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dash />} />
          {/* Add more routes for additional pages if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
