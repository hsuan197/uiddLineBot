#!/usr/bin/env node

const config = require('./config')
const mysql = require('mysql')

const connection = mysql.createConnection(config.mysql)

connection.connect(err => {
  if (err) {
    console.log('fail to connect:', err)
    process.exit()
  }
})

//create tables
connection.query('CREATE TABLE IF NOT EXISTS users (id VARCHAR(10), name VARCHAR(30))')

//show tables
connection.query('show tables;', function (error, results, fields) {
  if (error) throw error
  console.log('tables: ', results)
})

connection.end()
