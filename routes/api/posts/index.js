var express = require('express');
var router = express.Router();
var PostModel = require("../../../models/Post")
var fileUpload = require("express-fileupload")

router.use(fileUpload())

router.post('/', function (req, res, next) {

    //Se obtienen datos
    var postTitle = req.body.post_title
    var postDescription = req.body.post_description
    var postContent = req.body.post_content
    var postTags = req.body['post_tags[]']
    var postImg = req.files.post_img.name
    var postImgFile = req.files.post_img
    var postUserId = req.files.post_user_id


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
        newPost.user_id= postUserId
       

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
    PostModel.findOne({ '_id': req.params.id }).exec(function (err, post) {
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
    PostModel.find().exec(function(err, posts){
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
        var postUserId = req.params.id

        //validacion de campos
        if (!(postTitle || postDescription || postContent || postUserId )) {
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

        PostModel.tags.remove({"_id": postUserId}).exec(function(err, tag){
            //se envia mensaje de error al intentar guardar datos
            if (err) {
                res.status(500).json({
                    ok: false,
                    message: "Cannot complete query"
                })
            }

            //se envia respuesta por datos guardados exitosamente
            if (tag) {
                res.status(201).json({
                    ok: true,
                    message: "tag eliminado correctamente"
                })
            }
        })

        console.log(req.body)
})

module.exports = router;

