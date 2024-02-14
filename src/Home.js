import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Snackbar, Alert, Card, CardContent } from '@mui/material';
import './Home.css';
import ClearIcon from '@mui/icons-material/Clear';
import AppIcon from '@mui/icons-material/FlutterDash';
import { getPaymentStatus } from './paymentUtils';


export const handleAddPayableInDialog = (
  payableName,
  payableAmount,
  payables,
  setPayables,
  setSnackbarMessage,
  setSnackbarSeverity,
  setSnackbarOpen,
  setPayableName,
  setPayableAmount,
  closeDialog
) => {
  if (payableName && payableAmount) {
    const numericAmount = parseFloat(payableAmount.replace(/,/g, ''), 10);

    if (!isNaN(numericAmount)) {
      const newPayable = {
        name: payableName,
        amount: numericAmount,
        originalAmount: numericAmount,
        colorFormatStatus: getPaymentStatus(numericAmount, numericAmount), // Set colorFormatStatus
      };

      const existingPayableIndex = payables.findIndex((p) => p.name === payableName);

      if (existingPayableIndex !== -1) {
        payables[existingPayableIndex] = newPayable;
      } else {
        payables.push(newPayable);
      }

      localStorage.setItem('payables', JSON.stringify(payables));

      setSnackbarMessage('Biller added successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Clear the input fields in the dialog box
      setPayableName('');
      setPayableAmount('');

      // Close the dialog
      closeDialog();
    }
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

  const maxUsernameLength = 15;
  const maxPayableNameLength = 15;
  const maxPayableAmountLength = 9;

  useEffect(() => {
    const savedUsername = localStorage.getItem('username') || '';
    const savedPayables = JSON.parse(localStorage.getItem('payables')) || [];

    if (!savedUsername || savedPayables.length === 0) {
      // If either username or payables is missing, navigate to Home.js
      navigate('/');
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
    const newPayable = { amount: numericAmount, originalAmount: numericAmount, name: payableName };
  
    setPayables((prevPayables) => {
      const updatedPayables = [...prevPayables, newPayable];
      localStorage.setItem('payables', JSON.stringify(updatedPayables));
      return updatedPayables;
    });
  
    // Clear the input fields
    setPayableAmount('');
    setPayableName('');
  
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
    const isValidInput = /^[\d,]*$/.test(e.target.value) || e.target.value === '';

    if (isValidInput) {
      const numericAmount = parseFloat(e.target.value.replace(/,/g, '') || '0', 10);

      if (!isNaN(numericAmount)) {
        const formattedAmount = new Intl.NumberFormat().format(numericAmount);
        setPayableAmount(formattedAmount);
      } else {
        setPayableAmount('');
      }
    }
  };

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
       
        <p style={{alignItems:'center', display:'flex', alignContent:'center'}}> <AppIcon style={{ fontSize: 30}} /><strong>Spendify</strong></p>
        
        </div>
        <Card style={{borderRadius:'20px' , boxShadow:'1px 2px 9px #E0E0E0', width:'100%' , backgroundColor:'#ffffff'}}>
          <CardContent>
        <div className="input-section">


<TextField
style={{marginTop:'5px'}}
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
  onChange={(e) => setUsername(e.target.value)}
  inputProps={{
    maxLength: maxUsernameLength,
    style: { height: '10px' }, // Adjust the height as needed
  }}
  sx={{
    fontSize: '8px', 
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#6200EA',
    },
    '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#6200EA',
    },
  }}
          
              />


          <Button
            variant="contained"
            onClick={saveUsername}
            style={{ borderRadius:'50px' }}
            color="primary"
            disabled={isUsernameEmpty}
            className={isUsernameEmpty ? 'inactive' : 'active'}
          >
            Save
          </Button>
      
        </div>
     
        <div className="input-section">
     
          <TextField style={{marginTop:'10px'}}
            variant="outlined"
            label="Biller"
            value={payableName}
            onChange={(e) => setPayableName(e.target.value)}
            inputProps={{
              maxLength: maxPayableNameLength,
              style: { height: '10px' }, // Adjust the height as needed
            }}
            sx={{
              fontSize: '8px', 
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#6200EA',
              },
              '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6200EA',
              },
            }}
          />

          

          <TextField style={{marginTop:'10px'}}
          variant="outlined"
          label="Amount"
          value={payableAmount}
          onChange={handlePayableAmountChange}
          onKeyPress={(e) => {
            // Prevent non-numeric input
            if (isNaN(e.key)) {
              e.preventDefault();
            }
          }}
          inputProps={{
            maxLength: maxPayableAmountLength,
            style: { height: '10px' }, // Adjust the height as needed
          }}
          sx={{
            fontSize: '8px', 
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#6200EA',
            },
            '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6200EA',
            },
          }}
        />
          <Button
          
            variant="contained"
            onClick={savePayable}
            style={{ marginTop: '10px',borderRadius:'50px'}}
            color="primary"
            disabled={isPayableEmpty}
            className={isPayableEmpty ? 'inactive' : 'active'}
          >
            Add
          </Button>
        </div>
        </CardContent>
        </Card>

        <Button
         
          style={{ marginTop: '20px',alignSelf:'flex-end' ,borderRadius:'5px', marginRight:'15px'}}
          onClick={() => navigate('/dashboard')}
          variant="contained"
          color="primary"
          disabled={isLocalStorageEmpty}
          className={isLocalStorageEmpty ? 'inactive' : 'active'}
        >
          Next
        </Button>
        <div className="header2">
          <h3>Billers List</h3>
        </div>
      </div>

      <div className="scrollable-section">
        {payables.map((p, index) => (
          <div key={index} className="payable-item1"  >
            <div>
              <p style={{ fontWeight: 'bold', fontSize: 'medium' }}>
                {p.name} </p>
                <p style={{ fontWeight: 'normal', fontSize: 'medium', marginTop:"-10px" }}>
                {p.amount}
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