const express = require("express");

const router = express.Router();
const Task = require("../../model/Task");
const User = require("../../model/User");

const checklogin = require("../../middleware/checklogin");
const Sequilize = require("sequelize");
const TaskAssignment = require("../../model/TaskAssignment");
const Op = Sequilize.Op;


router.get("/pending-task", checklogin, (req, res) => {
    User.findOne({
      where: { email: req.email },
    }).then((user) => {
      Task.findAll({
        order: [
          ['due_date', 'ASC'],
         ],
        include:[{
          model: TaskAssignment,
          where:{
            assignedTo: user.id,
            status: "Pending"
          }
        },{
          model: User
        }]
      })
      .then(task=>{
        console.log(JSON.stringify(task, null,2))
        res.render("user/pending-task", {
          layout: "user-layout",
          user,
          task
        });
      });
      })
  
  
      
  });
  

  router.get("/task-completed", checklogin, (req, res) => {
    User.findOne({
      where: { email: req.email },
    }).then((user) => {
      Task.findAll({
        order: [
          ['due_date', 'ASC'],
         ],
        include:[{
          model: TaskAssignment,
          where:{
            assignedTo: user.id,
            status: "Completed"
          }
        },{
          model: User
        }]
      })
      .then(task=>{
        console.log(JSON.stringify(task, null,2))
        res.render("user/task-completed", {
          layout: "user-layout",
          user,
          task
        });
      });
      })
  
  
      
  });
  
  router.get("/task-in_progress", checklogin, (req, res) => {
    User.findOne({
      where: { email: req.email },
    }).then((user) => {
      Task.findAll({
        order: [
          ['due_date', 'ASC'],
         ],
        include:[{
          model: TaskAssignment,
          where:{
            assignedTo: user.id,
            status: "In Progress"
          }
        },{
          model: User
        }]
      })
      .then(task=>{
        console.log(JSON.stringify(task, null,2))
        res.render("user/task-in-progress", {
          layout: "user-layout",
          user,
          task
        });
      });
      })
  
  
      
  });


  router.get("/task-in_progress/:id", checklogin, async (req, res) => {

    User.findOne({
      where: { email: req.email },
    })
      .then(user => {
  
                Task.findOne({
                  where: {
                     id: req.params.id
                  }
                 })
                 .then(task=>{
  
                     TaskAssignment.update({
                       status: "In Progress"
                     },{  
                        where:{
                        taskId: task.id,
                        assignedTo: user.id
                      }
                    }).then(a=>{
                      res.redirect('/api/user/pending-task')
                     })
                  })
  
        })
  
  
  });
  
  
  router.get("/task-completed/:id", checklogin, async (req, res) => {
  
    User.findOne({
      where: { email: req.email },
    })
      .then(user => {
  
                Task.findOne({
                  where: {
                     id: req.params.id
                  }
                 })
                 .then(task=>{
  
                     TaskAssignment.update({
                       status: "Completed"
                     },{  
                        where:{
                          taskId: task.id,
                          assignedTo: user.id
                      }
                    }).then(a=>{
                      //  res.redirect('/api/user/task-completed')
                      res.redirect('/api/user/pending-task')
                     })
                  })
  
        })
  
  
  });
  router.get("/task-pending/:id", checklogin, async (req, res) => {
  
    User.findOne({
      where: { email: req.email },
    })
      .then(user => {
  
                Task.findOne({
                  where: {
                     id: req.params.id
                  },
                  
                 })
                 .then(task=>{
  
                     TaskAssignment.update({
                       status: "Pending"
  
                     },{  
                        where:{
                        taskId: task.id,
                        assignedTo: user.id
                      }
                    }).then(a=>{
                       //res.redirect('/api/user/pending-task')
                       res.redirect('/api/user/pending-task')
                     })
                  })
  
        })
  
  
  });
  



  router.get("/task-in_progress2/:id", checklogin, async (req, res) => {

    User.findOne({
      where: { email: req.email },
    })
      .then(user => {
  
                Task.findOne({
                  where: {
                     id: req.params.id
                  }
                 })
                 .then(task=>{
  
                     TaskAssignment.update({
                       status: "In Progress"
                     },{  
                        where:{
                        taskId: task.id,
                        assignedTo: user.id
                      }
                    }).then(a=>{
                      res.redirect('/api/user/task-in_progress')
                     })
                  })
  
        })
  
  
  });
  
  
  router.get("/task-completed2/:id", checklogin, async (req, res) => {
  
    User.findOne({
      where: { email: req.email },
    })
      .then(user => {
  
                Task.findOne({
                  where: {
                     id: req.params.id
                  }
                 })
                 .then(task=>{
  
                     TaskAssignment.update({
                       status: "Completed"
                     },{  
                        where:{
                          taskId: task.id,
                          assignedTo: user.id
                      }
                    }).then(a=>{
                      //  res.redirect('/api/user/task-completed')
                      res.redirect('/api/user/task-in_progress')
                     })
                  })
  
        })
  
  
  });
  router.get("/task-pending2/:id", checklogin, async (req, res) => {
  
    User.findOne({
      where: { email: req.email },
    })
      .then(user => {
  
                Task.findOne({
                  where: {
                     id: req.params.id
                  },
                  
                 })
                 .then(task=>{
  
                     TaskAssignment.update({
                       status: "Pending"
  
                     },{  
                        where:{
                        taskId: task.id,
                        assignedTo: user.id
                      }
                    }).then(a=>{
                       //res.redirect('/api/user/pending-task')
                       res.redirect('/api/user/task-in_progress')
                     })
                  })
  
        })
  
  
  });
module.exports=router