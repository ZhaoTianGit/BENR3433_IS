const {User, Visit} = require('../model/user');
const bcrypt = require('bcrypt');

module.exports.readVisitsData = async(req,res)=>{
    try {
        const allVisits = await Visit.find({});
        res.send(allVisits);
    } catch (error) {
        console.error('Error fetching visits:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }  
}

module.exports.registerHost = async(req,res)=>{
    try {
        //to detect any error with your terminal
        console.log("Request body:", req.body);
        const { username, password, email, phoneNumber } = req.body;

        // Check if the username is unique (you can add more validation if needed)
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // // Hash the password using bcrypt
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new host
        const newHost = new User({
            username,
            password,
            email,
            phoneNumber,
            category: 'host', // Assuming 'host' is the category for hosts
        });

        // Save the new host to the database
        await newHost.save();

        res.status(201).json({ message: 'Host registered successfully' });
    } catch (error) {
        console.error('Error registering host:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }    
}