/**
 * BankDash Frontend Application
 */

// Global state
const state = {
  user: null,
  token: null,
  currentPage: 'dashboard',
  transactions: [],
  cards: [],
  analytics: null,
  messages: []
};

// API base URL
const API_URL = '/api/v1';

// DOM Elements
const dashboardLink = document.querySelector('#dashboard-link');
const transactionsLink = document.querySelector('#transactions-link');
const cardsLink = document.querySelector('#cards-link');
const analyticsLink = document.querySelector('#analytics-link');
const messagesLink = document.querySelector('#messages-link');

const dashboardPage = document.querySelector('#dashboard-page');
const transactionsPage = document.querySelector('#transactions-page');
const cardsPage = document.querySelector('#cards-page');
const analyticsPage = document.querySelector('#analytics-page');
const messagesPage = document.querySelector('#messages-page');

const balanceElement = document.querySelector('#total-balance');
const incomeElement = document.querySelector('#total-income');
const expensesElement = document.querySelector('#total-expenses');
const userNameElement = document.querySelector('#user-name');
const userInitialsElement = document.querySelector('#user-initials');
const logoutButton = document.querySelector('#logout-button');
const notificationBadge = document.querySelector('#notification-badge');

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// API functions
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  let user = null;
  
  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  if (!token) {
    window.location.href = '/login.html';
    return;
  }
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  
  // Add user email to headers if available
  if (user && user.email) {
    defaultOptions.headers['X-User-Email'] = user.email;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...defaultOptions,
    ...options
  });
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
    return;
  }
  
  return response.json();
};

