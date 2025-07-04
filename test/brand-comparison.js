// Example data
const order = {
  cartItems: [{
    product: {
      _id: "67ae4566f24232648060134f",
      name: "Nile prod 3",
      brand: {
        _id: "67ae44f885ac68b2ac95d94e",
        name: "Zalmoka",
        owner: {
          _id: "67aa6ade8149077f5e9d2507",
          name: "owner2"
        }
      }
    },
    quantity: 1,
    price: 10
  }]
};

const ownerBrand = {
  _id: "67ae44f885ac68b2ac95d94e",
  name: "Zalmoka"
};

// Problem demonstration
console.log('\nProblem Demonstration:');
console.log('Brand object as string:', order.cartItems[0].product.brand.toString());
console.log('Owner brand ID as string:', ownerBrand._id.toString());
console.log('Do they match?', order.cartItems[0].product.brand.toString() === ownerBrand._id.toString());

// Solution demonstration
console.log('\nSolution Demonstration:');
console.log('Brand ID as string:', order.cartItems[0].product.brand._id.toString());
console.log('Owner brand ID as string:', ownerBrand._id.toString());
console.log('Do they match?', order.cartItems[0].product.brand._id.toString() === ownerBrand._id.toString());

// Example of how this affects filtering
console.log('\nFiltering Example:');

// Wrong way (problem)
const wrongFilter = order.cartItems.some(item =>
  item.product.brand.toString() === ownerBrand._id.toString()
);
console.log('Wrong filtering result:', wrongFilter);

// Right way (solution)
const correctFilter = order.cartItems.some(item =>
  item.product.brand._id.toString() === ownerBrand._id.toString()
);
console.log('Correct filtering result:', correctFilter); 