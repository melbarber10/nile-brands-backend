// Example of popular products query
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
  }
};

// Simulate database products
const dbProducts = [
  {
    _id: "product123",
    name: "Premium T-Shirt",
    price: 20,
    coverImage: "tshirt.jpg",
    description: "A comfortable cotton t-shirt",
    category: "Clothing"
  },
  {
    _id: "product456",
    name: "Classic Jeans",
    price: 50,
    coverImage: "jeans.jpg",
    description: "Durable denim jeans",
    category: "Clothing"
  },
  {
    _id: "product789",
    name: "Running Shoes",
    price: 80,
    coverImage: "shoes.jpg",
    description: "Professional running shoes",
    category: "Footwear"
  }
];

// Simulate the query
const popularProductIds = Object.keys(productStats);
const popularProducts = dbProducts
  .filter(product => popularProductIds.includes(product._id))
  .map(product => ({
    name: product.name,
    price: product.price,
    coverImage: product.coverImage
  }));

// Print the results
console.log('Product Stats:');
console.log(JSON.stringify(productStats, null, 2));

console.log('\nPopular Product IDs:', popularProductIds);

console.log('\nPopular Products (with selected fields):');
console.log(JSON.stringify(popularProducts, null, 2)); 