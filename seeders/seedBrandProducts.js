import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/productsModel.js";
import Brand from "../models/brandModel.js";
import Category from "../models/categoriesModel.js";
import SubCategory from "../models/subcategoriesModel.js";
import users from "../models/usersModel.js"

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

const productImageURL = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D";

const generateRandomPrice = () => {
  return (Math.random() * (5000 - 100) + 100).toFixed(2);
};

const generateProducts = async (brands, categories) => {
  const products = [];

  for (const brand of brands) {
    for (let i = 0; i < 15; i++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const subcategories = await SubCategory.find({ category: randomCategory._id });

      if (subcategories.length === 0) continue;

      const randomSubCategory = subcategories[Math.floor(Math.random() * subcategories.length)];

      products.push({
        name: `Product ${i + 1} - ${brand.name}`,
        description: `This is a high-quality product from ${brand.name}.`,
        colors: ["Red", "Blue", "Black"],
        sizes: ["S", "M", "L"],
        price: generateRandomPrice(),
        priceAfterDiscount: generateRandomPrice(),
        quantity: Math.floor(Math.random() * 100) + 1,
        coverImage: productImageURL ,
        images: [productImageURL, productImageURL, productImageURL, productImageURL, productImageURL],
        brand: brand._id,
        category: randomCategory._id,
        subcategory: randomSubCategory._id,
      });
    }
  }
  return products;
};

const seedProducts = async () => {
  try {
    await connectDB();

    const brands = await Brand.find();
    const categories = await Category.find();

    if (brands.length === 0 || categories.length === 0) {
      console.log("❌ No brands or categories found. Seed them first!");
      mongoose.connection.close();
      process.exit(1);
    }

    await Product.deleteMany();
    console.log("🗑️ Old products removed");

    const products = await generateProducts(brands, categories);
    await Product.create(products);
    console.log("✅ Products seeded successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedProducts();
