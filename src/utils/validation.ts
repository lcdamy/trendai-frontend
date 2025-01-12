const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};


const validateName = (name: string): boolean => {
  // At least 2 characters
  const nameRegex = /^[a-zA-Z]{2,}$/;
  return nameRegex.test(name);
};

export { validateEmail, validatePassword, validateName };