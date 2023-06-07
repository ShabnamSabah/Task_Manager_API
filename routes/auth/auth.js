const express = require('express');
const User = require('../../model/User');
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');


router.get('/register', (req, res) => res.render('auth/register',{layout:false}));
router.get('/login', (req, res) => res.render('auth/login', {layout:false}));


router.post('/register', async (req, res) => {

    let { name, email, password, confirmPassword} = req.body;
    //const hash = await bcrypt.hash(password,10);
    let errors = [];
    //Validation
    if (!name || !email || !password || !confirmPassword) {
      errors.push({ text: 'Please fill in all the fields' });
    }
  
    if (password !== confirmPassword) {
      errors.push({ text: 'Password donot match' });
    }
    if (password.length < 4) {
      errors.push({ text: 'Password must be atleast 4 characters!' });
    }
    if (errors.length > 0) {
      //error
      res.render('auth/register', {
        errors,
        name,
        email,
        password,
        confirmPassword,
        layout: false
      });
    }
    else {
      User.findOne({ where: { email: email } })
        .then(user => {
          if (user) {
            //User Exists
            errors.push({ text: 'Email Exists' });
            res.render('auth/register', {
              errors,
              name,
              email,
              password,
              confirmPassword,
              layout: false
            });
          }
          else {
            const newUser = new User({
              name,
              email,
              password,
              role:'user'
            });
            //Hash Password
            bcrypt.genSalt(10, (err, salt) =>
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                //set password to hash
                newUser.password = hash;
                newUser.save()
                  .then(user => {
                    // req.flash('success_msg', 'You Are Registered Succesfully');
                    // res.redirect('/issuer/i_login');
                    res.render('auth/login',{
                        success_msg: 'You Are Registered Succesfully',
                         layout: false
                    })
  
                  })
                  .catch(err => console.log(err));
  
              }))
          }
        });
  
  
    }
  
  
  })
  
 router.post('/login', (req, res) => {


    if (!req.body.email || !req.body.password) {
     // req.flash('error_msg', 'Please Give Email And Password');
      //res.redirect('/auth/login');
      res.render('auth/login',{
        error_msg: 'Please Give Email And Password',
        layout: false
    })
    }
    else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (!user) {
            res.render('auth/login',{
                error_msg: 'This Email Is Not Registered',
                layout: false
            })
          } else {
  
                    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        const token = jwt.sign({
                            username: user.name,
                            email: user.email,
                           
                        }, process.env.JWT_SECRET,{
                            expiresIn: '1h'
                        });
                       
                        res.cookie('ntoken', token,{
                            httpOnly:true
                        })
                        res.redirect('/api/user/dashboard');
                      

                    }
                    else {
                        res.render('auth/login',{
                            error_msg: 'Invalid Password',
                            layout: false
                        })
                    }

                });
            }

        }).catch(err => console.log(err));
  
    }
  
  })
  


  router.get('/logout', (req, res) => {
    res.clearCookie('ntoken');
    return res.redirect('/');
  }); 

module.exports = router