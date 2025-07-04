// Example of product performance sorting
const productStats = {
  "product1": {
    salesCount: 150,
    revenue: 3000
  },
  "product2": {
    salesCount: 75,
    revenue: 1500
  },
  "product3": {
    salesCount: 200,
    revenue: 4000
  },
  "product4": {
    salesCount: 50,
    revenue: 1000
  }
};

// Convert to array and sort by salesCount
const performance = Object.values(productStats)
  .sort((a, b) => b.salesCount - a.salesCount);

// Print the results
console.log('Products sorted by sales count (highest to lowest):');
performance.forEach((product, index) => {
  console.log(`\nRank ${index + 1}:`);
  console.log(`Sales Count: ${product.salesCount}`);
  console.log(`Revenue: $${product.revenue}`);
}); 