// Data fetching functions
const fetchDashboardData = async () => {
  try {
    const response = await fetchWithAuth('/dashboard');
    
    if (response && response.success) {
      updateDashboardUI(response.data);
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};

const fetchTransactions = async () => {
  try {
    const response = await fetchWithAuth('/transactions');
    
    if (response && response.success) {
      state.transactions = response.data;
      updateTransactionsUI();
    }
  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
};

const fetchCards = async () => {
  try {
    const response = await fetchWithAuth('/cards');
    
    if (response && response.success) {
      state.cards = response.data;
      updateCardsUI();
    }
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
};

const fetchAnalytics = async () => {
  try {
    const response = await fetchWithAuth('/analytics');
    
    if (response && response.success) {
      // Store the analytics data in the state
      state.analytics = response.data;
      
      // Update the analytics UI with the new data
      updateAnalyticsUI();
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
  }
};

const fetchMessages = async () => {
  try {
    const response = await fetchWithAuth('/messages');
    
    if (response && response.success) {
      state.messages = response.data;
      updateMessagesUI();
      updateNotificationBadge();
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

// UI update functions
const updateDashboardUI = (data) => {
  balanceElement.textContent = formatCurrency(data.balance);
  incomeElement.textContent = formatCurrency(data.income);
  expensesElement.textContent = formatCurrency(data.expenses);
  
  // Update recent transactions list
  const recentTransactionsList = document.querySelector('#recent-transactions');
  if (recentTransactionsList && state.transactions.length > 0) {
    recentTransactionsList.innerHTML = '';
    
    state.transactions.slice(0, 5).forEach(transaction => {
      const li = document.createElement('li');
      li.className = 'transaction-item';
      li.innerHTML = `
        <div class="transaction-icon ${transaction.category}"></div>
        <div class="transaction-details">
          <h4>${transaction.name}</h4>
          <p>${formatDate(transaction.date)}</p>
        </div>
        <div class="transaction-amount ${transaction.type}">
          ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
        </div>
      `;
      recentTransactionsList.appendChild(li);
    });
  }
};

const updateTransactionsUI = () => {
  const transactionsList = document.querySelector('#transactions-list');
  if (!transactionsList) return;
  
  transactionsList.innerHTML = '';
  
  state.transactions.forEach(transaction => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="transaction-icon ${transaction.category}"></div>
        <div class="transaction-name">${transaction.name}</div>
      </td>
      <td>${formatDate(transaction.date)}</td>
      <td>${transaction.category}</td>
      <td class="${transaction.type}">${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}</td>
      <td><span class="status ${transaction.status}">${transaction.status}</span></td>
    `;
    transactionsList.appendChild(tr);
  });
};

const updateCardsUI = () => {
  const cardsList = document.querySelector('#cards-list');
  if (!cardsList) return;
  
  cardsList.innerHTML = '';
  
  state.cards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.className = `card ${card.color}`;
    cardElement.innerHTML = `
      <div class="card-type">${card.type}</div>
      <div class="card-number">${card.number}</div>
      <div class="card-details">
        <div class="card-holder">
          <span>Card Holder</span>
          <h4>${card.holderName}</h4>
        </div>
        <div class="card-expiry">
          <span>Expires</span>
          <h4>${card.expiryDate}</h4>
        </div>
      </div>
      <div class="card-balance">
        <span>Balance</span>
        <h3>${formatCurrency(card.balance)}</h3>
      </div>
    `;
    cardsList.appendChild(cardElement);
  });
};

const updateAnalyticsUI = () => {
  if (!state.analytics) return;
  
  // Update monthly spending chart
  const monthlySpendingChart = document.querySelector('#monthly-spending-chart');
  if (monthlySpendingChart) {
    // In a real app, this would use a charting library like Chart.js
    // For this demo, we'll just create a simple representation
    monthlySpendingChart.innerHTML = '';
    
    // Get the maximum amount for scaling the chart
    const maxAmount = Math.max(...state.analytics.monthlySpending.map(item => item.amount));
    
    state.analytics.monthlySpending.forEach(item => {
      const barHeight = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
      const bar = document.createElement('div');
      bar.className = 'chart-bar';
      bar.innerHTML = `
        <div class="bar-value" style="height: ${barHeight}%"></div>
        <div class="bar-label">${item.month}</div>
      `;
      monthlySpendingChart.appendChild(bar);
    });
  }
  
  // Update spending by category
  const categoryList = document.querySelector('#category-spending-list');
  if (categoryList) {
    categoryList.innerHTML = '';
    
    state.analytics.spendingByCategory.forEach(item => {
      const li = document.createElement('li');
      li.className = 'category-item';
      li.innerHTML = `
        <div class="category-name">${item.category}</div>
        <div class="category-bar">
          <div class="category-progress" style="width: ${item.percentage}%"></div>
        </div>
        <div class="category-percentage">${item.percentage}%</div>
        <div class="category-amount">${formatCurrency(item.amount)}</div>
      `;
      categoryList.appendChild(li);
    });
  }
  
  // Update savings goal
  const savingsGoal = document.querySelector('#savings-goal');
  if (savingsGoal && state.analytics.savingsGoal) {
    const { current, target, percentage } = state.analytics.savingsGoal;
    savingsGoal.innerHTML = `
      <div class="goal-progress">
        <div class="progress-bar">
          <div class="progress-value" style="width: ${percentage}%"></div>
        </div>
        <div class="progress-percentage">${percentage}%</div>
      </div>
      <div class="goal-amounts">
        <div class="current-amount">${formatCurrency(current)}</div>
        <div class="target-amount">${formatCurrency(target)}</div>
      </div>
    `;
  }
};

const updateMessagesUI = () => {
  const messagesList = document.querySelector('#messages-list');
  if (!messagesList) return;
  
  messagesList.innerHTML = '';
  
  state.messages.forEach(message => {
    const li = document.createElement('li');
    li.className = `message-item ${message.isRead ? 'read' : 'unread'}`;
    li.innerHTML = `
      <div class="message-sender">${message.sender}</div>
      <div class="message-content">
        <h4>${message.subject}</h4>
        <p>${message.content}</p>
      </div>
      <div class="message-date">${formatDate(message.date)}</div>
    `;
    messagesList.appendChild(li);
    
    // Add click event to mark as read
    li.addEventListener('click', async () => {
      if (!message.isRead) {
        try {
          const response = await fetchWithAuth(`/messages/${message.id}/read`, {
            method: 'PATCH'
          });
          
          if (response && response.success) {
            message.isRead = true;
            li.classList.remove('unread');
            li.classList.add('read');
            updateNotificationBadge();
          }
        } catch (error) {
          console.error('Error marking message as read:', error);
        }
      }
    });
  });
};

const updateNotificationBadge = () => {
  const unreadCount = state.messages.filter(message => !message.isRead).length;
  
  if (unreadCount > 0) {
    notificationBadge.textContent = unreadCount;
    notificationBadge.style.display = 'block';
  } else {
    notificationBadge.style.display = 'none';
  }
};

// Navigation functions
const showPage = (pageName) => {
  // Hide all pages
  dashboardPage.style.display = 'none';
  transactionsPage.style.display = 'none';
  cardsPage.style.display = 'none';
  analyticsPage.style.display = 'none';
  messagesPage.style.display = 'none';
  
  // Remove active class from all links
  dashboardLink.classList.remove('active');
  transactionsLink.classList.remove('active');
  cardsLink.classList.remove('active');
  analyticsLink.classList.remove('active');
  messagesLink.classList.remove('active');
  
  // Show selected page and mark link as active
  switch (pageName) {
    case 'dashboard':
      dashboardPage.style.display = 'block';
      dashboardLink.classList.add('active');
      fetchDashboardData();
      break;
    case 'transactions':
      transactionsPage.style.display = 'block';
      transactionsLink.classList.add('active');
      fetchTransactions();
      break;
    case 'cards':
      cardsPage.style.display = 'block';
      cardsLink.classList.add('active');
      fetchCards();
      break;
    case 'analytics':
      analyticsPage.style.display = 'block';
      analyticsLink.classList.add('active');
      fetchAnalytics();
      break;
    case 'messages':
      messagesPage.style.display = 'block';
      messagesLink.classList.add('active');
      fetchMessages();
      break;
  }
  
  state.currentPage = pageName;
};

// Initialize the application
const initApp = () => {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token || !user) {
    window.location.href = '/login.html';
    return;
  }
  
  // Set user data
  state.user = user;
  state.token = token;
  
  // Update user info in UI
  if (userNameElement) {
    userNameElement.textContent = user.name;
  }
  
  if (userInitialsElement) {
    const initials = user.name.split(' ').map(name => name[0]).join('');
    userInitialsElement.textContent = initials;
  }
  
  // Add event listeners for navigation
  dashboardLink.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('dashboard');
  });
  
  transactionsLink.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('transactions');
  });
  
  cardsLink.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('cards');
  });
  
  analyticsLink.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('analytics');
  });
  
  messagesLink.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('messages');
  });
  
  // Add logout event listener
  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login.html';
    });
  }
  
  // Initial data fetch
  fetchTransactions();
  fetchCards();
  fetchMessages();
  
  // Show dashboard by default
  showPage('dashboard');
};

// Login form handler
const handleLogin = async (e) => {
  e.preventDefault();
  
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const errorMessage = document.querySelector('#error-message');
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/';
    } else {
      errorMessage.textContent = data.message || 'Invalid credentials';
      errorMessage.style.display = 'block';
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.textContent = 'An error occurred. Please try again.';
    errorMessage.style.display = 'block';
  }
};

// Register form handler
const handleRegister = async (e) => {
  e.preventDefault();
  
  const name = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const confirmPassword = document.querySelector('#confirm-password').value;
  const errorMessage = document.querySelector('#error-message');
  
  // Validate passwords match
  if (password !== confirmPassword) {
    errorMessage.textContent = 'Passwords do not match';
    errorMessage.style.display = 'block';
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/';
    } else {
      errorMessage.textContent = data.message || 'Registration failed';
      errorMessage.style.display = 'block';
    }
  } catch (error) {
    console.error('Registration error:', error);
    errorMessage.textContent = 'An error occurred. Please try again.';
    errorMessage.style.display = 'block';
  }
};

// Check which page we're on and initialize accordingly
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#login-form');
  const registerForm = document.querySelector('#register-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  } else if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  } else {
    // We're on the main app page
    initApp();
  }
}); 