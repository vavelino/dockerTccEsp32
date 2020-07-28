const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
// Rotas
const admin = require('./routes/admin');
const esp = require('./routes/esp');
const site = require('./routes/usuarioSite');

const path = require('path');
const usudb = require('./models/Usuaridb');
const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
require('./config/auth')(passport);
const { aute } = require('./helpers/eAdmin');
//const ciclo= require("./models/ciclo")

// Configurações
//Sessão
//app.use()  //Tudo que tem o use() é um middle
//configuracao session
app.use(
  session({
    secret: 'Controle de Acesso',
    resave: true,
    saveUninitialized: true,
  })
);
// Passport
app.use(passport.initialize());
app.use(passport.session());

//configuração flash
app.use(flash());
//Middleware
app.use((req, res, next) => {
  // Exemplo variavél Global res.locals.nome="Meu nome";
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
// Template Engine
// usar o handlebars como template engine
// Tem que existir a pasta views obrigatóriamente com esse nome
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Configuração Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public'))); // bootstrap

//Rotas
/*
app.get('/', function (req, res) {
    usudb.connection.query("select * from postagems", function (err, posts, field) {
        if (err) throw err;
        res.render('home', { posts: posts })
    })
})*/

app.get('/', function (req, res) {
  res.render('home');
});

app.use('/site', site);
//app.use('/admin', aute,admin)
// colocar no nav bara para aparecer so alguns menus
app.use('/admin', admin);
app.use('/esp', esp);

// tem que ser a ultima
app.listen(8080, function () {
  console.log('Servidor Rodando'); // Função call back
});
