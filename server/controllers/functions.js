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
       if(!isNaN(days)){
        row[index]['timeleft']= `${days} day(s) left `
       }else{
        row[index]['timeleft']= `0 day(s) left `
       }
       
       
    }  
    
  }

  

  module.exports={dateFormatter,timeLeft}