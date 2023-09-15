var mysql = require('mysql');


var con = mysql.createConnection({
     host: "localhost",
     user: "root",
     password: "",
     database: "nodeProject"
});

con.connect(function(error)
{
    if(error) throw error;

    console.log("connected");

    });
    
module.exports = con;