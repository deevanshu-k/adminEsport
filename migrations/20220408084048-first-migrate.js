'use strict';
const {DataTypes} = require('sequelize');


module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable('tour_details', {
      id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
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
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    queryInterface.createTable('tour_users', {
      id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    queryInterface.createTable('top_players', {
      id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
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
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable('tour_details');
    queryInterface.dropTable('tour_users');
    queryInterface.dropTable('top_players');
  }
};
