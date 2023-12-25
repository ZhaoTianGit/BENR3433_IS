const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        username:{
            type: String,
            required:true
        },
        password:{
            type: String,
            required: true
        },
        name:{
            type: String,
            required: true
        },
        role:{
            type: String,
            enum: ['host','admin'],
            required: true
        },
        visitor_id:{
            type: mongoose.Schema.Types.ObjectId,ref:'Visitor'
        },
        login_status:{
            type: Boolean
        },
    },
    { versionKey: false }
)
const User = mongoose.model('User', userSchema);
module.exports = User;