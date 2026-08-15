// User NewOrderPage - create new order

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Layout from "../../components/common/Layout";
import UserSidebar from "../../components/user/UserSidebar";
import StripePayment from "../../components/common/StripePayment";
import MobileWalletPayment from "../../components/common/MobileWalletPayment";
import bkashLogo from "../../assets/icons/bkash-logo.png";
import nagadLogo from "../../assets/icons/nagad-logo.png";
import { useAuth } from "../../contexts/AuthContext";
import { orderService, uploadService } from "../../api/services";
import {
  DRESS_TYPES,
  MEASUREMENT_FIELDS,
  DRESS_STITCHING_PRICE,
  FABRIC_OPTIONS,
} from "../../utils/constants";
import type {
  DressType,
  Measurement,
  UrgencyLevel,
  DeliveryMethod,
} from "../../types";
import shirt from "../../assets/dresses/shirt.jpg";
import punjabi from "../../assets/dresses/punjabi.png";
import pant from "../../assets/dresses/pant.jpg";
import coat from "../../assets/dresses/coat.jpg";
import waistcoat from "../../assets/dresses/waistcoat.jpeg";
import kurta from "../../assets/dresses/kurta.jpg";
import pajama from "../../assets/dresses/pajama.jpg";
import salwark from "../../assets/dresses/salwarkameej.jpg";
import lehenga from "../../assets/dresses/lehenga.jpg";
import skirt from "../../assets/dresses/shkirt.png";
import blouse from "../../assets/dresses/blouse.png";
import gown from "../../assets/dresses/gown.png";
import borkha from "../../assets/dresses/borkha.png";

const dressImages: Record<DressType, string> = {
  panjabi: punjabi,
  shirt: shirt,
  pant: pant,
  kurta: kurta,
  pajama: pajama,
  blazer: coat,
  waistcoat: waistcoat,
  salwar_kameez: salwark,
  lehenga: lehenga,
  saree_blouse: blouse,
  abaya: borkha,
  gown: gown,
  skirt: skirt,
};

