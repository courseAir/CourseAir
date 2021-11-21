const mysql = require("mysql")
const bcrypt= require("bcrypt")
const moment= require("moment")
const {state} = require("./userController")
moment.defaultFormat = "DD.MM.YYYY"
const {timeLeft,dateFormatter}= require('./functions')
require("dotenv").config();
//Connection Pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database:process.env.DB_NAME,
  multipleStatements: true
});



 //Add User
  exports.addUser = (req, res) => {
    
    if(state.Adminvalidate){
      const sql =
    "SELECT * FROM role";
    pool.getConnection((err, connection) => {
      connection.query(
    
        sql,
         (err, rows) => {
          //When done with the connection, release it
          connection.release();
                   
          if (!err) {
            res.render("addUser",{rows,layout:"main"});
          } else {
            console.log(err);
          }
        }
      )
    })
    }else{
      return res.json("Access restricted,Please Authenticate")
    }
    
  
    
       
  };

  exports.saveUser=  async (req, res) => {
    
    const { first_name,last_name,service_num,password,role } = req.body;
    const roleArr = role.split(/[^0-9a-zA-Z]+/g);
    const roleID = roleArr[0];
    const service_numCaps= service_num.toUpperCase()
    pool.getConnection(async(err, connection) => {
      if (err) throw err;
      console.log("Connected as ID" + connection.threadId);
      //Use the connection
      
    if(password.length<8){
      let data;
        const sql =
    "SELECT * FROM role";
    pool.getConnection((err, connection) => {
      connection.query(
    
        sql,
         (err, rows) => {
          //When done with the connection, release it
          connection.release();
                  
          if (!err) {
            return res.render("addUser",{alert: "Password is less than 8 characters",layout:"main",rows})
          } else {
            console.log(err);
          }
        }
      )
     })
     return;
     
      } 

      let hashedPass= await bcrypt.hash(password,8)
      const sql =
        "INSERT INTO user(service_num,first_name,last_name,role,password) VALUES (?,?,?,?,?); SELECT * FROM user,role WHERE user.role=role.id"
       connection.query(
        sql,
        [service_numCaps,first_name,last_name,roleID,hashedPass],
        (err, rows) => {
          //When done with the connection, release it
          connection.release();
          const row = JSON.parse(JSON.stringify(rows));
          
          const row2=row[1]
          
           if (!err) {
            res.render("view-user", {rows:row2});
          } else {
            console.log(err);
          }
        }
        
      );
    });
  
  };

  //view users

  exports.viewusers= (req, res) => {
    if(state.Adminvalidate){
      pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log("Connected as ID" + connection.threadId);
        //Use the connection
    
        const sql =
          " SELECT * FROM user,role WHERE user.role=role.id"
        connection.query(
          
          sql,
          
          (err, rows) => {
            //When done with the connection, release it
            connection.release();
            
             if (!err) {
              res.render("view-user", {rows});
            } else {
              console.log(err);
            }
          }
        );
      });
  
    }else{
      return res.json("Access restricted, Please Authenticate, Please Authenticate")
    }
   
      };

//View  course
exports.viewCourse= (req, res) => {
    
  if(state.Adminvalidate){
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID" + connection.threadId);
      //Use the connection
  
      const sql =
        " SELECT * FROM course"
      connection.query(
        
        sql,
        
        (err, rows) => {
          //When done with the connection, release it
          connection.release();
          const row = JSON.parse(JSON.stringify(rows));
           
          //Formatting date to be displayed in front end
          dateFormatter(row)
         
           if (!err) {
            res.render("addCourse", {rows:row, layout:"main"});
          } else {
            console.log(err);
          }
        }
      );
    });
    
  }else{
    return res.json("Access restricted, Please Authenticate")
  }
  
};

//Add Course
exports.addCourse= (req, res) => {
    const [course_name,start_date,end_date]= req.body.issue
  
   
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID" + connection.threadId);
    //Use the connection

    const sql =
      "INSERT INTO course(course_name,start_date,end_date) VALUES (?,?,?);SELECT * FROM course"
    connection.query(
      
      sql,
      [course_name,start_date,end_date],
      
      (err, rows) => {
        //When done with the connection, release it
        connection.release();
       
        const row = JSON.parse(JSON.stringify(rows));
        
        const row2=row[1]

        //format date
        dateFormatter(row2)
         if (!err) {
          res.render("addCourse", {rows:row2, layout:"main"});
        } else {
          console.log(err);
        }
      }
    );
  });
};


