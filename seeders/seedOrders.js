import dotenv from "dotenv";
import mongoose from "mongoose";
import Order from "../models/ordersModel.js";
import Product from "../models/productsModel.js";
import User from "../models/usersModel.js";
import Category from "../models/categoriesModel.js";
import subCategory from "../models/subcategoriesModel.js"
import brands from "../models/brandModel.js"

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

const getRandomElements = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// generate orders function
const generateOrders = async (users, products) => {
  const orders = [];

  for (let i = 0; i < 50; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomProducts = getRandomElements(products, Math.floor(Math.random() * 3) + 1);

    const cartItems = randomProducts.map(product => ({
      product: product._id,
      quantity: Math.floor(Math.random() * 5) + 1,
      price: product.price,
    }));

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    orders.push({
      user: randomUser._id,
      cartItems,
      totalPrice,
      status: "shipped",
      isPaid: true,
      paidAt: new Date(),
      address: "Test Address, Cairo, Egypt",
    });
  }

  return orders;
};

const seedOrders = async () => {
  try {
    await connectDB();

    const users = await User.find();
    const products = await Product.find();

    if (users.length === 0 || products.length === 0) {
      console.log("❌ No users or products found. Seed them first!");
      mongoose.connection.close();
      process.exit(1);
    }

    await Order.deleteMany();
    console.log("🗑️ Old orders removed");

    const orders = await generateOrders(users, products);
    const savedOrders = await Order.create(orders);

    console.log(`✅ Orders seeded successfully: ${savedOrders.length} orders added.`);

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding orders:", error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedOrders();
