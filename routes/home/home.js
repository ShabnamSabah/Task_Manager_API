const express = require('express');
const router = express.Router();

//const User = require('../../model/User');


router.get('/',(req,res)=>{
  res.render('home/index',{
    layout: 'index-layout'
  });
})

module.exports = router



