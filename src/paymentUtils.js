export const getPaymentStatus = (amount, originalAmount) => {
    if (amount === 0) {
      return 'Paid';
    } else if (amount === originalAmount / 2) {
      return 'Half Paid';
    } else {
      return 'Unpaid';
    }
  };