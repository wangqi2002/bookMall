const conn = require("../model/connectionRequest")
const { createRandomString } = require("../util/tool")
const recordService = {
    addRecord: ({ r_userId, r_url, r_result }, callback) => {
        let r_id = createRandomString(16);
        let r_date = new Date();
        console.log("record+++", r_id, r_userId, r_url, r_result, r_date);

        let sql_insert = `INSERT INTO record VALUES(?,?,?,?,?)`;
        let sql_insertParams = [r_id, r_userId, r_url, r_result, r_date];

        try {
            conn.query(sql_insert, sql_insertParams, (err, results) => {
                if (err) {
                    throw err
                }
                if (err) {
                    callback({ code: 0, value: "插入失败！" })
                } else {
                    callback({ code: 1, value: "插入成功" })
                }
            })
        } catch (error) {
            console.log(error);
        }
    },

    getRecord_id: (r_userId, callback) => {
        let sql_find = `select * from record where r_userId=?`;

        try {
            conn.query(sql_find, r_userId, function (err, results, fields) {
                if (err) {
                    throw err
                }
                //将查询出来的数据返回给回调函数
                callback &&
                    callback(
                        results ? JSON.parse(JSON.stringify(results)) : null
                    )
            })
        } catch (error) {
            console.log(error);
        }
    },
}

module.exports = recordService
