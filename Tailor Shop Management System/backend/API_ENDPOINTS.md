# API Endpoints Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "01700123766",
  "address": "Dhaka, Bangladesh"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "fullName": "John Doe",
    "phone": "01700123766",
    "address": "Dhaka, Bangladesh",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

---

### POST `/api/auth/login`
Login and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

---

### GET `/api/auth/me`
Get current authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "user"
  }
}
```

---

## 👥 User Endpoints

### GET `/api/users`
Get all users (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "...",
    "email": "user@example.com",
    "fullName": "John Doe",
    "phone": "01700123766",
    "address": "Dhaka, Bangladesh",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### GET `/api/users/:id`
Get user by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "...",
  "email": "user@example.com",
  "fullName": "John Doe",
  "phone": "01700123766",
  "address": "Dhaka, Bangladesh",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### PUT `/api/users/:id`
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fullName": "John Updated",
  "phone": "01700123767",
  "address": "New Address"
}
```

**Response:**
```json
{
  "_id": "...",
  "email": "user@example.com",
  "fullName": "John Updated",
  "phone": "01700123767",
  "address": "New Address",
  "role": "user",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

---

### DELETE `/api/users/:id`
Delete user (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

## 👔 Employee Endpoints

### GET `/api/employees`
Get all employees (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "...",
    "email": "tailor@example.com",
    "fullName": "Karim Tailor",
    "phone": "01700123769",
    "address": "Dhaka, Bangladesh",
    "role": "employee",
    "specialization": "Men's Wear",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### GET `/api/employees/:id`
Get employee by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "...",
  "email": "tailor@example.com",
  "fullName": "Karim Tailor",
  "phone": "01700123769",
  "address": "Dhaka, Bangladesh",
  "role": "employee",
  "specialization": "Men's Wear",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### POST `/api/employees`
Create new employee (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "email": "tailor@example.com",
  "password": "password123",
  "fullName": "Karim Tailor",
  "phone": "01700123769",
  "address": "Dhaka, Bangladesh",
  "specialization": "Men's Wear"
}
```

**Response:**
```json
{
  "message": "Employee created successfully",
  "employee": {
    "_id": "...",
    "email": "tailor@example.com",
    "fullName": "Karim Tailor",
    "role": "employee",
    "specialization": "Men's Wear",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### PUT `/api/employees/:id`
Update employee.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fullName": "Updated Name",
  "specialization": "Women's Wear"
}
```

**Response:**
```json
{
  "_id": "...",
  "email": "tailor@example.com",
  "fullName": "Updated Name",
  "specialization": "Women's Wear",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

---

### DELETE `/api/employees/:id`
Delete employee (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Employee deleted successfully"
}
```

---

## 📦 Order Endpoints

### GET `/api/orders`
Get orders (filtered by role).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Filter by status (pending, processing, completed, canceled, received)

**Response:**
```json
[
  {
    "_id": "...",
    "userId": "user_id",
    "customerName": "John Doe",
    "customerEmail": "user@example.com",
    "customerPhone": "01700123766",
    "customerAddress": "Dhaka, Bangladesh",
    "dressType": "panjabi",
    "measurements": {
      "Length": 40,
      "Chest": 38
    },
    "deliveryDate": "2024-02-15T00:00:00.000Z",
    "urgency": "normal",
    "deliveryMethod": "home_delivery",
    "deliveryAddress": "Dhaka, Bangladesh",
    "status": "pending",
    "paymentStatus": "paid",
    "totalAmount": 2500,
    "paidAmount": 2500,
    "assignedEmployeeId": null,
    "createdAt": "2024-01-25T00:00:00.000Z",
    "updatedAt": "2024-01-25T00:00:00.000Z"
  }
]
```

---

