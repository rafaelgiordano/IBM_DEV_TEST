
const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : '127.0.0.1',
  port     : '3306',
  user     : 'root',
  password : '',
  database : 'linksibm'
});

connection.connect(function(err){
  if(err) return console.log(err);
  console.log('conectou!');
  createTable(connection);
  //addRows(connection, "link", "origin");
  //connection.end();//fecha a conexão
})

function createTable(conn){
const sql = "CREATE TABLE IF NOT EXISTS links ("+
                  "ID int NOT NULL AUTO_INCREMENT,"+
                  "links varchar(100) NOT NULL,"+
                  "origin varchar(100),"+
                  "PRIMARY KEY (links, origin)"+
                  ");";
      
      conn.query(sql, function (error, results, fields){
          if(error) return console.log(error);
          console.log('criou a tabela!');
      });
}


function addRows(conn, link, origin){
  var sql = "INSERT INTO links(links,origin) VALUES (";
  const values = [
        ['teste1.com.br', 'este1.com.br'],
        ['teste12', 'este1.com.bra'],
        ['teste3', '12312312399']
      ];
      sql = sql + "'"+ link + "','"+ origin + "')";
      const value = "'"+ link + "','"+ origin + "'";
      console.log("value" +value);
  //conn.query(sql, [values], function (error, results, fields){
    conn.query(sql, function (error, results, fields){
          if(error) return console.log(error);
          console.log('adicionou registros!');
          
      });
}

module.exports = createTable;