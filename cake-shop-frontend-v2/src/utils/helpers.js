import { formatLKR as currencyFormatLKR } from '../config/currency';

export const formatPrice = (price) => {
  return currencyFormatLKR(price);
};

// Add this line to export formatLKR directly
export const formatLKR = currencyFormatLKR;

export const getCategoryIcon = (category) => {
  const icons = {
    'Birthday': 'bi-balloon',
    'Wedding': 'bi-heart',
    'Anniversary': 'bi-calendar-heart',
    'Special': 'bi-star',
    'Spring': 'bi-flower1',
    'All': 'bi-grid'
  };
  return icons[category] || 'bi-cake';
};

// LKR specific formatter for large numbers
export const formatLargeLKR = (amount) => {
  if (amount >= 1000000) {
    return `₨ ${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `₨ ${(amount / 1000).toFixed(1)}K`;
  }
  return `₨ ${amount.toFixed(2)}`;
};