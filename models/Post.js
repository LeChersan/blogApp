const mongoose = require('mongoose')

var PostModel = function(){
    var postSchema = new mongoose.Schema({
        'title' : String,
        'date' : {
            type: Date,
            default: Date.now,
        },
        'description' : String,
        'content' : String,
        'tags' : [],
        'img' : String,
        'user_id' : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        'activated': {
            type: Boolean,
            default: true,
        }
    })

    postSchema.index({title:"text"})
    var post = mongoose.model('Post', postSchema)
    return post 
}

module.exports = new PostModel()

