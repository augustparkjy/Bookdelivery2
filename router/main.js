// const express = require('express')
// const route = express.Router();
var express = require('express');
var router = express.Router();

// // middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// });
// define the home page route
router.get('/', function(req, res) 
{
    res.render('home.html');
});

// 이용자
router.get('/registerProvider/',function(req,res){
    res.render('registerProvider.html');
});

router.post('/searchBooks',function(req,res){
    res.render('searchBooks.html');
});

router.get('/checkOrderForUser',function(req,res){
    res.render('checkOrderForUser.html');
});

router.post('/renewBooks',function(req,res){
    res.render('renewBooks.html');
});
router.post('/returnBooks',function(req,res){
    res.render('returnBooks.html');
});

router.post('/rechargePoint',function(req,res){
    res.render('rechargePoint.html');
});

// 제공자
router.post('/manageBooks',function(req,res){
    res.render('manageBooks.html');
});

router.get('/checkOrderForProvider',function(req,res){
    res.render('checkOrdersforProvider.html');
});

router.post('/addBooks',function(req,res){
    res.render('addBook.html');
});

module.exports = router;