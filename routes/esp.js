const express = require("express")
const routeresp = express.Router()
const Pilha = require("../models/pilha")
const usudb = require("../models/Usuaridb")
var moment = require('moment')
//const Filas = require("../models/filas")


// Variavéis
var tempo = 0;
var tempoIncoerencia = 0;// Variável para controle de incoerrências
var tempointerno = 0; // Variável para controle de pedidos internos
var pilhaPedido = Pilha.pilha;
var pilhaEnvio = Pilha.pilha2;
var pilhaPedidoExterno = Pilha.pilha3; // Adiciona e excrui usuários
var pilhaincoerrencia = Pilha.pilha4; // Pilha de análise de incoerrência

let semaforoincoerrencia = false;// Indica quando as incoerencias estão rodando
let controleLog = true;// Serve para que o sistema só peça o log quando o anterior for excruido
var ae = 0;
const fila = [];
routeresp.get("/servertoesp/:id", (req, res) => {
  if (req.params.id == 'ESP_1') {
    if (pilhaPedidoExterno.GetCount() == 0) {
      if (fila.length == 0) {
        if (tempo > 1000000) {
          tempo = -1;
        }
        tempo++
        console.log("GET ID:" + req.params.id)
        if (pilhaPedido.GetCount() == 0) {
          res.send("N")
        } else {
          res.send(pilhaPedido.Pop())
        }
      } else { // Caso haja pedido de incoerência
        res.send(fila.pop()) // Segunda prioridade
      }
    } else {
      res.send(pilhaPedidoExterno.Pop()) // Pedido externo tem prioridade maior
    }
  } else {
    console.log("Desconhecido")
  }
})


routeresp.post("/esptoserver", (req, res) => {
  pilhaEnvio.Push(req.body.a);
  res.sendStatus(200) //OK  
})
// Responsável por controlar os pedidos de LOG
/*
var Pedidos = setInterval(function () {
  if (semaforoincoerrencia == false) {
    if (tempointerno != tempo) {
    //  pilhaPedido.Push("L"); // v 
     // tempointerno = tempo;
    }
  }
}, 1000);
*/
//Tratamento dos dados recebidos
var tratamentoDados = setInterval(function () {

  var mensgrecebida
  var log = ""
  var ID = ""
  var autentificação = ""
  var data = ""
  var informação = 0

  if (pilhaEnvio.GetCount() != 0) {
    mensgrecebida = pilhaEnvio.Pop();
    //console.log(mensgrecebida)
    switch (mensgrecebida[0]) {
      case 'v':
        console.log("ta vivo")
        break;
      case 't':
        agora();
        break;
      case 'L'://    L/LOG/0.TXTa9ff582c$N$10
        console.log(mensgrecebida);
        if (mensgrecebida[1] != '$') {
          for (var a = 6; a < mensgrecebida.length; a++) {
            var b = (mensgrecebida[a] == '.') || (mensgrecebida[a] == 'T') || (mensgrecebida[a] == '$')
            if (b) {
              informação++
            } else {
              switch (informação) {
                case 0:
                  log += mensgrecebida[a];
                  pilhaPedido.Push("R\n" + log);
                  break;
                case 3:
                  ID += mensgrecebida[a];
                  break;
                case 4:
                  autentificação += mensgrecebida[a];
                  break;
                case 5:
                  data += mensgrecebida[a];
                  break;
              }
            }
          }
          // console.log('/log= ' + log + '/ID= ' + ID + '/aute= ' + autentificação + '/data= ' + data)
          if (autentificação == 'N') {
            autentificação = 'Não autorizado'
          }
          if (autentificação == 'A') {
            autentificação = 'Autorizado'
          }
          sql = "SELECT * FROM log where tempo =" + data
          usudb.connection.query(sql, function (err, posts, field) {  // verificar se esse log já foi gravado            
            if (posts.length == 0) {
              var a = "insert into log(numero,aute,tempo,dt)values('"
              var b = ID;
              var c = "','"
              var d = autentificação
              var e = "','"
              var f = data;
              var g = "',CURRENT_TIMESTAMP)"
              var sql = a + b + c + d + e + f + g;
              usudb.connection.query(sql, function (err, result) {
                if (err) {
                  console.log("Erro ao gravar LOG")
                } else {
                  console.log("LOG gravado com sucesso")
                  if (semaforoincoerrencia == false) {
                    //pilhaPedido.Push("T\n200");
                  }
                }
              })
            } else {
              console.log("Esse LOG já está gravado")
            }
          })
        } else {
          if (mensgrecebida[2] == 'N') {
            console.log("Sem LOG")
            controleLog = true;
          }
          if (mensgrecebida[2] == 'E') { // Algum log foi excruido
            var idLogExcruido;
            for (var a = 3; a < mensgrecebida.length; a++) {
              idLogExcruido = mensgrecebida[a]
            }
            console.log("Excruido Log: " + idLogExcruido)
            controleLog = true;
          }
        }
        break;
      case 'E':
        autentificação = mensgrecebida[2];
        for (var a = 4; a < mensgrecebida.length; a++) {
          ID += mensgrecebida[a];
        }
        console.log('/ID= ' + ID + '/aute= ' + autentificação)
        break;
    }
  }
}, 1000);

