// Example of top products transformation
const productStats = {
  "product123": {
    salesCount: 150,
    revenue: 3000
  },
  "product456": {
    salesCount: 75,
    revenue: 1500
  },
  "product789": {
    salesCount: 200,
    revenue: 4000
  },
  "product101": {
    salesCount: 300,
    revenue: 6000
  },
  "product102": {
    salesCount: 50,
    revenue: 1000
  }
};

// Simulate database products
const dbProducts = [
  {
    _id: "product123",
    name: "Premium T-Shirt",
    price: 20,
    coverImage: "tshirt.jpg"
  },
  {
    _id: "product456",
    name: "Classic Jeans",
    price: 50,
    coverImage: "jeans.jpg"
  },
  {
    _id: "product789",
    name: "Running Shoes",
    price: 80,
    coverImage: "shoes.jpg"
  },
  {
    _id: "product101",
    name: "Smart Watch",
    price: 200,
    coverImage: "watch.jpg"
  },
  {
    _id: "product102",
    name: "Baseball Cap",
    price: 25,
    coverImage: "cap.jpg"
  }
];

// Transform and sort products
const topProducts = dbProducts
  .map(product => ({
    productId: product._id,
    salesCount: productStats[product._id.toString()].salesCount,
    revenue: productStats[product._id.toString()].revenue
  }))
  .sort((a, b) => b.salesCount - a.salesCount)
  .slice(0, 5);

// Print the results
console.log('Original Products:');
console.log(JSON.stringify(dbProducts, null, 2));

console.log('\nTop 5 Products (sorted by sales):');
console.log(JSON.stringify(topProducts, null, 2)); 