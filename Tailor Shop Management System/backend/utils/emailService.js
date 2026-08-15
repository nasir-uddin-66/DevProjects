import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure your email service
// Using Gmail with App Password (easiest option)
// Or use your preferred email provider
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Test connection (optional, remove later)
transporter.verify((error, success) => {
  if (error) {
    console.log("Email service error:", error);
  } else {
    console.log("Email service ready");
  }
});

export const sendCompletionEmail = async (order) => {
  try {
    // Get the correct order ID (MongoDB uses _id)
    const orderId = order.id || order._id?.toString() || "N/A";
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const invoiceUrl = `${frontendUrl}/user/orders/${orderId}`;

    const mailOptions = {
      from: `StitchCraft <${process.env.EMAIL_USER}>`,
      to: order.customerEmail,
      subject: `Your Tailor Order is Ready! - Order #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #1fb854, #178a3f); padding: 20px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">Your Tailor Order is Complete!</h1>
          </div>
          
          <div style="background: #f8f8f8; padding: 20px; border: 1px solid #ddd;">
            <p>Hi <strong>${order.customerName}</strong>,</p>
            
            <p>Great news! Your tailoring order has been completed and is ready for ${
              order.deliveryMethod === "pickup" ? "pickup" : "delivery"
            }.</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid #1fb854; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1fb854;">Order Details</h3>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Dress Type:</strong> ${order.dressType}</p>
              <p><strong>Total Amount:</strong> ৳${
                order.totalAmount?.toLocaleString() || "N/A"
              }</p>
              <p><strong>Status:</strong> <span style="background: #1fb854; color: white; padding: 2px 8px; border-radius: 4px;">Completed</span></p>
            </div>
            
            ${
              order.deliveryMethod === "pickup"
                ? `<p><strong>Next Steps:</strong> Please visit our shop to pick up your order at your earliest convenience.</p>`
                : `<p><strong>Next Steps:</strong> We will contact you shortly to arrange a convenient delivery time.</p>`
            }

            <div style="text-align: center; margin: 20px 0;">
              <a href="${invoiceUrl}" style="background: #1fb854; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                <i>📄</i> View Order & Download Invoice
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">If you have any questions, please contact us at your earliest convenience.</p>
          </div>
          
          <div style="background: #1fb854; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; font-size: 12px;">Thank you for choosing our tailoring service!</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${order.customerEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw - log the error but don't break the order update
    return false;
  }
};

export const sendCancellationEmail = async (order) => {
  try {
    // Check if order is valid
    if (!order) {
      console.log("Order data is undefined, skipping email");
      return false;
    }

    // Get the correct order ID (MongoDB uses _id)
    const orderId = order.id || order._id?.toString() || "N/A";

    const mailOptions = {
      from: `StitchCraft <${process.env.EMAIL_USER}>`,
      to: order.customerEmail,
      subject: `Order Cancelled - Order #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #ef4444, #dc2626); padding: 20px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">Order Cancelled</h1>
          </div>
          
          <div style="background: #f8f8f8; padding: 20px; border: 1px solid #ddd;">
            <p>Hi <strong>${order.customerName}</strong>,</p>
            
            <p>Your order has been cancelled as requested. If you have any questions about your cancellation, please contact us.</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #ef4444;">Order Details</h3>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Dress Type:</strong> ${order.dressType}</p>
              <p><strong>Total Amount:</strong> ৳${order.totalAmount?.toLocaleString() || "N/A"}</p>
              <p><strong>Status:</strong> <span style="background: #ef4444; color: white; padding: 2px 8px; border-radius: 4px;">Cancelled</span></p>
            </div>

            <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Refund Information</strong></p>
              <p>If payment was made, a full refund will be processed to your original payment method within 3-5 business days.</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">If you wish to place a new order or have any questions, please contact us at your earliest convenience.</p>
          </div>
          
          <div style="background: #ef4444; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; font-size: 12px;">We hope to serve you again in the future!</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order cancellation email sent to ${order.customerEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending cancellation email:", error);
    return false;
  }
};

export const sendOrderPlacedEmail = async (order) => {
  try {
    // Check if order is valid
    if (!order) {
      console.log("Order data is undefined, skipping email");
      return false;
    }

    // Get the correct order ID (MongoDB uses _id)
    const orderId = order.id || order._id?.toString() || "N/A";

    const mailOptions = {
      from: `StitchCraft <${process.env.EMAIL_USER}>`,
      to: order.customerEmail,
      subject: `Order Confirmation - Order #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #1fb854, #178a3f); padding: 20px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">Order Confirmed!</h1>
          </div>
          
          <div style="background: #f8f8f8; padding: 20px; border: 1px solid #ddd;">
            <p>Hi <strong>${order.customerName}</strong>,</p>
            
            <p>Thank you for placing your order! We have successfully received your payment and your order is now confirmed.</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid #1fb854; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1fb854;">Order Details</h3>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Dress Type:</strong> ${order.dressType}</p>
              <p><strong>Total Amount:</strong> ৳${order.totalAmount?.toLocaleString() || "N/A"}</p>
              <p><strong>Payment Status:</strong> <span style="background: #1fb854; color: white; padding: 2px 8px; border-radius: 4px;">Paid</span></p>
            </div>

            <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>What's Next?</strong></p>
              <p>Our team will review your order and assign it to a skilled tailor. You will receive an email update once your order is assigned.</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">If you have any questions, please contact us at your earliest convenience.</p>
          </div>
          
          <div style="background: #1fb854; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; font-size: 12px;">Thank you for choosing our tailoring service!</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order placed email sent to ${order.customerEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending order placed email:", error);
    return false;
  }
};

export const sendStatusUpdateEmail = async (
  order,
  newStatus,
  previousStatus,
) => {
  try {
    const orderId = order.id || order._id?.toString() || "N/A";
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const invoiceUrl = `${frontendUrl}/user/orders/${orderId}`;

    // Status messages and colors
    const statusMessages = {
      pending: {
        message: "Your order has been received",
        color: "#f59e0b",
        icon: "⏰",
      },
      processing: {
        message: "Your order is now being processed",
        color: "#3b82f6",
        icon: "⚙️",
      },
      completed: {
        message: "Your order is complete and ready",
        color: "#10b981",
        icon: "✓",
      },
      received: {
        message: "Your order has been delivered/received",
        color: "#8b5cf6",
        icon: "📦",
      },
      "re-processing": {
        message: "Your order is being re-worked",
        color: "#f59e0b",
        icon: "🔄",
      },
      canceled: {
        message: "Your order has been canceled",
        color: "#ef4444",
        icon: "✗",
      },
    };

    const statusInfo = statusMessages[newStatus] || {
      message: "Your order status has been updated",
      color: "#1fb854",
      icon: "📝",
    };

    const mailOptions = {
      from: `StitchCraft <${process.env.EMAIL_USER}>`,
      to: order.customerEmail,
      subject: `Order Status Update - Order #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #1fb854, #178a3f); padding: 20px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">Order Status Updated</h1>
          </div>
          
          <div style="background: #f8f8f8; padding: 20px; border: 1px solid #ddd;">
            <p>Hi <strong>${order.customerName}</strong>,</p>
            
            <div style="background: white; padding: 20px; border-left: 4px solid ${statusInfo.color}; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0 0 10px 0; font-size: 24px;">${statusInfo.icon}</p>
              <h2 style="margin: 0 0 10px 0; color: ${statusInfo.color};">${statusInfo.message}</h2>
              <p style="margin: 0; font-size: 14px; color: #666;">Your order #${orderId} status is now: <strong style="text-transform: capitalize; color: ${statusInfo.color};">${newStatus.replace("-", " ")}</strong></p>
            </div>

            <div style="background: white; padding: 15px; border: 1px solid #ddd; border-radius: 5px; margin: 20px 0;">
              <p><strong>Order Details:</strong></p>
              <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
              <p style="margin: 5px 0;"><strong>Dress Type:</strong> ${order.dressType?.replace(/_/g, " ") || "N/A"}</p>
              <p style="margin: 5px 0;"><strong>Total Amount:</strong> ৳${order.totalAmount?.toLocaleString() || "N/A"}</p>
              <p style="margin: 5px 0;"><strong>Payment Status:</strong> ${order.paymentStatus}</p>
            </div>

            <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Need Help?</strong></p>
              <p>If you have any questions about your order or need further assistance, please don't hesitate to contact us.</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">Thank you for your business!</p>
          </div>
          
          <div style="background: #1fb854; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; font-size: 12px;">Tailor Management System</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      `Status update email sent to ${order.customerEmail} for status: ${newStatus}`,
    );
    return true;
  } catch (error) {
    console.error("Error sending status update email:", error);
    return false;
  }
};
