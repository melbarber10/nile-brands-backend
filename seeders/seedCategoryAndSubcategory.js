import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "../models/categoriesModel.js";
import SubCategory from "../models/subcategoriesModel.js";

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

const categoryImageURL = "https://thumbs.dreamstime.com/b/fashion-boutique-rgb-color-icon-women-stylish-garment-online-store-shopping-mall-category-female-clothes-shoes-accessories-187269539.jpg";

const categoriesData = [
  {
    name: "Fashion",
    categoryImage: categoryImageURL,
    subcategories: [
      "Clothing",
      "Accessories",
      "Footwear",
    ],
  },
  {
    name: "Handicrafts",
    categoryImage: categoryImageURL,
    subcategories: [
      "Home Decor",
      "Artwork",
      "Gifts and Souvenirs",
    ],
  },
  {
    name: "Electronics",
    categoryImage: categoryImageURL,
    subcategories: [
      "Gadgets",
      "Appliances",
      "Accessories",
    ],
  },
  {
    name: "Furniture",
    categoryImage: categoryImageURL,
    subcategories: [
      "Indoor Furniture",
      "Outdoor Furniture",
      "Decor Pieces",
    ],
  },
  {
    name: "Beauty",
    categoryImage: categoryImageURL,
    subcategories: [
      "Skincare",
      "Haircare",
      "Makeup and Accessories",
    ],
  },
  {
    name: "Sports",
    categoryImage: categoryImageURL,
    subcategories: [
      "Fitness Equipment",
      "Outdoor Tools",
      "Sportswear",
    ],
  },
];

const seedCategories = async () => {
  try {
    await connectDB();

    await Category.deleteMany();
    await SubCategory.deleteMany();
    console.log("🗑️ Old categories and subcategories removed");

    for (const categoryData of categoriesData) {
      const category = await Category.create({
        name: categoryData.name,
        categoryImage: categoryData.categoryImage,
      });

      const subcategories = categoryData.subcategories.map((subName) => ({
        name: subName,
        category: category._id,
      }));

      await SubCategory.create(subcategories);
    }

    console.log("✅ Categories and subcategories seeded successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedCategories();
