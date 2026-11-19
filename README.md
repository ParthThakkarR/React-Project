# 🍏 Organic Food E-Commerce Platform

A full-stack MERN e-commerce application for organic food — fresh fruits, vegetables, dairy, nuts, and natural beverages. Built with a React 18 + Vite storefront and an Express 5 + MongoDB REST API.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)

> **Project status:** Active development. The core customer journey — browse → add to cart → checkout → order history — works end to end. The admin dashboard, live payment gateway, and automated test suites are not implemented yet. See [Known gaps](#known-gaps-and-roadmap) for the honest production-readiness checklist.

---

## ✨ Highlights

- **End-to-end shopping flow** — category browsing, product quantities, cart persistence, checkout, order confirmation, and order history.
- **JWT authentication** — registration and login with bcrypt password hashing, a 1-hour token, and protected client-side routes.
- **Normalized data layer** — 8 Mongoose models covering users, admins, categories, products, carts, orders, payments, and reviews.
- **Server-side cart pricing** — the add-to-cart path derives totals from live product prices instead of trusting the client.
- **Seeded demo catalog** — 5 categories and 13 organic products, ready in one command.
- **One-click Windows setup** — a batch launcher installs both workspaces, starts the API and Vite server, and opens the storefront.

---

## 🧺 Features

### Customer storefront

- Responsive landing page with hero banners, promotional sections, and category carousels.
- Category-based product listing (`/products/:categoryName`) with an "all products" view.
- Quantity selector and add-to-cart action with login enforcement.
- Persistent cart with quantity updates, item removal, subtotal, flat shipping, and total.
- Checkout that creates an order, clears the cart, and redirects to a confirmation page.
- Order history with status, line items, quantities, prices, and order dates.
- Login/signup form with first name, last name, email, password, phone, and address.

### API and data

- 35 route handlers across 8 resource groups.
- Password hashing with `bcryptjs` (10 salt rounds).
- JWT verification middleware for user reads and cart access.
- Product filtering by category.
- Models and routes scaffolded for payments, reviews, and admin accounts.
- Seed script that resets and repopulates categories and products.

---

## 🛠️ Tech stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, React Router 7, Bootstrap 5, Swiper, Axios, React Icons |
| **Backend** | Node.js, Express 5, Mongoose 9, JSON Web Tokens, bcryptjs, CORS, dotenv |
| **Database** | MongoDB Atlas or a local MongoDB instance |
| **Tooling** | ESLint, npm, Vite build, Windows batch launcher |

---

## 🏗️ Architecture

```text
┌──────────────────────────────┐
│        React Frontend        │
│   Vite · React Router 7      │
│        localhost:5173        │
└──────────────┬───────────────┘
               │  HTTP / REST (Axios)
               │  Authorization: Bearer <JWT>
               ▼
┌──────────────────────────────┐
│        Express Server        │
│   Routes → Models → Logic    │
│        localhost:5000        │
└──────────────┬───────────────┘
               │  Mongoose ODM
               ▼
┌──────────────────────────────┐
│           MongoDB            │
│      Atlas or localhost      │
└──────────────────────────────┘
```

**Request flow:** React Router renders a page → Axios calls the REST API → Express validates the route and JWT (where required) → Mongoose reads or writes MongoDB → JSON response updates React state.

---

## 📂 Project structure

```text
.
├── backend/                         # Express REST API
│   ├── models/                      # 8 Mongoose schemas
│   │   ├── admin.js
│   │   ├── cart.js
│   │   ├── categories.js
│   │   ├── order.js
│   │   ├── payment.js
│   │   ├── product.js
│   │   ├── review.js
│   │   └── user.js
│   ├── routes/                      # API route handlers
│   │   ├── adminRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── productRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example                 # Environment template (safe to commit)
│   ├── package.json
│   ├── seed.js                      # Resets and seeds categories + products
│   └── server.js                    # App entry point and MongoDB connection
│
├── React/First/                     # React + Vite storefront
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── assets/                  # Banners, product images, icons
│   │   ├── pages/                   # Placeholder pages for future routes
│   │   ├── App.jsx                  # Routing, auth state, protected routes
│   │   ├── Cart.jsx                 # Cart, totals, checkout
│   │   ├── DisplayProducts.jsx      # Category and all-product listing
│   │   ├── Login.jsx                # Login and signup form
│   │   ├── Navbar.jsx
│   │   ├── OrdersPage.jsx           # Order history
│   │   ├── OrderPlaced.jsx          # Confirmation page
│   │   └── ...                      # Home sections and banners
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── run_project.bat                  # One-click Windows launcher
├── start.bat                        # Shortcut to the launcher
└── README.md
```

---

## 🚀 Getting started

### Prerequisites

- **Node.js 18+** and npm
- **MongoDB** — either a free MongoDB Atlas cluster or a local `mongod` instance
- Windows is only required for the one-click `.bat` launcher; the app runs anywhere with Node.js

### Option A — One-click Windows launch

Double-click **`run_project.bat`** (or `start.bat`). It will:

1. Install backend dependencies if `backend/node_modules` is missing.
2. Install frontend dependencies if `React/First/node_modules` is missing.
3. Start the Express API on `http://localhost:5000`.
4. Start the Vite dev server on `http://localhost:5173`.
5. Open the storefront in your default browser.

> Create `backend/.env` before the first run — see [Environment variables](#environment-variables). The launcher does not create it for you.

### Option B — Manual setup

**1. Clone the repository**

```bash
git clone https://github.com/ParthThakkarR/React-Project.git
cd React-Project
```

**2. Configure the backend**

```bash
cd backend
npm install
cp .env.example .env        # macOS/Linux
copy .env.example .env      # Windows
```

Edit `.env` with your MongoDB URI and a strong JWT secret.

**3. Seed the catalog**

```bash
npm run seed
```

This clears the existing categories and products, then inserts 5 categories and 13 products.

**4. Start the API**

```bash
npm start
# Server running on port 5000
```

**5. Start the storefront** (new terminal)

```bash
cd React/First
npm install
npm run dev
# Vite dev server on http://localhost:5173
```

---

<a id="environment-variables"></a>
## 🔑 Environment variables

Create `backend/.env` from `backend/.env.example`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=replace_with_a_long_random_secret
```

| Variable | Required | Purpose |
| :--- | :--- | :--- |
| `MONGO_URI` | Yes | MongoDB Atlas or local connection string |
| `PORT` | No | API port (defaults to `5000`) |
| `JWT_SECRET` | Yes | Signs and verifies authentication tokens |

Local MongoDB example:

```env
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
```

> `backend/.env` is gitignored. Never commit real credentials or production secrets.

---

## 🌐 API reference

**Base URL:** `http://localhost:5000/api`

Protected routes expect:

```http
Authorization: Bearer <token>
```

Tokens are issued by `/api/users/login` and `/api/users/register` and expire after **1 hour**.

### Users and authentication

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/users/register` | Public | Create an account, create an empty cart, return a JWT |
| `POST` | `/users/login` | Public | Verify credentials, return a JWT and user ID |
| `GET` | `/users` | Bearer | List users |
| `GET` | `/users/:id` | Bearer | Get a user by ID |
| `PUT` | `/users/:id` | Bearer | Update a user |
| `DELETE` | `/users/:id` | Bearer | Delete a user |

### Catalog

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/products` | Public | List all products |
| `GET` | `/products/:id` | Public | Get a product by ID |
| `GET` | `/products/category/:categoryName` | Public | List products in a category |
| `POST` | `/products` | Public ⚠️ | Create a product |
| `PUT` | `/products/:id` | Public ⚠️ | Update a product |
| `DELETE` | `/products/:id` | Public ⚠️ | Delete a product |
| `GET` | `/categories` | Public | List all categories |
| `POST` | `/categories` | Public ⚠️ | Create a category |

### Cart and orders

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/cart/user/:userId` | Bearer | Get the authenticated user's cart (`:userId` is ignored; the token identity is used) |
| `POST` | `/cart` | Public ⚠️ | Add or merge items and recompute `totalPrice` |
| `PUT` | `/cart` | Public ⚠️ | Replace cart items |
| `DELETE` | `/cart` | Bearer | Delete the authenticated user's cart |
| `POST` | `/orders/place` | Public ⚠️ | Create an order |
| `GET` | `/orders/:userId` | Public ⚠️ | List orders for a user |

### Scaffolded resources

These API groups have models and routes but are **not wired into the storefront yet**.

| Resource | Routes | Auth | Notes |
| :--- | :--- | :--- | :--- |
| **Payments** | `GET /payments`, `GET /payments/:orderId`, `POST /payments`, `DELETE /payments/:orderId` | Public ⚠️ | Records payment metadata; no gateway integration |
| **Reviews** | `GET /reviews`, `GET /reviews/product/:id`, `POST /reviews`, `DELETE /reviews/:id` | Public | Rating and review records; no review UI yet |
| **Admins** | `GET /admins`, `GET /admins/:id`, `POST /admins`, `PUT /admins/:id`, `DELETE /admins/:id` | Public ⚠️ | Admin accounts; no role-based access control or dashboard |

⚠️ = intentionally marked as a security or production-readiness gap. See [Known gaps](#known-gaps-and-roadmap).

---

## 🗃️ Data model

| Model | Key fields |
| :--- | :--- |
| **User** | `firstName`, `lastName`, `email` (unique), `password` (hashed), `phone`, `addresses` |
| **Admin** | `adminName`, `adminPassword`, `adminPhone`, `adminEmail` |
| **Category** | `categoryName`, `categoryImage` |
| **Product** | `name`, `description`, `price`, `stock`, `category`, `images[]`, `rating` |
| **Cart** | `userId`, `items[{ _id, quantity }]`, `totalPrice` |
| **Order** | `userId`, `items[{ productId, quantity, price }]`, `totalAmount`, `orderStatus`, `createdAt` |
| **Payment** | `orderId`, `paymentMethod`, `amount`, `transactionId`, `paymentDate` |
| **Review** | `productId`, `userId`, `rating`, `review`, `createdAt` |

---

## 📜 Available scripts

### Backend (`backend/`)

| Command | Description |
| :--- | :--- |
| `npm start` | Start the Express API |
| `npm run dev` | Start the API (same as `start`) |
| `npm run seed` | Reset and seed categories and products |
| `npm test` | Not configured yet |

### Frontend (`React/First/`)

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## 🔐 Security posture

### Implemented

- Passwords are hashed with `bcryptjs` before storage.
- JWTs are signed with `JWT_SECRET` and expire after 1 hour.
- JWT verification middleware protects user reads and cart read/delete operations.
- Client routes `/cart`, `/orders`, and `/order-placed` redirect unauthenticated users to `/login`.
- Secrets are kept in gitignored `.env` files.

### Known gaps

- **CORS is fully open** (`app.use(cors())`), suitable for local development only.
- **Several write APIs are unauthenticated** — product CRUD, admin CRUD, payments, reviews, order placement, and cart mutations.
- **No role-based authorization** — admin records exist, but no admin-only middleware or UI.
- **Checkout is a simulation** — order creation and cart clearing work, but card fields are UI-only and no payment provider is called.
- **JWT is stored in `localStorage`**, which is readable by injected scripts; an httpOnly-cookie flow would be safer.
- **Client-side trust** — the frontend sends the order total; it should be recomputed from product prices on the server before saving.
- **`PUT /api/cart` replaces items without recomputing `totalPrice`**; only `POST /api/cart` does.
- **No request validation layer, rate limiting, or automated tests yet.**
- **A few scaffolded handlers still need cleanup** — `GET /api/cart` and `GET /api/categories/category/:categoryName` reference models without importing them, and `GET /api/admins/:id` calls `findOne(id)` instead of `findById(id)`.

---

<a id="known-gaps-and-roadmap"></a>
## 🗺️ Known gaps & roadmap

- [ ] Add role-based admin authentication and an admin dashboard for products, categories, orders, and users.
- [ ] Integrate a real payment provider (Stripe or Razorpay) with server-side amount calculation and webhook verification.
- [ ] Add request validation (Zod or Joi), centralized error handling, and rate limiting.
- [ ] Recompute cart and order totals on the server for every mutation.
- [ ] Move JWTs to httpOnly cookies with refresh-token rotation; restrict CORS to trusted origins.
- [ ] Protect all write endpoints and add integration tests for authentication and checkout.
- [ ] Add product search, wishlist, and a review UI.
- [ ] Replace the client-side `mongoose` import used for ObjectId validation with a lightweight check.
- [ ] Add pagination and database indexes for product listing.
- [ ] Add Jest/Supertest for the API and Vitest/React Testing Library for the UI, plus a CI workflow.
- [ ] Containerize with Docker and add deployment configuration.

---

## 📄 Resume-ready summary

### Project entry (copy/paste)

```text
Organic Food E-Commerce Platform | React, Node.js, Express, MongoDB, JWT | 2026
```

### Bullet points

- Built a full-stack MERN e-commerce platform with a React 18 + Vite storefront and an Express 5 REST API spanning 35 route handlers across 8 resource groups.
- Implemented JWT authentication with bcrypt password hashing, protected client routes, and persistent login state.
- Designed 8 Mongoose models for users, admins, categories, products, carts, orders, payments, and reviews; seeded a 5-category, 13-product demo catalog.
- Delivered the complete shopping flow — category browsing, cart quantity management, checkout, order confirmation, and order history.
- Automated local onboarding with a Windows batch launcher that installs both workspaces and starts the API and frontend together.
- Documented the architecture, API contract, data model, security posture, and a prioritized production-readiness roadmap.

### Interview talking points

- **Data modeling:** why carts store product references plus quantities, and why orders snapshot unit prices.
- **Auth tradeoffs:** JWT in `localStorage` versus httpOnly cookies, token expiry, and what is still missing for production.
- **Trust boundaries:** why the server must recompute totals instead of trusting the client-supplied checkout amount.
- **Next iteration:** role-based admin access, payment webhooks, validation, tests, and CI.

> Add measurable outcomes you can verify — Lighthouse score, API response time, catalog size, or test coverage — before using these bullets on a resume.

---

## 👤 Author

**Parth Thakkar**

- GitHub: [@ParthThakkarR](https://github.com/ParthThakkarR)
- Repository: [ParthThakkarR/React-Project](https://github.com/ParthThakkarR/React-Project)

---

## 📄 License

No license has been added yet. Add a `LICENSE` file if you plan to distribute or open-source this project.
