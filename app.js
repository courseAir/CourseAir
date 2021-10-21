const express = require("express");
const exphbs= require("express-handlebars")
const mysql= require("mysql");
const routes = require("./server/routes/user");


const app= express();
const port= process.env.PORT || 8080;

//Parsing middleware
app.use(express.urlencoded({extended: true}))

//Parse application as JSON
app.use(express.json());

//Static Files
app.use(express.static("public"));

//Templating Engine
app.engine("hbs",exphbs({extname: ".hbs"}))
app.set("view engine","hbs")


  
  app.use("/", routes)
  
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    
  });