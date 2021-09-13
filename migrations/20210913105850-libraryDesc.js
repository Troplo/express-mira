module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
          'library',
          'description',
          {
            type: Sequelize.TEXT
          },
      )
    ]);
  },
}