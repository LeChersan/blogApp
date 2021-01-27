var express = require('express');
var router = express.Router();
var UserModel = require("../../../models/User")
var bcrypt = require("bcrypt")
var fileUpload = require("express-fileupload")

router.use(fileUpload())

router.post('/', function (req, res, next) {

    //Se obtienen datos
    var userName = req.body.user_name
    var userLastName = req.body.user_last_name
    var userEmail = req.body.user_email
    var userPassword = req.body.user_password
    var userRol = req.body.user_rol
    var userImg = req.files.user_img.name
    var userFileImg = req.files.user_img
    var userFacebook = req.body.user_facebook
    var userInstagram = req.body.user_instagram
    var userTwitter = req.body.user_twitter
    var userLinkedin = req.body.user_linkedin

    //validacion de campos
    if (!(userName || userLastName || userEmail || userPassword || userRol || userFacebook || userInstagram || userTwitter || userLinkedin)) {
        return res.status(400).json({
            ok: false,
            message: "Favor de enviar los campos obligatorios"
        })
    }

    //validacion de campos vacios
    if ((userName == '' || userEmail == '' || userPassword == '' || userRol == '')) {
        return res.status(400).json({
            ok: false,
            message: "Favor llenar los campos obligatorios"
        })
    }

    //validacion email
    UserModel.findOne({ "email": userEmail }, function (err, email) {

        //manda error si la consulta no se ejecuto correctamente
        if (err) {
            res.status(500).json({
                ok: false,
                message: "Internal server error"
            })
        }

        //se envia respuesta de correo existente
        if (email) {
            res.status(400).json({
                ok: false,
                message: "That email already exists, please try with a different email"
            })
        }
        else {

            //funcion para encriptar la password
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(userPassword, salt, function (err, hash) {

                    //se envia mensaje si hubo error al encriptar password
                    if (err) {
                        res.status(500).json({
                            ok: false,
                            message: "Internal server error"
                        })
                    }

                    //se realiza funcion para guardar la imagen
                    userFileImg.mv(`./public/images/${userImg}`, err => {
                        if (err) {
                            res.status(500).json({
                                ok: false,
                                message: "Error al intentar guardar la imagen"
                            })
                        }

                        var newUser = new UserModel()

                        newUser.name = userName
                        newUser.last_name = userLastName
                        newUser.email = userEmail
                        newUser.password = hash
                        newUser.rol = userRol
                        newUser.img = userImg
                        newUser.social_media.facebook = userFacebook
                        newUser.social_media.instagram = userInstagram
                        newUser.social_media.twitter = userTwitter
                        newUser.social_media.linkedin = userLinkedin

                        //Funcion para guardar datos despues de proceso de validacion
                        newUser.save(function (err, user) {

                            //se envia mensaje de error al intentar guardar datos
                            if (err) {
                                res.status(500).json({
                                    ok: false,
                                    message: "Cannot complete signup process"
                                })
                            }

                            //se envia respuesta por datos guardados exitosamente
                            if (user) {
                                res.status(201).json({
                                    ok: true,
                                    message: "usuario agregado correctamente"
                                })
                            }
                        })

                    })

                })
            })
        }
    })
});

router.get('/:id', function (req, res) {
    UserModel.findOne({ '_id': req.params.id }).exec(function (err, user) {
        if (err) {
            console.log(err)
            return res.status(500).json({
                ok: false,
                message: "Error en la consulta"
            })
        }
        if (user) {
            return res.json(user)
        }
    })
})

router.get('/', function(req, res){
    UserModel.find().exec(function(err, users){
        if(err){ 
            return res.status(500).json({
                ok: false,
                message: "Error en la consulta"
            })
        }
        res.json(users)
    })
})

router.put('/:id', function(req, res){
        //Se obtienen datos
        // var userId = req.params.id
        // var userName = req.body.user_name
        // var userLastName = req.body.user_last_name
        // var userEmail = req.body.user_email
        // var userPassword = req.body.user_password
        // var userRol = req.body.user_rol
        // var userImg = req.files.user_img.name
        // var userFileImg = req.files.user_img
        // var userFacebook = req.body.user_facebook
        // var userInstagram = req.body.user_instagram
        // var userTwitter = req.body.user_twitter
        // var userLinkedin = req.body.user_linkedin  
})

module.exports = router;

