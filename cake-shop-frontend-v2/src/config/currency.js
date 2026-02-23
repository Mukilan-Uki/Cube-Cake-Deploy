// Currency Configuration for Sri Lankan Rupees (LKR)
export const CURRENCY = {
  code: 'LKR',
  symbol: '₨',
  name: 'Sri Lankan Rupee',
  exchangeRate: 300, // 1 USD = 300 LKR (adjust this as needed)
  format: (amount) => {
    // Format with thousand separators for LKR
    return `₨ ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
};

// Helper function to convert USD to LKR
export const usdToLkr = (usdAmount) => {
  return usdAmount * CURRENCY.exchangeRate;
};

// Helper function to format LKR with proper spacing and symbol
export const formatLKR = (lkrAmount) => {
  return `₨ ${lkrAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

// Helper function to convert and format in one step
export const convertAndFormat = (usdAmount) => {
  const lkrAmount = usdToLkr(usdAmount);
  return formatLKR(lkrAmount);
};