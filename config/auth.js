const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
const usudb = require("../models/Usuaridb")

module.exports = function (passport) {
    passport.use(new localStrategy({ usernameField: 'nome', passwordField: "senha" }, (nome, senha, done) => {
        var sql = "select * from usuariosite where nome ='" + nome + "'";
        // console.log("Pedio pelo nome: "+sql)
        usudb.connection.query(sql, function (err, result) {
            //console.log(result)
            //console.log(result.RowDataPacket)
            if ((err) || (result.length <= 0)) {
                //console.log("Não cadastrada")
                return done(null, false, { message: "Essa conta não esta cadastrada" })
            } else {
                // console.log("cadastrado")
                var sql = "select * from usuariosite where nome ='" + nome + "'"
                //console.log(sql)
                usudb.connection.query(sql, function (err, result, fields) {
                    // const number = result[0].senha

                    bcrypt.compare(senha, result[0].senha, (erro, batem) => {
                        if (batem) {
                            // console.log( "Senha batem")
                            return done(null, result)

                        } else {
                            // console.log( "Não batem")
                            return done(null, false, { message: "Senha incorreta" })
                        }
                    })
                })
            }
        })
    }))
    passport.serializeUser((result, done) => {        
        done(null, result[0].id)
    })
    passport.deserializeUser((id, done) => {       
        var sql = "select * from usuariosite where id ='" + id + "'";
        usudb.connection.query(sql, function (err, result) {
            if (!err) {
                done(err, result[0].nome)
            }
        })
    })

}

