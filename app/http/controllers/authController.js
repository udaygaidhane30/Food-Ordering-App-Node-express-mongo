const {userSchema} = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
const { request } = require('express')

function authController(){
    const _getRedirectUrl = (req) =>{
        return req.user.role === 'admin' ? '/admin/orders' :'/customer/orders'
    }
    return{
        login(req,res){
            res.render('auth/login')
        },
        register(req,res){
            res.render('auth/register')
        },
        postLogin(req, res, next) {
            const { email, password }   = req.body
            passport.authenticate('local', (err, user, info) => {
                if(err) {
                    req.flash('error', info.message )
                    return next(err)
                }
                if(!user) {
                    req.flash('error', info.message )
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err) {
                        req.flash('error', info.message ) 
                        return next(err)
                    }

                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)
        },
        async postRegister(req,res){
            const { name , email , password} = req.body
            userSchema.exists({ email : email}, (err,result)=>{
                if(result){
                    req.flash('error','Email already Registered')
                    req.flash('name' ,name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })
            //hash password
            var hashedPassword = await bcrypt.hash(password,10)
            //Create User
            const user = new userSchema({
                name : name,
                email : email,
                password : hashedPassword
            })
            user.save().then((user)=>{
                return res.redirect('/')
            }).catch(err =>{
                req.flash('error','Something went Wrong')
                return res.redirect('/register')
            })
        },
        logout(req,res){
            req.logout()
            return res.redirect('/')
        }
    }
}

module.exports=authController