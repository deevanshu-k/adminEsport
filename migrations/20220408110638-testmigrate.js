'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn( 'tour_details', 'email', Sequelize.STRING );
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn( 'tour_details', 'email' );
  }
};
