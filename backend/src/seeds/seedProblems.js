import problems from "./problem.seeds.js";
import { Problem } from "../models/problems.model.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../db/index_db.js";

dotenv.config({
  path: "./.env",
});

const seedProblems = async () => {
  try {
    (await connectDB(), await Problem.deleteMany({}));
    await Problem.insertMany(problems);
    console.log("Seeding successful");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    await mongoose.connection.close();
    console.log("Seeding error:", error);
    process.exit(1);
  }
};
seedProblems();
