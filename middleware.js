// middleware.js
const jwt = require('jsonwebtoken');

// Middleware to check if the request has a valid JWT token
module.exports.authenticateToken =(requiredRole) => async (req, res, next) => {
  // Extract the token from the Authorization header
  const header = req.headers['authorization'];
  
  // check first if whether the token is present, if not the app will crash 
  //then only do the header.split
  // Verify the token
  if (!header) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  //split the bearer token 
  // take the index 1 , to exclude the bearer words
  let token = header.split(' ')[1];

  //to check whether the token pass in is what you want
//  console.log("Token",token);
  try {
    // Verify the token
    const decoded = jwt.verify(token, 'vms2');

    // Log decoded information for troubleshooting
    console.log('Decoded Token:', decoded);

    // Check if the token has the required role
    if (decoded.category !== requiredRole) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    // Attach user information to the request if needed
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};