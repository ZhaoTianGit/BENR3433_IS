// controller/host.js
const { User, Visitor } = require('../model/user');

module.exports.getWelcomeMessage = async (req, res) => {
  try {
    const { hostId } = req.params;

    // Assuming hostId is the user's ID
    const user = await User.findById(hostId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { username } = user;
    res.json({ message: `Welcome, ${username}!` });
  } catch (error) {
    console.error('Error getting welcome message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.getVisitors = async (req, res) => {
  try {
    // Assuming req.user is populated by your authentication middleware
    const { userId } = req.user;

    // Find the host by userId
    const host = await User.findById(userId);

    if (!host) {
      return res.status(404).json({ error: 'Host not found' });
    }

    // Get visitors registered under the host
    const visitors = host.visitors;

    res.json({ visitors });
  } catch (error) {
    console.error('Error getting visitors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};