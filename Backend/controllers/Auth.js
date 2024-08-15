const register = (req, res) => {
    // Handle user registration logic here
    res.json({ message: 'User registered successfully!' });
  };
  
  const login = (req, res) => {
    // Handle user login logic here
    res.json({ message: 'User logged in successfully!' });
  };
  
  module.exports = {
    register,
    login,
  };
  