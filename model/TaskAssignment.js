const Sequelize = require('sequelize');
const db = require('../config/database');
const moment = require("moment")

//creating model

const TaskAssignment = db.define('task_assignment', {
   
    status:{
        type: Sequelize.STRING,
        defaultValue: "No"
    },
    assignedTo:{
        type:Sequelize.INTEGER,
        
    },
      
    
},

    {
        timestamps: false
    }
);



module.exports = TaskAssignment;


