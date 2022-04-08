// Include Sequelize module
var mysql = require('mysql');
const Sequelize = require('sequelize');

var port = process.env.PORT;
var host = process.env.HOST;
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config.json')[env];
// console.log(config);
// initialize();
// function initialize() {
//    try {
//       var user = "apubg";
//       var connection = mysql.createConnection({ host:"localhost", user, password: "Deevanshu@125502" });
//       connection.query(`CREATE DATABASE IF NOT EXISTS tour_bgmi`);
//     //   connection.query(`CREATE DATABASE IF NOT EXISTS tour_players`);
//       console.log("database created");
//    } catch (error) {
//       console.log("Error Occured!\n");
//       console.log("Database not created : Check config/sequelize.js");
//    }
  
// }

// Creating new Object of Sequelize
const tour_bgmi = new Sequelize(
	config.database,
	config.username,
	config.password, {

		// Explicitly specifying
		// mysql database
		dialect: config.dialect,

		// By default host is 'localhost'		
		host: config.host
	}
);
// const tour_players = new Sequelize(
// 	'tour_players',
// 	'apubg',
// 	'Deevanshu@125502', {

// 		// Explicitly specifying
// 		// mysql database
// 		dialect: 'mysql',

// 		// By default host is 'localhost'		
// 		host: 'localhost'
// 	}
// );

// Exporting the sequelize object.
// We can use it in another file
// for creating models
module.exports = {tour_bgmi}
