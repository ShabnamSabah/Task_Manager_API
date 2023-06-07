const express = require("express");
const router = express.Router();
const User = require("../../model/User");
const checklogin = require("../../middleware/checklogin");
const bcrypt = require('bcryptjs');

router.get("/my-profile", checklogin, (req, res) => {

    User.findOne({
      where: { email: req.email },
    }).then((user) => {
     
        res.render("user/profile", {
          layout: "user-layout",
        
          user,
          
        });
      });
    

});

router.post("/edit-profile/:id", checklogin, (req, res) => {

    let { name } = req.body;
    User.findOne({
      where: { id: req.params.id },
    }).then((user1) => {
      User.update(
        {
          name,
        },
        {
          where: { id: user1.id },
        }
      ).then((user1) => {
        User.findOne({
          where: { id: req.params.id },
        }).then((user) => {
          
            res.render("user/profile", {
              layout: "user-layout",
              user,
              
            });
          });
        
      });
    });

});


module.exports = router;
