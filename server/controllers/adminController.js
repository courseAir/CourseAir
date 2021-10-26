const mysql = require("mysql")
const moment= require("moment")

moment.defaultFormat = "DD.MM.YYYY"
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

//function

const dateFormatter=(row)=>{
  for (const date in row) {
    row[date].start_date =moment(row[date].start_date).format('DD/MM/YYYY').toString() 
    row[date].end_date=moment(row[date].end_date).format('DD/MM/YYYY').toString() 
}
 
}

// View Base
exports.viewBase = (req, res) => {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID" + connection.threadId);
      //Use the connection
  
      const sql = "SELECT * FROM base ";
      connection.query(
        sql,
  
        (err, rows) => {
          //When done with the connection, release it
          connection.release();
                    
          if (!err) {
            res.render("view-Base", { rows });
          } else {
            console.log(err);
          }
        }
      );
    });
  };



  //Add User
  exports.addUser = (req, res) => {
    
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
  
    
       
  };

  exports.saveUser= (req, res) => {
    console.log(req.body)
    const { first_name,last_name,service_num,password,role } = req.body;
    const roleArr = role.split(/[^0-9a-zA-Z]+/g);
    const roleID = roleArr[0];
    const service_numCaps= service_num.toUpperCase()
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID" + connection.threadId);
      //Use the connection
  
      const sql =
        "INSERT INTO user(service_num,first_name,last_name,role,password) VALUES (?,?,?,?,?); SELECT * FROM user,role WHERE user.role=role.id"
      connection.query(
        
        sql,
        [service_numCaps,first_name,last_name,roleID,password],
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
  };

//View  course
exports.viewCourse= (req, res) => {
    
   
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
          res.render("addCourse", {rows:row});
        } else {
          console.log(err);
        }
      }
    );
  });
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
        console.log(rows)
        const row = JSON.parse(JSON.stringify(rows));
        
        const row2=row[1]

        //format date
        dateFormatter(row2)
         if (!err) {
          res.render("addCourse", {rows:row2});
        } else {
          console.log(err);
        }
      }
    );
  });
};


//Tracking Info
exports.trackingInfo = (req, res) => {
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
          res.render("trackingInfo",{rows:row1,row:row2})    
        } else {
          console.log(err);
        }
      }
    )
  })
      
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
          console.log(err);
        }
      }
    )
  })
      
};

