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
connection.query('CREATE TABLE IF NOT EXISTS record (lineId VARCHAR(33), id INT, PRIMARY KEY (id))');
connection.query('CREATE TABLE IF NOT EXISTS location (id INT, lat FLOAT, lng FLOAT, statu CHAR(1), address VARCHAR(100), PRIMARY KEY (id)) CHARSET=utf8;')
connection.query('CREATE TABLE IF NOT EXISTS house (id INT, total_floor TINYINT, age SMALLINT, folderId CHAR(33), PRIMARY KEY (id));')
connection.query('CREATE TABLE IF NOT EXISTS crack (id INT, picId TINYINT, x FLOAT, y FLOAT, crackType TINYINT, crcakCorner TINYINT, info TINYINT, spaceType TINYINT, crackPart TINYINT, floor TINYINT, length FLOAT, width FLOAT, fileId CHAR(33));')

//connection.query('alter table location change address address varchar(100) character utf8;')
//connection.query('drop table record')
//connection.query('drop table location')
//connection.query('drop table house')
//connection.query('drop table crack')
//show tables

connection.query('show tables;', function (error, results, fields) {
  if (error) throw error
  console.log('show: ', results)
})

//connection.query('INSERT INTO crack (id, x, y, crackType, spaceType, crackPart, height, width) VALUES (1,-1, -1, 1, 1, 1, 1, 1);');
//connection.query('INSERT INTO location(id, lat, lng, statu, address) VALUES (2, 22.3, 121.4, "3", "???" );');
/*
connection.query('select * from record;', function (error, results, fields) {
    if (error) throw error
    console.log('tables: ', results)
})
connection.query('select * from location;', function (error, results, fields) {
    if (error) throw error
    console.log('tables: ', results)
})
connection.query('select * from house;', function (error, results, fields) {
    if (error) throw error
    console.log('tables: ', results)
})
*/

connection.query('select * from crack', function (error, results, fields) {
    if (error) throw error
    console.log('tables: ', results)
})

connection.end()
