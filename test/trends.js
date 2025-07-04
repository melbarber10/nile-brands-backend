// Example of trends calculation and formatting
const ownerOrders = [
  {
    createdAt: new Date('2024-03-01T10:30:00'),
    totalPrice: 100
  },
  {
    createdAt: new Date('2024-03-01T15:45:00'),
    totalPrice: 150
  },
  {
    createdAt: new Date('2024-03-02T09:15:00'),
    totalPrice: 200
  },
  {
    createdAt: new Date('2024-03-03T14:20:00'),
    totalPrice: 300
  },
  {
    createdAt: new Date('2024-03-03T16:30:00'),
    totalPrice: 250
  }
];

// Calculate trends
const trends = {};
ownerOrders.forEach(order => {
  const date = order.createdAt.toISOString().split('T')[0];
  if (!trends[date]) {
    trends[date] = { sales: 0, revenue: 0 };
  }
  trends[date].sales += 1;
  trends[date].revenue += order.totalPrice;
});

// Print the results
console.log('Daily Trends:');
for (const [date, data] of Object.entries(trends)) {
  console.log(`${date}: ${data.sales} sales, $${data.revenue} revenue`);
} 