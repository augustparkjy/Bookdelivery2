var express = require('express')
var app = express()
var birds = require('./birds.js');
var router = require('./router/main.js')
var http = require('http')
var bodyParser = require('body-parser');
var mysql = require('mysql')

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extened: true}));
app.use(bodyParser.json());

app.use(router);

var con = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    port: '3306'
})

con.connect(function(err) {
    if (err) throw err;
    con.query("use bd");
    // con.query("SELECT * FROM user", function (err, result, fields) {
    //   if (err) throw err;
    //   console.log(result);
    // });
  });

app.post('/login', function(req,res){
    var id = req.body.id
    var pw = req.body.pw
    console.log(id + ':' + pw);
    if(req.body.info==="user"){
        con.query('SELECT USER_ID, PASSWORD FROM USER', function(err, result, fields){
            if(err){
                console.log(err);
            } else {
                for(var i=0; i<result.length; i++){
                    console.log(result[i].USER_ID)
                    console.log(id);
                    console.log(result[i].PASSWORD)
                    console.log(pw);
                    if(id===result[i].USER_ID && pw===result[i].PASSWORD){
                        res.sendFile(__dirname + '/views/forUser.html')
                    }
            }
            // res.send('no data');
            console.log('no data!');
        }})
        // res.sendFile(__dirname + '/views/forUser.html')
    }
    else{
        con.query('SELECT PROD_ID, PASSWORD FROM PRODUCER', function(err, result, fields){
            if(err){
                console.log(err);
            } else {
                for(var i=0; i<result.length; i++){
                    if(id===result[i].PROD_ID && pw===result[i].PASSWORD){
                        res.sendFile(__dirname + '/views/forProvider.html')
                    }
            }
            // res.send('no data!');
            console.log('no data!');
        }})
        // res.sendFile(__dirname + '/views/forProvider.html')
    }
})

//   host     : process.env.RDS_HOSTNAME,
//   user     : process.env.RDS_USERNAME,
//   password : process.env.RDS_PASSWORD,
//   port     : process.env.RDS_PORT



//   con.end();

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});