function agora() {
  var ag = Math.floor(Date.now() / 1000) - 3 * 3600 // Brasil -3   
  var envio = "t\nt\n" + ag;
  pilhaPedido.Push(envio);
}
// Função para adicionar zero nos minutos e segundos
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
//ROTAS:

/*
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
*/
// ROTA LOG
// ROTA LOG versão antiga
// Versão nova
var organizado = '0'; // Guarda o valor anterior
routeresp.get("/log/:ordem/:pagina", (req, res) => {
  let controleOrdem; 
    controleOrdem = req.params.ordem
  
  switch (controleOrdem) {
    case '0':
      organizado = '0';
      sql = " select	u.nome as nome,    l.id as id,    l.numero as numero,    l.aute as aute,    l.tempo as tempo,    l.dt as dt     from usuario u    right OUTER JOIN  log l	on u.numero = l.numero ORDER BY nome ASC"
      break;
    case '1':
      organizado = '1';
      sql = " select	u.nome as nome,    l.id as id,    l.numero as numero,    l.aute as aute,    l.tempo as tempo,    l.dt as dt     from usuario u    right OUTER JOIN  log l	on u.numero = l.numero ORDER BY aute ASC"
      break;
    case '2':
      organizado = '2';
      sql = " select	u.nome as nome,    l.id as id,    l.numero as numero,    l.aute as aute,    l.tempo as tempo,    l.dt as dt     from usuario u    right OUTER JOIN  log l	on u.numero = l.numero ORDER BY dt ASC"
      break;
    case '3':
      organizado = '3';
      sql = " select	u.nome as nome,    l.id as id,    l.numero as numero,    l.aute as aute,    l.tempo as tempo,    l.dt as dt     from usuario u    right OUTER JOIN  log l	on u.numero = l.numero ORDER BY tempo ASC"
      break;
    case '4':
      organizado = '4';
      sql = " select	u.nome as nome,    l.id as id,    l.numero as numero,    l.aute as aute,    l.tempo as tempo,    l.dt as dt     from usuario u    right OUTER JOIN  log l	on u.numero = l.numero ORDER BY id ASC"
      break;
    default:
      organizado = '4';
      sql = " select	u.nome as nome,    l.id as id,    l.numero as numero,    l.aute as aute,    l.tempo as tempo,    l.dt as dt     from usuario u    right OUTER JOIN  log l	on u.numero = l.numero ORDER BY id ASC"
      break;
  }
  usudb.connection.query(sql, function (err, posts, field) {
    if (err) throw err;
    for (a = 0; a < posts.length; a++) {
      if (posts[a].nome == null) {
        posts[a].nome = 'Desconhecido'
      }
      var dataInput = posts[a].dt
      data = new Date(dataInput);
      var dataFormatada = "Hora: " + addZero(data.getHours()) + ":" + addZero(data.getMinutes()) + ":" + addZero(data.getSeconds()) + " | Data: " + ("0" + data.getDate()).substr(-2) + "/" + ("0" + (data.getMonth() + 1)).substr(-2) + "/" + data.getFullYear();
      posts[a].dt = dataFormatada;
      var dataInput = posts[a].tempo;
      data = new Date((dataInput) * 1000);
      var dataFormatada = "Hora: " + addZero(data.getUTCHours()) + ":" + addZero(data.getUTCMinutes()) + ":" + addZero(data.getUTCSeconds()) + " | Data: " + ("0" + data.getDate()).substr(-2) + "/" + ("0" + (data.getMonth() + 1)).substr(-2) + "/" + data.getFullYear();
      posts[a].tempo = dataFormatada;
    }
    if (err) throw err;
    if (req.params.pagina == '0') {
      res.render('log/logesp', { posts: posts })
    } else {
      res.render('log/logaesp', { posts: posts })
    }
  })
})







