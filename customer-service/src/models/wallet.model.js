import mongoose from "mongoose";
import Customer from "./customer.model";

const walletSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Customer.name,
    required: true
  },
  code: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  created_by: {
    type: String
  },
  updated_by: {
    type: String
  }
}, {
  timestamps: true
});

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;
