import mongoose from "mongoose";
import Customer from "./customer.model.js";

const customerRefreshTokenSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Customer.name,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  device_info: {
    type: String,
    required: true
  },
  expires_at: {
    type: Date,
    required: true
  },
}, {
  timestamps: true
});

customerRefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const CustomerRefreshToken = mongoose.model("CustomerRefreshToken", customerRefreshTokenSchema);

export default CustomerRefreshToken;
