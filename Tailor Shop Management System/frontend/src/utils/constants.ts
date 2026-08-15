// App-wide constants

import type { DressType } from "../types";

export const DRESS_TYPES: { value: DressType; label: string }[] = [
  { value: "panjabi", label: "Panjabi" },
  { value: "shirt", label: "Shirt" },
  { value: "pant", label: "Pant" },
  { value: "kurta", label: "Kurta" },
  { value: "pajama", label: "Pajama" },
  { value: "blazer", label: "Blazer / Coat" },
  { value: "waistcoat", label: "Waistcoat" },
  { value: "salwar_kameez", label: "Salwar Kameez" },
  { value: "lehenga", label: "Lehenga" },
  { value: "saree_blouse", label: "Saree Blouse" },
  { value: "abaya", label: "Abaya / Burkha" },
  { value: "gown", label: "Gown" },
  { value: "skirt", label: "Skirt" },
];

export const MEASUREMENT_FIELDS: Record<DressType, string[]> = {
  panjabi: ["Length", "Shoulder", "Chest", "Sleeve Length", "Collar"],
  shirt: ["Length", "Shoulder", "Chest", "Sleeve Length", "Collar", "Waist"],
  pant: ["Length", "Waist", "Hip", "Thigh", "Bottom", "Knee"],
  kurta: ["Length", "Chest", "Waist", "Hip", "Sleeve Length", "Shoulder"],
  pajama: ["Length", "Waist", "Hip", "Thigh", "Bottom"],
  blazer: [
    "Length",
    "Shoulder",
    "Chest",
    "Waist",
    "Sleeve Length",
    "Hip",
    "Neck",
  ],
  waistcoat: ["Length", "Chest", "Waist", "Shoulder", "Neck"],
  salwar_kameez: [
    "Kameez Length",
    "Bust",
    "Waist",
    "Hip",
    "Shoulder",
    "Sleeve Length",
    "Neck",
    "Salwar Length",
    "Thigh",
    "Bottom",
  ],
  lehenga: [
    "Lehenga Length",
    "Waist",
    "Hip",
    "Bottom Width",
    "Blouse Bust",
    "Blouse Waist",
    "Blouse Sleeve Length",
  ],
  saree_blouse: [
    "Bust",
    "Under Bust",
    "Waist",
    "Shoulder",
    "Sleeve Length",
    "Armhole",
    "Blouse Length",
  ],
  abaya: [
    "Length",
    "Bust",
    "Waist",
    "Hip",
    "Sleeve Length",
    "Shoulder",
    "Neck",
  ],
  gown: [
    "Length",
    "Bust",
    "Waist",
    "Hip",
    "Shoulder",
    "Sleeve Length",
    "Neck",
    "Flare Length",
  ],
  skirt: ["Length", "Waist", "Hip", "Bottom Width"],
};

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "canceled", label: "Canceled" },
  { value: "received", label: "Received" },
  { value: "re-processing", label: "Re-Processing" },
];

// Status transition rules - only allows forward movement
// Format: currentStatus -> [allowedNextStatuses]
export const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ["processing", "canceled"],
  processing: ["completed", "canceled"],
  completed: ["received", "canceled"],
  received: ["re-processing"],
  "re-processing": ["completed", "canceled"],
};

// Get allowed next statuses for a given current status
export const getAllowedNextStatuses = (currentStatus: string): string[] => {
  return STATUS_TRANSITIONS[currentStatus] || [];
};

export const PAYMENT_STATUSES = [
  { value: "paid", label: "Paid" },
  { value: "due", label: "Due" },
  { value: "partial", label: "Partial" },
  { value: "refunded", label: "Refunded" },
];

// Pricing structure: stitching cost per dress type
export const DRESS_STITCHING_PRICE: Record<DressType, number> = {
  panjabi: 800,
  shirt: 600,
  pant: 400,
  kurta: 700,
  pajama: 500,
  blazer: 1200,
  waistcoat: 600,
  salwar_kameez: 900,
  lehenga: 1500,
  saree_blouse: 700,
  abaya: 600,
  gown: 1200,
  skirt: 500,
};

// Fabric options per dress type with prices
export const FABRIC_OPTIONS: Record<
  DressType,
  { value: string; label: string; price: number }[]
> = {
  panjabi: [
    { value: "cotton", label: "Cotton", price: 400 },
    { value: "linen", label: "Linen", price: 600 },
    { value: "silk", label: "Silk", price: 1200 },
    { value: "poly_cotton", label: "Poly Cotton", price: 500 },
  ],
  shirt: [
    { value: "cotton", label: "Cotton", price: 350 },
    { value: "linen", label: "Linen", price: 550 },
    { value: "silk", label: "Silk", price: 1000 },
    { value: "poly_cotton", label: "Poly Cotton", price: 450 },
  ],
  pant: [
    { value: "cotton", label: "Cotton", price: 300 },
    { value: "denim", label: "Denim", price: 700 },
    { value: "wool", label: "Wool", price: 800 },
    { value: "poly_cotton", label: "Poly Cotton", price: 400 },
  ],
  kurta: [
    { value: "cotton", label: "Cotton", price: 400 },
    { value: "linen", label: "Linen", price: 600 },
    { value: "silk", label: "Silk", price: 1200 },
    { value: "cotton_silk_blend", label: "Cotton-Silk Blend", price: 800 },
  ],
  pajama: [
    { value: "cotton", label: "Cotton", price: 300 },
    { value: "poly_cotton", label: "Poly Cotton", price: 350 },
    { value: "silk", label: "Silk", price: 800 },
  ],
  blazer: [
    { value: "wool", label: "Wool", price: 1500 },
    { value: "cotton", label: "Cotton Blend", price: 1000 },
    { value: "silk", label: "Silk Blend", price: 1800 },
  ],
  waistcoat: [
    { value: "cotton", label: "Cotton", price: 400 },
    { value: "silk", label: "Silk", price: 1000 },
    { value: "velvet", label: "Velvet", price: 1200 },
  ],
  salwar_kameez: [
    { value: "cotton", label: "Cotton", price: 500 },
    { value: "linen", label: "Linen", price: 700 },
    { value: "silk", label: "Silk", price: 1500 },
    { value: "chiffon", label: "Chiffon", price: 800 },
  ],
  lehenga: [
    { value: "silk", label: "Silk", price: 2000 },
    { value: "net", label: "Net", price: 1500 },
    { value: "georgette", label: "Georgette", price: 1800 },
    { value: "velvet", label: "Velvet", price: 2200 },
  ],
  saree_blouse: [
    { value: "silk", label: "Silk", price: 900 },
    { value: "cotton", label: "Cotton", price: 500 },
    { value: "chiffon", label: "Chiffon", price: 700 },
    { value: "net", label: "Net", price: 800 },
  ],
  abaya: [
    { value: "crepe", label: "Crepe", price: 600 },
    { value: "nida", label: "Nida", price: 700 },
    { value: "aerobin", label: "Aerobin", price: 800 },
    { value: "rayon", label: "Rayon", price: 550 },
  ],
  gown: [
    { value: "silk", label: "Silk", price: 1500 },
    { value: "satin", label: "Satin", price: 1200 },
    { value: "net", label: "Net", price: 1000 },
    { value: "georgette", label: "Georgette", price: 1100 },
  ],
  skirt: [
    { value: "cotton", label: "Cotton", price: 350 },
    { value: "linen", label: "Linen", price: 500 },
    { value: "silk", label: "Silk", price: 1000 },
    { value: "denim", label: "Denim", price: 600 },
  ],
};
