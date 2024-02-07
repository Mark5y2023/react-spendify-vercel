import React, { useState, useEffect } from 'react';
import { Button, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Snackbar, Alert, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import './Dash.css'; // Import the CSS file for styling
import { handleAddPayableInDialog } from './Home'; // Ensure the correct path to Home.js



const Dash = () => {

  const [username, setUsername] = useState('');
  const [payables, setPayables] = useState([]);
  const [lastClickedDate, setLastClickedDate] = useState('');
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isDialogOpen, setDialogOpen] = useState(false);
const [payableName, setPayableName] = useState('');
const [payableAmount, setPayableAmount] = useState('');

 

  useEffect(() => {
    const savedUsername = localStorage.getItem('username') || '';
    const savedPayables = JSON.parse(localStorage.getItem('payables')) || [];
    const savedLastClickedDate = localStorage.getItem('lastClickedDate') || '';

    setUsername(savedUsername);
    setPayables(savedPayables.map(p => ({ ...p, originalAmount: p.amount })));
    setLastClickedDate(savedLastClickedDate);
  }, []);

  const handlePay = (index) => {
    const updatedPayables = [...payables];
    const currentAmount = updatedPayables[index].amount;
    const originalAmount = updatedPayables[index].originalAmount;

    if (currentAmount === originalAmount) {
      updatedPayables[index].amount = originalAmount / 2;
    } else if (currentAmount === originalAmount / 2) {
      updatedPayables[index].amount = 0;
    }

    updatedPayables[index].clickCount = (updatedPayables[index].clickCount || 0) + 1;

    setPayables(updatedPayables);

    const currentDate = new Date();
    const formattedDate = `${getDayName(currentDate)}, ${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    setLastClickedDate(formattedDate);
    localStorage.setItem('payables', JSON.stringify(updatedPayables));
    localStorage.setItem('lastClickedDate', formattedDate);
    handleSnackbarOpen(`Payment processed successfully!`);
    setSnackbarSeverity('success'); 
  };

  const handleUndo = (index) => {
    const updatedPayables = [...payables];
    updatedPayables[index].amount = updatedPayables[index].originalAmount;
    setPayables(updatedPayables);
    localStorage.setItem('payables', JSON.stringify(updatedPayables));
  };

  const handleDelete = (index) => {
    const updatedPayables = [...payables];
    updatedPayables.splice(index, 1);
    setPayables(updatedPayables);
    localStorage.setItem('payables', JSON.stringify(updatedPayables));
  };

  const handleReset = () => {
    setDrawerOpen(false);
    const shouldReset = window.confirm('Are you sure you want to reset? This action cannot be undone.');

    if (shouldReset) {
      localStorage.clear();
      navigate('/');
    }
  };

  const handleNewMonth = () => {
    setDrawerOpen(false);
    const shouldProceed = window.confirm('Are you sure you want to start a new month? This will reset all payables.');
  
    if (shouldProceed) {
      const updatedPayables = payables.map(p => ({ ...p, amount: p.originalAmount }));
      setPayables(updatedPayables);
      localStorage.setItem('payables', JSON.stringify(updatedPayables));
    
    }
  };
  
  const handleAdd = () => {

    setDialogOpen(true);
    setDrawerOpen(false);

  };

  const handlePayableAmountChangeDialog = (e) => {
    // Allow only numbers, commas, and backspace
    const isValidInput = /^[\d,]*$/.test(e.target.value) || e.target.value === '';
    
    if (isValidInput) {
      // Remove commas and convert to a number for calculations
      const numericAmount = parseFloat(e.target.value.replace(/,/g, '') || '0', 10);
    
      setPayableAmount(numericAmount.toString());
    }
  };
  
  

  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  

  const getDayName = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  return (
    <div className="dashboard-container">
      <div className="fixed-section">
        <div className="header">
          <p>
            <img src="/2685032.png" alt="" style={{ height: '25px' }} /> <strong>Spendify</strong>
          </p>
          
          <IconButton onClick={() => setDrawerOpen(true)} style={{ marginLeft: 'auto' }}>
            <MenuIcon />
          </IconButton>
        </div>
        <div className="header" style={{marginTop:'2px'}}>
          <p style={{fontSize:'large', fontWeight:'bold'}}>{`Hi, ${username}!`}</p>
        </div>
        <p className="last-payment">{`Last Payment: ${lastClickedDate}`}</p>
      </div>

      <div className="user-section">
      <p style={{fontSize:'large', fontWeight:'bold'}}>Billers List</p>
    
          </div>

      <div className="payables-list">
        {payables.map((p, index) => (
          <div key={index} className="payable-item">
            <div className="payable-buttons">
              <IconButton
                onClick={() => handleDelete(index)}
                style={{ border: 'none', background: 'none' }}
              >
                <ClearIcon style={{ color: 'grey' }} />
              </IconButton>
            </div>
            <div className="payable-texts">
              <p style={{ fontWeight: 'bold', fontSize: 'medium', margin: '0' }}>{`${p.name}`}</p>
              <p style={{ fontSize: 'small', margin: '0' }}>{`₱ ${p.amount}`}</p>
            </div>
            <div className="payable-buttons">
              <Button variant="contained" onClick={() => handlePay(index)}>
                Pay
              </Button>
              <Button variant="outlined" onClick={() => handleUndo(index)}>
                Undo
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Drawer */}
      <Drawer  
       anchor="bottom"
       open={isDrawerOpen}
       onClose={() => setDrawerOpen(false)}
       PaperProps={{
         sx: {
           borderTopLeftRadius: '10px',  // Set the radius for top-left corner
           borderTopRightRadius: '10px', // Set the radius for top-right corner
         },
       }}
     >
        <List>
          <ListItem button onClick={handleAdd}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText style={{marginLeft:'-10px'}} primary="Add" />
          </ListItem>
          <ListItem button onClick={handleNewMonth}>
            <ListItemIcon>
              <CalendarTodayIcon />
            </ListItemIcon>
            <ListItemText style={{marginLeft:'-10px'}} primary="New Month" />
          </ListItem>
          <ListItem button onClick={handleReset}>
            <ListItemIcon>
              <RefreshIcon />
            </ListItemIcon>
            <ListItemText style={{marginLeft:'-10px'}} primary="Reset" />
          </ListItem>
        </List>
      </Drawer>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle style={{fontWeight:'bold'}}>Add New Biller</DialogTitle>
        <DialogContent>
          {/* Your form content goes here */}
          <TextField
            label="Biller Name"
            variant="outlined"
            margin="normal"
            value={payableName}
            onChange={(e) => setPayableName(e.target.value)}
            style={{ width: '100%' }}
            inputProps={{ maxLength: 15 }}
          />
          <TextField
  label="Amount"
  variant="outlined"
  margin="normal"
  value={payableAmount}
  onChange={(e) => handlePayableAmountChangeDialog(e)}
  onKeyPress={(e) => {
    // Prevent non-numeric input
    if (isNaN(e.key)) {
      e.preventDefault();
    }
  }}
  style={{ width: '100%' }}
  inputProps={{ maxLength: 9 }} // Limit to 9 characters
/>

        </DialogContent>
        <DialogActions>
        <Button onClick={() => handleAddPayableInDialog(payableName, payableAmount, payables, setPayables, setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen)}>Add</Button>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

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

export default Dash;
