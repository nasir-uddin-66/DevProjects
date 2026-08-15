// TypeScript type definitions

export type UserRole = "user" | "admin" | "employee";

export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "canceled"
  | "received"
  | "re-processing";

export type PaymentStatus = "paid" | "due" | "partial" | "refunded";

export type DeliveryMethod = "pickup" | "home_delivery";

export type UrgencyLevel = "normal" | "urgent" | "express";

export type DressType =
  | "panjabi"
  | "shirt"
  | "pant"
  | "kurta"
  | "pajama"
  | "blazer"
  | "waistcoat"
  | "salwar_kameez"
  | "lehenga"
  | "saree_blouse"
  | "abaya"
  | "gown"
  | "skirt";

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
  role: UserRole;
  createdAt: string;
}

export interface Measurement {
  [key: string]: number; // e.g., { "Length": 40, "Chest": 38 }
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  dressType: DressType;
  measurements: Measurement;
  deliveryDate: string;
  urgency: UrgencyLevel;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string;
  additionalNotes?: string;
  referenceImage?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  paidAmount: number;
  assignedEmployeeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
  role: "employee";
  specialization?: string;
  createdAt: string;
}
