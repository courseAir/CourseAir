const moment= require("moment")
const mysql = require("mysql")
//Functions
const dateFormatter=(row)=>{
    for (const date in row) {
      row[date].start_date =moment(row[date].start_date).format('DD/MM/YYYY').toString() 
      row[date].end_date=moment(row[date].end_date).format('DD/MM/YYYY').toString() 
  }
  }
  
  const timeLeft= (row)=>{
  
    for (const index in row) {
       
       const now= moment()
       const end= moment((row[index].end_date)) 
       
       const days=end.diff(now,'days') 
       
       row[index]['timeleft']= `${days} day(s) left `
       
    }  
    
  }

  const pool = {
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  };
  
  //Connect to DB
   const connectToDB= function(){
     connection=mysql.createConnection(pool)
     connection.connect(function(err){
       if(err){
         setTimeout(connectToDB,2000)
         
       }
     })
  
     connection.on('error',function(err){
       if(err.code==='PROTOCOL_CONNECTION_LOST'){
        connectToDB()
       }else{
         throw err;
       }
     })
   }
  

  module.exports={dateFormatter,timeLeft,connectToDB}