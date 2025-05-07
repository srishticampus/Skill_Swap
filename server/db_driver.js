import mongoose from "mongoose";
import pino from "pino";
import Category from "./models/category.js"; // Import Category model

let logger = pino(); // Move logger declaration to the top

mongoose.connect("mongodb://127.0.0.1:27017/skillswap");
logger.info("Attempting to connect to MongoDB...");

let db = mongoose.connection;

db.on("error", (err) => {
  logger.error("MongoDB connection error:", err);
});

logger.info("Setting up 'open' event listener for MongoDB connection.");
db.once("open", async () => {
  logger.info("MongoDB connection open.");
  await seedDefaultCategories(); // Call seeding function after connection opens
});

const defaultCategories = [
  { value: "programming", label: "Programming" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "writing", label: "Writing" },
];

const seedDefaultCategories = async () => {
  logger.info("Starting to seed default categories...");
  try {
    for (const categoryData of defaultCategories) {
      logger.info(`Checking for category: ${categoryData.label}`);
      const existingCategory = await Category.findOne({ value: categoryData.value });
      if (!existingCategory) {
        // Map the 'label' from defaultCategories to the 'name' field in the Category model
        const newCategory = new Category({ name: categoryData.label, value: categoryData.value });
        await newCategory.save();
        logger.info(`Default category "${categoryData.label}" created.`);
      } else {
        logger.info(`Default category "${categoryData.label}" already exists.`);
      }
    }
    logger.info("Finished seeding default categories.");
  } catch (error) {
    logger.error("Error seeding default categories:", error);
  }
};
 
export default db;
