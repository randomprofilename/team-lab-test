const express = require('express')
const formidable = require('formidable')
const fs = require('fs')
const { dirPath, parseXmlToDb, generateXmlByDb } = require('./working_with_xml')
const { Client, BankAccount, BankCard } = require('./sequelize')

const app = express()
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index')  
})

app.get('/import', (req, res) => {
  res.render('pages/import', {success: false})
})

app.get('/export', (req, res) => {
  res.render('pages/export')
})

app.get('/client*', (req, res) => {
  res.render('pages/client')
})

app.get('/bankcard*', (req, res) => {
  res.render('pages/bankcard')
})

app.get('/bankaccount*', (req, res) => {
  res.render('pages/bankaccount')
})


app.post('/api/import', (req, res) => {
  var form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, files) {
    if (err) { res.sendStatus(400) }
    if (parseXmlToDb(files.filetoimport.path)) {
      res.render('pages/import', {success: true})
    }
  })
})

app.get('/api/export', (req, res) => {
  generateXmlByDb().then(() => {
    var today = new Date();
    var UTCstring = today.toUTCString(); 
    res.download(dirPath, UTCstring + ".xml") })
})

app.get('/api/clients', (req, res) => {
  Client.findAll()
    .then(client => { res.json(client) })
})


app.get('/api/client/:id', (req, res) => {
  Client.findById(req.params.id)
    .then(client => { res.json(client) })
})

app.get('/api/client/:id/bankcards', (req, res) => {
  Client.findById(req.params.id).then(client => {
    client.getBankCards({ attributes: ['cardnumber'] })
      .then(bankcards => { res.json(bankcards) })
  })
})

app.get('/api/client/:id/bankaccounts', (req, res) => {
  Client.findById(req.params.id).then(client => {
    client.getBankAccounts({ attributes: ['number'] })
      .then(bankaccounts => { res.json(bankaccounts) })
  })
})

app.get('/api/bankcard/:cardnumber', (req, res) => {
  BankCard.findOne({ where: { cardnumber: req.params.cardnumber } }).then(bankcard => { res.json(bankcard) })
})

app.get('/api/bankaccount/:number', (req, res) => {
  BankAccount.findOne({ where: { number: req.params.number } }).then(bankaccount => { res.json(bankaccount) 
  console.log(bankaccount)})
})

app.listen(3000)
