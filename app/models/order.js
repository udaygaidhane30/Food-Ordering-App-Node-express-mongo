const mongoose = require('mongoose')

const orders = new mongoose.Schema({
    customerId :  { 
        type: mongoose.Schema.Types.ObjectId, 
        ref : 'userSchema',
        required : true
    },
    items :    { type: Object, required : true},
    phone :    { type: String, required : true},
    address:   { type: String, required : true},
    paymentType : { type:String, default: 'COD'},
    status : { type: String, default:'order_placed'}
},{ timestamps: true })

const orderSchema = mongoose.model('Order',orders);



module.exports = {
    orderSchema
};