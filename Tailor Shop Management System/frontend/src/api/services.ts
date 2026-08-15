// API service functions - connecting to backend API

import type { User, Order, Employee, UserRole, OrderStatus } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to get auth token
const getToken = (): string | null => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.token || null;
    } catch {
      return null;
    }
  }
  return null;
};

// Helper function for API calls
const apiCall = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<any> => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth Services
export const authService = {
  async login(email: string, password: string): Promise<User> {
    const data = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Transform _id to id for consistency
    const user = {
      ...data.user,
      id: data.user._id,
      token: data.token,
    };
    localStorage.setItem("user", JSON.stringify(user));

    return { ...data.user, id: data.user._id };
  },

  async signup(
    email: string,
    password: string,
    fullName: string,
    phone: string,
    address: string,
  ): Promise<User> {
    const data = await apiCall("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, fullName, phone, address }),
    });

    // Transform _id to id for consistency
    const user = {
      ...data.user,
      id: data.user._id,
      token: data.token,
    };
    localStorage.setItem("user", JSON.stringify(user));

    return { ...data.user, id: data.user._id };
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const data = await apiCall("/auth/me");
      // Transform _id to id for consistency
      return { ...data.user, id: data.user._id };
    } catch {
      return null;
    }
  },
};

// Order Services
export const orderService = {
  async getOrders(userId?: string, role?: UserRole): Promise<Order[]> {
    const queryParams = role === "admin" ? "" : `?status=all`;
    const data = await apiCall(`/orders${queryParams}`);

    // Transform MongoDB _id to id and format dates
    return data.map((order: any) => ({
      ...order,
      id: order._id,
      userId: order.userId,
      assignedEmployeeId: order.assignedEmployeeId || undefined,
      deliveryDate: order.deliveryDate
        ? new Date(order.deliveryDate).toISOString().split("T")[0]
        : order.deliveryDate,
      createdAt: order.createdAt
        ? new Date(order.createdAt).toISOString()
        : order.createdAt,
      updatedAt: order.updatedAt
        ? new Date(order.updatedAt).toISOString()
        : order.updatedAt,
    }));
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const data = await apiCall(`/orders/${orderId}`);
      return {
        ...data,
        id: data._id,
        userId: data.userId,
        assignedEmployeeId: data.assignedEmployeeId || undefined,
        deliveryDate: data.deliveryDate
          ? new Date(data.deliveryDate).toISOString().split("T")[0]
          : data.deliveryDate,
        createdAt: data.createdAt
          ? new Date(data.createdAt).toISOString()
          : data.createdAt,
        updatedAt: data.updatedAt
          ? new Date(data.updatedAt).toISOString()
          : data.updatedAt,
      };
    } catch {
      return null;
    }
  },

  async createOrder(
    order: Omit<Order, "id" | "createdAt" | "updatedAt">,
  ): Promise<Order> {
    const data = await apiCall("/orders", {
      method: "POST",
      body: JSON.stringify(order),
    });

    return {
      ...data.order,
      id: data.order._id,
      userId: data.order.userId,
      assignedEmployeeId: data.order.assignedEmployeeId || undefined,
      deliveryDate: data.order.deliveryDate
        ? new Date(data.order.deliveryDate).toISOString().split("T")[0]
        : data.order.deliveryDate,
      createdAt: data.order.createdAt
        ? new Date(data.order.createdAt).toISOString()
        : data.order.createdAt,
      updatedAt: data.order.updatedAt
        ? new Date(data.order.updatedAt).toISOString()
        : data.order.updatedAt,
    };
  },

  async updateOrder(
    orderId: string,
    updates: Partial<Order>,
  ): Promise<Order | null> {
    try {
      const data = await apiCall(`/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });

      return {
        ...data.order,
        id: data.order._id,
        userId: data.order.userId,
        assignedEmployeeId: data.order.assignedEmployeeId || undefined,
        deliveryDate: data.order.deliveryDate
          ? new Date(data.order.deliveryDate).toISOString().split("T")[0]
          : data.order.deliveryDate,
        createdAt: data.order.createdAt
          ? new Date(data.order.createdAt).toISOString()
          : data.order.createdAt,
        updatedAt: data.order.updatedAt
          ? new Date(data.order.updatedAt).toISOString()
          : data.order.updatedAt,
      };
    } catch {
      return null;
    }
  },

  async getOrdersByStatus(
    status: OrderStatus,
    userId?: string,
    role?: UserRole,
  ): Promise<Order[]> {
    const queryParams = `?status=${status}`;
    const data = await apiCall(`/orders${queryParams}`);

    return data.map((order: any) => ({
      ...order,
      id: order._id,
      userId: order.userId,
      assignedEmployeeId: order.assignedEmployeeId || undefined,
      deliveryDate: order.deliveryDate
        ? new Date(order.deliveryDate).toISOString().split("T")[0]
        : order.deliveryDate,
      createdAt: order.createdAt
        ? new Date(order.createdAt).toISOString()
        : order.createdAt,
      updatedAt: order.updatedAt
        ? new Date(order.updatedAt).toISOString()
        : order.updatedAt,
    }));
  },
};

// User Services
export const userService = {
  async getUsers(): Promise<User[]> {
    const data = await apiCall("/users");
    return data.map((user: any) => ({
      ...user,
      id: user._id,
      createdAt: user.createdAt
        ? new Date(user.createdAt).toISOString()
        : user.createdAt,
    }));
  },

  async getUserById(userId: string): Promise<User | null> {
    try {
      const data = await apiCall(`/users/${userId}`);
      return {
        ...data,
        id: data._id,
        createdAt: data.createdAt
          ? new Date(data.createdAt).toISOString()
          : data.createdAt,
      };
    } catch {
      return null;
    }
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const data = await apiCall(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    return {
      ...data,
      id: data._id,
      createdAt: data.createdAt
        ? new Date(data.createdAt).toISOString()
        : data.createdAt,
    };
  },

  async deleteUser(userId: string): Promise<boolean> {
    try {
      await apiCall(`/users/${userId}`, {
        method: "DELETE",
      });
      return true;
    } catch {
      return false;
    }
  },
};

// Employee Services
export const employeeService = {
  async getEmployees(): Promise<Employee[]> {
    const data = await apiCall("/employees");
    return data.map((emp: any) => ({
      ...emp,
      id: emp._id,
      createdAt: emp.createdAt
        ? new Date(emp.createdAt).toISOString()
        : emp.createdAt,
    }));
  },

  async getEmployeeById(employeeId: string): Promise<Employee | null> {
    try {
      const data = await apiCall(`/employees/${employeeId}`);
      return {
        ...data,
        id: data._id,
        createdAt: data.createdAt
          ? new Date(data.createdAt).toISOString()
          : data.createdAt,
      };
    } catch {
      return null;
    }
  },

  async createEmployee(
    employee: Omit<Employee, "id" | "createdAt">,
  ): Promise<Employee> {
    const data = await apiCall("/employees", {
      method: "POST",
      body: JSON.stringify(employee),
    });

    return {
      ...data.employee,
      id: data.employee._id,
      createdAt: data.employee.createdAt
        ? new Date(data.employee.createdAt).toISOString()
        : data.employee.createdAt,
    };
  },

  async updateEmployee(
    employeeId: string,
    updates: Partial<Employee>,
  ): Promise<Employee | null> {
    try {
      const data = await apiCall(`/employees/${employeeId}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      return {
        ...data,
        id: data._id,
        createdAt: data.createdAt
          ? new Date(data.createdAt).toISOString()
          : data.createdAt,
      };
    } catch {
      return null;
    }
  },

  async deleteEmployee(employeeId: string): Promise<boolean> {
    try {
      await apiCall(`/employees/${employeeId}`, {
        method: "DELETE",
      });
      return true;
    } catch {
      return false;
    }
  },
};

// Payment Services
export const paymentService = {
  async createStripeIntent(
    amount: number,
    orderId?: string,
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    return apiCall("/payments/stripe/create-intent", {
      method: "POST",
      body: JSON.stringify({ amount, orderId }),
    });
  },

  async confirmStripePayment(
    paymentIntentId: string,
    orderId?: string,
  ): Promise<any> {
    return apiCall("/payments/stripe/confirm", {
      method: "POST",
      body: JSON.stringify({ paymentIntentId, orderId }),
    });
  },

  async processMobileWallet(
    paymentMethod: "bkash" | "nagad",
    amount: number,
    transactionId: string,
    orderId?: string,
  ): Promise<any> {
    return apiCall("/payments/mobile-wallet", {
      method: "POST",
      body: JSON.stringify({
        paymentMethod,
        amount,
        transactionId,
        orderId,
      }),
    });
  },
};

// Upload Service
export const uploadService = {
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const token = getToken();
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return {
      url: data.url,
      filename: data.filename,
    };
  },
};
