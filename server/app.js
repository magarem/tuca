var express = require('express');
var cors = require('cors')
const ejs = require('ejs')
const path = require('path')
const fs = require('fs');

var bodyParser = require('body-parser');

// Load sqlite
const sqlite3 = require('sqlite3').verbose();

// Load produtos data
//var produtos = require('./produtos.json');

// Load Databank
let db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to the in-memory SQlite database.');
  db.run('CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY AUTOINCREMENT, ean CHAR(20), descricao CHAR(230), pco_venda CHAR(10), unidade CHAR(10), estoque CHAR(5))');
  //Create vendas table
  db.run('CREATE TABLE IF NOT EXISTS vendas (id INTEGER PRIMARY KEY AUTOINCREMENT, vendaID CHAR(20), cliente int, subtotal int, desconto int, acrescimo int, total int, dinheiro int, debito int, credito int, totalpago int, troco int)');
  //Create vendas_itens table
  db.run('CREATE TABLE IF NOT EXISTS vendas_itens (id INTEGER PRIMARY KEY AUTOINCREMENT, vendaID CHAR(20), vendaItem INTEGER, ean CHAR(10), descricao CHAR(200), unidade CHAR(10), pco_venda CHAR(10), qnt INTEGER, subtotal INTEGER)');
  //Create fornecedor
  db.run('CREATE TABLE  IF NOT EXISTS "fornecedores" ("id"	INTEGER PRIMARY KEY AUTOINCREMENT, "nome"	char(50), "tipo"	char(15), "doc"	char(25), "contato"	char(30),"fone"	char(100),"fone2"	TEXT,"email"	char(100),"endereco"	TEXT,"obs"	text)');
  //Create compras
  //db.run('CREATE TABLE IF NOT EXISTS compras (id INTEGER PRIMARY KEY AUTOINCREMENT, fornecedor int, data char(100), tipo char(15), cnpjcpf char(25), contato char(30), fone char(100), email char(100), obs text)');

});
function db_close(){
  // close the database connection
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}
function db_populate(){
  for (var i = 0; i < produtos.data.items.length; i++) {
    db.run('INSERT INTO produtos (ean, descricao, pco_venda, unidade, estoque) VALUES (?,?,?,?,?)', [produtos.data.items[i].ean, produtos.data.items[i].descricao, produtos.data.items[i].pco_venda, produtos.data.items[i].unidade, produtos.data.items[i].estoque], function(err) {
        if (err) {
          return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
   }
 }


// Init app
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(cors())


////////////////////////////////
// Cadastros
////////////////////////////////

  // Clientes
  app.get('/dev-api/clientes', function (req, res, next) {

    console.log('req.query:', req.query);
    sqlStr = "SELECT * FROM clientes ";
    console.log('sqlStr', sqlStr);
    db.all(sqlStr, function(err, rows, fields) {
    // console.log('rows.length:', rows.length);
    jsonStr = {
      "code": 20000,
      "data": {
          "total": (rows||[]).length}
      }
     jsonStr.data.items = rows
     res.send(jsonStr);

    });

  })
  app.post('/dev-api/cliente', function (req, res, next) {

    console.log('req.body:', req.body);

    db.run('INSERT INTO clientes (nome, tipo, doc, contato, fone, fone2, email, endereco, obs) VALUES (?,?,?,?,?,?,?,?,?)',
            [req.body.nome,
             req.body.tipo,
             req.body.doc,
             req.body.contato,
             req.body.fone,
             req.body.fone2,
             req.body.email,
             req.body.endereco,
             req.body.obs],
             function(err) {
                if (err) return console.log(err.message);
                // get the last insert id
                console.log(`A row has been inserted with rowid ${this.lastID}`);
             }
    );
    jsonStr = {code: 20000, data: 'success'}
    res.send(jsonStr);
  })
  app.patch('/dev-api/cliente', function (req, res, next) {
    var id = req.body.id

    console.log('req.body:', req.body);
    //
    let data = [req.body.nome, req.body.tipo, req.body.doc, req.body.contato, req.body.fone, req.body.fone2, req.body.email, req.body.endereco, req.body.obs, id];
    let sql = "UPDATE clientes SET nome = ?, tipo = ?, doc = ?, contato = ?, fone = ?, fone2 = ?, email = ?, endereco = ?, obs = ? WHERE id = ?";


    db.run(sql, data, function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row(s) updated: ${this.changes}`);
    });


    res.send({
      code: 20000,
      data: 'success'
    })
  })
  app.delete('/dev-api/cliente', function (req, res, next) {

    console.log('req.body.id:', req.body.id);
    console.log('req.params.id:', req.params.id);
    db.run('DELETE FROM clientes WHERE id = ' + req.body.id);

     res.send({code: 20000,
             data: {
               pvData: [
                 { key: 'PC', pv: 1024 },
                 { key: 'mobile', pv: 1024 },
                 { key: 'ios', pv: 1024 },
                 { key: 'android', pv: 1024 }
               ]
             }
           });
  })

  // Fornecedores
  app.get('/dev-api/fornecedores', function (req, res, next) {

    console.log('req.query:', req.query);
    sqlStr = "SELECT * FROM fornecedores ";
    console.log('sqlStr', sqlStr);
    db.all(sqlStr, function(err, rows, fields) {
    // console.log('rows.length:', rows.length);
    jsonStr = {
      "code": 20000,
      "data": {
          "total": rows.length}
      }
     jsonStr.data.items = rows
     res.send(jsonStr);

    });

  })
  app.post('/dev-api/fornecedor', function (req, res, next) {

    console.log('req.body:', req.body);

    db.run('INSERT INTO fornecedores (nome, tipo, doc, contato, fone, fone2, email, endereco, obs) VALUES (?,?,?,?,?,?,?,?,?)',
            [req.body.nome,
             req.body.tipo,
             req.body.doc,
             req.body.contato,
             req.body.fone,
             req.body.fone2,
             req.body.email,
             req.body.endereco,
             req.body.obs],
             function(err) {
                if (err) return console.log(err.message);
                // get the last insert id
                console.log(`A row has been inserted with rowid ${this.lastID}`);
             }
    );
    jsonStr = {code: 20000, data: 'success'}
    res.send(jsonStr);
  })
  app.patch('/dev-api/fornecedor', function (req, res, next) {
    var id = req.body.id

    console.log('req.body:', req.body);
    //
    let data = [req.body.nome, req.body.tipo, req.body.doc, req.body.contato, req.body.fone, req.body.fone2, req.body.email, req.body.endereco, req.body.obs, id];
    let sql = "UPDATE fornecedores SET nome = ?, tipo = ?, doc = ?, contato = ?, fone = ?, fone2 = ?, email = ?, endereco = ?, obs = ? WHERE id = ?";


    db.run(sql, data, function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row(s) updated: ${this.changes}`);
    });


    res.send({
      code: 20000,
      data: 'success'
    })
  })
  app.delete('/dev-api/fornecedor', function (req, res, next) {

    console.log('req.body.id:', req.body.id);
    console.log('req.params.id:', req.params.id);
    db.run('DELETE FROM fornecedores WHERE id = ' + req.body.id);

     res.send({code: 20000,
             data: {
               pvData: [
                 { key: 'PC', pv: 1024 },
                 { key: 'mobile', pv: 1024 },
                 { key: 'ios', pv: 1024 },
                 { key: 'android', pv: 1024 }
               ]
             }
           });
  })

  // Produtos
  app.get('/dev-api/produtos', function (req, res, next) {
    console.log('req.query:', req.query);

    var sqlWhere = "where 1=1 "
    var sqlLimit = ""
    if (req.query.page){
      sqlLimit = " LIMIT " + (parseInt(req.query.page)-1) * 20 + ", " + req.query.limit
    }
    if (req.query.ean){
      sqlWhere += "and ean like '"+req.query.ean+"'"
    }
    if (req.query.descricao){
      sqlWhere += "and descricao like '%"+req.query.descricao+"%'"
    }
    sqlStr = "SELECT * FROM produtos "+ sqlWhere + " order by id desc " + sqlLimit ;
    console.log('sqlStr', sqlStr);
    db.all(sqlStr, function(err, rows, fields) {
    // console.log('rows.length:', rows.length);
    jsonStr = {
      "code": 20000,
      "data": {
          "total": rows.length}
      }
     jsonStr.data.items = rows
     res.send(jsonStr);

    });

  })
  app.post('/dev-api/produto', function (req, res, next) {

    console.log('req.body:', req.body);

    db.run('INSERT INTO produtos (ean, descricao, pco_venda, unidade, estoque) VALUES (?,?,?,?,?)',
            [req.body.ean,
             req.body.descricao,
             req.body.pco_venda,
             req.body.unidade,
             req.body.estoque],
             function(err) {
                if (err) return console.log(err.message);
                // get the last insert id
                console.log(`A row has been inserted with rowid ${this.lastID}`);
             }
    );
    jsonStr = {code: 20000, data: 'success'}
    res.send(jsonStr);
  })
  app.delete('/dev-api/produto', function (req, res, next) {
    var id = req.body.id
    console.log('req.body.id:', req.body.id);
    console.log('req.params.id:', req.params.id);
    db.run(
          'DELETE FROM produtos WHERE id = ?',
          req.params.id,
          function (err, result) {
              if (err){
                  res.status(400).json({"error": res.message})
                  return;
              }
              res.json({"message":"deleted", changes: this.changes})
      });

   res.send({code: 20000,
             data: {
               pvData: [
                 { key: 'PC', pv: 1024 },
                 { key: 'mobile', pv: 1024 },
                 { key: 'ios', pv: 1024 },
                 { key: 'android', pv: 1024 }
               ]
             }
           });
  })


//////////////////////////////
// Vendas
//////////////////////////////

  // Vendas
  app.get('/dev-api/vendas', function (req, res, next) {
    console.log('req.query:', req.query);

    var sqlWhere = "where 1=1 "
    var sqlLimit = ""
    if (req.query.page){
      sqlLimit = " LIMIT " + (parseInt(req.query.page)-1) * 20 + ", " + req.query.limit
    }
    if (req.query.ean){
      sqlWhere += "and venda like '"+req.query.ean+"'"
    }
    if (req.query.descricao){
      sqlWhere += "and descricao like '%"+req.query.descricao+"%'"
    }
    sqlStr = "SELECT * FROM vendas "+ sqlWhere + " order by id desc " + sqlLimit ;
    console.log('sqlStr', sqlStr);
    db.all(sqlStr, function(err, rows, fields) {
    // console.log('rows.length:', rows.length);
    jsonStr = {
      "code": 20000,
      "data": {
          "total": rows.length}
      }
     jsonStr.data.items = rows
     res.send(jsonStr);

    });

  })
  app.get('/dev-api/vendaItens', function (req, res, next) {
    console.log('req.query:', req.query);


    sqlStr = "SELECT * FROM vendas_itens where vendaId = '" + req.query.vendaID + "'" ;
    console.log('sqlStr', sqlStr);
    db.all(sqlStr, function(err, rows, fields) {
    // console.log('rows.length:', rows.length);
    jsonStr = {
      "code": 20000,
      "data": {
          "total": rows.length}
      }
     jsonStr.data.items = rows
     res.send(jsonStr);

    });

  })

  //Balcao
  app.post('/vendaClose', function (req, res) {
    json_data = JSON.parse(req.body.json_data)

    let data = new Date()
    db.run('INSERT INTO vendas (vendaID, cliente, subtotal, desconto, acrescimo, total, dinheiro, debito, credito, totalpago, troco, created) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [json_data.vendaID, json_data.cliente, json_data.subtotal, json_data.desconto, json_data.acrescimo, json_data.total, json_data.dinheiro, json_data.debito, json_data.credito, json_data.totalpago, json_data.troco, data], function(err) {
      if (err) {
        return console.log(err.message);
      }
      // get the last insert id
      console.log(`${this.lastID}`);
    });

    //Insert itens
    for (var i = 0; i < json_data.itens.length; i++) {
      db.run('INSERT INTO vendas_itens (vendaID, vendaItem, ean, descricao, pco_venda, unidade, qnt, subtotal) VALUES (?,?,?,?,?,?,?,?)', [json_data.itens[i].vendaID, json_data.itens[i].vendaItem, json_data.itens[i].ean, json_data.itens[i].descricao, json_data.itens[i].pco_venda, json_data.itens[i].unidade, json_data.itens[i].qnt, json_data.itens[i].subtotal], function(err) {
          if (err) {
            return console.log(err.message);
          }
          // get the last insert id
          console.log(`insert venda table success`);
      });
     }

    res.send(req.body.json_data);
  });

