import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  first_name:{
    type: String,
    required: true
  },
  last_name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  citizen_id: {
    type: String
  },
  tax_id: {
    type: String
  },
  birthday: {
    type: Date,
  },
  address: {
    type: String
  },
  notes: {
    type: String
  },
  avatar: {
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

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
