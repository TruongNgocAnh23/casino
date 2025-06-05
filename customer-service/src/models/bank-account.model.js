import mongoose from "mongoose";
import Customer from "./customer.model";

const bankAccountSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Customer.name,
    required: true
  },
  bank_name: {
    type: String,
    required: true
  },
  account_number: {
    type: String,
    required: true
  },
  account_owner: {
    type: String,
    required: true
  },
  isVerified: {
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

const BankAccount = mongoose.model("BankAccount", bankAccountSchema);

export default BankAccount;
