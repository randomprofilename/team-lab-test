module.exports = (sequelize, type) => {
  return sequelize.define('bankAccount', {
    number: {
      type: type.INTEGER,
      primaryKey: true
    },
    currency: {
      type: type.STRING,
      allowNull: false
    },
    accountbalance: {
      type: type.INTEGER,
      allowNull: false
    }
  })
}
