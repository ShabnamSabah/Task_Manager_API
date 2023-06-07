const express = require("express");

const router = express.Router();
const Task = require("../../model/Task");
const User = require("../../model/User");

const checklogin = require("../../middleware/checklogin");
const Sequilize = require("sequelize");
const TaskAssignment = require("../../model/TaskAssignment");
const Op = Sequilize.Op;

User.hasMany(Task, {
  foreignKey: "userId",
});
Task.belongsTo(User, {
  foreignKey: "userId",
});

Task.hasMany(TaskAssignment,{
  foreignKey: "taskId",
})

TaskAssignment.belongsTo(Task,{
  foreignKey: "taskId",
  
})

router.get("/dashboard", checklogin, (req, res) => {
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
          status: "No"
        }
      },{
        model: User
      }]
      
    })
    .then(task=>{
      console.log(JSON.stringify(task, null,2))
      res.render("user/dashboard", {
        layout: "user-layout",
        user,
        task
      });
    });
    })


    
});



router.get("/add-task", checklogin, async (req, res) => {
  User.findOne({
    where: { email: req.email },
  }).then((user) => {
    User.findAll()
    .then(users_list =>{
      res.render("user/add-task", {
        layout: "user-layout",
        users_list,
        user,
      });

    })
    
  
  });
});

router.post("/add-task", checklogin, async (req, res) => {
  let { title, description, due_date, assignedTo} = req.body;
  let errors = [];
  //Validation
  if (!title || !description || !due_date || !assignedTo) {
    errors.push({ text: "Please fill in all the fields" });
  }

  if (errors.length > 0) {
    //error
    User.findOne({
      where: { email: req.email },
    }).then(user => {
      res.render("user/add-task", {
        layout: "user-layout",
        errors,
        title,
        description,
        due_date,
        assignedTo,
        user,
      });
    });
  } else {
    User.findOne({
      where: { email: req.email },
    }).then(user => {
      const newTask = new Task({
        title,
        description,
        due_date,
        assigned: "Yes",
        assignedTo,
        userId: user.id,
      });
      newTask.save().then(new_task => {
    
       for(let i=0; i<new_task.assignedTo.length; i++){
        const newTaskAssignment = new TaskAssignment({
          status: "No",
          assignedTo: new_task.assignedTo[i],
          taskId: new_task.id,
        })
        newTaskAssignment.save()
        .then(task_assignment=>{
           
          console.log(task_assignment)
        })
       }
       User.findAll()
       .then(users_list =>{
       res.render("user/add-task", {
            layout: "user-layout",
            user,
            users_list,
            success_msg: "Successfully Added",
          });
        
      });
    })
    });
  }
});

router.get("/view-all-task", checklogin, async (req, res) => {
  User.findOne({
    where: { email: req.email },
  }).then(user => {
    Task.findAll({
      order: [
        ['due_date', 'ASC'],
       ],
      where: {
        userId: user.id,
      },
      include:[{
        model: TaskAssignment,
        // where: {
        //   status: "No"
        // }
      },{
        model:User
      }]
    }).then(task=> {
      console.log(JSON.stringify(task, null,2))
      res.render("user/view-added-task", {
        layout: "user-layout",
        task,
        user,
      });
    });
  });
});

router.get("/edit-added-task/:id", checklogin, async (req, res) => {
  User.findOne({
    where: { email: req.email },
  }).then((user) => {
   
    
    Task.findOne({
      
      where: { id: req.params.id },
      include:[{
        model: TaskAssignment,
      }]
    }).then(task => {
      let a=[];
      for(let i=0; i<task.assignedTo.length; i++){
       a.push(task.assignedTo[i])
      }
      User.findAll({
        where: {
          id: {
            [Op.in]: a
          }
        }
      })
      .then(u=>{
        User.findAll({
          where: {
            id: {
              [Op.notIn]: a
            }
          }
        })
        .then(users_list=>{
        //console.log(JSON.stringify(task,null,2))
        //console.log(JSON.stringify(u,null,2))
        res.render("user/edit-added-task", {
          layout: "user-layout",
          task,
          user,
          u,
          users_list
        });
      })
    })
    });
  })
});

router.post("/edit-added-task/:id", checklogin, async (req, res) => {
  let { title, description, due_date, assignedTo} = req.body;
  User.findOne({
    where: {
      email: req.email,
    },
  }).then(user => {

    Task.findOne({
      where: { id: req.params.id },
    })
      .then(task1 => {
        Task.update(
          {
            title,
            description,
            due_date,
            assigned: "Yes",
            assignedTo,
            userId: user.id
          },
          {
            where: { id: task1.id },
          }
        ).then((pm1) => {
          User.findOne({
            where: { email: req.email },
          }).then((user) => {
            
            Task.findOne({
              where: { id: req.params.id },
              include:[{
                model: TaskAssignment
              }]
            }).then(task => {
              let a=[];
              for(let i=0; i<task.assignedTo.length; i++){
                a.push(task.assignedTo[i])
              }
              for(let i=0; i<task.assignedTo.length; i++){
               //a.push(task.assignedTo[i])
               TaskAssignment.findOne({
                where:{
                  assignedTo: task.assignedTo[i],
                  taskId: task.id
                }
               }).then(task_assignment1=>{
                   if(!task_assignment1){
                    const newTaskAssignment = new TaskAssignment({
                      status: "No",
                      assignedTo: task.assignedTo[i],
                      taskId: task.id,
                    });
                   newTaskAssignment.save()
                   .then(x=>{
                     console.log(x)
                   })
                   }else{
                    TaskAssignment.update({
                      status: task_assignment1.status,
                       assignedTo: task_assignment1.assignedTo,
                      taskId: task_assignment1.taskId
                    },{
                      where: {
                        id: task_assignment1.id
                      }
                    }).then(y=>{
                      TaskAssignment.findAll({
                       where:{
                        taskId: req.params.id,
                         assignedTo: {
                           [Op.notIn]: task.assignedTo
                         }
                       }
                      }).then(t_task=>{
                         for(let j=0; j<t_task.length;j++){
                          TaskAssignment.destroy({
                             where:{
                               id: t_task[j].dataValues.id
                             }
                           }).then(m=>{
                             console.log(m)
                           })
                         }
                      })
                    })
                   }

               })
              }
              User.findAll({
                where: {
                  id: {
                    [Op.in]: a
                  }
                }
              })
              .then(u=>{
                User.findAll({
                  where: {
                    id: {
                      [Op.notIn]: a
                    }
                  }
                })
            .then(users_list=>{
              //console.log(JSON.stringify(paper, null, 2))
              console.log(JSON.stringify(u, null, 2))
              res.render("user/edit-added-task", {
                layout: "user-layout",

                user,
                task,
                u,
                users_list,
                success_msg: "Updated Successfully",
              });
            });
          })
          });
        })
        
      })
      })

      .catch((err) => console.log(err));
  });
});


router.get("/delete-added-task/:id", checklogin, async (req, res) => {

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

                     Task.destroy({
                         
                        where:{
                        id: task.id
                      }
                    }).then(a=>{
                       res.redirect('/api/user/view-all-task')
                     })
                  })

        })


});



router.get("/added-task-in_progress/:id", checklogin, async (req, res) => {

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
                     res.redirect('/api/user/dashboard')
                   })
                })

      })


});


router.get("/added-task-completed/:id", checklogin, async (req, res) => {

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
                     res.redirect('/api/user/dashboard')
                   })
                })

      })


});
router.get("/added-task-pending/:id", checklogin, async (req, res) => {

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
                     res.redirect('/api/user/dashboard')
                   })
                })

      })


});


///





module.exports = router;
