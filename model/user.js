const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const visitSchema = new mongoose.Schema({
    purposeOfVisit: {
        type: String,
        required: true
    },
    visitTime: {
        type: Date,
        default: Date.now
    }
    // Add more properties for the visit as needed
    // For example: checkInTime, checkOutTime, etc.
}, { timestamps: true });  // Add timestamps to track visit creation and update times

const visitorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },    
    phoneNumber: {
        type: Number,
        required: true
    },
    visits: [visitSchema]  // Embed an array of visits within each visitor
});

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        min: 5
    },
    email:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        enum: ['host','admin']
    },
    visitors: [visitorSchema]  // Embed an array of visitors within each host
    // inferior:{

    // }
})

// Define a pre-save hook to hash the password before saving to the database
userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password') || this.isNew) {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error);
    }
});


const User = mongoose.model('User', userSchema);
const Visitor = mongoose.model('Visitor', visitorSchema);
const Visit = mongoose.model('Visit', visitSchema);

module.exports = { User, Visitor, Visit };