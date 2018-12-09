// const express = require('express')
// const route = express.Router();
var express = require('express');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) 
{
    res.render('home.html');
});

// router.get('/forUser',function(req,res){
//     res.render('forUser.html');
// });

// router.get('/forProvider',function(req,res){
//     res.render('forProvider.html');
// });

router.get('/checkOrderForUser',function(req,res){
    res.render('checkOrderForUser.html');
});

router.get('/checkOrderForProvider',function(req,res){
    res.render('checkOrderForProvider.html');
});

router.post('/manageBooks',function(req,res){
    res.render('manageBooks.html');
});

router.post('/rechargePoint',function(req,res){
    res.render('rechargePoint.html');
});

router.get('/registerProvider/',function(req,res){
    res.render('registerProvider.html');
});

router.post('/renewBooks',function(req,res){
    res.render('renewBooks.html');
});
router.post('/returnBooks',function(req,res){
    res.render('returnBooks.html');
});
router.post('/searchBooks',function(req,res){
    res.render('searchBooks.html');
});

module.exports = router;