const {timeLeft,dateFormatter,connectToDB}= require('./functions')
const mysql = require("mysql")
const bcrypt= require("bcrypt")
require("dotenv").config();



let state={
  Adminvalidate:false,
  Uservalidate:false
}







//Connection Pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database:process.env.DB_NAME,
  multipleStatements: true
});


//for bcrypt
const db = mysql.createConnection({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database:process.env.DB_NAME,
  multipleStatements: true
});


//Landing Page
landingPg=(req,res)=>{
    res.render("index", {layout: "lpg"})
}

home=(req,res)=>{
    res.render("login",{layout:"login"})
        
}

try{
  login=  (req,res)=>{
    
      const { service_num,password}= req.body;
      service_num_upper= service_num.toUpperCase()
      
        db.query('SELECT service_num,password FROM user WHERE service_num=? ' ,[service_num_upper],async (error,results)=>{
          if(error || results[0]?.password===undefined){
            return res.render("login",{alert: "Not connected to db or Wrong credentials provided",layout:"login"})
          }else{
            
            let validPass= await bcrypt.compare(password,results[0].password)
            
           if(validPass){
             pool.getConnection((err, connection) => {
               if (err) return res.send({error:"cannot connect to databse"});
               
               const sql =
                 "SELECT * FROM user,role WHERE service_num=? AND password= ? AND role.id=user.role;SELECT * FROM user,course WHERE user.course_id <>0 AND user.course_id=course.course_id"
               connection.query(sql, [service_num_upper, results[0].password], (err, rows) => {
                 connection.release();
                 
                 const row = JSON.parse(JSON.stringify(rows));
                 const row1= row[0]
                 const row2= row[1]
       
                 console.log(row2)
                 timeLeft(row2)
                 dateFormatter(row2)
                 
       
                
                        
                 
                   if (row1[0].role_name ==="administrator") {
                     
                     req.session.user=results
                     
                     res.render("admin",{row1:row2,layout: "main"});
                     state.Adminvalidate=true;
                     state.Uservalidate=true;
                     
                   } else if (row1[0].role_name === "staff") {
                    
                    req.session.user=results
                     res.render("home",{ row1:row2,layout: "staff" });
                     state.Adminvalidate=true;
                     state.Uservalidate=true;
                     
                   }          
                
                   
       
                        
                 
                  });
             });
           }else{
             return res.render("login",{alert: "Incorrect Service Number Or Password",layout:"login"})
           }
     
          }
        })
      
      
         
         
           
      
          
         
        
  }

}catch(e){
  res.send({error:"Check Internet Connection"})
}

//logout
logout=  (req,res)=>{
  req.session.destroy(function(err){
    if(err){
        res.send("Log Out!")
    }else{
      state.Adminvalidate=false,
      state.Uservalidate=false,
      res.redirect("/")
    }
    
})
            
        
   
 
}

//dashboard
dashboard= (req, res) => {
  if(state.Adminvalidate){
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID" + connection.threadId);
      //Use the connection
  
      const sql =
        " SELECT * FROM user,course WHERE user.course_id <>0 AND user.course_id=course.course_id"
      connection.query(
        
        sql,
        
        (err, rows) => {
          //When done with the connection, release it
          connection.release();
          dateFormatter(rows)
            timeLeft(rows)
          console.log(rows)
           if (!err) {
            res.render("admin", {row1:rows});
          } else {
            console.log(err);
          }
        }
      );
    });
  }else{
    return res.json("Access restricted,Please Authenticate")
  }
  
};



module.exports={state,dashboard,login,landingPg,home,logout}