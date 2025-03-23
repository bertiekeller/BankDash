/**
 * Sample data for BankDash application
 * This file contains mock data for transactions, cards, analytics, and messages
 */

// Sample transactions data
const transactions = [
  {
    id: 't1',
    type: 'income',
    name: 'Salary Payment',
    amount: 2850.00,
    date: '2023-05-15T10:30:00',
    status: 'completed',
    category: 'salary',
    icon: 'salary'
  },
  {
    id: 't2',
    type: 'expense',
    name: 'Grocery Shopping',
    amount: 120.50,
    date: '2023-05-14T15:45:00',
    status: 'completed',
    category: 'shopping',
    icon: 'shopping'
  },
  {
    id: 't3',
    type: 'expense',
    name: 'Netflix Subscription',
    amount: 14.99,
    date: '2023-05-10T08:00:00',
    status: 'completed',
    category: 'entertainment',
    icon: 'entertainment'
  },
  {
    id: 't4',
    type: 'expense',
    name: 'Electricity Bill',
    amount: 85.75,
    date: '2023-05-05T09:15:00',
    status: 'completed',
    category: 'utilities',
    icon: 'utilities'
  },
  {
    id: 't5',
    type: 'income',
    name: 'Freelance Payment',
    amount: 450.00,
    date: '2023-05-03T14:20:00',
    status: 'completed',
    category: 'freelance',
    icon: 'freelance'
  },
  {
    id: 't6',
    type: 'expense',
    name: 'Restaurant Dinner',
    amount: 65.30,
    date: '2023-05-01T20:30:00',
    status: 'completed',
    category: 'food',
    icon: 'food'
  },
  {
    id: 't7',
    type: 'expense',
    name: 'Gas Station',
    amount: 45.00,
    date: '2023-04-28T12:15:00',
    status: 'completed',
    category: 'transportation',
    icon: 'transportation'
  },
  {
    id: 't8',
    type: 'income',
    name: 'Tax Refund',
    amount: 750.25,
    date: '2023-04-25T11:00:00',
    status: 'completed',
    category: 'tax',
    icon: 'tax'
  },
  // New transactions for Test User
  {
    id: 't9',
    type: 'income',
    name: 'Bonus Payment',
    amount: 1200.00,
    date: '2023-05-20T09:45:00',
    status: 'completed',
    category: 'bonus',
    icon: 'salary',
    user: 'test@example.com'
  },
  {
    id: 't10',
    type: 'expense',
    name: 'Amazon Purchase',
    amount: 89.99,
    date: '2023-05-19T16:30:00',
    status: 'completed',
    category: 'shopping',
    icon: 'shopping',
    user: 'test@example.com'
  },
  {
    id: 't11',
    type: 'expense',
    name: 'Gym Membership',
    amount: 49.99,
    date: '2023-05-18T08:15:00',
    status: 'completed',
    category: 'health',
    icon: 'health',
    user: 'test@example.com'
  },
  {
    id: 't12',
    type: 'expense',
    name: 'Internet Bill',
    amount: 79.99,
    date: '2023-05-17T10:00:00',
    status: 'completed',
    category: 'utilities',
    icon: 'utilities',
    user: 'test@example.com'
  },
  {
    id: 't13',
    type: 'income',
    name: 'Consulting Fee',
    amount: 850.00,
    date: '2023-05-16T14:30:00',
    status: 'completed',
    category: 'freelance',
    icon: 'freelance',
    user: 'test@example.com'
  },
  {
    id: 't14',
    type: 'expense',
    name: 'Coffee Shop',
    amount: 12.50,
    date: '2023-05-15T09:20:00',
    status: 'completed',
    category: 'food',
    icon: 'food',
    user: 'test@example.com'
  },
  {
    id: 't15',
    type: 'expense',
    name: 'Uber Ride',
    amount: 24.75,
    date: '2023-05-14T19:45:00',
    status: 'completed',
    category: 'transportation',
    icon: 'transportation',
    user: 'test@example.com'
  },
  {
    id: 't16',
    type: 'expense',
    name: 'Movie Tickets',
    amount: 32.00,
    date: '2023-05-13T20:15:00',
    status: 'completed',
    category: 'entertainment',
    icon: 'entertainment',
    user: 'test@example.com'
  }
];