//Tracking Info
exports.trackingInfo = (req, res) => {
  if(state.Adminvalidate){
    const sql =
  "SELECT * FROM base;SELECT * FROM course";
  pool.getConnection((err, connection) => {
    connection.query(
      
      sql,
       (err, rows) => {
        //When done with the connection, release it
        connection.release();
         
        const row1=rows[0]; 
        const row2= rows[1];       
        if (!err) {
          res.render("trackingInfo",{rows:row1,row:row2,layout:"main"})    
        } else {
          console.log(err);
        }
      }
    )
  })

  }else{
    return res.json("Access restricted,Please Authenticate")
  }
  
      
};

//Save Tracking info
exports.saveTrackingInfo = (req, res) => {

    const {first_name,last_name,service_num,base,course}= req.body
   console.log(req.body)
  //Getting index of the base and course
  const baseArr = base.split(/[^0-9a-zA-Z]+/g)
  const baseID= baseArr[0]

  const courseArr = course.split(/[^0-9a-zA-Z]+/g)
  const courseID= courseArr[0]
  
    const sql =
  "INSERT INTO user(first_name,last_name,service_num,base_id,course_id) VALUES (?,?,?,?,?) ";
  pool.getConnection((err, connection) => {
    connection.query(
  
      sql,
      [first_name,last_name,service_num,baseID, courseID],
       (err, rows) => {
        //When done with the connection, release it
        connection.release();
                 
        if (!err) {
          res.render("trackingInfo", { alert: "Tracking Info Added"})    
        } else {
          res.json("Multiple entries for one person is not allowed. Please authenticate by logging in again.")
        }
      }
    )
  })
  
    
   
     
};

//delete
exports.delete = (req, res) => {
 
  //Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID" + connection.threadId);
    //Use the connection
    connection.query(
      "DELETE FROM user WHERE service_num=?;SELECT * FROM user,course WHERE user.course_id <>0 AND user.course_id=course.course_id",

      [req.params.service_num],
      (err, rows) => {
        //When done with the connection, release it
        connection.release();
        
        const row = JSON.parse(JSON.stringify(rows));
        const row1=row[1]
         dateFormatter(row1)
          timeLeft(row1)
        if (!err) {
          res.render("admin", { alert: "Delete operation successful",row1 });
        } else {
          res.render("admin", { alert: "Delete operation not successful"});
        }
       
      }
    );
  });
};

// Edit user
exports.edit= (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID" + connection.threadId);
    //Use the connection

    const sql = "SELECT user.course_id,course.course_id,service_num,user.first_name,user.last_name,course.course_name,course.start_date,course.end_date FROM user,course WHERE service_num = ? AND user.course_id=course.course_id;SELECT * FROM course";
    connection.query(
      sql,
      [req.params.service_num],
      (err, rows) => {
        //When done with the connection, release it
        connection.release();
        const row = JSON.parse(JSON.stringify(rows));
        const row1=row[0] 
        const row2=row[1]     
        console.log(row2)    
        if (!err) {
          res.render("editInfo",{rows:row1,row2,layout:"edit"});
        } else {
          console.log(err);
        }
      }
    );
  });
};

//Save
exports.save= (req, res) => {
  const {course}=req.body
  const courseArr = course.split(/[^0-9a-zA-Z]+/g)
  const courseID= courseArr[0]
 
  pool.getConnection((err, connection) => {
    if (err) throw err;
   
    //Use the connection

    const sql = "UPDATE user SET course_id=? WHERE service_num=?;SELECT user.course_id,course.course_id,service_num,user.first_name,user.last_name,course.course_name,course.start_date,course.end_date FROM user,course WHERE service_num = ? AND user.course_id=course.course_id";
    connection.query(
      sql,
      [courseID,req.params.service_num,req.params.service_num],
      (err, rows) => {
        //When done with the connection, release it
        connection.release();
        const row = JSON.parse(JSON.stringify(rows));
        const row1=row[1]
        console.log(row1)
          
        if (!err) {
          res.render("editInfo",{layout:"edit",rows:row1,alert: "The user's information has been updated successfully. Click on Home"});
        } else {
          console.log(err);
        }
      }
    );
  });
};


