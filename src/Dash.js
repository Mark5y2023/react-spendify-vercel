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
  Card,
  CardContent,
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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';




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
    const handleBeforeUnload = (event) => {
      const savedUsername = localStorage.getItem('username');

      if (!savedUsername) {
        event.preventDefault();
        navigate('/dashboard');
        return "Kindly reset the app for you to go back to set up page.";
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate]);



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
  
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedPayables = [...payables];
    const [removed] = updatedPayables.splice(result.source.index, 1);
    updatedPayables.splice(result.destination.index, 0, removed);

    setPayables(updatedPayables);
    localStorage.setItem('payables', JSON.stringify(updatedPayables));
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
  
      // Reset lastClickedDate
      setLastClickedDate('');
  
      handleSnackbarOpen('New month started. All payables reset.');
      setSnackbarSeverity('info');
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
      
        <div className="header">
        <p style={{alignItems:'center', display:'flex', alignContent:'center'}}> <AppIcon style={{ fontSize: 30, color: '#651FFF'}} /><strong>Spendify</strong></p>
        

          <IconButton onClick={() => setDrawerOpen(true)} style={{ marginLeft: 'auto' }}>
            <MenuIcon />
          </IconButton>
        </div>
        <Card style={{borderRadius:'20px' , boxShadow:'1px 2px 9px #E0E0E0', width:'100%' , backgroundColor:'#ffffff'}}>
          <CardContent>

          <div className='card-holder' style={{ paddingLeft: "10px", display: 'flex', flexDirection: 'column' }}>
  <div>
    <p style={{ fontSize: 'large', fontWeight: 'bold', marginTop: '5px' }}>{`Hi, ${username}!`}</p>
    <p style={{ fontSize: 'medium', fontWeight: 'bold' }}>{`Last Payment: ${lastClickedDate}`}</p>
  </div>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop:'10px' }}>
    <div style={{
      backgroundColor: '#651FFF',
      borderRadius: '20px',
      width: 'fit-content',
      boxShadow: '1px 2px 9px #E0E0E0',
      animation: 'breathing 3s infinite',
    }}>
      <p style={{
        marginBottom: '-5px',
        fontSize: 'large',
        fontWeight: 'bold',
        padding: '8px',
        color: 'white',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        width: '90%',
        margin: 0,
      }}>
        {`Total: ₱ ${totalOriginalAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
      </p>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Button
     variant='outlined'
        style={{
       
          fontSize: '15px',
     
       marginRight:'20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
         borderColor:'#616161',
          borderRadius: '15px',
          color:'#616161',
        
        
        }}
        onClick={handleAdd}
      >
        <AddIcon style={{ fontSize: 18,marginBottom:'3px'}} />
        Add
      </Button>
    </div>
  </div>
</div>
      
     
    </CardContent>
    </Card>
  

      <div className="user-section">
      <p style={{ fontSize: 'large', fontWeight: 'bold' }}>Billers List</p>
          
      
      </div>
      </div>
      
       <div className="payables-list">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="payables">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {payables.map((p, index) => (
                  <Draggable key={index} draggableId={`payable-${index}`} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`payable-item ${snapshot.isDragging ? 'dragging' : ''}`}
                    >
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
                              color: p.amount !== p.originalAmount ? '#f50057' : '',
                            }}
                          >
                            {`${p.name}`}
                          </p>
                          <p style={{ fontSize: 'small', margin: '0' }}>{`₱ ${p.amount}`}</p>
                          <p
                            style={{
                              fontSize: 'small',
                              margin: '0',
                              color: p.amount !== p.originalAmount ? '#f50057' : '',
                            }}
                          >
                            {p.colorFormatStatus}
                          </p>
                        </div>
                        <div className="payable-buttons">
  <Button
    variant="contained"
    onClick={() => handlePay(index)}
    style={{ backgroundColor: '#6200EA', color: '#ffffff' }}
  >
    Pay
  </Button>
  <Button
    variant="outlined"
    onClick={() => handleUndo(index)}
    style={{ borderColor: '#6200EA', color: '#6200EA' }}
  >
    Undo
  </Button>
</div>

                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
        <DialogTitle style={{ fontWeight: 'bold', color:'#6200EA' }}>Add New Biller</DialogTitle>
        <DialogContent>
          {/* Your form content goes here */}
            <TextField
              label="Biller Name"
              variant="outlined"
              margin="normal"
              value={payableName}
              onChange={(e) => setPayableName(e.target.value)}
              style={{ width: '100%'}}
              inputProps={{ maxLength: 15 }}
              sx={{
   
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6200EA',
                },
                '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6200EA',
                },
              }}
              
           
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
            style={{ width: '100%'}}
            inputProps={{ maxLength: 9 }} // Limit to 9 characters
            sx={{
   
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#6200EA',
              },
              '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6200EA',
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button style={{color:'#6200EA'}}
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
          <Button style={{color:'#6200EA'}} onClick={handleCloseDialog}>Cancel</Button>
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
    <p><b>Version 1.2
    <br/>Version Date: 2.15.24</b>
    <br/><br/><b>Spendify</b> is currently optimized for mobile web use only. You can still access Spendify via Desktop or Tablet, but the user experience wouldn't be as pleasing. For updates, kindly follow the developer on 
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