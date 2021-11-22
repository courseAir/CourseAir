const express = require("express");
const exphbs= require("express-handlebars")
const mysql = require("mysql")
const routes = require("./server/routes/user");
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);


const app= express();
const port= process.env.PORT || 8080;

//Connection Pool
const options = {
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database:process.env.DB_NAME,
  multipleStatements: true
}

let sessionConnection = mysql.createConnection(options);
let sessionStore = new MySQLStore({
    expiration: 10800000,
    createDatabaseTable: true,
    schema:{
        tableName: 'sessiontbl',
        columnNames:{
            session_id: 'sesssion_id',
            expires: 'expires',
            data: 'data'
        }
    }
},sessionConnection)

app.use(session({
  key:'keyin',
  secret:'mysecret',
  store: sessionStore,
  resave:false,
  saveUninitialized:true,
  cookie: {
    expires: 60*60*24,
  }
}))

//Parsing middleware
app.use(express.urlencoded({extended: true}))

//Parse application as JSON
app.use(express.json());

//Static Files
app.use(express.static("public"));

//Templating Engine
app.engine("hbs",exphbs({extname: ".hbs"}))
app.set("view engine","hbs")



 
 
 
  app.use("/",  routes)

  
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    
  });
