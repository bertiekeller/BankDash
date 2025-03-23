/**
 * Utility functions for calculating financial data
 */

/**
 * Calculate total income from transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {Number} - Total income amount
 */
const calculateTotalIncome = (transactions) => {
  if (!Array.isArray(transactions)) return 0;
  
  return transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

/**
 * Calculate total expenses from transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {Number} - Total expenses amount
 */
const calculateTotalExpenses = (transactions) => {
  if (!Array.isArray(transactions)) return 0;
  
  return transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

/**
 * Calculate balance (income - expenses)
 * @param {Array} transactions - Array of transaction objects
 * @returns {Number} - Balance amount
 */
const calculateBalance = (transactions) => {
  if (!Array.isArray(transactions)) return 0;
  
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  
  return income - expenses;
};

/**
 * Calculate spending by category
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} - Object with categories as keys and total amounts as values
 */
const calculateSpendingByCategory = (transactions) => {
  if (!Array.isArray(transactions)) return {};
  
  const expenseTransactions = transactions.filter(transaction => transaction.type === 'expense');
  
  return expenseTransactions.reduce((categories, transaction) => {
    const { category, amount } = transaction;
    
    if (!categories[category]) {
      categories[category] = 0;
    }
    
    categories[category] += amount;
    return categories;
  }, {});
};

/**
 * Calculate monthly spending totals
 * @param {Array} transactions - Array of transaction objects
 * @param {Number} year - Year to filter by (optional, defaults to current year)
 * @returns {Object} - Object with months as keys and total amounts as values
 */
const calculateMonthlySpending = (transactions, year = new Date().getFullYear()) => {
  if (!Array.isArray(transactions)) return {};
  
  const monthlyTotals = {
    'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0,
    'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
  };
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transaction.type === 'expense' && transactionDate.getFullYear() === year;
    })
    .forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const month = monthNames[transactionDate.getMonth()];
      monthlyTotals[month] += transaction.amount;
    });
  
  return monthlyTotals;
};

module.exports = {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateBalance,
  calculateSpendingByCategory,
  calculateMonthlySpending
}; 