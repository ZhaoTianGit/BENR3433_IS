const mongoose = require('mongoose')

const visitorSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        phoneNumber:{
            type: String,
            required: true
        },
        user_id:{
            type: mongoose.Schema.Types.ObjectId, ref:'User'
        },
        visitor_pass_id:[{
            type: mongoose.Schema.Types.ObjectId, ref:'Vpass'
        }]
    },
    { versionKey: false }
)

const Visitor = mongoose.model('Visitor', visitorSchema);
module.exports = Visitor;