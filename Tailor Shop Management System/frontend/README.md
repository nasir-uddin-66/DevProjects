# Tailor Shop Management System - Frontend

A comprehensive frontend application for managing a tailor shop with multi-role support (User/Customer, Admin, Employee/Tailor). Built with React, TypeScript, and Tailwind CSS.

## Features

### Multi-Role System
- **User (Customer)**: Place orders, view order history, manage profile
- **Admin**: Manage all orders, customers, employees, and transactions
- **Employee/Tailor**: View assigned orders and update order status

### Key Features
- Role-based authentication and protected routes
- Order management with status tracking
- Measurement entry for various dress types
- **Stripe Payment Integration** - Secure payment processing for orders
- **Print Functionality** - Print order details and transaction reports
- Payment status tracking
- Transaction management (Admin)
- Responsive design with Tailwind CSS and DaisyUI
- Mock API for frontend-first development

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **DaisyUI** - UI components
- **React Router 7** - Routing
- **React Hot Toast** - Notifications

## Project Structure

```
frontend/src/
├── api/                    # Mock API services
│   ├── mockData.ts         # Dummy data
│   └── services.ts          # API service functions
├── assets/                 # Static assets (images, icons)
├── components/             # Reusable components
│   ├── admin/              # Admin-specific components
│   ├── auth/               # Authentication components
│   ├── common/             # Shared components
│   ├── employee/           # Employee-specific components
│   └── user/               # User-specific components
├── contexts/               # React contexts
│   └── AuthContext.tsx     # Authentication context
├── pages/                  # Page components
│   ├── admin/              # Admin pages
│   ├── employee/           # Employee pages
│   ├── public/             # Public pages (login, signup, etc.)
│   └── user/               # User pages
├── types/                  # TypeScript type definitions
│   └── index.ts
├── utils/                  # Utility functions
│   ├── constants.ts        # App constants
│   └── helpers.ts          # Helper functions
├── App.tsx                 # Main app component with routing
├── main.tsx                # Entry point
└── index.css               # Global styles
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Authentication

### Test Accounts

**User (Customer):**
- Email: `user@example.com`
- Password: `password123`

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**Employee:**
- Email: `tailor1@example.com`
- Password: `tailor123`

## Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/signup` - Signup page
- `/about` - About page
- `/contact` - Contact page

### User Routes (Protected)
- `/user/dashboard` - User dashboard with order statistics
- `/user/profile` - View profile
- `/user/profile/edit` - Edit profile
- `/user/orders/new` - Create new order
- `/user/orders` - View all orders (with filter tabs)
- `/user/orders/:id` - Order details

### Admin Routes (Protected)
- `/admin/dashboard` - Admin dashboard with statistics
- `/admin/orders` - Manage all orders
- `/admin/orders/:id` - Order details and edit
- `/admin/transactions` - View all transactions and print reports
- `/admin/customers` - Manage customers
- `/admin/employees` - Manage employees

### Employee Routes (Protected)
- `/employee/dashboard` - Employee dashboard
- `/employee/orders` - View assigned orders
- `/employee/orders/:id` - Order details and status update

## Components

### Common Components
- `Layout` - Main layout wrapper with header and sidebar
- `LoadingSpinner` - Loading indicator
- `StatusBadge` - Order/payment status badge
- `EmptyState` - Empty state message
- `Navbar` - Public navigation bar

### Auth Components
- `LoginCard` - Login form
- `SignupCard` - Signup form
- `ProtectedRoute` - Route protection wrapper

### Role-Specific Sidebars
- `UserSidebar` - User navigation sidebar
- `AdminSidebar` - Admin navigation sidebar
- `EmployeeSidebar` - Employee navigation sidebar

## Mock API

The application uses a mock API system for frontend-first development:

- **authService**: Login, signup, get current user
- **orderService**: CRUD operations for orders
- **userService**: User management
- **employeeService**: Employee management

All API calls simulate network delay (300-500ms) for realistic testing.

## Dress Types

The system supports 13 dress types:
- Men's: Panjabi, Shirt, Pant, Kurta, Pajama, Blazer, Waistcoat
- Women's: Salwar Kameez, Lehenga, Saree Blouse, Abaya, Gown, Skirt

Each dress type has specific measurement fields.

## Order Statuses

- **Pending** - Order placed, awaiting processing
- **Processing** - Order being worked on
- **Completed** - Order finished
- **Canceled** - Order canceled
- **Unreceived** - Order completed but not received by customer

## Payment Statuses

