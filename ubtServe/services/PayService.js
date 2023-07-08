const conn = require("../model/connectionRequest")
const { createRandomString } = require("../util/tool")
const WxPay = require("wechatpay-node-v3")
const axios = require("axios")
const fs = require("fs")
const PayService = {
    placeAnOrder: async ({ params }, callback) => {
        console.log("pay--", params)

        callback({ code: 1, value: "到达" })
    },

    addRecord: ({ r_userId, r_url, r_result }, callback) => {
        let r_id = createRandomString(16);
        let r_date = new Date();
        console.log("pay--", r_id, r_userId, r_url, r_result, r_date);

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
    }
}

module.exports = PayService
