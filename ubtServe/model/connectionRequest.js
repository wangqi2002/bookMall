const mysql = require('mysql2')
const dbConfig = require('./connectionsConfig.json');

// 创建一个默认配置的连接池
// const conn = mysql.createPool({
//     host: connCreds["host"],
//     user: connCreds['username'],
//     password: connCreds['password'],
//     database: connCreds['database'],
//     port: connCreds["port"],
//     charset: 'utf8', //应该设置编码（省略在某些情况下会有错误）

//     //以下选项均为默认值（如果不需要变动可省略）
//     waitForConnections: true, //为true时，连接排队等待可用连接。为false将立即抛出错误
//     connectionLimit: 5, //单次可创建最大连接数
//     queueLimit: 0 //连接池的最大请求数，从getConnection方法前依次排队。设置为0将没有限制
// });

// 创建一个默认配置的连接池
const conn = mysql.createPool(dbConfig);

module.exports = conn
