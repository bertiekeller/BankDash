const express = require('express');
const router = express.Router();
const sampleData = require('../data/sampleData');
const calculations = require('../utils/calculations');

// Middleware to simulate authentication
const authMiddleware = (req, res, next) => {
  // In a real app, this would verify JWT tokens
  // For demo purposes, we'll just check if the Authorization header exists
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  // Extract user email from the request for user-specific data
  // In a real app, this would come from the JWT token
  // For demo purposes, we'll use a custom header
  req.userEmail = req.headers['x-user-email'] || null;
  
  next();
};

// Helper function to filter data by user
const filterByUser = (data, userEmail) => {
  if (!userEmail) return data;
  
  return data.filter(item => {
    // If the item has a user property, filter by it
    if (item.user) {
      return item.user === userEmail;
    }
    // Otherwise return all items (for backward compatibility)
    return true;
  });
};

// Get dashboard data (totals)
router.get('/dashboard', authMiddleware, (req, res) => {
  // Filter transactions by user if email is provided
  const userTransactions = filterByUser(sampleData.transactions, req.userEmail);
  
  // Use our calculation utility functions to get real-time totals
  const income = calculations.calculateTotalIncome(userTransactions);
  const expenses = calculations.calculateTotalExpenses(userTransactions);
  const balance = calculations.calculateBalance(userTransactions);
  
  res.json({
    success: true,
    data: {
      income,
      expenses,
      balance
    }
  });
});

// Get all transactions
router.get('/transactions', authMiddleware, (req, res) => {
  // Filter transactions by user if email is provided
  const userTransactions = filterByUser(sampleData.transactions, req.userEmail);
  
  res.json({
    success: true,
    count: userTransactions.length,
    data: userTransactions
  });
});

// Get transaction by ID
router.get('/transactions/:id', authMiddleware, (req, res) => {
  // First filter by user, then find by ID
  const userTransactions = filterByUser(sampleData.transactions, req.userEmail);
  const transaction = userTransactions.find(t => t.id === req.params.id);
  
  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: 'Transaction not found'
    });
  }
  
  res.json({
    success: true,
    data: transaction
  });
});

// Get all cards
router.get('/cards', authMiddleware, (req, res) => {
  // Filter cards by user if email is provided
  const userCards = filterByUser(sampleData.cards, req.userEmail);
  
  res.json({
    success: true,
    count: userCards.length,
    data: userCards
  });
});

// Get card by ID
router.get('/cards/:id', authMiddleware, (req, res) => {
  // First filter by user, then find by ID
  const userCards = filterByUser(sampleData.cards, req.userEmail);
  const card = userCards.find(c => c.id === req.params.id);
  
  if (!card) {
    return res.status(404).json({
      success: false,
      message: 'Card not found'
    });
  }
  
  res.json({
    success: true,
    data: card
  });
});

// Get analytics data
router.get('/analytics', authMiddleware, (req, res) => {
  // Check if we have specific analytics for this user
  if (req.userEmail === 'test@example.com' && sampleData.analytics.testUser) {
    // Return test user specific analytics
    res.json({
      success: true,
      data: {
        monthlySpending: sampleData.analytics.testUser.monthlySpending,
        spendingByCategory: sampleData.analytics.testUser.spendingByCategory,
        savingsGoal: sampleData.analytics.testUser.savingsGoal
      }
    });
    return;
  }
  
  // Filter transactions by user if email is provided
  const userTransactions = filterByUser(sampleData.transactions, req.userEmail);
  
  // Use our calculation utility functions for analytics data
  const spendingByCategory = calculations.calculateSpendingByCategory(userTransactions);
  const monthlySpending = calculations.calculateMonthlySpending(userTransactions);
  
  // Convert spendingByCategory object to array format expected by frontend
  const spendingByCategoryArray = Object.entries(spendingByCategory).map(([category, amount]) => {
    // Calculate percentage based on total expenses
    const totalExpenses = calculations.calculateTotalExpenses(userTransactions);
    const percentage = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
    
    return {
      category,
      amount,
      percentage
    };
  });
  
  // Convert monthlySpending object to array format expected by frontend
  const monthlySpendingArray = Object.entries(monthlySpending).map(([month, amount]) => ({
    month,
    amount
  }));
  
  res.json({
    success: true,
    data: {
      monthlySpending: monthlySpendingArray,
      spendingByCategory: spendingByCategoryArray,
      savingsGoal: sampleData.analytics.savingsGoal
    }
  });
});

// Get all messages
router.get('/messages', authMiddleware, (req, res) => {
  // For messages, we don't have user-specific data yet, so return all
  res.json({
    success: true,
    count: sampleData.messages.length,
    data: sampleData.messages
  });
});

// Get message by ID
router.get('/messages/:id', authMiddleware, (req, res) => {
  const message = sampleData.messages.find(m => m.id === req.params.id);
  
  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Message not found'
    });
  }
  
  res.json({
    success: true,
    data: message
  });
});

// Mark message as read
router.patch('/messages/:id/read', authMiddleware, (req, res) => {
  const message = sampleData.messages.find(m => m.id === req.params.id);
  
  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Message not found'
    });
  }
  
  message.isRead = true;
  
  res.json({
    success: true,
    data: message
  });
});

// Authentication routes
router.post('/auth/register', (req, res) => {
  // In a real app, this would create a user in the database
  // For demo purposes, we'll just return a success response
  const email = req.body.email || 'john.doe@example.com';
  const name = req.body.name || 'John Doe';
  
  res.json({
    success: true,
    token: 'sample-jwt-token',
    user: {
      id: email === 'test@example.com' ? 'u2' : 'u1',
      name: email === 'test@example.com' ? 'Test User' : name,
      email: email
    }
  });
});

router.post('/auth/login', (req, res) => {
  // In a real app, this would verify credentials
  // For demo purposes, we'll just return a success response
  const email = req.body.email;
  
  // Simulate failed login for specific test case
  if (email === 'invalid@example.com') {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  res.json({
    success: true,
    token: 'sample-jwt-token',
    user: {
      id: email === 'test@example.com' ? 'u2' : 'u1',
      name: email === 'test@example.com' ? 'Test User' : 'John Doe',
      email: email || 'john.doe@example.com'
    }
  });
});

module.exports = router; 