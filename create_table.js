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
connection.query('CREATE TABLE IF NOT EXISTS record (lineId VARCHAR(33), id INT,time INT, PRIMARY KEY (id))');
connection.query('CREATE TABLE IF NOT EXISTS location (id INT, lat FLOAT, lng FLOAT, statu CHAR(1), address VARCHAR(100), PRIMARY KEY (id)) CHARSET=utf8;')
connection.query('CREATE TABLE IF NOT EXISTS house (id INT, total_floor TINYINT, age SMALLINT, folderId CHAR(33), PRIMARY KEY (id));')
connection.query('CREATE TABLE IF NOT EXISTS crack (id INT, picId TINYINT, x FLOAT, y FLOAT, crackType TINYINT, crcakCorner TINYINT, info TINYINT, spaceType TINYINT, crackPart TINYINT, floor TINYINT, length FLOAT, width FLOAT, fileId CHAR(33));')

connection.query('CREATE TABLE IF NOT EXISTS floor_plan (id INT, floor TINYINT, fileId CHAR(33));')

connection.query('show tables;', function (error, results, fields) {
  if (error) throw error
  console.log('show: ', results)
})

connection.end()
