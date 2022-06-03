const { DataTypes } = require('sequelize');
var { tour_bgmi } = require('../config/sequelize');


function createptable(tablename) {

  const players_add = tour_bgmi.define(tablename, {
    // Model attributes are defined here

    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    phone: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      defaultValue: '0000000000'
    },
    pubg_userid: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      defaultValue: '0000000000'
    },
    pubg_username: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    kills: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    speciality: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    dateofenroll: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00'
    },
    paymentstatus: {
      type: DataTypes.CHAR,
      allowNull: true,
      defaultValue: '0'
    }
    ,
    paymentid: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    // Other model options go here
  });

  players_add.sync({ force: false })
    .catch((error) => {
      console.log(error);
    });

}

const top_players = tour_bgmi.define('top_player', {
  // Model attributes are defined here

  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: ''
  },
  kills: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: '0'
  },
  speciality: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: ''
  },
  index: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: '0'
  }
}, {
  // Other model options go here
});

top_players.sync({ force: false })
.catch((error) => {
  console.log(error);
});

module.exports = { createptable , top_players};
// `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true