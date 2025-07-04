import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/usersModel.js"; 

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

const userImageURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8AJM9wkP__z2M-hovSAWcTb_9XJ6smy3NKw&s";

const generateUsers = async () => {
  const users = [];

  for (let i = 1; i <= 50; i++) {
    users.push({
      name: `User ${i}`,
      email: `user${i}@gmail.com`,
      userImage: userImageURL,
      password: "password123",
      role: "user",
    });
  }

  for (let i = 1; i <= 10; i++) {
    users.push({
      name: `Owner ${i}`,
      email: `owner${i}@gmail.com`,
      userImage: userImageURL,
      password: "password123",
      role: "owner",
    });
  }

  users.push({
    name: "Admin",
    email: "admin@gmail.com",
    userImage: userImageURL,
    password: "admin123",
    role: "admin",
  });

  return users;
};

const seedUsers = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    console.log("🗑️ Old users removed");

    const users = await generateUsers();

    await User.create(users);
    console.log("✅ Users seeded successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedUsers();
