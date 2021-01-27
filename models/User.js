const mongoose = require('mongoose')

var UserModel = function(){
    var userSchema = new mongoose.Schema({
        'name': String, 
        'last_name': String,
        'email': String,
        'password': String,
        'rol': String,
        'img': String,
        'social_media': {
            'facebook': String,
            'instagram': String,
            'twitter': String,
            'linkedin': String,
        }
    })

    userSchema.index({name:"text"})
    var user = mongoose.model('User', userSchema)
    return user 
}

module.exports = new UserModel()