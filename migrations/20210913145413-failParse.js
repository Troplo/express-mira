module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
          'library',
          'failedParse',
          {
            type: Sequelize.BOOLEAN
          },
      )
    ]);
  },
}