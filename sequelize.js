var ClientModel = require('./models/client')
var BankAccountModel = require('./models/back_account')
var BankCardModel = require('./models/bank_card')
var Sequelize = require('sequelize')

const sequelize = new Sequelize('bankdb', 'root', 'root', {
  host: 'localhost',
  dialect: 'sqlite',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  storage: './db/db.sqlite'
})

const Client = ClientModel(sequelize, Sequelize)
const BankAccount = BankAccountModel(sequelize, Sequelize)
const BankCard = BankCardModel(sequelize, Sequelize)

Client.hasMany(BankAccount, { foreignKey: 'clientid' })
Client.hasMany(BankCard, { foreignKey: 'clientid' })

sequelize.sync({ force: true })
  .then(() => {
    console.log('Database & tables created!')
  })

module.exports = {
  Client,
  BankAccount,
  BankCard
}
