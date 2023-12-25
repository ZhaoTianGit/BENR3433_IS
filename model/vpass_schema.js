const mongoose = require('mongoose')

const vpassSchema = mongoose.Schema(
    {
        visitor_id:{
            type: mongoose.Schema.Types.ObjectId,ref:'Visitor'
        },
        purposeOfVisit:{
            type: mongoose.Schema.Types.ObjectId,ref:'Purpose',
            required: true
        },
        phoneNumber:{
            type: String,
            required: true
        },
        // host_name:{
        //     type: String,
        //     required: true
        // },
        // host_address:{
        //     type: String,
        //     required: true
        // },
        // remarks:{
        //     type: String,
        // },
        // visit_date:{
        //     type: String,
        //     required: true
        // },
        // checkin_time:{
        //     type: String
        // },
        // checkout_time:{
        //     type: String
        // }
    },
    { versionKey: false }
)
const Pass = mongoose.model('vPass', vpassSchema);
module.exports = Pass;