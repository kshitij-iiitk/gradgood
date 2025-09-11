import mongoose from "mongoose";
import User from "./models/user.model.js"; 
import Item from "./models/item.model.js";
import { faker } from '@faker-js/faker';

const MONGO_URI = "mongodb+srv://kshitijrphutane:0UvydycrLRfPMwna@clusternull.95xcazy.mongodb.net/?retryWrites=true&w=majority&appName=Clusternull";
if (!MONGO_URI) {
  throw new Error("MONGODB_URI environment variable is not set.");
}

// Indian first names
const firstNames = [
  "Kshitij","Arjun","Ravi","Priya","Ananya","Siddharth",
  "Vikram","Lakshmi","Divya","Nithya","Harsha","Keerthi",
  "Suman","Manoj","Sahana","Raghav","Meera","Aditya",
  "Varun","Tejas","Sneha","Aditi","Rahul","Anjali"
];

// Branches
const branches = ["BEC", "BCS", "BCY", "BCD"];

// Weighted item types: cheap gadgets more frequent
const itemTypesWeighted = [
  "Books","Books","Books","Calculator","Calculator",
  "Stationery","Stationery","Bag","Laptop","Cycle"
];

// Generate users
function generateUsers(num: number) {
  const users: any[] = [];
  for (let i = 0; i < num; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const year = 20 + Math.floor(Math.random() * 6); // 2020–2025
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const rollNumber = Math.floor(10 + Math.random() * 990); // 2–3 digits
    const email = `${firstName.toLowerCase()}${year}${branch}${rollNumber}@iiitkottayam.ac.in`;

    const phoneNumber = `9${Math.floor(100000000 + Math.random() * 899999999)}`;
    users.push({
      userName: firstName,
      rollNumber: `CS${rollNumber}`,
      email,
      phoneNumber,
      password: "password123",
      profilePic: `https://avatars.dicebear.com/api/initials/${firstName}.svg`,
      isGoogleUser: false,
      gPayID:"kshitijrphutane@okhdfcbank",
    });
  }
  return users;
}

// Generate items
const generateItems = (users: any[], numPerUser = 20) => {
  const items: any[] = [];
  for (const user of users) {
    for (let i = 0; i < numPerUser; i++) {
      const type = itemTypesWeighted[Math.floor(Math.random() * itemTypesWeighted.length)];
      let price = 0;

      // Cheap vs expensive item prices
      if (["Books","Calculator","Stationery","Bag"].includes(type)) {
        price = Math.floor(Math.random() * 500) + 20; // 20–520
      } else if (type === "Laptop") {
        price = Math.floor(Math.random() * 10000) + 15000; // 15k–25k
      } else if (type === "Cycle") {
        price = Math.floor(Math.random() * 2000) + 5000; // 5k–7k
      }

      items.push({
        itemName: `${type} - ${faker.word.adjective()}`,
        belongTo: user._id,
        userName: user.userName,
        phoneNumber: user.phoneNumber,
        photo: [`https://picsum.photos/200?random=${Math.floor(Math.random() * 5000)}`],
        price,
        description: faker.lorem.sentence(),
        type: [type],
      });
    }
  }
  return items;
};

const seed = async () => {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("Connected");

  console.log("Clearing old data...");
  await User.deleteMany({});
  await Item.deleteMany({});
  console.log("Old data cleared");

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB. Seeding complete!");
};

seed().catch(console.error);
