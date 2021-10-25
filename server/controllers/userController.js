const moment= require("moment")
const mysql = require("mysql")
require("dotenv").config();

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


//Connection Pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database:process.env.DB_NAME,
  multipleStatements: true
});


//Landing Page
exports.landingPg=(req,res)=>{
    res.render("index", {layout: "lpg"})
}

exports.home=(req,res)=>{
    res.render("login",{layout:"login"})
        
}

try{
  exports.login=(req,res)=>{
    console.log(req.body)
      const { service_num,password}= req.body;
      service_num_upper= service_num.toUpperCase()
     
          
          pool.getConnection((err, connection) => {
          if (err) return res.send({error:"cannot connect to databse"});
          console.log("Connected as ID" + connection.threadId);
          //Use the connection
          const sql =
            "SELECT * FROM user,role WHERE service_num=? AND password= ? AND role.id=user.role;SELECT * FROM user,course WHERE user.course_id <>0 AND user.course_id=course.course_id"
          connection.query(sql, [service_num_upper, password], (err, rows) => {
            connection.release();
            
            const row = JSON.parse(JSON.stringify(rows));
            const row1= row[0]
            const row2= row[1]
  
            
            dateFormatter(row2)
            timeLeft(row2)
  
           
            
            try{ 
              if (row1[0].role_name ==="administrator") {
              
                res.render("admin",{row1:row2,layout: "main"});
              } else if (row1[0].role_name === "staff") {
               
                res.render("home",{ row1:row2,layout: "staff" });
                
              }          
            }catch(e){
              return res.render("login",{alert: "Incorrect Service Number Or Password",layout:"login"})
  
            }           
            
             });
        });
        
  }

}catch(e){res.send({error:"Check Internet Connection"})}



//dashboard
exports.dashboard= (req, res) => {
    
   
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
};
