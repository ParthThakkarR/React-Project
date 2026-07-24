# 🍏 Organic Food E-Commerce Full-Stack Application

An end-to-end full-stack e-commerce web application specialized in organic food products, fresh fruits, vegetables, dairy, nuts, and natural beverages. Built with Node.js, Express, MongoDB, and React (Vite).

---

## 🏗️ System Architecture

```
                                  +-----------------------+
                                  |     React Frontend    |
                                  |    (Vite, Port 5173)  |
                                  +-----------+-----------+
                                              |
                                              | HTTP / REST API (Axios)
                                              v
                                  +-----------------------+
                                  |     Express Server    |
                                  |     (Node, Port 5000) |
                                  +-----------+-----------+
                                              |
                                              | Mongoose ORM
                                              v
                                  +-----------------------+
                                  |     MongoDB Database  |
                                  |  (Atlas / Local Host) |
                                  +-----------------------+
```

---

## 📂 Project Structure

```text
.
├── backend/                        # Node.js & Express REST API Backend
│   ├── models/                     # Mongoose Data Schemas
│   │   ├── admin.js                # Admin user schema
│   │   ├── cart.js                 # Cart item & user cart schema
│   │   ├── categories.js           # Category schema (categoryName, categoryImage)
│   │   ├── order.js                # Customer order schema
│   │   ├── payment.js              # Payment transactions schema
│   │   ├── product.js              # Product schema (name, price, stock, category, images, rating)
│   │   ├── review.js               # Product review & rating schema
│   │   └── user.js                 # Registered customer schema
│   ├── routes/                     # Express API Route Handlers
│   │   ├── adminRoutes.js          # Admin management API
│   │   ├── cartRoutes.js           # Shopping cart operations
│   │   ├── categoryRoutes.js       # Product category listing
│   │   ├── orderRoutes.js          # Order creation & checkout
│   │   ├── paymentRoutes.js        # Payment handling
│   │   ├── productRoutes.js        # Product catalog & details
│   │   ├── reviewRoutes.js         # Ratings & review operations
│   │   └── userRoutes.js           # Customer registration & authentication
│   ├── .env                        # Environment variables (MONGO_URI, PORT, JWT_SECRET)
│   ├── package.json                # Backend dependencies & npm scripts
│   ├── seed.js                     # Seed script populating organic food data & images
│   └── server.js                   # Express server entry point & MongoDB connection
│
├── React/First/                    # React Frontend (Vite)
│   ├── public/                     # Static assets & images
│   │   └── images/                 # Banner images, category icons, logos
│   ├── src/                        # Source components & pages
│   │   ├── App.jsx                 # Main application router & state
│   │   ├── Banner.jsx              # Hero banner component
│   │   ├── Banner2.jsx             # Promotional sales & discount banners
│   │   ├── Banner3.jsx             # Newsletter banner component
│   │   ├── BestSellingProducts.jsx # Best sellers product section
│   │   ├── Cart.jsx                # Shopping cart page & checkout flow
│   │   ├── Category.jsx            # Dynamic category carousel slider
│   │   ├── DisplayProducts.jsx     # Category-filtered & product listing page
│   │   ├── FeaturedProducts.jsx    # Featured organic produce section
│   │   ├── Footer.jsx              # Main footer component
│   │   ├── Login.jsx               # User authentication (Login / Signup)
│   │   ├── Navbar.jsx              # Top navigation bar
│   │   ├── OrderPlaced.jsx         # Order confirmation success page
│   │   ├── OrdersPage.jsx          # User order history page
│   │   └── PopularProduct.jsx      # Popular products & just-arrived section
│   ├── package.json                # Frontend dependencies
│   └── vite.config.js              # Vite configuration
│
├── .gitignore                      # Git ignore rules for node_modules, build & env files
├── run_project.bat                 # One-click Windows batch launcher script
└── README.md                       # Comprehensive project documentation
```

---

## ⚡ Quick Start (One-Click Launcher)

To install dependencies and start both backend and frontend automatically:

Double-click **`run_project.bat`** (or **`start.bat`**).

This batch script will automatically:
1. Check & install backend npm packages (`backend/node_modules`).
2. Check & install frontend npm packages (`React/First/node_modules`).
3. Start the Express server on `http://localhost:5000`.
4. Start the Vite dev server on `http://localhost:5173`.
5. Open your default web browser to `http://localhost:5173`.

---

## ⚙️ Manual Setup & Execution

### 1. Backend Setup
```bash
cd backend
npm install
node seed.js     # Seeds database with organic fruits, vegetables & produce
npm start        # Launches backend REST API on port 5000
```

### 2. Frontend Setup
In a new terminal window:
```bash
cd React/First
npm install
npm run dev      # Launches React app on port 5173
```

---

## 🔑 Environment Configuration (`backend/.env`)

Configure your MongoDB database connection in `backend/.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
```

*Note: You can also use a local MongoDB instance: `mongodb://127.0.0.1:27017/ecommerce`.*

---

## 📊 Database Seeding (`backend/seed.js`)

To populate or reset your MongoDB database with fresh organic food items:

```bash
cd backend
npm run seed
```

This populates:
- **5 Categories**: Fruits, Vegetables, Dairy & Eggs, Nuts & Seeds, Beverages.
- **13 Organic Food Products**: Complete with titles, descriptions, prices, stock counts, ratings, and Unsplash images.

---

## 🌐 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch all products |
| `GET` | `/api/products/:id` | Fetch product by ID |
| `GET` | `/api/categories` | Fetch all product categories |
| `POST` | `/api/users/register` | Register new customer account |
| `POST` | `/api/users/login` | Authenticate customer & generate JWT |
| `GET` | `/api/cart/:userId` | Get user shopping cart items |
| `POST` | `/api/cart/add` | Add product to cart |
| `DELETE` | `/api/cart/remove` | Remove item from cart |
| `POST` | `/api/orders` | Place new order |
| `GET` | `/api/orders/:userId` | Get user order history |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router v7, Bootstrap 5, Swiper, Axios, React Icons
- **Backend**: Node.js, Express.js, Mongoose ORM, JSON Web Tokens (JWT), BcryptJS, CORS, Dotenv
- **Database**: MongoDB (Atlas Cloud / Local MongoDB)
