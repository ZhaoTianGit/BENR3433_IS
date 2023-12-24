// In loginController.js

const {User} = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports.login = async(req, res) =>{
  try {
    // Implement your login logic (e.g., validate credentials against the database)
    const { username, password } = req.body;
    const user = await User.findOne({username});

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, category: user.category }, 'vms2', {
      expiresIn: '1h',
    });

    // Check the user's category and generate the appropriate link
    let redirectLink;
    if (user.category === 'host') {
        redirectLink = `/host/${user._id}`;
    } else if (user.category === 'admin') {
        redirectLink = `/admin`;
    }

    console.log("JWT:",token);
    res.json({
        token,
        category: user.category,
        redirectLink,
        "GET": `http://localhost:3000${redirectLink}`,
        Authorization: token,
        "Content-Type": "application/json",
      });
      
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
