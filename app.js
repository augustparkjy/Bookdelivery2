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

var id
var pw
var opt1
var opt2

console.log(id + ":" + pw)

con.connect(function(err) {
    if (err) throw err;
    con.query("use bd");
  });

//도서 검색 처리
app.post('/search', function(req, res){
        var sql = 'SELECT * FROM BOOK'
        var opt1 = req.body.genre
        var opt2 = req.body.rate
    
        switch(req.body.info){
            case 'title':
                sql = sql + ' WHERE BOOK_TITLE LIKE "%' + req.body.input + '%"'
                break;
            case 'author':
                sql = sql + ' WHERE AUTHOR LIKE "%' + req.body.input + '%"'
                break;
        }
        if(opt1!=='no'){
            sql = sql + ' AND genre = '+opt1
        }
        if(opt2!=='no'){
            sql = sql + ' AND rate = '+opt2
        }
        
        con.query(sql, function(err, result, fields){
            if(err){
                console.log(err);
            }
            if(result.length>0)
            {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            
                for(var i=0; i<result.length; i++)
                {
                    res.write('book id : ' + result[i].book_id + '|book title : ' + result[i].book_title + '|author : ' + result[i].author + '|genre : '+result[i].genre +'|rate : ' + result[i].rate + '<br>');
                    // return result[i];
                    // console.log(result[i]);
                }
                res.end();
            }
            else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('일치하는 책 정보가 없습니다.');
                res.end();
            }
        })
})


//충전 처리
app.post('/requestRecharge', function(req, res){
    // 충전 눌렀을 때
    if(req.body.info==="recharge"){
        if(req.body.point>0){
            console.log(id)
            console.log(req.body.point)

            var sql = 'UPDATE USER SET POINT = POINT + ? WHERE USER_ID = ?'
            var params = [req.body.point, id]
            con.query(sql, params, function(err, result, fields){
                if(err){
                    console.log(err);
                }
                //팝업 처리
                console.log('충전 완료')
                res.sendfile(__dirname+'/views/forUser.html')
            })   
        // 0이하의 값을 입력했을 때
        } else {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('invalid value!');
            res.end();        
        }
    }
    // 취소 눌렀을 때
    else{
        res.sendFile(__dirname+'/views/forUser.html')
    }
})

//로그인 처리
app.post('/login', function(req,res){
    
    // console.log(id + ':' + pw);
    if(req.body.info==="user"){
        var sql = 'SELECT USER_ID, PASSWORD FROM USER'
        con.query(sql, function(err, result, fields){
            if(err){
                console.log(err);
            } else {
                for(var i=0; i<result.length; i++){
                    if(req.body.id===result[i].USER_ID && req.body.pw===result[i].PASSWORD){
                        id = req.body.id
                        pw = req.body.pw
                        console.log(id+":"+pw)
                        // 유저 로그인 성공시
                        res.sendFile(__dirname + '/views/forUser.html')
                        return
                    }
            }
            // 유저 로그인 실패시
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('no data!');
            res.end();
        }})
    }
    else{
        var sql = 'SELECT PROD_ID, PASSWORD FROM PRODUCER'
        con.query(sql, function(err, result, fields){
            if(err){
                console.log(err);
            } else {
                for(var i=0; i<result.length; i++){
                    if(req.body.id===result[i].PROD_ID && req.body.pw===result[i].PASSWORD){
                        id = req.body.id
                        pw = req.body.pw
                        console.log(id+":"+pw)
                        // 프로듀서 로그인 성공시
                        res.sendFile(__dirname + '/views/forProvider.html')
                        return
                    }
            }
            // 프로듀서 로그인 실패
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('no data!');
            res.end();
        }})
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