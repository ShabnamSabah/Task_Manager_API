# Task_Manager_API
## Technology Used
1. Node.JS
2. MySQL (Sequelize)

    ##### 
    Sequelize is a Node. js-based Object Relational Mapper  that makes it easy to work with MySQL, MariaDB, SQLite, PostgreSQL databases, and more. An Object Relational Mapper performs functions like handling database records by representing the data as objects. The benefit of using Sequelize is we can easily avoid writing raw SQL queries.


3. Javascript
4. Express.JS
5. Handlebars for Client Side User-Interface
## Documentation

1. Initialize the project by running the following command in Visual Studio Code.
```
npm init
```

2. Install the dependencies by running the following command in Visual Studio Code.
```
npm install
```
3. Create the databse with following name in MySQL database
```
js_encoder_task
```

4. Run the project by using the followin command.
```
nodemon app.js
```
After that databse will be created.

5. Open your browser and the following command
```
localhost:8000
```

6. Register some users in the system with the credentials.
7. Login with one user.
8. After that dashboard will open, in dashboard all the assigned task will be dispalyed. Intially it will be empty.
9. Click "Add A New Task" option from side bar.
10. Add a task and assign users for that task.
11. Click "View All Task" option from side bar. Here, it will display the tasks added by loggedIn user.
 a) There are two button here for edit and delete a task respectively. Through with you can edit or delete a task.
13. Then , logout from the system by clickig the person icon from the top-right corner of dashboard.
14. Next, Login with another user to whom you have assigned a task.
15. After that dashboard of that user will open, in dashboard all the assigned task will be dispalyed and it is sorted by due date wise. 
16. Here, for each task, there are three button to represent the status of the task: Pending, In Progress and Completed respectively.
17.  a) If you clicked on Pending, the status of task will become Pending. Then Click on the "View all Pending Task" option from side bar, it will display all the pending task by loggedIn User. Tasks are sorted by due date wise.
  b) If you clicked on In Progress, the status of task will become In Progress. Then Click on the "Task In Progress" option from side bar, it will dispaly all the task-in-progress by loggedIn User. Tasks are sorted by due date wise.
  c) If you clicked on Completed, the status of task will become Completed. Then Click on the "Completed Task" option from side bar, it will display all the completed task by loggedIn User. Tasks are sorted by due date wise.
 18. Click on "View all Pending Task","Task In Progress" and "Completed Task" option from side bar respectively,  then, all the pending task, all the task-in-progress and all the completed task by the loggedIn user will be displayed. Tasks are sorted by due date wise. From there, you can also change the status of a task.
 19. In the top-right corner of dashboard, there is a person-icon, from there a user can their profile and update it.
 20. Lastly, you can logged out from the system.
 