// Sample cards data
const cards = [
  {
    id: 'c1',
    type: 'visa',
    number: '4111 **** **** 1234',
    holderName: 'John Doe',
    expiryDate: '05/25',
    cvv: '***',
    balance: 3500.75,
    color: 'purple',
    isDefault: true
  },
  {
    id: 'c2',
    type: 'mastercard',
    number: '5555 **** **** 5678',
    holderName: 'John Doe',
    expiryDate: '08/24',
    cvv: '***',
    balance: 1250.50,
    color: 'blue',
    isDefault: false
  },
  {
    id: 'c3',
    type: 'amex',
    number: '3782 **** **** 9012',
    holderName: 'John Doe',
    expiryDate: '12/26',
    cvv: '****',
    balance: 5200.25,
    color: 'green',
    isDefault: false
  },
  // New cards for Test User
  {
    id: 'c4',
    type: 'visa',
    number: '4222 **** **** 5678',
    holderName: 'Test User',
    expiryDate: '09/26',
    cvv: '***',
    balance: 4250.50,
    color: 'orange',
    isDefault: true,
    user: 'test@example.com'
  },
  {
    id: 'c5',
    type: 'mastercard',
    number: '5333 **** **** 9012',
    holderName: 'Test User',
    expiryDate: '11/25',
    cvv: '***',
    balance: 2800.75,
    color: 'red',
    isDefault: false,
    user: 'test@example.com'
  },
  {
    id: 'c6',
    type: 'discover',
    number: '6011 **** **** 3456',
    holderName: 'Test User',
    expiryDate: '03/27',
    cvv: '***',
    balance: 1750.25,
    color: 'teal',
    isDefault: false,
    user: 'test@example.com'
  }
];

// Sample analytics data
const analytics = {
  monthlySpending: [
    { month: 'Jan', amount: 1250 },
    { month: 'Feb', amount: 1400 },
    { month: 'Mar', amount: 1300 },
    { month: 'Apr', amount: 950 },
    { month: 'May', amount: 1200 },
    { month: 'Jun', amount: 1600 },
    { month: 'Jul', amount: 1800 },
    { month: 'Aug', amount: 1400 },
    { month: 'Sep', amount: 1100 },
    { month: 'Oct', amount: 1350 },
    { month: 'Nov', amount: 1500 },
    { month: 'Dec', amount: 2000 }
  ],
  spendingByCategory: [
    { category: 'Shopping', percentage: 25, amount: 450 },
    { category: 'Food', percentage: 20, amount: 360 },
    { category: 'Entertainment', percentage: 15, amount: 270 },
    { category: 'Transportation', percentage: 15, amount: 270 },
    { category: 'Utilities', percentage: 10, amount: 180 },
    { category: 'Other', percentage: 15, amount: 270 }
  ],
  savingsGoal: {
    current: 5000,
    target: 10000,
    percentage: 50
  },
  // New analytics data for Test User
  testUser: {
    monthlySpending: [
      { month: 'Jan', amount: 980 },
      { month: 'Feb', amount: 1150 },
      { month: 'Mar', amount: 1420 },
      { month: 'Apr', amount: 1050 },
      { month: 'May', amount: 1380 },
      { month: 'Jun', amount: 1240 },
      { month: 'Jul', amount: 1560 },
      { month: 'Aug', amount: 1320 },
      { month: 'Sep', amount: 1190 },
      { month: 'Oct', amount: 1450 },
      { month: 'Nov', amount: 1680 },
      { month: 'Dec', amount: 1890 }
    ],
    spendingByCategory: [
      { category: 'Shopping', percentage: 22, amount: 380 },
      { category: 'Food', percentage: 18, amount: 310 },
      { category: 'Entertainment', percentage: 14, amount: 240 },
      { category: 'Transportation', percentage: 12, amount: 210 },
      { category: 'Utilities', percentage: 15, amount: 260 },
      { category: 'Health', percentage: 10, amount: 170 },
      { category: 'Other', percentage: 9, amount: 160 }
    ],
    savingsGoal: {
      current: 3500,
      target: 8000,
      percentage: 43.75
    }
  }
};

// Sample messages data
const messages = [
  {
    id: 'm1',
    sender: 'BankDash Support',
    subject: 'Welcome to BankDash',
    content: 'Welcome to BankDash! We\'re excited to have you on board. If you have any questions, feel free to reach out to our support team.',
    date: '2023-05-15T09:00:00',
    isRead: true
  },
  {
    id: 'm2',
    sender: 'Security Team',
    subject: 'Security Alert: New Login',
    content: 'We detected a new login to your account from a new device. If this was you, you can ignore this message. If not, please contact our security team immediately.',
    date: '2023-05-14T15:30:00',
    isRead: true
  },
  {
    id: 'm3',
    sender: 'Transactions Team',
    subject: 'Large Transaction Notification',
    content: 'A transaction of $450.00 was processed on your account. This is an automated notification for transactions over $400.',
    date: '2023-05-03T14:25:00',
    isRead: false
  },
  {
    id: 'm4',
    sender: 'Card Services',
    subject: 'Your New Card is Ready',
    content: 'Your new card has been processed and will be delivered within 3-5 business days. Please activate it as soon as you receive it.',
    date: '2023-04-28T11:15:00',
    isRead: false
  },
  {
    id: 'm5',
    sender: 'BankDash Offers',
    subject: 'Special Offer: Upgrade Your Account',
    content: 'Based on your account activity, you\'re eligible for our premium account with additional benefits. Click here to learn more.',
    date: '2023-04-20T10:00:00',
    isRead: false
  }
];

// Calculate totals
const calculateTotals = () => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = income - expenses;
  
  return {
    income,
    expenses,
    balance
  };
};

const totals = calculateTotals();

module.exports = {
  transactions,
  cards,
  analytics,
  messages,
  totals
}; 