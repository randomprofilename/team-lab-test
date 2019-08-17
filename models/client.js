module.exports = (sequelize, type) => {
  return sequelize.define('client', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      allowNull: false
    },
    surname: {
      type: type.STRING,
      allowNull: false
    },
    dateofbirth: {
      type: type.DATEONLY,
      allowNull: false
    },
    adress: {
      type: type.STRING
    },
    passport: {
      type: type.STRING,
      allowNull: false
    }
  })
}
