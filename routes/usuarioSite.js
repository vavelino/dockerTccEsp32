const express = require("express")
const routersite = express.Router()
const usudb = require("../models/Usuaridb")
const bcrypt = require("bcryptjs")
const passport = require("passport")

routersite.get("/registro", (req, res) => {
    res.render("acesso/registro")
})
routersite.post("/registro", (req, res) => {
    var erros = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ text: "Nome inválido" })// Coloca um novo dado no array
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ text: "email invalido" })// Coloca um novo dado no array
    }
    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ text: "Senha invalida" })// Coloca um novo dado no array
    }
    if (req.body.senha.length < 4) {
        erros.push({ text: "Senha muito pequena" })
    }
    if (req.body.senha != req.body.senha2) {
        erros.push({ text: "As senhas devem ser iguais" })
    }
    var sql = "select * from usuariosite where nome ='" + req.body.nome + "'";

    usudb.connection.query(sql, function (err, result) {
        if (err) {
            req.flash("error_msg", "Erro durante salvamento do usuário")
            res.redirect("/")
        } else {
            if (result.length > 0) {
                erros.push({ text: "Ja existe usuário com esse nome" })
            }
            if (erros.length > 0) {
                res.render("acesso/registro", { erros: erros })
            } else {
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(req.body.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "Erro durante salvamento do usuário")
                            res.redirect("/")
                        } else {
                            var a = "insert into usuariosite(nome,email,senha,eadmin,dt)values('"
                            var b = req.body.nome;
                            var c = "','"
                            var d = req.body.email;
                            var e = "','"
                            //hash
                            var g = "','"
                            var h = "false"
                            var i = "',CURRENT_TIMESTAMP)"
                            var sql = a + b + c + d + e + hash + g + h + i;
                            usudb.connection.query(sql, function (err, result) {
                                if ((err) || result.affectedRows == 0) {
                                    req.flash("error_msg", "Erro ao cadastrar acesso ")
                                    res.redirect("/")
                                } else {
                                    req.flash("success_msg", "Acesso cadastrado")
                                    res.redirect("/site/registro")
                                }
                            })
                        }
                    })
                })
            }
        }
    })
})
routersite.get("/login", (req, res) => {
    res.render("acesso/login")
})
routersite.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/site/login",
        failureFlash:true
    })(req,res,next)
})

module.exports = routersite