var {menuSchema} = require('../../models/menu')

function homeController (){
    return {
        async index(req,res){
            const food = await menuSchema.find()
            return res.render('home',{food:food})
        }
    }
}

module.exports=homeController 