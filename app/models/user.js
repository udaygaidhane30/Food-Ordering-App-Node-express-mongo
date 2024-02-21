const mongoose = require('mongoose')

const user = new mongoose.Schema({
    name :      { type: String, required : true},
    email :     { type: String, required : true,unique : true},
    password :  { type: String, required : true},
    role :      { type: String, default : 'customer'},
    //time :      { type : Date, default: Date.now }
},{ timestamps: true })

const userSchema = mongoose.model('user',user);



module.exports = {
    userSchema
};