// SplashScreen.js

import React from 'react';
import './SplashScreen.css'; // Include your styling here
import AppIcon from '@mui/icons-material/AppRegistration';


const SplashScreen = () => {
  return (
    <div className="splash-screen">
    
          <AppIcon style={{ fontSize: 30, color: 'blue', alignContent:'center', alignItems:'center  ' }} /><strong>Spendify</strong>
              
      {/* Additional content goes here */}
    </div>
  );
};

export default SplashScreen;