- **Paid** - Fully paid
- **Due** - Payment pending
- **Partial** - Partially paid
- **Refunded** - Payment refunded

## Development

### Adding New Features

1. **New Page**: Create in appropriate `pages/` subdirectory
2. **New Component**: Add to appropriate `components/` subdirectory
3. **New Type**: Add to `types/index.ts`
4. **New Route**: Add to `App.tsx` with appropriate `ProtectedRoute`

### Styling

The project uses Tailwind CSS with DaisyUI. Color scheme:
- Primary: `#1fb854` (green)
- Text: `#30ce67` (light green)
- Background: `#282424` (dark gray)
- Header: `#1b1717` (darker gray)

## New Features

### Print Functionality

**Order Details Print:**
- Available on all OrderDetailPage components (User, Admin, Employee)
- Click the "Print" button to print order details and transaction information
- Only the order details section is printed (navigation and buttons are excluded)
- Print section is wrapped in `<div id="print-section">` for easy identification

**Transaction Report Print:**
- Available on Admin Transactions page (`/admin/transactions`)
- Click "Print Report" to print the complete transaction table
- Includes summary totals (Total Revenue, Total Due, Total Amount)

**Usage:**
```typescript
import { printSection } from "../utils/printHelpers";

// Print a section by its ID
<button onClick={() => printSection("print-section")}>
  Print
</button>

// Wrap printable content
<div id="print-section">
  {/* Content to print */}
</div>
```

### Stripe Payment Integration

**Payment Flow:**
1. User fills out the order form on `/user/orders/new`
2. Clicks "Continue to Payment"
3. Stripe payment form appears
4. User enters card details
5. Order is created only after successful payment
6. Order status is set to "paid" automatically

**Current Implementation:**
- Uses mock Stripe integration (no real API calls)
- Mock client secret (will be replaced with backend integration)
- Test card: `4242 4242 4242 4242` (any future date, any CVC)
- 90% success rate for testing purposes

**Stripe Component:**
- Located in `components/common/StripePayment.tsx`
- Accepts: `amount`, `onSuccess`, `onError`, `clientSecret` (optional)
- Styled to match the app's theme

**To Integrate with Real Backend:**
1. Replace mock `stripePromise` with real publishable key
2. Get `clientSecret` from your backend API
3. Update `PaymentForm` to use real `stripe.confirmCardPayment()`
4. Handle real payment intent status

**Example Usage:**
```typescript
<StripePayment
  amount={totalAmount}
  onSuccess={handlePaymentSuccess}
  onError={handlePaymentError}
  clientSecret="pi_xxx_secret_xxx" // From backend
/>
```

### Transaction Management (Admin)

**Features:**
- View all orders with transaction details
- See total revenue, total due, and total amount
- Filter and sort transactions
- Print transaction reports
- Access via `/admin/transactions`

**Transaction Details Shown:**
- Order ID
- Customer Name
- Date
- Total Amount
- Paid Amount
- Due Amount
- Payment Status

## How to Use New Features

### Printing Order Details

1. Navigate to any order detail page (User, Admin, or Employee)
2. Click the "Print" button in the top-right corner
3. A print dialog will open with the order details
4. Select your printer or save as PDF

### Printing Transaction Reports

1. Log in as Admin
2. Navigate to "Transactions" from the sidebar
3. Review the transaction table
4. Click "Print Report" button
5. Print or save the complete transaction report

### Making Payments

1. Log in as a User
2. Go to "Place New Order"
3. Fill out all order details (customer info, measurements, delivery info)
4. Click "Continue to Payment"
5. Enter card details in the Stripe form:
   - Card: `4242 4242 4242 4242`
   - Date: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
6. Click "Pay [Amount]"
7. Order is created automatically after successful payment

**Note:** Currently using mock payment processing. Replace with real Stripe integration when backend is ready.

## Stripe Setup (For Production)

1. Install Stripe packages (already installed):
   ```bash
   npm install @stripe/stripe-js @stripe/react-stripe-js
   ```

2. Get your Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com)

3. Update `components/common/StripePayment.tsx`:
   - Replace mock publishable key with your real key
   - Update `PaymentForm` to use real `clientSecret` from backend
   - Implement real payment confirmation

4. Backend should:
   - Create PaymentIntent and return `clientSecret`
   - Verify payment status
   - Update order payment status

## Future Enhancements

- Backend API integration
- Real-time order status updates
- Real Stripe payment processing (currently mocked)
- Email notifications
- Advanced reporting and analytics
- Image upload to cloud storage
- Export transaction reports as CSV/PDF

## License

This project is for educational/practicum purposes.
