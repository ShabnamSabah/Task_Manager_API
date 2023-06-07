const Sequelize = require('sequelize');
const db = require('../config/database');
const moment = require("moment")

//creating model

const Task = db.define('tasks', {
   title: {
        type: Sequelize.STRING

    },
    description: {
        type: Sequelize.TEXT('long')

    },
 
    due_date:{
        type: Sequelize.STRING,
        get() {
            
            return moment(this.getDataValue("due_date")).format('MM-DD-YYYY');
          },

          set(val) {
          
            return this.setDataValue("due_date", moment(val).format('MM-DD-YYYY'));
          }
     
    },
  
    assigned:{
        type: Sequelize.STRING,
        defaultValue: "No"
    },
  
    assignedTo: {
        type: Sequelize.TEXT,
        get() {
          
            return JSON.parse(this.getDataValue("assignedTo"))
            
        },
        set(val) {
          
           return this.setDataValue("assignedTo", JSON.stringify(val));
        },
    },
    
},

    {
        timestamps: false
    }
);



module.exports = Task;


