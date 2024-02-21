const mongoose = require('mongoose')


var menuSchema = mongoose.model('menus',{
    name :  { type: String, required : true},
    image : { type: String, required : true},
    price : { type: Number, required : true},
    size :  { type: Number, required : true}
});



module.exports = {
    menuSchema
};