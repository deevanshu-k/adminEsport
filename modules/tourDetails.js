const { Sequelize, DataTypes } = require('sequelize');
var {tour_bgmi} = require('../config/sequelize');


const tour_details = tour_bgmi.define('tour_details', {
  // Model attributes are defined here
  indexs: {
    type: DataTypes.INTEGER,
    allowNull: false,
    default: 0
  },
  win_prize: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  per_kill: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  entry_fees: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  type: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'SOLO'
  },
  version: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'TPP'
  },
  map: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'Erangle'
  },
  sheduled_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: '0000-00-0'
  },
  player_joined: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: '0',
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: '0'
  },
  total_player: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: '0'
  },
  rstatus: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  },
  rpay_link: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '#rpay'
  }
}, {
  // Other model options go here
});

tour_details.sync({ force: false })
   .catch((error) => {
      console.log(error);
   });

const tour_users = tour_bgmi.define('tour_user',{
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: '234234'
  },
  user: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: ''
  },
  hash: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: ''
  },

},{});

tour_users.sync({ force: false })
   .catch((error) => {
      console.log(error);
   });

module.exports = {tour_details,tour_users};
// `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true