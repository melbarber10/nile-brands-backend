// Example of daily stats transformation
const dailyStats = {
  "2024-03-01": { sales: 5, revenue: 1000 },
  "2024-03-02": { sales: 3, revenue: 600 },
  "2024-03-03": { sales: 7, revenue: 1400 }
};

// Transform the data
const transformedStats = Object.entries(dailyStats).map(([date, stats]) => ({
  date: new Date(date),
  ...stats
}));

// Print the results
console.log('Original dailyStats:');
console.log(JSON.stringify(dailyStats, null, 2));

console.log('\nTransformed stats:');
transformedStats.forEach(stat => {
  console.log(`\nDate: ${stat.date.toISOString().split('T')[0]}`);
  console.log(`Sales: ${stat.sales}`);
  console.log(`Revenue: $${stat.revenue}`);
}); 