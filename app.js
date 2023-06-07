const express = require('express');
var hbs = require('express-handlebars');
var _handlebars = require('handlebars')
const  bodyParser = require('body-parser');
const path = require('path')


const home = require('./routes/home/home');
const auth = require('./routes/auth/auth');
const user = require('./routes/user/user');
const user_profile = require('./routes/user/user_profile');
const task = require('./routes/user/task');
//const task = require('./routes/task/task');


// Database
const db = require('./config/database');

const { allowedNodeEnvironmentFlags } = require('process');

var cookieParser = require('cookie-parser')


// Test DB
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))

  //Model Synchrization With Database
  //db.sync({alter:{drop: false}})
  db.sync()
  .then((result) => {
   //console.log(result);
     
      
  })
  .catch((err) => {
      console.log(err);
  })

const app = express();
app.use(cookieParser());

//Handlebars
// const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');


// view engine setup with hbs
app.engine('hbs', hbs.engine({
  extname: 'hbs', 
  defaultLayout: 'layout', 
  layoutsDir:path.join(__dirname, 'views/partials'),
  handlebars: allowInsecurePrototypeAccess(_handlebars),
  helpers:{
    'calculation': function(options){
      if(options.data.last) {
        return options.inverse();
       } else {
        return options.fn();
    }},
  'test': function(v1, v2,options){
    if(v1 === v2){
      return options.fn(this);
    }
    else{
      return options.inverse(this);
    }
  },
}
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// application level middleware


// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, './public')
// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.use(express.json());
// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))


app.use('/', home);
app.use('/api/auth', auth)

app.use('/api/user', user);
app.use('/api/user', user_profile);
app.use('/api/user', task);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}...`));