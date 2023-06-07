const jwt = require('jsonwebtoken');
const checklogin = (req, res, next) => {
  const token = req.cookies.ntoken;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { username, email } = decoded;
      req.username = username;
      req.email = email;
      next();
      
    } catch (err) {
      console.log(err);
      next("Authentication Failure");
    }
  
  };

  module.exports = checklogin;


