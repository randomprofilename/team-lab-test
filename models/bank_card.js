module.exports = (sequelize, type) => {
  return sequelize.define('bankCard', {
    cardnumber: {
      type: type.INTEGER,
      primaryKey: true,
      unique: true
    },
    expirationdate: type.DATEONLY,
    currency: {
      type: type.STRING,
      allowNull: false
    },
    cardbalance: {
      type: type.INTEGER,
      allowNull: false
    }
  })
}
