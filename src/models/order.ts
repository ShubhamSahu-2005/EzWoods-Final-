// File: models/order.ts

import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from './product'; // Now only references the Product model

// --- Interface Definitions for Type Safety ---

// Interface for the customer's details
export interface ICustomerDetails {
  name: string;
  email: string;
  phone: string;
}

// Interface for a single item within an order (now only for Products)
export interface IOrderItem {
  item: IProduct['_id']; // Reference is strictly to a Product
  name: string; // Denormalized for easy display
  quantity: number;
  price: number; // Price at the time of purchase
}

// Interface for payment information
export interface IPaymentInfo {
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  totalAmount: number;
}

// Interface for an event in the order's timeline
export interface ITimelineEvent {
  status: string;
  timestamp: Date;
  notes?: string;
}

// Main interface for the Order document
export interface IOrder extends Document {
  orderId: string;
  customerDetails: ICustomerDetails;
  deliveryAddress: string;
  orderItems: IOrderItem[];
  paymentInfo: IPaymentInfo;
  orderNotes?: string;
  orderTimeline: ITimelineEvent[];
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

// --- Mongoose Schemas ---

const CustomerDetailsSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
}, { _id: false });

const OrderItemSchema: Schema = new Schema({
  // The 'ref' is now directly set to 'Product'
  item: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
}, { _id: false });

const PaymentInfoSchema: Schema = new Schema({
  paymentMethod: { type: String, required: true },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending',
  },
  totalAmount: { type: Number, required: true },
}, { _id: false });

const TimelineEventSchema: Schema = new Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  notes: { type: String },
}, { _id: false });

// The main schema for the Order model
const OrderSchema: Schema = new Schema({
  orderId: {
    type: String,
    unique: true,
  },
  customerDetails: {
    type: CustomerDetailsSchema,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
    trim: true,
  },
  orderItems: [OrderItemSchema],
  paymentInfo: {
    type: PaymentInfoSchema,
    required: true,
  },
  orderNotes: {
    type: String,
    trim: true,
  },
  orderTimeline: [TimelineEventSchema],
  orderStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Mongoose pre-save hook to generate a custom order ID and initial timeline event
OrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    // FIX: Ensure the orderTimeline array is initialized before pushing to it.
    if (!this.orderTimeline) {
      this.orderTimeline = [];
    }

    // Create the initial "Order Created" event in the timeline
    (this as unknown as IOrder).orderTimeline.push({
      status: 'Order Created',
      timestamp: new Date(),
    });

    // Generate a unique, human-readable order ID
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // A simple way to get a unique sequence, you might use a dedicated counter in production
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderId = `ORD-${year}${month}-${randomPart}`;
  }
  next();
});

// Prevent model overwrite in Next.js hot-reloading environment
export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);