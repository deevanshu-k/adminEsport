// Include Sequelize module
const Sequelize = require('sequelize');

// Creating new Object of Sequelize
const tour_bgmi = new Sequelize(
	'tour_bgmi',
	'apubg',
	'Deevanshu@125502', {

		// Explicitly specifying
		// mysql database
		dialect: 'mysql',

		// By default host is 'localhost'		
		host: 'localhost'
	}
);
const tour_players = new Sequelize(
	'tour_players',
	'apubg',
	'Deevanshu@125502', {

		// Explicitly specifying
		// mysql database
		dialect: 'mysql',

		// By default host is 'localhost'		
		host: 'localhost'
	}
);

// Exporting the sequelize object.
// We can use it in another file
// for creating models
module.exports = {tour_bgmi,tour_players}