//////////////////////////////
// Compras
//////////////////////////////

  // Compras
  app.get('/dev-api/compras', function (req, res, next) {
    console.log('req.query:', req.query);

    var sqlWhere = "where 1=1 "
    var sqlLimit = ""
    if (req.query.page){
      sqlLimit = " LIMIT " + (parseInt(req.query.page)-1) * 20 + ", " + req.query.limit
    }
    if (req.query.ean){
      sqlWhere += "and ean like '"+req.query.ean+"'"
    }
    if (req.query.descricao){
      sqlWhere += "and descricao like '%"+req.query.descricao+"%'"
    }
    sqlStr = "SELECT * FROM compras "+ sqlWhere + " order by id desc " + sqlLimit ;
    console.log('sqlStr', sqlStr);
    db.all(sqlStr, function(err, rows, fields) {
    // console.log('rows.length:', rows.length);
    jsonStr = {
      "code": 20000,
      "data": {
          "total": rows||[].length}
      }
     jsonStr.data.items = rows
     res.send(jsonStr);

    });

  })
  app.get('/dev-api/compraItens', function (req, res, next) {

    sqlStr = "SELECT * FROM compras_itens where compraId = '" + req.query.compraID + "'" ;
    console.log('sqlStr', sqlStr);
    db.all(sqlStr, function(err, rows, fields) {
    // console.log('rows.length:', rows.length);
    jsonStr = {
      "code": 20000,
      "data": {
          "total": rows.length}
      }
     jsonStr.data.items = rows
     res.send(jsonStr);

    });

  })

  // Entrada
  app.post('/compraClose', function (req, res) {

    json_data = JSON.parse(req.body.json_data)

    let data = new Date()
    db.run('INSERT INTO compras (compraID, cliente, subtotal, desconto, acrescimo, total, dinheiro, debito, credito, totalpago, troco, created) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [json_data.compraID, json_data.cliente, json_data.subtotal, json_data.desconto, json_data.acrescimo, json_data.total, json_data.dinheiro, json_data.debito, json_data.credito, json_data.totalpago, json_data.troco, data], function(err) {
      if (err) {
        return console.log(err.message);
      }
      // get the last insert id
      console.log(`${this.lastID}`);
    });

    //Insert itens
    for (var i = 0; i < json_data.itens.length; i++) {
      db.run('INSERT INTO compras_itens (compraID, compraItem, ean, descricao, pco_compra, unidade, qnt, subtotal) VALUES (?,?,?,?,?,?,?,?)', [json_data.itens[i].compraID, json_data.itens[i].compraItem, json_data.itens[i].ean, json_data.itens[i].descricao, json_data.itens[i].pco_compra, json_data.itens[i].unidade, json_data.itens[i].qnt, json_data.itens[i].subtotal], function(err) {
          if (err) {
            return console.log(err.message);
          }
          // get the last insert id
          console.log(`insert compra table success`);
      });
     }

    res.send(req.body.json_data);
  });


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
