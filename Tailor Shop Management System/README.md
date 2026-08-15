# 👔 Tailor Shop Management System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-v6+-13aa52.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

A complete, professional full-stack tailor shop management system built with **React**, **TypeScript**, **Express.js**, and **MongoDB**.

[Features](#-features) • [Installation](#-installation--setup) • [Usage](#-usage-guide) • [API Docs](#-api-endpoints) • [Contributing](#-contributing)

</div>

---

## ✨ Features

<table>
<tr>
<td>

### 👥 **User Management**

- Customer registration & login
- Profile management & editing
- Order history tracking
- Payment method management

</td>
<td>

### 💼 **Employee Management**

- Add, update, delete employees
- Specialization tracking
- Work dashboard & statistics
- Order assignment tracking

</td>
</tr>
<tr>
<td>

### 📦 **Order Management**

- Create & track orders
- Real-time status updates
- Reference image uploads
- Measurement tracking
- Delivery date scheduling

</td>
<td>

### 💳 **Payment Processing**

- Stripe integration
- bKash mobile wallet
- Nagad mobile wallet
- Transaction history
- Receipt generation

</td>
</tr>
<tr>
<td>

### 📊 **Dashboard Analytics**

- Role-based dashboards
- Sales statistics
- Order trends
- Transaction reports
- Employee performance metrics

</td>
<td>

### 🔐 **Security & Access**

- JWT authentication
- Role-based access control
- Password hashing (bcryptjs)
- Protected API endpoints
- Secure file uploads

</td>
</tr>
<tr>
<td colspan="2">

### 🎨 **User Experience**

- Modern UI with Tailwind CSS & DaisyUI
- Dark/Light theme support
- Responsive mobile design with **Sidebar Drawer** and **Card Views**
- Print functionality for receipts
- Real-time notifications

</td>
</tr>
</table>

---

## 📋 Prerequisites

Ensure you have these installed on your system:

| Requirement | Version | Download                                                      |
| ----------- | ------- | ------------------------------------------------------------- |
| **Node.js** | v18+    | [nodejs.org](https://nodejs.org/)                             |
| **npm**     | v9+     | Included with Node.js                                         |
| **MongoDB** | v6+     | [mongodb.com](https://www.mongodb.com/try/download/community) |

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd "Tailor Management"
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install
```

**Create `.env` file** in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=developement

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_min_32_characters
JWT_EXPIRE=7d

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# CORS Configuration
FRONTEND_URL=your_frontend_url_from_render

# Email Configuration
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_app_password
```

**Start MongoDB:**

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

**Start Backend Server:**

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

✅ Backend running on: `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install
```

**Create `.env` file** in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

**Start Frontend Development Server:**

```bash
npm run dev
```

✅ Frontend running on: `http://localhost:5173`

---

## 📁 Project Architecture

```
Tailor Management/
├── 📂 backend/
│   ├── config/
│   │   └── database.js              # MongoDB configuration
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   ├── errorHandler.js          # Error handling middleware
│   │   └── upload.js                # File upload middleware
│   ├── routes/
│   │   ├── auth.js                  # Auth endpoints
│   │   ├── users.js                 # User endpoints
│   │   ├── employees.js             # Employee endpoints
│   │   ├── orders.js                # Order endpoints
│   │   ├── payments.js              # Payment endpoints
│   │   ├── upload.js                # Upload endpoints
│   │   └── dashboard.js             # Dashboard endpoints
│   ├── utils/
│   │   └── emailService.js          # Email notifications
│   ├── server.js                    # Express server
│   ├── package.json
│   └── .env                         # Environment variables
│
├── 📂 frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── services.ts          # API calls
│   │   │   └── mockData.ts          # Mock data
│   │   ├── components/
│   │   │   ├── admin/               # Admin components
│   │   │   ├── auth/                # Auth components
│   │   │   ├── common/              # Shared components
│   │   │   └── user/                # User components
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx      # Auth state
│   │   │   └── ThemeContext.tsx     # Theme state
│   │   ├── pages/                   # Page components
│   │   ├── types/                   # TypeScript types
│   │   └── utils/                   # Utility functions
│   ├── public/                      # Static assets
│   ├── package.json
│   └── vite.config.ts
│
├── 📋 README.md
├── 📋 SETUP_INSTRUCTIONS.md
└── 📋 API_ENDPOINTS.md
```

---

## 🔑 Quick Start - Default Accounts

After initial setup, create accounts via the signup page. For testing, you can use the admin creation script:

```bash
cd backend
npm run create-admin
```

Or manually create in MongoDB:

```javascript
use tailor

// Create Admin Account
db.users.insertOne({
  email: "admin@example.com",
  password: "$2a$10$hashed_password_here",
  fullName: "Admin User",
  phone: "01700123768",
  address: "Dhaka, Bangladesh",
  role: "admin",
  createdAt: new Date()
})
```

**To hash a password:**

```javascript
const bcrypt = require("bcryptjs");
const hashed = bcrypt.hashSync("admin123", 10);
console.log(hashed);
```

---

## 🎯 Usage Guide

### 👤 For Users

| Step | Action             | Location                                                                            |
| ---- | ------------------ | ----------------------------------------------------------------------------------- |
| 1    | **Sign Up**        | `/signup`                                                                           |
| 2    | **Login**          | `/login`                                                                            |
| 3    | **Create Order**   | `/user/orders/new` - Select dress type, enter measurements, choose delivery options |
| 4    | **Make Payment**   | Choose Stripe Card or Mobile Wallet (bKash/Nagad)                                   |
| 5    | **Track Order**    | `/user/orders` - View status updates in real-time                                   |
| 6    | **Manage Profile** | `/user/profile` - Edit information and view order history                           |

### 👷 For Employees

| Action              | Details                                       |
| ------------------- | --------------------------------------------- |
| **Login**           | Use employee credentials                      |
| **View Orders**     | Dashboard displays assigned orders            |
| **Update Status**   | Mark orders as processing/completed/cancelled |
| **View Statistics** | Dashboard shows personal work metrics         |
| **Manage Tasks**    | Accept and update order progress              |

### 🔑 For Admins

| Feature          | Access                | Details                             |
| ---------------- | --------------------- | ----------------------------------- |
| **Dashboard**    | `/admin`              | System-wide statistics & analytics  |
| **Orders**       | `/admin/orders`       | View, manage, and track all orders  |
| **Employees**    | `/admin/employees`    | Add, edit, delete employee accounts |
| **Customers**    | `/admin/customers`    | Manage customer information         |
| **Transactions** | `/admin/transactions` | Financial reports & payment history |
| **Reports**      | `/admin/reports`      | Generate custom reports             |

---

## 🔌 API Endpoints

<details>
<summary><b>📚 Click to expand API documentation</b></summary>

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Employees

- `GET /api/employees` - List all employees
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Orders

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Cancel order
- `GET /api/orders/user/:userId` - Get user's orders

### Payments

- `POST /api/payments/stripe` - Process Stripe payment
- `POST /api/payments/mobile-wallet` - Process mobile wallet payment
- `GET /api/payments/history` - Payment history

### Dashboard

- `GET /api/dashboard/admin` - Admin dashboard stats
- `GET /api/dashboard/employee` - Employee dashboard stats
- `GET /api/dashboard/user` - User dashboard stats

### Upload

- `POST /api/upload` - Upload order reference image
- `DELETE /api/upload/:id` - Delete uploaded file

For complete API documentation, see [API_ENDPOINTS.md](./backend/API_ENDPOINTS.md)

</details>

---

## 🧪 Testing the API

### Using Postman

1. Import API endpoints into Postman
2. Set Base URL: `http://localhost:5000/api`
3. Use the provided endpoints to test

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get Orders (with authentication token)
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Backend Admin UI

Visit `http://localhost:5000` for backend administration interface

---

## 🐛 Troubleshooting

### ❌ MongoDB Connection Issues

```
Error: connect ECONNREFUSED
```

**Solution:**

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

### ❌ Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F
```

### ❌ Frontend Can't Connect to Backend

- Verify backend is running: `http://localhost:5000`
- Check `.env` file: `VITE_API_URL=http://localhost:5000/api`
- Clear browser cache: `Ctrl+Shift+Delete`
- Check browser console for errors

### ❌ Payment Errors

**Stripe Issues:**

- Verify API keys in `.env`
- Test with Stripe test cards: `4242 4242 4242 4242`

**Mobile Wallet Issues:**

- Currently simulated for testing
- Integrate real APIs for production deployment

---

## 🚀 Deployment

### Backend Deployment (Heroku / Railway / Render)

```bash
# Build for production
npm install
npm start

# Using PM2 for production
npm install -g pm2
pm2 start server.js --name tailor-backend
```

### Frontend Deployment (Vercel / Netlify)

```bash
# Build for production
npm run build

# Preview build
npm run preview
```

**Deploy `dist/` folder to:**

- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [GitHub Pages](https://pages.github.com)

---

## 🛡️ Security Best Practices

✅ **Implemented:**

- ✔️ JWT authentication with token expiration
- ✔️ Password hashing with bcryptjs (10 rounds)
- ✔️ Role-based access control (RBAC)
- ✔️ Protected API endpoints
- ✔️ Input validation & sanitization
- ✔️ File upload restrictions

⚠️ **Production Checklist:**

- [ ] Never commit `.env` files
- [ ] Use strong, unique JWT secrets
- [ ] Enable HTTPS/SSL certificates
- [ ] Validate all user inputs
- [ ] Implement rate limiting
- [ ] Use environment-specific configurations
- [ ] Regular security audits
- [ ] Keep dependencies updated

---

## 📚 Documentation

| Document                                                  | Purpose                |
| --------------------------------------------------------- | ---------------------- |
| [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)          | Detailed setup guide   |
| [API_ENDPOINTS.md](./backend/API_ENDPOINTS.md)            | Complete API reference |
| [Frontend Documentation](./frontend/README.md)             | Frontend architecture  |
| [USE_CASE_DIAGRAM.md](./USE_CASE_DIAGRAM.md)              | System use cases       |
| [ACTIVITY_DIAGRAMS.md](./ACTIVITY_DIAGRAMS.md)            | Activity flows         |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)                | Project overview       |

---

## 🛠️ Technology Stack

<table>
<tr>
<td><b>Backend</b></td>
<td><b>Frontend</b></td>
<td><b>Database</b></td>
<td><b>Services</b></td>
</tr>
<tr>
<td>

- Node.js 18+
- Express.js
- MongoDB Native
- JWT (jsonwebtoken)
- bcryptjs
- Multer
- Nodemailer

</td>
<td>

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- DaisyUI
- React Router v7
- React Hot Toast

</td>
<td>

- MongoDB v6+
- Collections:
  - Users
  - Employees
  - Orders
  - Transactions

</td>
<td>

- Stripe API
- Email Service
- File Upload
- JWT Auth
- Mobile Wallets

</td>
</tr>
</table>

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/YourFeature`
3. **Commit** your changes: `git commit -m 'Add YourFeature'`
4. **Push** to branch: `git push origin feature/YourFeature`
5. **Submit** a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 📞 Support & Contact

Having issues? Here are the steps to get help:

1. **Check Documentation** - Review the docs above
2. **Review Logs** - Check server and browser console logs
3. **Search Issues** - Look for similar reported issues
4. **Create Issue** - Open a GitHub issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Screenshots (if applicable)

---

<div align="center">

### Made with ❤️ for Tailor Management

**Last Updated:** January 2026

[⬆ back to top](#-tailor-management-system)

</div>