### GET `/api/orders/:id`
Get order by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "...",
  "userId": "user_id",
  "customerName": "John Doe",
  "dressType": "panjabi",
  "status": "pending",
  "paymentStatus": "paid",
  "totalAmount": 2500,
  "paidAmount": 2500
}
```

---

### POST `/api/orders`
Create new order (User only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "customerName": "John Doe",
  "customerEmail": "user@example.com",
  "customerPhone": "01700123766",
  "customerAddress": "Dhaka, Bangladesh",
  "dressType": "panjabi",
  "measurements": {
    "Length": 40,
    "Chest": 38
  },
  "deliveryDate": "2024-02-15",
  "urgency": "normal",
  "deliveryMethod": "home_delivery",
  "deliveryAddress": "Dhaka, Bangladesh",
  "additionalNotes": "Please make it comfortable",
  "referenceImage": "url_or_base64",
  "totalAmount": 2500,
  "paidAmount": 2500
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "order": {
    "_id": "...",
    "userId": "user_id",
    "status": "pending",
    "paymentStatus": "paid",
    "createdAt": "2024-01-25T00:00:00.000Z"
  }
}
```

---

### PUT `/api/orders/:id`
Update order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "processing",
  "assignedEmployeeId": "employee_id",
  "paidAmount": 2500
}
```

**Response:**
```json
{
  "message": "Order updated successfully",
  "order": {
    "_id": "...",
    "status": "processing",
    "assignedEmployeeId": "employee_id",
    "updatedAt": "2024-01-26T00:00:00.000Z"
  }
}
```

---

### DELETE `/api/orders/:id`
Delete order (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Order deleted successfully"
}
```

---

## 💳 Payment Endpoints

### POST `/api/payments/stripe/create-intent`
Create Stripe payment intent.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": 2500,
  "orderId": "order_id_optional"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

---

### POST `/api/payments/stripe/confirm`
Confirm Stripe payment.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx",
  "orderId": "order_id_optional"
}
```

**Response:**
```json
{
  "message": "Payment confirmed",
  "paymentIntent": {
    "id": "pi_xxx",
    "amount": 2500,
    "status": "succeeded"
  }
}
```

---

### POST `/api/payments/mobile-wallet`
Process mobile wallet payment (bKash/Nagad).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "walletNumber": "01700123766",
  "pin": "1234",
  "paymentMethod": "bkash",
  "amount": 2500,
  "orderId": "order_id_optional"
}
```

**Response:**
```json
{
  "message": "Payment of ৳2500 successful via BKASH",
  "transactionId": "TXN1234567890",
  "amount": 2500,
  "paymentMethod": "bkash"
}
```

---

## 📤 Upload Endpoints

### POST `/api/upload/image`
Upload image file.

**Headers:** `Authorization: Bearer <token>`

**Request:** `multipart/form-data`
- `image`: File

**Response:**
```json
{
  "message": "File uploaded successfully",
  "filename": "order-1234567890.jpg",
  "path": "/uploads/order-1234567890.jpg",
  "url": "http://localhost:5000/uploads/order-1234567890.jpg"
}
```

---

## 📊 Dashboard Endpoints

### GET `/api/dashboard/stats`
Get dashboard statistics (role-based).

**Headers:** `Authorization: Bearer <token>`

**Response (Admin):**
```json
{
  "totalOrders": 100,
  "pendingOrders": 20,
  "processingOrders": 15,
  "completedOrders": 50,
  "canceledOrders": 5,
  "receivedOrders": 10,
  "totalCustomers": 50,
  "totalEmployees": 5,
  "totalRevenue": 125000,
  "totalDue": 25000,
  "totalAmount": 150000
}
```

**Response (Employee):**
```json
{
  "assignedOrders": 10,
  "pendingOrders": 3,
  "processingOrders": 5,
  "completedOrders": 2
}
```

**Response (User):**
```json
{
  "totalOrders": 5,
  "pendingOrders": 1,
  "processingOrders": 1,
  "completedOrders": 2,
  "canceledOrders": 0,
  "receivedOrders": 1,
  "totalAmountSpent": 12500,
  "totalAmountPaid": 10000
}
```

---

## Health Check

### GET `/api/health`
Check server status.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

