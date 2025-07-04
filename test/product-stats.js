// Example of product statistics calculation
const ownerBrand = {
  _id: "brand123"
};

const ownerOrders = [
  {
    cartItems: [
      {
        product: {
          _id: "product1",
          brand: "brand123",
          name: "T-Shirt",
          price: 20
        },
        quantity: 2
      },
      {
        product: {
          _id: "product2",
          brand: "brand123",
          name: "Jeans",
          price: 50
        },
        quantity: 1
      }
    ]
  },
  {
    cartItems: [
      {
        product: {
          _id: "product1",
          brand: "brand123",
          name: "T-Shirt",
          price: 20
        },
        quantity: 3
      }
    ]
  }
];

// Calculate product statistics
const productStats = {};
ownerOrders.forEach(order => {
  order.cartItems.forEach(item => {
    if (item.product.brand === ownerBrand._id) {
      if (!productStats[item.product._id]) {
        productStats[item.product._id] = {
          product: item.product,
          salesCount: 0,
          revenue: 0
        };
      }
      productStats[item.product._id].salesCount += item.quantity;
      productStats[item.product._id].revenue += item.product.price * item.quantity;
    }
  });
});

// Sort by performance
const performance = Object.values(productStats)
  .sort((a, b) => b.salesCount - a.salesCount);

// Print the results
console.log('Product Statistics:');
Object.entries(productStats).forEach(([id, stats]) => {
  console.log(`\nProduct: ${stats.product.name}`);
  console.log(`Sales Count: ${stats.salesCount}`);
  console.log(`Revenue: $${stats.revenue}`);
});

console.log('\nProducts Sorted by Sales:');
performance.forEach(stats => {
  console.log(`\nProduct: ${stats.product.name}`);
  console.log(`Sales Count: ${stats.salesCount}`);
  console.log(`Revenue: $${stats.revenue}`);
}); 