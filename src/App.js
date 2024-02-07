import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Dash from './Dash';
import SplashScreen from './SplashScreen'; // Import the SplashScreen component

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an asynchronous operation (e.g., fetching data, initializing)
    const fakeAsyncOperation = () => {
      setTimeout(() => {
        setLoading(false);
      }, 2000); // Set the time based on your needs
    };

    fakeAsyncOperation();
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Conditionally render SplashScreen or main components based on loading state */}
        {loading ? (
          <SplashScreen />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dash />} />
            {/* Add more routes for additional pages if needed */}
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
