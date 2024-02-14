// SplashScreen.js

import React from 'react';
import './SplashScreen.css'; // Include your styling here
import AppIcon from '@mui/icons-material/FlutterDash';


const SplashScreen = () => {
  return (
    <div className="splash-screen">
    
          <AppIcon style={{ fontSize: 30,  alignContent:'center', alignItems:'center  ' }} /><strong style={{marginLeft:'10px'}}>Spendify</strong>
              
      {/* Additional content goes here */}
    </div>
  );
};

export default SplashScreen;
