var mysql = require('mysql');

var con = mysql.createPool({
   connectionLimit : 10,
    host: "localhost",
    user: "apubg",
    password: "Deevanshu@125502",
    database: "tour_bgmi"
});

 var con1 = mysql.createPool({
   connectionLimit : 10,
    host: "localhost",
    user: "apubg",
    password: "Deevanshu@125502",
    database: "tour_players"
});

//  con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
//  });
//  con1.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
//  });

module.exports ={
      con , con1
} 