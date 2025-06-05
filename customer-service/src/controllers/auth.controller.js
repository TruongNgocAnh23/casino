import Customer from "../models/customer.model.js";
import { hashPassword, isValidCitizenId, isValidEmail } from "../utils/helper.js";

const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, phone, citizen_id, tax_id, birthday, address } = req.body;

    if (!first_name) {
      return res.status(400).json({ error: true, message: "First name required." });
    }

    if (!email) {
      return res.status(400).json({ error: true, message: "Email required." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: true, message: "Email's format not valid." });
    }

    if (!password) {
      return res.status(400).json({ error: true, message: "Password required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: true, message: "Password must be at least 6 characters." });
    }

    const currentUser  = await Customer.findOne({ email: email });

    if (currentUser) {
      return res.status(400).json({ error: true, message: `Username ${username} already exists.` });
    }

    if (!citizen_id) {
      return res.status(400).json({ error: true, message: "Citizen ID required." });
    }

    if (!isValidCitizenId(citizen_id)) {
      return res.status(400).json({ error: true, message: "Citizen ID must be a 12-digit number and correct format." });
    }

    if (!tax_id) {
      return res.status(400).json({ error: true, message: "Tax ID required." });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new Customer({
      first_name: first_name,
      last_name: last_name || null,
      email: email,
      password: hashedPassword,
      phone: phone || null,
      citizen_id: citizen_id,
      tax_id: tax_id,
      birthday: birthday || null,
      address: address || null
    });

    await newUser.save();
    res.status(201).json({ error: false, message: "Registered successfully." });
  } catch (error) {
    error.methodName = register.name;
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    
  } catch (error) {
    error.methodName = login.name;
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    
  } catch (error) {
    error.methodName = logout.name;
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    
  } catch (error) {
    error.methodName = refreshToken.name;
    next(error);
  }
};

const getAuthCustomer = async (req, res, next) => {
  try {
    res.status(200).json({ error: false, data: req.user });
  } catch (error) {
    error.methodName = getAuthCustomer.name;
    next(error);
  }
};

export { register, login, logout, refreshToken, getAuthCustomer };