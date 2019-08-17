const fs = require('fs')
const xml2js = require('xml2js')
var builder = require('xmlbuilder')
var moment = require('moment')
moment().format()
var parser = new xml2js.Parser()

var dirPath = __dirname + '/xmls/saved.xml'

const { Client, BankAccount, BankCard } = require('./sequelize')

function parseXmlToDb (pathToXml) {
  var xml = fs.readFileSync(pathToXml)
  parser.parseString(xml, async function (err, result) {
    if (err) {
      return console.log(err)
    }
    var clients = result['database']['client']
    var bankCards = result['database']['bankcard']
    var bankAccounts = result['database']['bankaccount']
    for (var clientJSON of clients) {
      // Parsing for table `Clients`
      var client = await Client.findOrCreate({ where: {
        name: String(clientJSON.name),
        surname: String(clientJSON.surname),
        dateofbirth: moment(clientJSON.dateofbirth, 'YYYY-MM-DD'),
        adress: String(clientJSON.adress),
        passport: String(clientJSON.passport)
      }
      })

      console.log(client[0].dataValues.id)

      // Parsing for table `Bank_Cards`

      clientJSON['cards'].forEach(array => {
        array['card'].forEach(card => {
          bankCards.forEach(bankCard => {
            // If current client is cardholder
            if (card == bankCard.cardnumber) {
              BankCard.create({
                cardnumber: String(bankCard.cardnumber),
                expirationdate: moment(bankCard.expirationdate, 'YYYY-MM-DD'),
                currency: String(bankCard.currency),
                cardbalance: String(bankCard.cardbalance),
                clientid: client[0].dataValues.id
              }).then((record) => { console.log(record.get()) })
            }
          })
        })
      })

      // Parsing for table `BankAccounts`
      clientJSON['accounts'].forEach(array => {
        array['account'].forEach(account => {
          bankAccounts.forEach(bankAccount => {
            // If current client is cardholder
            if (account == Number(bankAccount.number)) {
              BankAccount.create({
                number: Number(bankAccount.number),
                currency: String(bankAccount.currency),
                accountbalance: String(bankAccount.accountbalance),
                clientid: client[0].dataValues.id
              }).then((bankAccount) => { console.log(bankAccount.get()) })
            }
          })
        })
      })
    }
  })
  return true
}

async function generateXmlByDb () {
  var xml = builder.create('database')

  var clients = await Client.findAll()
  // clients
  for (var client of clients) {
    let bankCards = await client.getBankCards()
    let bankAccounts = await client.getBankAccounts()
    let cardNumbers = []
    let accountNumbers = []
    bankCards.forEach(bankCard => { cardNumbers.push(bankCard.dataValues.cardnumber) })
    bankAccounts.forEach(bankAccount => { accountNumbers.push(bankAccount.dataValues.number) })
    console.log(cardNumbers)
    xml.ele('client')
      .ele('name', client.dataValues.name).up()
      .ele('surname', client.dataValues.surname).up()
      .ele('dateofbirth', client.dataValues.dateofbirth).up()
      .ele('cards').ele({ 'card': cardNumbers }).up().up()
      .ele('accounts').ele({ 'account': accountNumbers }).up().up()
  }
  // cards
  var bankcards = await BankCard.findAll()
  for (var bankcard of bankcards) {
    xml.ele('bankcard')
      .ele('cardnumber', bankcard.dataValues.cardnumber).up()
      .ele('expirationdate', bankcard.dataValues.expirationdate).up()
      .ele('currency', bankcard.dataValues.currency).up()
      .ele('cardbalance', bankcard.dataValues.cardbalance).up()
  }
  // accounts
  var bankaccounts = await BankAccount.findAll()
  for (var bankaccount of bankaccounts) {
    xml.ele('bankaccount')
      .ele('number', bankaccount.dataValues.number).up()
      .ele('currency', bankaccount.dataValues.currency).up()
      .ele('accountbalance', bankaccount.dataValues.accountbalance).up()
  }
  xml.end()
  var xmldoc = xml.toString({ pretty: true })
  console.log(xmldoc)

  fs.writeFileSync(dirPath, xmldoc, function (err) {
    if (err) { return console.log(err) }

    console.log('The file was saved!')
  })
  // return path to new xml
}

module.exports = {
  dirPath,
  parseXmlToDb,
  generateXmlByDb
}
