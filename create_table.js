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
connection.query('CREATE TABLE IF NOT EXISTS record (lineId VARCHAR(33), id INT)');
connection.query('CREATE TABLE IF NOT EXISTS location (id INT, lat FLOAT, lng FLOAT, statu CHAR(1), address VARCHAR(100)) CHARSET=utf8;')
connection.query('CREATE TABLE IF NOT EXISTS house (id INT, total_floor CHAR(1), now_floor CHAR(1), shape CHAR(1), door CHAR(1), stair CHAR(1));')


//connection.query('alter table location change address address varchar(100) character utf8;')
//connection.query('drop table record')
//connection.query('drop table location')
//connection.query('drop table house')

//show tables

connection.query('show tables;', function (error, results, fields) {
  if (error) throw error
  console.log('show: ', results)
})

//connection.query('INSERT INTO location(id, lat, lng, statu, address) VALUES (1, 22.5, 120.4, "1", "???" );');
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
/*

connection.query('select * from location where statu = "1";', function (error, results, fields) {
    if (error) throw error
    console.log('tables: ', results)
})
*/
//connection.end()
