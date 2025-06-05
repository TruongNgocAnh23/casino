import argon2 from "argon2";

const validProvinceCodes = [
  '001', '002', '004', '006', '008', '010', '011', '012', '014', '015', '017', '019', '020',
  '022', '024', '025', '026', '027', '030', '031', '033', '034', '035', '036', '037',
  '038', '040', '042', '044', '045', '046', '048', '049', '051', '052', '054', '056',
  '058', '060', '062', '064', '066', '067', '068', '070', '072', '074', '075', '077',
  '079', '080', '082', '083', '084', '086', '087', '089', '091', '092', '093', '094', '095', '096'
];

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const hashPassword = async (password) => {
  return await argon2.hash(password);
};

const isValidCitizenId = (citizenId) => {
  const regex = /^\d{12}$/;
  if (!regex.test(citizenId)) {
    return false;
  }
  const provinceCode = citizenId.substring(0, 3);
  return validProvinceCodes.includes(provinceCode);
};

export { isValidEmail, hashPassword, isValidCitizenId };
