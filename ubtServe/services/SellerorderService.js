const conn = require("../model/connectionRequest")
const { createRandomString } = require("../util/tool")
const SellerorderService = {
    addOrder: ({ sellerorder_sellerid, sellerorder_book_isbn, sellerorder_address, sellerorder_bookid }, callback) => {

        let sellerorder_id = createRandomString(18);
        let sellerorder_date = new Date();
        console.log("sellorder---", sellerorder_id, sellerorder_sellerid, sellerorder_bookid, sellerorder_book_isbn, sellerorder_date, sellerorder_address);

        let sql_insert = `INSERT INTO sellerorder VALUES(?,?,?,?,?,?,default)`;
        let sql_insertParams = [sellerorder_id, sellerorder_sellerid, sellerorder_bookid, sellerorder_book_isbn, sellerorder_date, sellerorder_address];

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

    updateOrder: ({ sellerorder_status }, sellerorder_id, callback) => {
        console.log("sellorder---", sellerorder_id, sellerorder_status);

        let sql_update = `UPDATE sellerorder set sellerorder_status=? where sellerorder_id=?`;
        let sql_updateParams = [sellerorder_status, sellerorder_id];
        let sql_look_id = `SELECT * FROM sellerorder WHERE sellerorder_id= ?`

        try {
            conn.query(sql_look_id, sellerorder_id, (err1, result1) => {
                if (err1) {
                    throw err1
                }
                if (!result1.length) {
                    callback({ code: 0, value: "该订单不存在！" })
                } else {
                    conn.query(sql_update, sql_updateParams, (err2, results2) => {
                        if (err2) {
                            throw err2
                        }
                        if (err2) {
                            callback({ code: 0, value: "更新失败！" })
                        } else {
                            callback({ code: 1, value: "更新成功" })
                        }
                    })
                }
            })
        } catch (error) {
            console.log(error);
        }
    },

    deleteOrder: (sellerorder_id, callback) => {
        console.log("sellorder---", sellerorder_id);

        let sql_delete = `delete from sellerorder where sellerorder_id=?`;
        let sql_look_id = `SELECT * FROM sellerorder WHERE sellerorder_id= ?`;

        try {
            conn.query(sql_look_id, sellerorder_id, (err1, result1) => {
                if (err1) {
                    throw err1
                }
                if (!result1.length) {
                    callback({ code: 0, value: "该订单不存在！" })
                } else {
                    if (result1[0].sellerorder_status === 1) {
                        conn.query(sql_delete, sellerorder_id, (err, results) => {
                            if (err) {
                                throw err
                            }
                            if (err) {
                                callback({ code: 0, value: "删除失败！" })
                            } else {
                                callback({ code: 1, value: "删除成功" })
                            }
                        })
                    } else {
                        callback({ code: 0, value: "该订单未完成！" })
                    }
                }
            })
        } catch (error) {
            console.log(error);
        }
    },

    getOrder_id: (sellerorder_sellerid, callback) => {
        console.log("sellorder---", sellerorder_sellerid);
        let sql_find = `select * from sellerorder where sellerorder_sellerid=?`;

        try {
            conn.query(sql_find, sellerorder_sellerid, function (err, results) {
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

    getOrder_status: ({ sellerorder_status }, callback) => {
        console.log("sellorder---", sellerorder_status);
        let sql_find = `select * from sellerorder where sellerorder_status=?`;

        try {
            conn.query(sql_find, sellerorder_status, function (err, results) {
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

    getOrder_status_page: ({ page, orderSn, consignee, status }, callback) => {
        let sql_find_total =
            `select COUNT(*) AS count from (select * from sellerorder where FIND_IN_SET (sellerorder_status,?)) as a`;

        let sql_find = `select * from sellerorder where FIND_IN_SET (sellerorder_status,?)`
        let sql_find_book = `select sellerorder_bookid from sellerorder where  FIND_IN_SET (sellerorder_status,?)`
        let sql_find_user = `select sellerorder_sellerid from sellerorder where  FIND_IN_SET (sellerorder_status,?)`


        if (orderSn !== '' && orderSn !== undefined) {
            sql_find = sql_find + " and sellerorder_sellerid = '" + orderSn + "'"
            sql_find_book = sql_find_book + " and sellerorder_sellerid = '" + orderSn + "'"
            sql_find_user = sql_find_user + " and sellerorder_sellerid = '" + orderSn + "'"
        }
        if (consignee !== '' && consignee !== undefined) {
            sql_find = sql_find + " and sellerorder_sellerid in (SELECT user_id FROM User where user_nickname like '%" +
                consignee + "%')"
            sql_find_book = sql_find_book + " and sellerorder_sellerid in (SELECT user_id FROM User where user_nickname like '%" +
                consignee + "%')"
            sql_find_user = sql_find_user + " and sellerorder_sellerid in (SELECT user_id FROM User where user_nickname like '%" +
                consignee + "%')"
        }

        let sql_find_all =
            `SELECT * FROM (SELECT * FROM (${sql_find}) a LEFT JOIN (select user_id,user_nickname,user_telphone,user_image from user where user_id in (${sql_find_user})) b on a.sellerorder_sellerid=b.user_id) m LEFT JOIN (SELECT * FROM (select * from bookabout WHERE bookA_id in (${sql_find_book})) a JOIN books b ON a.bookA_isbn=b.book_isbn) n ON m.sellerorder_bookid=n.bookA_id`
        sql_find_all = sql_find_all + ' LIMIT 6 OFFSET ?'

        let offsets = (parseInt(page) - 1) * 6
        let sql_totalParams = [status];
        let sql_findParams = [status, status, status, offsets];
        let result = { count: null, orderData: null, page: page };

        try {
            conn.query(sql_find_total, sql_totalParams, function (err, results1) {
                if (err) {
                    throw err
                }
                result.count = results1[0].count
                if (results1[0].count > 0) {
                    conn.query(sql_find_all, sql_findParams, function (err, results2) {
                        if (err) {
                            throw err
                        }
                        result.orderData = results2
                        callback &&
                            callback(
                                result ? JSON.parse(JSON.stringify(result)) : null
                            )
                    })
                } else {
                    callback &&
                        callback(
                            result ? JSON.parse(JSON.stringify(result)) : null
                        )
                }
            })
        } catch (error) {
            console.log(error);
        }
    },

    getOrder_sAn: (sellerorder_status, callback) => {
        let sql_find = `select * from (select * from sellerorder where sellerorder_status=?)a LEFT JOIN (select user_id,user_nickname from user where user_id in(select sellerorder_sellerid from sellerorder where sellerorder_status=?))b on a.sellerorder_sellerid=b.user_id;`;

        let sql_findParams = [sellerorder_status, sellerorder_status];

        try {
            conn.query(sql_find, sql_findParams, function (err, results) {
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

    getOrder_idstat: ({ sellerorder_sellerid, sellerorder_status }, callback) => {
        let sql_find = `select * from sellerorder where sellerorder_sellerid=? and sellerorder_status=?`;
        let sql_findParams = [sellerorder_sellerid, sellerorder_status];

        try {
            conn.query(sql_find, sql_findParams, function (err, results) {
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
    }
}

module.exports = SellerorderService