export default function NewOrderPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dressType, setDressType] = useState<DressType>("panjabi");
  const [measurements, setMeasurements] = useState<Measurement>({});
  const [deliveryType, setDeliveryType] = useState<DeliveryMethod>("pickup");
  const [selectedFabric, setSelectedFabric] = useState<string>("cotton");
  const [preview, setPreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: user?.fullName || "",
    customerEmail: user?.email || "",
    customerPhone: user?.phone || "",
    customerAddress: user?.address || "",
    deliveryDate: "",
    urgency: "normal" as UrgencyLevel,
    deliveryAddress: "",
    additionalNotes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "stripe" | "bkash" | "nagad"
  >("stripe");
  const [totalAmount, setTotalAmount] = useState(0);
  const [priceBreakdown, setPriceBreakdown] = useState({
    fabricCost: 0,
    stitchingCost: 0,
    urgencyMultiplier: 1,
  });

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedFormData = localStorage.getItem("newOrderFormData");
    const savedMeasurements = localStorage.getItem("newOrderMeasurements");
    const savedDressType = localStorage.getItem("newOrderDressType");
    const savedFabric = localStorage.getItem("newOrderFabric");
    const savedDeliveryType = localStorage.getItem("newOrderDeliveryType");

    if (savedFormData) setFormData(JSON.parse(savedFormData));
    if (savedMeasurements) setMeasurements(JSON.parse(savedMeasurements));
    if (savedDressType) setDressType(JSON.parse(savedDressType));
    if (savedFabric) setSelectedFabric(JSON.parse(savedFabric));
    if (savedDeliveryType) setDeliveryType(JSON.parse(savedDeliveryType));
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("newOrderFormData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("newOrderMeasurements", JSON.stringify(measurements));
  }, [measurements]);

  useEffect(() => {
    localStorage.setItem("newOrderDressType", JSON.stringify(dressType));
  }, [dressType]);

  useEffect(() => {
    localStorage.setItem("newOrderFabric", JSON.stringify(selectedFabric));
  }, [selectedFabric]);

  useEffect(() => {
    localStorage.setItem("newOrderDeliveryType", JSON.stringify(deliveryType));
  }, [deliveryType]);

  // Calculate total amount with breakdown
  const calculateTotal = () => {
    // Get stitching cost for dress type
    const stitchingCost = DRESS_STITCHING_PRICE[dressType] || 800;

    // Get fabric cost
    const fabricOptions = FABRIC_OPTIONS[dressType] || [];
    const selectedFabricOption = fabricOptions.find(
      (f) => f.value === selectedFabric,
    );
    const fabricCost = selectedFabricOption?.price || 400;

    // Calculate urgency multiplier
    const urgencyMultiplier =
      formData.urgency === "urgent"
        ? 1.2
        : formData.urgency === "express"
          ? 1.5
          : 1;

    // Total = (fabric + stitching) * urgency multiplier
    const subtotal = fabricCost + stitchingCost;
    const total = Math.round(subtotal * urgencyMultiplier);

    // Update price breakdown
    setPriceBreakdown({
      fabricCost,
      stitchingCost,
      urgencyMultiplier,
    });

    return total;
  };

  // Update total amount when urgency, dress type, or fabric changes
  useEffect(() => {
    setTotalAmount(calculateTotal());
  }, [formData.urgency, dressType, selectedFabric]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleMeasurementChange = (field: string, value: string) => {
    setMeasurements({ ...measurements, [field]: parseFloat(value) || 0 });
  };

  const handleFormValidation = () => {
    // Check if all required fields are filled
    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerPhone ||
      !formData.customerAddress ||
      !formData.deliveryDate ||
      Object.keys(measurements).length === 0
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }

    // Validate delivery date is at least 3 days in the future
    const threeDoHence = new Date();
    threeDoHence.setDate(threeDoHence.getDate() + 3);

    const selectedDate = new Date(formData.deliveryDate);

    if (selectedDate < threeDoHence) {
      toast.error("Delivery date must be at least 3 days from today");
      return false;
    }

    return true;
  };

  const handlePaymentSuccess = async () => {
    if (!createdOrderId) {
      toast.error("Order ID not found");
      return;
    }

    // Payment is already confirmed by payment service
    // Order payment status will be updated by the payment service
    toast.success("Payment successful! Order created.");

    // Add a small delay to ensure backend has processed the payment
    await new Promise((resolve) => setTimeout(resolve, 1000));

    navigate("/user/orders");
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate form
    if (!handleFormValidation()) {
      return;
    }

    // Calculate and update total amount
    const calculatedTotal = calculateTotal();
    setTotalAmount(calculatedTotal);

    // Create order first (without payment), then show payment
    setSubmitting(true);
    try {
      // Upload image if exists
      let imageUrl = preview || undefined;
      if (imageFile) {
        setUploadingImage(true);
        try {
          const uploadResult = await uploadService.uploadImage(imageFile);
          imageUrl = uploadResult.url;
        } catch (error) {
          console.error("Image upload failed:", error);
          toast.error("Image upload failed");
        } finally {
          setUploadingImage(false);
        }
      }

      // Create order with payment status "due" initially
      const order = await orderService.createOrder({
        userId: user.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        dressType,
        measurements,
        deliveryDate: formData.deliveryDate,
        urgency: formData.urgency,
        deliveryMethod: deliveryType,
        deliveryAddress:
          deliveryType === "home_delivery"
            ? formData.deliveryAddress
            : undefined,
        additionalNotes: formData.additionalNotes || undefined,
        referenceImage: imageUrl,
        status: "pending",
        paymentStatus: "due",
        totalAmount: calculatedTotal,
        paidAmount: 0,
      });

      setCreatedOrderId(order.id);
      setShowPayment(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to create order");
      console.error("Error creating order:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout sidebar={<UserSidebar />} title="">
      <div className="min-h-screen bg-[#1b1717] py-12 px-5">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-linear-to-r from-[#1fb854] to-[#178a3f] rounded-t-xl p-8 text-white">
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
              <i className="fa-solid fa-shirt"></i>
              Create New Order
            </h1>
            <p className="text-white opacity-90">
              Fill in your details and measurements to place an order
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-[#282424] border border-[#1fb854] rounded-b-xl p-8">
            <form onSubmit={handleSubmit}>
              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                {/* Customer Information Section */}
                <div className="bg-[#1b1717] p-6 rounded-lg border border-[#1fb854]">
                  <h2 className="text-[#54c07a] font-bold text-lg mb-6 flex items-center gap-2">
                    <i className="fa-solid fa-user"></i>
                    Customer Information
                  </h2>
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="text-[#30ce67] font-semibold text-sm block mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-[#282424] border-2 border-[#1fb854] rounded-lg text-[#30ce67] focus:outline-none focus:border-[#54c07a] transition placeholder:text-[#30ce67] placeholder:opacity-50"
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-[#30ce67] font-semibold text-sm block mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 bg-[#282424] border-2 border-[#1fb854] rounded-lg text-[#30ce67] focus:outline-none focus:border-[#54c07a] transition placeholder:text-[#30ce67] placeholder:opacity-50"
                        value={formData.customerEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerEmail: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-[#30ce67] font-semibold text-sm block mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 bg-[#282424] border-2 border-[#1fb854] rounded-lg text-[#30ce67] focus:outline-none focus:border-[#54c07a] transition placeholder:text-[#30ce67] placeholder:opacity-50"
                        value={formData.customerPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerPhone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="text-[#30ce67] font-semibold text-sm block mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-[#282424] border-2 border-[#1fb854] rounded-lg text-[#30ce67] focus:outline-none focus:border-[#54c07a] transition placeholder:text-[#30ce67] placeholder:opacity-50"
                        value={formData.customerAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerAddress: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Information Section */}
                <div className="bg-[#1b1717] p-6 rounded-lg border border-[#1fb854]">
                  <h2 className="text-[#54c07a] font-bold text-lg mb-6 flex items-center gap-2">
                    <i className="fa-solid fa-truck"></i>
                    Delivery Information
                  </h2>
                  <div className="space-y-4">
                    {/* Delivery Date */}
                    <div>
                      <label className="text-[#30ce67] font-semibold text-sm block mb-2">
                        Delivery Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 bg-[#282424] border-2 border-[#1fb854] rounded-lg text-[#30ce67] focus:outline-none focus:border-[#54c07a] transition"
                        value={formData.deliveryDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            deliveryDate: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Delivery Method */}
                    <div>
                      <label className="text-[#30ce67] font-semibold text-sm block mb-2">
                        Delivery Method
                      </label>
                      <select
                        className="select select-bordered w-full border-2 border-[#1fb854] bg-[#282424] text-[#30ce67] focus:outline-none focus:border-[#54c07a] transition"
                        value={deliveryType}
                        onChange={(e) =>
                          setDeliveryType(e.target.value as DeliveryMethod)
                        }
                      >
                        <option value="pickup">Store Pickup</option>
                        <option value="home_delivery">Home Delivery</option>
                      </select>
                    </div>

                    {/* Delivery Address (conditional) */}
                    {deliveryType === "home_delivery" && (
                      <div>
                        <label className="text-[#30ce67] font-semibold text-sm block mb-2">
                          Delivery Address
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-[#282424] border-2 border-[#1fb854] rounded-lg text-[#30ce67] focus:outline-none focus:border-[#54c07a] transition placeholder:text-[#30ce67] placeholder:opacity-50"
                          placeholder="Enter delivery address"
                          value={formData.deliveryAddress}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              deliveryAddress: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}

                    {/* Additional Notes */}
                    <div>
                      <label className="text-[#30ce67] font-semibold text-sm block mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        className="w-full px-4 py-2 bg-[#282424] border-2 border-[#1fb854] rounded-lg text-[#30ce67] focus:outline-none focus:border-[#54c07a] transition placeholder:text-[#30ce67] placeholder:opacity-50"
                        placeholder="Any special instructions or requests..."
                        rows={4}
                        value={formData.additionalNotes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            additionalNotes: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dress Type and Measurements Section */}
              <div className="bg-[#1b1717] p-6 rounded-lg border border-[#1fb854] mb-10">
                {/* Dress Type Selection */}
                <div className="mb-8">
                  <h2 className="text-[#54c07a] font-bold text-lg mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-palette"></i>
                    Select Dress Type
                  </h2>
                  <div className="flex gap-4 items-center">
                    <select
                      className="flex-1 select select-bordered border-2 border-[#1fb854] bg-[#282424] text-[#30ce67] focus:outline-none focus:border-[#54c07a] transition"
                      value={dressType}
                      onChange={(e) => {
                        const newType = e.target.value as DressType;
                        setDressType(newType);
                        // Reset fabric to first option when dress type changes
                        const firstFabric = FABRIC_OPTIONS[newType]?.[0];
                        if (firstFabric) {
                          setSelectedFabric(firstFabric.value);
                        }
                      }}
                    >
                      {DRESS_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <div className="border-2 border-[#1fb854] rounded-lg overflow-hidden">
                      <img
                        src={dressImages[dressType]}
                        alt="dress preview"
                        className="w-24 h-24 object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Measurements */}
                <div>
                  <h2 className="text-[#54c07a] font-bold text-lg mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-ruler"></i>
                    Measurements (in cm)
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {MEASUREMENT_FIELDS[dressType].map((field) => (
                      <div key={field}>
                        <label className="text-[#30ce67] font-semibold text-sm block mb-2">
                          {field}
                        </label>
                        <input
                          type="number"
                          min={0}
                          step="0.1"
                          className="w-full px-3 py-2 bg-[#282424] border-2 border-[#1fb854] rounded-lg text-[#30ce67] focus:outline-none focus:border-[#54c07a] transition placeholder:text-[#30ce67] placeholder:opacity-50"
                          placeholder={`${field}`}
                          onChange={(e) =>
                            handleMeasurementChange(field, e.target.value)
                          }
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fabric Selection */}
                <div className="mt-8 pt-6 border-t border-[#1fb854]/30">
                  <h2 className="text-[#54c07a] font-bold text-lg mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    Select Fabric
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {FABRIC_OPTIONS[dressType].map((fabric) => (
                      <button
                        key={fabric.value}
                        type="button"
                        onClick={() => setSelectedFabric(fabric.value)}
                        className={`p-4 rounded-lg transition-all border-2 font-semibold ${
                          selectedFabric === fabric.value
                            ? "border-[#1fb854] bg-[#1fb854] text-white shadow-lg shadow-[#1fb854]/50"
                            : "border-[#1fb854] bg-[#1fb854]/30 text-[#30ce67] hover:bg-[#1fb854]/50 hover:text-white"
                        }`}
                      >
                        <div className="text-sm font-semibold">
                          {fabric.label}
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          ৳{fabric.price}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Urgency Level Pricing */}
                <div className="mt-8 pt-6 border-t border-[#1fb854]/30">
                  <h2 className="text-[#54c07a] font-bold text-lg mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-bolt"></i>
                    Urgency Level
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, urgency: "normal" })
                      }
                      className={`p-4 rounded-lg transition-all border-2 font-semibold text-center ${
                        formData.urgency === "normal"
                          ? "border-[#1fb854] bg-[#1fb854] text-white shadow-lg shadow-[#1fb854]/50"
                          : "border-[#1fb854] bg-[#1fb854]/30 text-[#30ce67] hover:bg-[#1fb854]/50 hover:text-white"
                      }`}
                    >
                      <div className="font-semibold">Normal</div>
                      <div className="text-xs opacity-75 mt-1">
                        No extra charge
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, urgency: "urgent" })
                      }
                      className={`p-4 rounded-lg transition-all border-2 font-semibold text-center ${
                        formData.urgency === "urgent"
                          ? "border-[#1fb854] bg-[#1fb854] text-white shadow-lg shadow-[#1fb854]/50"
                          : "border-[#1fb854] bg-[#1fb854]/30 text-[#30ce67] hover:bg-[#1fb854]/50 hover:text-white"
                      }`}
                    >
                      <div className="font-semibold">Urgent</div>
                      <div className="text-xs opacity-75 mt-1">+20% charge</div>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, urgency: "express" })
                      }
                      className={`p-4 rounded-lg transition-all border-2 font-semibold text-center ${
                        formData.urgency === "express"
                          ? "border-[#1fb854] bg-[#1fb854] text-white shadow-lg shadow-[#1fb854]/50"
                          : "border-[#1fb854] bg-[#1fb854]/30 text-[#30ce67] hover:bg-[#1fb854]/50 hover:text-white"
                      }`}
                    >
                      <div className="font-semibold">Express</div>
                      <div className="text-xs opacity-75 mt-1">+50% charge</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Reference Picture Section */}
              <div className="bg-[#1b1717] p-6 rounded-lg border border-[#1fb854] mb-8">
                <h2 className="text-[#54c07a] font-bold text-lg mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-image"></i>
                  Reference Picture (Optional)
                </h2>
                <div>
                  <input
                    id="picture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="picture"
                    className={`inline-block px-6 py-3 rounded-lg cursor-pointer font-semibold transition ${
                      preview
                        ? "bg-[#1fb854] text-white"
                        : "bg-[#1fb854] hover:bg-[#178a3f] text-white"
                    }`}
                  >
                    {preview ? (
                      <>
                        <i className="fa-solid fa-check mr-2"></i>
                        Image Uploaded
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-upload mr-2"></i>
                        Upload Image
                      </>
                    )}
                  </label>
                  {preview && (
                    <div className="mt-6">
                      <p className="text-[#30ce67] font-semibold mb-3">
                        Preview:
                      </p>
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-48 h-48 rounded-lg object-cover border-2 border-[#1fb854]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Price Summary Section */}
              <div className="bg-[#1b1717] p-6 rounded-lg border border-[#1fb854] mb-8 max-w-md">
                <h2 className="text-[#54c07a] font-bold text-lg mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-calculator"></i>
                  Price Summary
                </h2>
                <div className="space-y-3 text-[#30ce67]">
                  <div className="flex justify-between text-sm">
                    <span>Fabric Cost:</span>
                    <span>৳{priceBreakdown.fabricCost}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Stitching Cost:</span>
                    <span>৳{priceBreakdown.stitchingCost}</span>
                  </div>
                  {priceBreakdown.urgencyMultiplier > 1 && (
                    <div className="flex justify-between text-sm">
                      <span>
                        {formData.urgency === "urgent"
                          ? "Urgent Fee"
                          : "Express Fee"}
                        :
                      </span>
                      <span>
                        +
                        {Math.round(
                          (priceBreakdown.urgencyMultiplier - 1) * 100,
                        )}
                        %
                      </span>
                    </div>
                  )}
                  <div className="border-t border-[#1fb854] pt-3 flex justify-between font-bold text-[#1fb854]">
                    <span>Total Amount:</span>
                    <span>৳{totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!showPayment && (
                  <button
                    type="submit"
                    className="flex-1 bg-[#1fb854] hover:bg-[#178a3f] text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                    disabled={submitting}
                  >
                    <i className="fa-solid fa-arrow-right"></i>
                    Continue to Payment
                  </button>
                )}
              </div>
            </form>

            {/* Payment Section */}
            {showPayment && (
              <div className="mt-10 border-t border-[#1fb854] pt-10">
                <h2 className="text-2xl font-bold text-[#54c07a] mb-8 text-center flex items-center justify-center gap-2">
                  <i className="fa-solid fa-credit-card"></i>
                  Payment Information
                </h2>

                {/* Order Summary */}
                <div className="bg-[#1b1717] border border-[#1fb854] rounded-lg p-6 mb-8 max-w-md mx-auto">
                  <h3 className="text-[#54c07a] font-bold mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-3 text-[#30ce67]">
                    <div className="flex justify-between">
                      <span>Fabric Cost:</span>
                      <span>৳{priceBreakdown.fabricCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stitching Cost:</span>
                      <span>৳{priceBreakdown.stitchingCost}</span>
                    </div>
                    {priceBreakdown.urgencyMultiplier > 1 && (
                      <div className="flex justify-between">
                        <span>
                          {formData.urgency === "urgent"
                            ? "Urgent Fee"
                            : "Express Fee"}
                          :
                        </span>
                        <span>
                          +
                          {Math.round(
                            (priceBreakdown.urgencyMultiplier - 1) * 100,
                          )}
                          %
                        </span>
                      </div>
                    )}
                    <div className="border-t border-[#1fb854] pt-3 flex justify-between font-bold text-[#1fb854]">
                      <span>Total Amount:</span>
                      <span>৳{totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="max-w-md mx-auto mb-8">
                  <label className="text-[#54c07a] font-bold text-sm block mb-3">
                    <i className="fa-solid fa-wallet mr-2"></i>
                    Select Payment Method
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("stripe")}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition flex items-center justify-center gap-2 font-semibold ${
                          paymentMethod === "stripe"
                            ? "border-[#1fb854] bg-[#1fb854] text-white"
                            : "border-[#1fb854] bg-[#282424] text-[#30ce67] hover:border-[#54c07a]"
                        }`}
                      >
                        <i className="fa-solid fa-credit-card"></i>
                        Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("bkash")}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition flex items-center justify-center gap-2 font-semibold ${
                          paymentMethod === "bkash"
                            ? "border-[#1fb854] bg-[#1fb854] text-white"
                            : "border-[#1fb854] bg-[#282424] text-[#30ce67] hover:border-[#54c07a]"
                        }`}
                      >
                        <img
                          src={bkashLogo}
                          alt="bKash"
                          className="w-5 h-5 object-contain"
                        />
                        bKash
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("nagad")}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition flex items-center justify-center gap-2 font-semibold ${
                          paymentMethod === "nagad"
                            ? "border-[#1fb854] bg-[#1fb854] text-white"
                            : "border-[#1fb854] bg-[#282424] text-[#30ce67] hover:border-[#54c07a]"
                        }`}
                      >
                        <img
                          src={nagadLogo}
                          alt="Nagad"
                          className="w-5 h-5 object-contain"
                        />
                        Nagad
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payment Component */}
                <div className="max-w-md mx-auto bg-[#1b1717] border border-[#1fb854] rounded-lg p-6">
                  {paymentMethod === "stripe" && (
                    <StripePayment
                      amount={totalAmount}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      orderId={createdOrderId || undefined}
                    />
                  )}
                  {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
                    <MobileWalletPayment
                      amount={totalAmount}
                      paymentMethod={paymentMethod}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      orderId={createdOrderId || undefined}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
