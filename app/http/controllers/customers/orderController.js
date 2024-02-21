const {orderSchema} = require('../../../models/order')
const moment = require('moment')
function orderController(){
    return {
        store(req,res){
            const { phone,address} = req.body
            const order = new orderSchema({
                customerId : req.user._id,
                items : req.session.cart.items,
                phone : phone,
                address : address
            })
            order.save().then(result =>{
                req.flash('success','Order placed Successfully')
                delete req.session.cart
                return res.redirect('/customer/orders')
            }).catch(err =>{
                req.flash('error','Something went wrong')
                return res.redirect('/cart')
            })
        },
        async index(req,res){
            const orders = await orderSchema.find({ customerId: req.user._id}, null ,{ sort:{'createdAt':-1} })
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', { orders : orders,moment:moment})
        },
        async show(req,res){
            const order = await orderSchema.findById(req.params.id)
            //Authorize user
            if(req.user._id.toString() === order.customerId.toString()){
                return res.render('customers/singleOrder',{ order : order })
            } 
            return res.redirect('/')
        }
    }
}

module.exports = orderController