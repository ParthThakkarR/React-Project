const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/product');
const Category = require('./models/categories');

const categoriesData = [
  {
    categoryName: "Fruits",
    categoryImage: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80"
  },
  {
    categoryName: "Vegetables",
    categoryImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80"
  },
  {
    categoryName: "Dairy & Eggs",
    categoryImage: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=400&q=80"
  },
  {
    categoryName: "Nuts & Seeds",
    categoryImage: "https://images.unsplash.com/photo-1508061252966-dfd30f67ea55?auto=format&fit=crop&w=400&q=80"
  },
  {
    categoryName: "Beverages",
    categoryImage: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80"
  }
];

const productsData = [
  {
    name: "Organic Honeycrisp Apples",
    description: "Crisp, sweet, and 100% certified organic fresh apples straight from local orchards.",
    price: 3.99,
    stock: 50,
    category: "Fruits",
    images: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80"],
    rating: 4.8
  },
  {
    name: "Organic Cavendish Bananas",
    description: "Rich in potassium and naturally ripened without synthetic chemicals.",
    price: 1.99,
    stock: 80,
    category: "Fruits",
    images: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80"],
    rating: 4.7
  },
  {
    name: "Organic Wild Blueberries",
    description: "Freshly picked organic blueberries packed with antioxidants and natural flavor.",
    price: 4.99,
    stock: 40,
    category: "Fruits",
    images: ["https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80"],
    rating: 4.9
  },
  {
    name: "Organic Strawberries",
    description: "Juicy, vibrant red organic strawberries grown sustainably without pesticides.",
    price: 4.49,
    stock: 45,
    category: "Fruits",
    images: ["https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80"],
    rating: 4.9
  },
  {
    name: "Organic Hass Avocados",
    description: "Creamy organic Hass avocados, perfect for salads, toast, and guacamole.",
    price: 5.49,
    stock: 60,
    category: "Vegetables",
    images: ["https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80"],
    rating: 4.8
  },
  {
    name: "Organic Fresh Baby Spinach",
    description: "Tender, pre-washed organic baby spinach leaves rich in iron and vitamins.",
    price: 2.99,
    stock: 55,
    category: "Vegetables",
    images: ["https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80"],
    rating: 4.6
  },
  {
    name: "Organic Crisp Carrots",
    description: "Sweet, crunchy organic carrots freshly harvested from certified organic farms.",
    price: 2.49,
    stock: 75,
    category: "Vegetables",
    images: ["https://images.unsplash.com/photo-1598170845058-12ef4a457939?auto=format&fit=crop&w=600&q=80"],
    rating: 4.5
  },
  {
    name: "Organic Broccoli Crowns",
    description: "Nutrient-dense organic broccoli crowns packed with essential vitamins.",
    price: 3.29,
    stock: 35,
    category: "Vegetables",
    images: ["https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80"],
    rating: 4.7
  },
  {
    name: "Organic Vine Tomatoes",
    description: "Vine-ripened organic tomatoes with deep flavor and rich aroma.",
    price: 3.99,
    stock: 50,
    category: "Vegetables",
    images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80"],
    rating: 4.6
  },
  {
    name: "Farm Fresh Organic Eggs (12 pcs)",
    description: "Free-range, pasture-raised organic brown eggs with rich golden yolks.",
    price: 4.99,
    stock: 90,
    category: "Dairy & Eggs",
    images: ["https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80"],
    rating: 4.9
  },
  {
    name: "Grass-Fed Whole Organic Milk",
    description: "Pure organic whole milk from grass-fed cows, pasteurized for freshness.",
    price: 3.79,
    stock: 65,
    category: "Dairy & Eggs",
    images: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80"],
    rating: 4.8
  },
  {
    name: "Organic Raw Whole Almonds",
    description: "Unsalted, raw organic almonds ideal for healthy snacking and homemade almond milk.",
    price: 8.99,
    stock: 40,
    category: "Nuts & Seeds",
    images: ["https://images.unsplash.com/photo-1508061252966-dfd30f67ea55?auto=format&fit=crop&w=600&q=80"],
    rating: 4.9
  },
  {
    name: "Cold-Pressed Organic Green Juice",
    description: "Revitalizing blend of organic kale, green apple, cucumber, lemon, and ginger.",
    price: 5.99,
    stock: 30,
    category: "Beverages",
    images: ["https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80"],
    rating: 4.8
  }
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is missing in .env");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    // Clear existing categories and products
    await Category.deleteMany({});
    console.log("Cleared existing categories.");

    await Product.deleteMany({});
    console.log("Cleared existing products.");

    // Insert categories
    const insertedCategories = await Category.insertMany(categoriesData);
    console.log(`Successfully seeded ${insertedCategories.length} categories.`);

    // Insert products
    const insertedProducts = await Product.insertMany(productsData);
    console.log(`Successfully seeded ${insertedProducts.length} organic food products.`);

    console.log("Database Seeding Completed Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error.message);
    process.exit(1);
  }
}

seedDatabase();
