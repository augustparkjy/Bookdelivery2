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
var user_point
var opt1
var opt2

console.log(id + ":" + pw)

con.connect(function(err) {
    if (err) throw err;
    con.query("use bd2", function(err, result, fields){
        if(err) console.log(err)
        else console.log('connected')
    })
  });
// 도서 등록
app.post('/add', function(req, res){
    // 등록 눌렀을 때
    // var genrecode
    // var ratecode
    if(req.body.info==="register"){
        // switch(req.body.genre){
        //     case 'sports':
        //     genrecode = '1';
        //     break;
        //     case 'horror':
        //     genrecode = '2';
        //     break;
        //     case 'action':
        //     genrecode = '3';
        //     break;
        //     case 'science':
        //     genrecode = '4';
        //     break;
        //     case 'humanities':
        //     genrecode = '5';
        //     break;
        // }
        // switch(req.body.rate){
        //     case 'all':
        //     ratecode = '0';
        //     break;
        //     case 'adult':
        //     ratecode = '1';
        //     break;
        // }
        var sql = 'INSERT INTO BOOK (TITLE, AUTHOR, GENRE, RATE, POINT_PRICE, PROD_ID) VALUES (?, ?, ?, ?, ?, ?)'
        var params = [req.body.title, req.body.author, req.body.genre, req.body.rate, req.body.price, id]
            con.query(sql, params, function(err, result, fields){
                if(err){
                    console.log(err);
                }
                //팝업 처리
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('등록 완료!');
                res.end(); 
            })
    }
    // 취소 눌렀을 때
    else{
        res.sendFile(__dirname+'/views/forProvider.html')
    }
})

app.post('/view', function(req, res){
    //등록된 도서 보기
    if(req.body.info==="등록된 도서 보기"){
        var sql = 'SELECT TITLE, AUTHOR, GENRE, RATE, POINT_PRICE FROM BOOK WHERE PROD_ID = ?'
        var params = [id]
            con.query(sql, params, function(err, result, fields){
                if(err){
                    console.log(err);
                }
                else{
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('책 제목 | 저자 | 장르 | 등급 | 포인트<br><br>')

                    for(var i=0; i<result.length; i++)
                        {   
                            console.log(result);
                            res.write('<input type="button" name="title" value="' + result[i].TITLE + '" disabled="disabled">|'
                            + '<input type="button" name="author" value="' + result[i].AUTHOR + '" disabled="disabled">|'
                            + '<input type="button" name="genre" value="' + result[i].GENRE + '" disabled="disabled">|'
                            + '<input type="button" name="rate" value="' + result[i].RATE + '" disabled="disabled">|'
                            + '<input type="button" name="point" value="' + result[i].POINT_PRICE + '" disabled="disabled">'
                            + '<br>')
                        }
                    res.end();
                }
            })
    }
    // 확인 눌렀을 때
    else{
        res.sendFile(__dirname+'/views/forProvider.html')
    }
})

// 도서 대여 신청
app.post('/rent', function(req,res){
    console.log('rent asf')
    res.sendFile(__dirname+'/views/rent.html')
})

//도서 검색 처리
app.post('/search', function(req, res){
        var sql = 'SELECT * FROM BOOK'
        var opt1 = req.body.genre
        var opt2 = req.body.rate
        console.log(opt1)
        console.log(opt2)
        console.log(req.body.info)
    
        switch(req.body.info){
            case 'title':
                sql = sql + ' WHERE TITLE LIKE "%' + req.body.input + '%"'
                break;
            case 'author':
                sql = sql + ' WHERE AUTHOR LIKE "%' + req.body.input + '%"'
                break;
        }
        if(opt1!=='no'){
            sql = sql + ' AND genre = "'+opt1+'"'
        }
        if(opt2!=='no'){
            sql = sql + ' AND rate = "'+opt2+'"'
        }
        
        con.query(sql, function(err, result, fields){
            if(err){
                console.log(err);
            }
            if(result.length>0)
            {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<form action="/rent" method="POST">')

                res.write('선택 | 책 제목 | 저자 | 장르 | 등급 | 포인트<br><br>')

                for(var i=0; i<result.length; i++)
                {   
                    res.write('<input type="checkbox" name="select">|' 
                    + '<input type="button" name="title" value="' + result[i].title + '" disabled="disabled">|'
                    + '<input type="button" name="author" value="' + result[i].author + '" disabled="disabled">|'
                    + '<input type="button" name="genre" value="' + result[i].genre + '" disabled="disabled">|'
                    + '<input type="button" name="rate" value="' + result[i].rate + '" disabled="disabled">|'
                    + '<input type="button" name="point" value="' + result[i].point_price + '" disabled="disabled">'
                    + '<br>')
                }
                res.write('<br>선택 도서 대여 신청')
                res.write('<input type="submit" value="신청"<br></form>')
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
    console.log(req.body.id)
    if(req.body.info==="user"){
        var sql = 'SELECT PASSWORD FROM USER WHERE USER_ID = ?'
        var params = [req.body.id]
        con.query(sql, params, function(err, result, fields){
            if(err){
                console.log(err);
            } else {
                console.log(result)
                if(result==""){
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('no data!');
                    res.end();
                    return
                }
                else if(req.body.pw==result[0].PASSWORD){
                    id=req.body.id
                    pw=req.body.pw
                    res.sendFile(__dirname + '/views/forUser.html')
                    return
                }
        }})
    }
    else{
        var sql = 'SELECT PASSWORD FROM PRODUCER WHERE PROD_ID = ?'
        console.log(req.body.id)
        console.log(req.body.pw)
        var params = [req.body.id]
        con.query(sql, params, function(err, result, fields){
            if(err){
                console.log(err);
            } else {
                if(result==""){
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('no data!');
                    res.end();
                    return
                }
                else if(req.body.pw==result[0].PASSWORD){
                    id=req.body.id
                    pw=req.body.pw
                    res.sendFile(__dirname + '/views/forProvider.html')
                    return
                }
        }})
    }
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});