// ROTA delete
routeresp.get("/log/delete", (req, res) => {
  usudb.connection.query("DELETE FROM log", function (err, posts, field) {
    usudb.connection.query("ALTER TABLE log AUTO_INCREMENT = 0", function (err, posts, field) {
      res.redirect("/esp/log/4/0");
    })
  })
})
var vez = 12// = 0;
routeresp.get("/inco", (req, res) => { // Giro de incoerrências
  vez = 0;
  res.redirect("/");
})
//DE TEMPOS EM TEMPOS VERFICAR OS USUÁRIOS CADASTRADOS NO ESP

var n_banco = 0;// quantidade no banco

var Incoerencia = setInterval(function () {
  semaforoincoerrencia = true;
  switch (vez) {
    case 0:
      for (a = 0; a < fila.length; a++) { // limpando a fila
        fila.pop()
      }
      vez = 1;
      break;
    case 1:
      if (tempoIncoerencia != tempo) {
        tempoIncoerencia = tempo;
        fila.unshift("T\n600")// Altera Tempo de requisições get do esp para 200 ms
        vez = 2;
      }
      break;
    case 2:
      if (tempoIncoerencia != tempo) {
        vez = 3;
        fila.unshift("B\na\n2") // Excrui todos arquivos dentro da pasta 2
        tempoIncoerencia = tempo;
        n_banco = 0
      }
      break;
    case 3:
      if (tempoIncoerencia != tempo) {
        tempoIncoerencia = tempo;
        sql = "select * from usuario";
        usudb.connection.query(sql, function (err, posts, field) {
          if (n_banco < posts.length) {
            a = n_banco;
            fila.unshift("a\n" + posts[a].nome + "$" + posts[a].numero + "\n2") // Grava tudo na pasta 2 a de backup
            n_banco++;
          } else {
            vez++;
            tempoIncoerencia = tempo;
          }
        })
      }
      break;
    case 4:
      if (tempoIncoerencia != tempo) {
        tempoIncoerencia = tempo;
        fila.unshift("p\na\n2") // Troca a pasta da leitura do esp para a pasta 2
        vez++;
      }
      break;
    case 5:
      if (tempoIncoerencia != tempo) {
        tempoIncoerencia = tempo;
        fila.unshift("p\na\n2") // Troca a pasta da leitura do esp para a pasta 2
        vez++;
      }
      break;
    case 6:
      if (tempoIncoerencia != tempo) {
        tempoIncoerencia = tempo;
        fila.unshift("B\na\n1") // Excrui os arquivos dentro da pasta 1
        vez++;
        n_banco = 0
      }
      break;
    case 7:
      if (tempoIncoerencia != tempo) {
        tempoIncoerencia = tempo;
        sql = "select * from usuario";
        usudb.connection.query(sql, function (err, posts, field) {
          if (n_banco < posts.length) {
            a = n_banco;
            fila.unshift("a\n" + posts[a].nome + "$" + posts[a].numero + "\n1") // Grava tudo na pasta 2 a de backup
            n_banco++;
          } else {
            vez++;
            tempoIncoerencia = tempo;
          }
        })
      }
      break;
    case 8:
      if (tempoIncoerencia != tempo) {
        tempoIncoerencia = tempo;
        fila.unshift("p\na\n1") // Troca a pasta da leitura do esp para a pasta 1
        vez++;
      }
      break;
    case 9:
      if (tempoIncoerencia != tempo) {
        tempoIncoerencia = tempo;
        fila.unshift("B\na\n2") // Excrui os arquivos dentro da pasta 2
        vez++;
      }
      break;
    case 10:
      if (tempoIncoerencia != tempo) {
        tempoIncoerencia = tempo;
        fila.unshift("G\na")  // Altera Tempo de requisições get do esp para o padrão
        vez = 11;
      }
      break;
    case 11:
      agora();
      controleLog = true;
      vez++;
      break;
    case 100: // 20 em 20 segundos
      console.log("Inicio da rotina de análise de incoerrências")
      vez = 0;
      break;
    default:
      if (tempointerno != tempo) {
        // pilhaPedido.Push("L"); // v
        if (controleLog) {
          controleLog = false;
          pilhaPedido.Push("L");
          //fila.unshift("L")
        }
        tempointerno = tempo;
        vez++;
      }
      break;
  }
  // console.log(vez)
  semaforoincoerrencia = false;
}, 1000);



// Exports
module.exports = routeresp
module.exports.adicionarnaPilha = (informação) => {
  pilhaPedidoExterno.Push(informação);
}














