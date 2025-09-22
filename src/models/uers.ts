import { Schema, model, Document, Types } from 'mongoose';

// Address Schema
const AddressSchema = new Schema(
  {
    street: { type: String, required: true },
    city:   { type: String, required: true },
    state:  { type: String, required: true },
    zipCode:{ type: String, required: true },
    country:{ type: String, required: true }
  },
  { _id: false } // Prevents nested address from having its own _id
);

// Cart Item Schema
const CartItemSchema = new Schema(
  {
    productId: { type: Types.ObjectId, ref: 'Product', required: true },
    quantity:  { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

// Order Schema (for embedding reference in User)
const OrderSchema = new Schema(
  {
    orderId:   { type: Types.ObjectId, ref: 'Order', required: true },
    total:     { type: Number, required: true },
    date:      { type: Date, required: true },
    status:    { 
      type: String, 
      enum: ['pending', 'shipped', 'delivered', 'cancelled', 'returned'], 
      required: true 
    }
  },
  { _id: false }
);

// User Document interface
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  addresses: typeof AddressSchema[];
  cart: typeof CartItemSchema[];
  wishlist: Types.ObjectId[]; // product IDs
  orderHistory: typeof OrderSchema[];
  isAdmin?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const UserSchema = new Schema<IUser>(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    phone:        { type: String },
    addresses:    { type: [AddressSchema], default: [] },
    cart:         { type: [CartItemSchema], default: [] },
    wishlist:     [{ type: Types.ObjectId, ref: 'Product' }],
    orderHistory: { type: [OrderSchema], default: [] },
    isAdmin:      { type: Boolean, default: false },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false // Removes __v field for cleaner docs
  }
);

// Indexes for scalability and performance
UserSchema.index({ email: 1 }); // Fast email lookup
UserSchema.index({ 'cart.productId': 1 });
UserSchema.index({ 'wishlist': 1 });

export const User = model<IUser>('User', UserSchema);