import React, { useState, useEffect } from 'react';
import {
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import './Dash.css';
import { handleAddPayableInDialog } from './Home';
import AppIcon from '@mui/icons-material/FlutterDash';
import { getPaymentStatus } from './paymentUtils';
import InfoIcon from '@mui/icons-material/Info';



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
  const [isDialogOpen2, setDialogOpen2] = useState(false);


  useEffect(() => {
    const savedUsername = localStorage.getItem('username') || '';
    const savedPayables = JSON.parse(localStorage.getItem('payables')) || [];
    const savedLastClickedDate = localStorage.getItem('lastClickedDate') || '';

    const updatedPayables = savedPayables.map(p => ({
      ...p,
      colorFormatStatus: getPaymentStatus(p.amount, p.originalAmount),
    }));

    setUsername(savedUsername);
    setPayables(updatedPayables);
    setLastClickedDate(savedLastClickedDate);
  }, []);

  const handleAbout = () => {
    setDialogOpen2(true);
    setSnackbarMessage('');
    setSnackbarSeverity('info');
  };
  

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
    updatedPayables[index].colorFormatStatus = getPaymentStatus(
      updatedPayables[index].amount,
      updatedPayables[index].originalAmount
    );

    setPayables(updatedPayables);

    const currentDate = new Date();
    const formattedDate = `${getDayName(currentDate)}, ${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    setLastClickedDate(formattedDate);
    localStorage.setItem('payables', JSON.stringify(updatedPayables));
    localStorage.setItem('lastClickedDate', formattedDate);
    handleSnackbarOpen(`Payment processed successfully!`);
    setSnackbarSeverity('success');
  };

  const totalOriginalAmount = payables.reduce((sum, payable) => sum + payable.originalAmount, 0);


  const handleUndo = (index) => {
    const updatedPayables = [...payables];
    updatedPayables[index].amount = updatedPayables[index].originalAmount;
  
    // Update the payment status based on the new amount
    updatedPayables[index].colorFormatStatus = getPaymentStatus(
      updatedPayables[index].amount,
      updatedPayables[index].originalAmount
    );
  
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
      const updatedPayables = payables.map(p => ({
        ...p,
        amount: p.originalAmount,
        colorFormatStatus: getPaymentStatus(p.originalAmount, p.originalAmount), // Reset colorFormatStatus
      }));
      setPayables(updatedPayables);
      localStorage.setItem('payables', JSON.stringify(updatedPayables));
    }
  };

  const handleAdd = () => {
    setDialogOpen(true);
    setDrawerOpen(false);
  };

  const handlePayableAmountChangeDialog = (e) => {
    const isValidInput = /^[\d,]*$/.test(e.target.value) || e.target.value === '';
  
    if (isValidInput) {
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
      <div className="fixed-section2">
      <div className="fixed-section">
        <div className="header">
        <p style={{alignItems:'center', display:'flex', alignContent:'center'}}> <AppIcon style={{ fontSize: 30, color: 'blue'}} /><strong>Spendify</strong></p>
        

          <IconButton onClick={() => setDrawerOpen(true)} style={{ marginLeft: 'auto' }}>
            <MenuIcon />
          </IconButton>
        </div>
        <div className="header" style={{ marginTop: '2px' }}>
          <p style={{ fontSize: 'large', fontWeight: 'bold', color:'black' }}>{`Hi, ${username}!`}</p>
        </div>
        <p className="last-payment">{`Last Payment: ${lastClickedDate}`}</p>
       
      </div>

      <div className="user-section">
      <p style={{ fontSize: 'large', fontWeight: 'bold' }}>Billers List</p>
          <p style={{ fontSize: 'large', fontWeight: 'bold', color:'#f50057' }}>
            {`Total: ₱ ${totalOriginalAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          </p>
      
      </div>
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
              <p
                style={{
                  fontWeight: 'bold',
                  fontSize: 'medium',
                  margin: '0',
                  color: p.amount !== p.originalAmount ? '#f50057' : 'gray', // Change text color if amount is different
                }}
              >{`${p.name}`}</p>
              <p style={{ fontSize: 'small', margin: '0' }}>{`₱ ${p.amount}`}</p>
              <p
                style={{
                  fontSize: 'small',
                  margin: '0',
                  color: p.amount !== p.originalAmount ? '#f50057' : 'gray', // Change text color if amount is different
                }}
              >{p.colorFormatStatus}</p>
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
            borderTopLeftRadius: '10px', // Set the radius for the top-left corner
            borderTopRightRadius: '10px', // Set the radius for the top-right corner
          },
        }}
      >
        <List>
          <ListItem button onClick={handleAdd}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText style={{ marginLeft: '-10px' }} primary="Add" />
          </ListItem>
          <ListItem button onClick={handleNewMonth}>
            <ListItemIcon>
              <CalendarTodayIcon />
            </ListItemIcon>
            <ListItemText style={{ marginLeft: '-10px' }} primary="New Month" />
          </ListItem>
          <ListItem button onClick={handleReset}>
            <ListItemIcon>
              <RefreshIcon />
            </ListItemIcon>
            <ListItemText style={{ marginLeft: '-10px' }} primary="Reset" />
          </ListItem>
          <ListItem button onClick={handleAbout}>
    <ListItemIcon>
      <InfoIcon />
    </ListItemIcon>
    <ListItemText style={{ marginLeft: '-10px' }} primary="About" />
  </ListItem>
        </List>
      </Drawer>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle style={{ fontWeight: 'bold' }}>Add New Biller</DialogTitle>
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
          <Button
            onClick={() =>
              handleAddPayableInDialog(
                payableName,
                payableAmount,
                payables,
                setPayables,
                setSnackbarMessage,
                setSnackbarSeverity,
                setSnackbarOpen,
                setPayableName, // Pass setPayableName function
                setPayableAmount, // Pass setPayableAmount function
                () => setDialogOpen(false)
              )
            }
          >
            Add
          </Button>
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

      <Dialog open={isDialogOpen2} onClose={() => setDialogOpen2(false)}>
  <DialogTitle style={{ fontWeight: 'bold' }}>About</DialogTitle>
  <DialogContent>
    <div className='dialog-about'>
    <p><b>Version 1.0:</b> <br/><b>Spendify</b> is currently optimized for mobile web use only. You can still access Spendify via Desktop or Tablet but the user expierence would't be as pleasing as much. For updates, kindly follow the developer on 
    <a href="https://www.facebook.com/DenmarkJudilla.Main/" target="_blank" rel="noopener noreferrer"> Facebook</a> and 
    <a href="https://www.instagram.com/denmarkjkl/?hl=en" target="_blank" rel="noopener noreferrer"> Instagram.</a>
    
    <br/><br/><b>Developed by Denmark Judilla<br/> All Rights Reserved 2024</b></p>
    </div>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDialogOpen2(false)}>Okay</Button>
  </DialogActions>
</Dialog>

    </div>
  );
};

export default Dash;