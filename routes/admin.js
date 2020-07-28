const express = require("express")
const router = express.Router()
//const Post = require('../models/Post')
//const banco = require('../models/db')
const usudb = require("../models/Usuaridb")
const esp = require("../routes/esp")



/*
router.get('/cad', function (req, res) {
    res.render('formulario')
})
router.post('/add', function (req, res) {



    var sql = "insert into estados(nome,sigla)values ?";
    var values = [[req.body.titulo, req.body.conteudo]]

    usudb.connection.query(sql, [values], function (err, result) {
        if (err) res.send("Erro Criação postagem");
        res.send("Postagem criada com sucesso");
    })

})
router.get('/deletar/:id', function (req, res) {

    var sql = "DELETE FROM postagems WHERE id =" + req.params.id;
    usudb.connection.query(sql, function (err, posts, field) {
        if (err) res.send("Postagem não existe");
        res.send("Postagem deletada com sucesso");
    })
})*/
router.get('/usuario/deletar/:id', function (req, res) {
    var sql = "select * from usuario where id=" + req.params.id;
    usudb.connection.query(sql, function (err, posts, field) {
       // console.log(posts[0].numero)
        if (err) {
        } else {
            esp.adicionarnaPilha("r\n" + posts[0].numero + "\n1")
        }
    })
    var sql = "DELETE FROM usuario WHERE id =" + req.params.id;
    usudb.connection.query(sql, function (err, posts, field) {
        if (err) {
            req.flash("error_msg", "Erro ao deletar o Usuário ")
        } else {
            sql = "SET @count = 0 "
            usudb.connection.query(sql, function (err, posts, field) { })
            sql = "UPDATE `usuario` SET `usuario`.`id` = @count:= @count + 1 "
            usudb.connection.query(sql, function (err, posts, field) { })
            sql = "ALTER TABLE usuario AUTO_INCREMENT = 0 "
            usudb.connection.query(sql, function (err, posts, field) { })
            req.flash("success_msg", "Usuário deletado com sucesso")
        }
        res.redirect("/admin/usuario")
    })
})
router.post("/usuario/editar", (req, res) => {

    var sql = "UPDATE usuario SET nome='" + req.body.nome + "',numero='" + req.body.numero + "'where id=" + req.body.id



    usudb.connection.query(sql, function (err, dados, field) {

        if ((err) || (dados.affectedRows == 0)) {
            req.flash("error_msg", "Esse usuário não existe");
        } else {
            req.flash("success_msg", "Usuário editado com sucesso")
        }
        res.redirect("/admin/usuario");
    })
})
router.get("/usuario/edit/:id", (req, res) => {
    var sql = "select * from usuario where id = " + req.params.id;
    usudb.connection.query(sql, function (err, dados, field) {
        if ((err) || (dados.length <= 0)) {
            //throw err;
            req.flash("error_msg", "Esse usuário não existe");
            res.redirect("/admin/usuario");
        } else {
            res.render('admin/editusuario', { dados: dados })
        }
    })
})
router.get("/usuario", (req, res) => {
    usudb.connection.query("select * from usuario", function (err, posts, field) {
        // console.log(posts)
        if (err) throw err;
        res.render('admin/usuario', { posts: posts })
    })
})
router.get("/usuario/add", (req, res) => {
    res.render("admin/addusuario")
})
router.post("/usuario/novo", (req, res) => {
    // (!req.body.nome) -> se não for enviado o nome
    var erros = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ text: "Nome inválido" })// Coloca um novo dado no array
    }
    if (!req.body.tag || typeof req.body.tag == undefined || req.body.tag == null) {
        erros.push({ text: "tag inválido" })// Coloca um novo dado no array
    }
    if (req.body.nome.length < 2) {
        erros.push({ text: "Nome de usuário muito pequeno" })
    }
    if (erros.length > 0) {
        res.render("admin/addusuario", { erros: erros })
    } else {

        var a = "insert into usuario(nome,numero,dt)values('"
        var b = req.body.nome;
        var c = "','"
        var d = req.body.tag;
        var e = "',CURRENT_TIMESTAMP)"
        esp.adicionarnaPilha("a\n" + req.body.nome+"$"+req.body.tag+"\n1")
        var sql = a + b + c + d + e;
        usudb.connection.query(sql, function (err, result) {
            if (err) {
                //res.send("Erro na Criação do Usuário");
                req.flash("error_msg", "Erro ao cadastrar Usuário ")
                // res.redirect("/admin/usuario")
                res.redirect("/admin/usuario/add")
            } else {
                //res.send("Usuario Criado");
                req.flash("success_msg", "Usuário cadastrado com sucesso")
                res.redirect("/admin/usuario")
            }
        })
    }
})

module.exports = router