import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Snackbar, Alert } from '@mui/material';
import './Home.css'; // Import the CSS file for styling
import ClearIcon from '@mui/icons-material/Clear';



export const handleAddPayableInDialog = (payableName, payableAmount, payables, setPayables, setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen) => {
  if (payableName && payableAmount) {
    const updatedPayables = [...payables, { name: payableName, amount: payableAmount }];
    setPayables(updatedPayables);
    localStorage.setItem('payables', JSON.stringify(updatedPayables));

    // Additional logic if needed

    // Show success snackbar
    setSnackbarMessage('Biller added successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    window.location.reload();
  } else {
    setSnackbarMessage(`Please enter Biller Name and Amount.`);
    setSnackbarOpen(true);
    setSnackbarSeverity('error');
  }
};




const Home = () => {

 const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [payables, setPayables] = useState([]);
  const [payableAmount, setPayableAmount] = useState('');
  const [payableName, setPayableName] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const maxUsernameLength = 15; // Set your desired maximum length for username
  const maxPayableNameLength = 15; // Set your desired maximum length for payable name
  const maxPayableAmountLength = 9; // Set your desired maximum length for payable amount

  useEffect(() => {
    // Check if there is a saved username and/or payables in local storage
    const savedUsername = localStorage.getItem('username') || '';
    const savedPayables = JSON.parse(localStorage.getItem('payables')) || [];
  
    if (savedUsername || savedPayables.length > 0) {
      navigate('/dashboard'); // Redirect to Dash.js if either username or payables exist
    } else {
      setUsername(savedUsername);
      setPayables(savedPayables);
    }
  }, [navigate]);
  

  const saveUsername = () => {
    localStorage.setItem('username', username);
    setSnackbarMessage('Username saved successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const savePayable = () => {
    const numericAmount = parseFloat(payableAmount.replace(/,/g, ''), 10);
    const newPayable = { amount: numericAmount, name: payableName };
    setPayables([...payables, newPayable]);
    setPayableAmount('');
    setPayableName('');
    localStorage.setItem('payables', JSON.stringify([...payables, newPayable]));
    setSnackbarMessage('Biller added successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  
  const deletePayable = (index) => {
    const updatedPayables = [...payables];
    updatedPayables.splice(index, 1);
    setPayables(updatedPayables);
    localStorage.setItem('payables', JSON.stringify(updatedPayables));
    setSnackbarMessage('Biller deleted successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handlePayableAmountChange = (e) => {
    // Allow only numbers, commas, and backspace
    const isValidInput = /^[\d,]*$/.test(e.target.value) || e.target.value === '';

    if (isValidInput) {
      // Remove commas and convert to a number for calculations
      const numericAmount = parseFloat(e.target.value.replace(/,/g, ''), 10);

      if (!isNaN(numericAmount)) {
        // Format the amount with commas for display
        const formattedAmount = new Intl.NumberFormat().format(numericAmount);
        setPayableAmount(formattedAmount);
      } else {
        // Handle NaN case gracefully
        setPayableAmount('');
      }
    }
  };



  // Conditions to check if input fields are empty
  const isUsernameEmpty = !username.trim();
  const isPayableEmpty = !payableName.trim() || !payableAmount.trim();
  const isLocalStorageEmpty = payables.length === 0 || !localStorage.getItem('username');


  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  
 
  return (
    
    <div className="home-container">
      <div className="fixed-section">
        <div className="header">
          <p>
            <img src="/2685032.png" alt="" style={{ height: '25px' }} /> <strong>Spendify</strong>
          </p>
        </div>
        <div className="input-section">
          <label>Username:</label>
          <TextField
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            inputProps={{ maxLength: maxUsernameLength }}
          />
          <Button
            variant="contained"
            onClick={saveUsername}
            style={{ marginTop: '10px' }}
            color="primary"
            disabled={isUsernameEmpty}
          >
            Save
          </Button>
        </div>

        <div className="input-section">
          <label>Biller:</label>
          <TextField
            variant="outlined"
            value={payableName}
            onChange={(e) => setPayableName(e.target.value)}
            inputProps={{ maxLength: maxPayableNameLength }}
          />
          <label style={{ marginTop: '5px' }}>Amount:</label>
          <TextField
          variant="outlined"
          value={payableAmount}
          onChange={handlePayableAmountChange}
          onKeyPress={(e) => {
            // Prevent non-numeric input
            if (isNaN(e.key)) {
              e.preventDefault();
            }
          }}
          inputProps={{ maxLength: maxPayableAmountLength }}
        />
          <Button
            variant="contained"
            onClick={savePayable}
            style={{ marginTop: '10px' }}
            color="primary"
            disabled={isPayableEmpty}
          >
            Add
          </Button>
        </div>

        <Button
          className="next-button"
          style={{ marginTop: '10px' }}
          onClick={() => navigate('/dashboard')}
          variant="contained"
          color="primary"
          disabled={isLocalStorageEmpty}
        >
          Next
        </Button>
        <div className="header2">
          <h3>Billers List</h3>
        </div>
      </div>

      <div className="scrollable-section">
        {payables.map((p, index) => (
          <div key={index} className="payable-item">
            <div>
              <p style={{ fontWeight: 'bold', fontSize: 'medium' }}>
                {p.name} | ₱ {p.amount}
              </p>
            </div>
            <Button
              onClick={() => deletePayable(index)}
              style={{ fontSize: '15px', backgroundColor: 'transparent' }}
              disabled={isLocalStorageEmpty}
            >
              <ClearIcon style={{ color: 'grey' }} />
            </Button>
          </div>
        ))}
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </div>
    
  );
};

export default Home;

