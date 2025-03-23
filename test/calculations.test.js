/**
 * Unit tests for calculation utility functions
 */

const calculations = require('../src/utils/calculations');

// Sample test data
const testTransactions = [
  {
    id: 't1',
    type: 'income',
    name: 'Salary',
    amount: 3000,
    date: '2023-05-15T10:30:00',
    category: 'salary'
  },
  {
    id: 't2',
    type: 'expense',
    name: 'Rent',
    amount: 1200,
    date: '2023-05-01T09:00:00',
    category: 'housing'
  },
  {
    id: 't3',
    type: 'expense',
    name: 'Groceries',
    amount: 200,
    date: '2023-05-05T15:45:00',
    category: 'food'
  },
  {
    id: 't4',
    type: 'expense',
    name: 'Dining Out',
    amount: 100,
    date: '2023-05-10T20:30:00',
    category: 'food'
  },
  {
    id: 't5',
    type: 'income',
    name: 'Freelance',
    amount: 500,
    date: '2023-05-20T14:00:00',
    category: 'freelance'
  }
];

describe('Calculation Utilities', () => {
  describe('calculateTotalIncome', () => {
    test('should calculate total income correctly', () => {
      const result = calculations.calculateTotalIncome(testTransactions);
      expect(result).toBe(3500); // 3000 + 500
    });

    test('should return 0 if no transactions', () => {
      const result = calculations.calculateTotalIncome([]);
      expect(result).toBe(0);
    });

    test('should return 0 if transactions is not an array', () => {
      const result = calculations.calculateTotalIncome(null);
      expect(result).toBe(0);
    });
  });

  describe('calculateTotalExpenses', () => {
    test('should calculate total expenses correctly', () => {
      const result = calculations.calculateTotalExpenses(testTransactions);
      expect(result).toBe(1500); // 1200 + 200 + 100
    });

    test('should return 0 if no transactions', () => {
      const result = calculations.calculateTotalExpenses([]);
      expect(result).toBe(0);
    });

    test('should return 0 if transactions is not an array', () => {
      const result = calculations.calculateTotalExpenses(null);
      expect(result).toBe(0);
    });
  });

  describe('calculateBalance', () => {
    test('should calculate balance correctly', () => {
      const result = calculations.calculateBalance(testTransactions);
      expect(result).toBe(2000); // 3500 - 1500
    });

    test('should return 0 if no transactions', () => {
      const result = calculations.calculateBalance([]);
      expect(result).toBe(0);
    });

    test('should return 0 if transactions is not an array', () => {
      const result = calculations.calculateBalance(null);
      expect(result).toBe(0);
    });
  });

  describe('calculateSpendingByCategory', () => {
    test('should calculate spending by category correctly', () => {
      const result = calculations.calculateSpendingByCategory(testTransactions);
      expect(result).toEqual({
        housing: 1200,
        food: 300 // 200 + 100
      });
    });

    test('should return empty object if no transactions', () => {
      const result = calculations.calculateSpendingByCategory([]);
      expect(result).toEqual({});
    });

    test('should return empty object if transactions is not an array', () => {
      const result = calculations.calculateSpendingByCategory(null);
      expect(result).toEqual({});
    });
  });

  describe('calculateMonthlySpending', () => {
    test('should calculate monthly spending correctly', () => {
      // All test transactions are in May 2023
      const result = calculations.calculateMonthlySpending(testTransactions, 2023);
      
      // Check that May has the correct total and other months are 0
      expect(result.May).toBe(1500); // 1200 + 200 + 100
      expect(result.Jan).toBe(0);
      expect(result.Feb).toBe(0);
      expect(result.Mar).toBe(0);
      expect(result.Apr).toBe(0);
      expect(result.Jun).toBe(0);
      expect(result.Jul).toBe(0);
      expect(result.Aug).toBe(0);
      expect(result.Sep).toBe(0);
      expect(result.Oct).toBe(0);
      expect(result.Nov).toBe(0);
      expect(result.Dec).toBe(0);
    });

    test('should return all zeros if no transactions in the specified year', () => {
      const result = calculations.calculateMonthlySpending(testTransactions, 2022);
      
      // All months should be 0 since our test data is for 2023
      Object.values(result).forEach(value => {
        expect(value).toBe(0);
      });
    });

    test('should return empty object if transactions is not an array', () => {
      const result = calculations.calculateMonthlySpending(null);
      expect(result).toEqual({});
    });
  });
}); 