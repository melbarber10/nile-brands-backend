import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/usersModel.js";    
import Brand from "../models/brandModel.js";

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

const generateUniqueTaxID = async () => {
  let taxID;
  let exists = true;

  while (exists) {
    taxID = Math.floor(100000000 + Math.random() * 900000000).toString();  
    exists = await Brand.exists({ taxID });    
  }

  return taxID;
};

const brandLogoURL = "https://www.logologo.com/logos/abstract-isometric-logo-design-free-logo.jpg"; 

const generateBrands = async (owners) => {
  const brands = [];

  for (const [index, owner] of owners.entries()) {
    const taxID = await generateUniqueTaxID(); 

    brands.push({
      name: `Brand ${index + 1}`,
      logo: brandLogoURL,
      description: `This is a description for Brand ${index + 1}. It provides high-quality products.`,
      taxID,
      owner: owner._id,
    });
  }

  return brands;
};
const seedBrands = async () => {
  try {
    await connectDB();

    const owners = await User.find({ role: "owner" });

    if (owners.length === 0) {
      console.log("❌ No owners found. Seed users first!");
      mongoose.connection.close();
      process.exit(1);
    }

    await Brand.deleteMany();
    console.log("🗑️ Old brands removed");

    const brands = await generateBrands(owners);

    await Brand.create(brands);
    console.log("✅ Brands seeded successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding brands:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// تشغيل السكريبت
seedBrands();
