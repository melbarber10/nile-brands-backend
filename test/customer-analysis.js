// Example demonstrating how previous and returning customers are calculated
const mockOrders = [
  {
    _id: '1',
    user: { _id: 'user1' },
    createdAt: new Date('2025-02-01T20:42:05.349Z'),  // February 1st with specific time
    cartItems: [{
      product: {
        brand: { _id: 'brand1' }
      }
    }]
  },
  {
    _id: '2',
    user: { _id: 'user2' },
    createdAt: new Date('2025-02-15T20:42:05.349Z'),  // February 15th
    cartItems: [{
      product: {
        brand: { _id: 'brand1' }
      }
    }]
  },
  {
    _id: '3',
    user: { _id: 'user1' }, // Same user as order 1
    createdAt: new Date('2025-03-10T20:42:05.349Z'),  // March 10th
    cartItems: [{
      product: {
        brand: { _id: 'brand1' }
      }
    }]
  },
  {
    _id: '4',
    user: { _id: 'user3' },
    createdAt: new Date('2025-03-11T20:42:05.349Z'),  // March 11th
    cartItems: [{
      product: {
        brand: { _id: 'brand1' }
      }
    }]
  }
];

// Create a date with specific time
const createDateWithTime = (dateString) => {
  const date = new Date(dateString);
  date.setUTCHours(20, 42, 5, 349);  // Set specific time: 20:42:05.349
  return date;
};

// Set our date range (example: analyzing March 1-31)
const startDate = createDateWithTime('2025-03-01');
const endDate = createDateWithTime('2025-03-31');

// Split orders into previous and recent
const previousOrders = mockOrders.filter(order => order.createdAt < startDate);
const recentOrders = mockOrders.filter(order =>
  order.createdAt >= startDate && order.createdAt <= endDate
);

// Get unique customers from recent orders
const uniqueCustomers = new Set(
  recentOrders.map(order => order.user._id)
);

// Get customers who ordered before the start date
const previousCustomers = new Set(
  previousOrders.map(order => order.user._id)
);

// Find returning customers (customers who ordered both before and during the period)
const returningCustomers = new Set(
  [...uniqueCustomers].filter(userId => previousCustomers.has(userId))
);

console.log({
  dateRange: {
    start: startDate.toISOString(),
    end: endDate.toISOString()
  },
  orderCounts: {
    previous: previousOrders.length,
    recent: recentOrders.length
  },
  customerAnalysis: {
    uniqueCustomers: [...uniqueCustomers],
    previousCustomers: [...previousCustomers],
    returningCustomers: [...returningCustomers],
    stats: {
      totalCustomers: uniqueCustomers.size,
      returningCustomers: returningCustomers.size,
      newCustomers: uniqueCustomers.size - returningCustomers.size
    }
  }
}); 