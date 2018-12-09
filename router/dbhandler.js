// var mysql = require('mysql');
// var config =mysql 
// var pool = mysql.createPool({
//     host    :
//     user:
//     password:
//     database:
// });

pool.getConnection(function(err, connection){
    connection.query("SELECT * FROM sometable", function(error, results, fields){
        connection.release();

        if(error) throw error;
    })
})
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'me',
  password : 'secret',
  database : 'my_db'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

connection.end();