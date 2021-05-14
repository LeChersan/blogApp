var express = require('express');
var router = express.Router();
var PostModel = require("../../../models/Post")
var fileUpload = require("express-fileupload")
var fs = require('fs')

router.use(fileUpload())

router.post('/', function (req, res, next) {

    //Se obtienen datos
    var postTitle = req.body.post_title
    var postDescription = req.body.post_description
    var postContent = req.body.post_content
    var postTags = req.body['post_tags[]']
    var postImg = req.files.post_img.name
    var postImgFile = req.files.post_img
    var postUserId = req.body.post_user_id


    //validacion de campos
    if (!(postTitle || postDescription || postContent || postImg || postUserId )) {
        return res.status(400).json({
            ok: false,
            message: "Favor de enviar los campos obligatorios"
        })
    }

    //validacion de campos vacios
    if ((postTitle == '' || postDescription == '' || postContent == '' || postUserId == '')) {
        return res.status(400).json({
            ok: false,
            message: "Favor llenar los campos obligatorios"
        })
    }

    //se realiza funcion para guardar la imagen
    postImgFile.mv(`./public/images/post/${postImg}`, err => {
        if (err) {
            res.status(500).json({
                ok: false,
                message: "Error al intentar guardar la imagen"
            })
        }

        var newPost = new PostModel()

        newPost.title = postTitle
        newPost.description= postDescription
        newPost.content = postContent
        newPost.tags = postTags
        newPost.img = postImg
        newPost.user_id = postUserId
       

        //Funcion para guardar datos despues de proceso de validacion
        newPost.save(function (err, post) {

            //se envia mensaje de error al intentar guardar datos
            if (err) {
                res.status(500).json({
                    ok: false,
                    message: "Cannot complete signup process"
                })
            }

            //se envia respuesta por datos guardados exitosamente
            if (post) {
                res.status(201).json({
                    ok: true,
                    message: "post agregado correctamente"
                })
            }
        })
    })
});

router.get('/:id', function (req, res) {
    PostModel.findOne({ '_id': req.params.id }).populate("users").exec(function (err, post) {
        if (err) {
            console.log(err)
            return res.status(500).json({
                ok: false,
                message: "Error en la consulta"
            })
        }
        if (post) {
            return res.json(post)
        }
    })
})

router.get('/', function(req, res){
    PostModel.find({"activated": true}).exec(function(err, posts){
        if(err){ 
            return res.status(500).json({
                ok: false,
                message: "Error en la consulta" 
            })
        }
        res.json(posts)
    })
})

router.put('/:id', function(req, res){
    //Se obtienen datos
    var postTitle = req.body.edit_post_title
    var postDescription = req.body.edit_post_description
    var postContent = req.body.edit_post_content
    var postTags = req.body['edit_post_tags[]']
    var postId = req.params.id

    //validacion de campos
    if (!(postTitle || postDescription || postContent || postId )) {
        return res.status(400).json({
            ok: false,
            message: "Favor de enviar los campos obligatorios"
        })
    }

    //validacion de campos vacios
    if ((postTitle == '' || postDescription == '' || postContent == '' || postId == '')) {
        return res.status(400).json({
            ok: false,
            message: "Favor llenar los campos obligatorios"
        })
    }

    PostModel.findByIdAndUpdate(postId, {'$set': {'tags': []}}, function(err, tags){
        if(err){
            return res.status(500).json({
                ok: false,
                message: "Error en la consulta"
            })
        }
        if(tags){
            PostModel.findByIdAndUpdate(postId, {
                "$set": {
                    'title': postTitle,
                    'description': postDescription,
                    'content': postContent,
                    'tags': postTags,
                }
            },function(err, post){
                if(err){
                    return res.status(500).json({
                        ok: false,
                        message: "Error al intentar agregar post"
                    })
                }   
                return res.status(200).json({
                    ok: true,
                    message: "El post se edito correctamente"
                })
            })
        }
    })
})

router.put('/img/:id', function(req,res){
    var postImg = req.files.post_img.name
    var postImgFile = req.files.post_img
    var postId = req.params.id
    var extImg = ""

    if (postImgFile.mimetype == 'image/jpeg'){
        extImg = ".jpeg"
    } else if (postImgFile.mimetype == 'image/jpg') {
        extImg = ".jpg"    
    } else if (postImgFile.mimetype == 'image/png') {
        extImg = ".png"     
    } 
  

    //validacion de campos
    if (!postImg) {
        return res.status(400).json({
            ok: false,
            message: "Favor de enviar los campos obligatorios"
        })
    }

    PostModel.findOne({'_id':postId}, function(err, post){
        if(err){
            return res.status(500).json({
                ok: false,
                message: "Error en la consulta"
            })
        }
        if(post){
           //  console.log(post)

            fs.unlink(`./public/images/post/${post.img}`, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: "Error al intentar borrar la imagen"
                    })
                }
                postImg = Math.random().toString(36).substring(7)
                postImg = `${postImg}${extImg}`
                   //se realiza funcion para guardar la imagen
                postImgFile.mv(`./public/images/post/${postImg}`, err => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: "Error al intentar guardar la imagen"
                        })
                    }

                    PostModel.findByIdAndUpdate(postId, {
                        "$set": {
                            'img': postImg,
                        }
                    },function(err, post){
                        if(err){
                            return res.status(500).json({
                                ok: false,
                                message: "Error al actualizar la imagen"
                            })
                        }   
                        return res.status(200).json({
                            ok: true,
                            message: "La imagen se edito correctamente"
                        })
                    })
                })
            })   
        }
    })
})

router.delete('/:id', function(req, res){
    var idPost = req.params.id
    PostModel.findByIdAndUpdate(idPost,{
        '$set': {
            'activated': false
        }
    }, function(err, post){
        if(err){
            return res.status(500).json({
                ok: false,
                message: "Error al intentar desactivar el usuario"
            })
        }
        return res.status(200).json({
            ok: true,
            message: "El usuario se desactivo correctamente"
        })
    })
})

router.get('/graphs/1', function(req, res){
    var data = {
        "tags": [],
        "totales":[],
        "anime": 0,
        "cine": 0,
        "ciencia": 0,
        "tecnologia": 0
    }

    PostModel.count({"tags": "anime"}).exec(function(err, totalAnime){
        if(err){ 
            return res.status(500).json({
                ok: false,
                message: "Error en la consulta" 
            })
        } 

        data.anime = totalAnime
        data.tags.push("anime")
        data.totales.push(totalAnime)

        PostModel.count({"tags": "ciencia"}).exec(function(err, totalCiencia){
            if(err){ 
                return res.status(500).json({
                    ok: false,
                    message: "Error en la consulta" 
                })
            } 
    
            data.ciencia = totalCiencia 
            data.tags.push("ciencia")
            data.totales.push(totalCiencia)

            PostModel.count({"tags": "tecnologia"}).exec(function(err, totalTecnologia){
                if(err){ 
                    return res.status(500).json({
                        ok: false,
                        message: "Error en la consulta" 
                    })
                } 
        
                data.tecnologia = totalTecnologia
                data.tags.push("tecnologia")
                data.totales.push(totalTecnologia)

                PostModel.count({"tags": "cine"}).exec(function(err, totalCine){
                    if(err){ 
                        return res.status(500).json({
                            ok: false,
                            message: "Error en la consulta" 
                        })
                    } 
            
                    data.cine = totalCine
                    data.tags.push("cine")
                    data.totales.push(totalCine)
                    res.json(data)       
                }) 
            })
        })
    })
})


module.exports = router;

