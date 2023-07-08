const conn = require("../model/connectionRequest")
const { createRandomString } = require("../util/tool")
const BuyerorderService = {
    addOrder: ({ buyerorder_buyerid, buyerorder_bookid, buyerorder_sellerid, buyerorder_address, buyerorder_price, buyerorder_id }, callback) => {
        let buyerorder_time = new Date();
        console.log("buyorder---", buyerorder_id, buyerorder_buyerid, buyerorder_bookid, buyerorder_sellerid, buyerorder_address, buyerorder_time, buyerorder_price);

        let sql_insert = `INSERT INTO Buyerorder VALUES(?,?,?,?,?,?,?,default)`;
        let sql_insertParams = [buyerorder_id, buyerorder_buyerid, buyerorder_bookid, buyerorder_sellerid, buyerorder_address, buyerorder_time, buyerorder_price];

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

    updateOrder: ({ buyerorder_status }, buyerorder_id, callback) => {
        console.log("buyorder---", buyerorder_id, buyerorder_status);

        let sql_update = `UPDATE Buyerorder set buyerorder_status=? where buyerorder_id=?`;
        let sql_updateParams = [buyerorder_status, buyerorder_id];
        let sql_look_id = `SELECT * FROM Buyerorder WHERE buyerorder_id= ?`

        try {
            conn.query(sql_look_id, buyerorder_id, (err1, result1) => {
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

    deleteOrder: (buyerorder_id, callback) => {
        console.log("buyorder---", buyerorder_id);

        let sql_delete = `delete from Buyerorder where buyerorder_id=?`;
        let sql_look_id = `SELECT * FROM Buyerorder WHERE buyerorder_id= ?`

        try {
            conn.query(sql_look_id, buyerorder_id, (err1, result1) => {
                if (err1) {
                    throw err1
                }
                if (!result1.length) {
                    callback({ code: 0, value: "该订单不存在！" })
                } else {
                    if (result1[0].buyerorder_status === 2 || result1[0].buyerorder_status === 3) {
                        conn.query(sql_delete, buyerorder_id, (err, results) => {
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

    getOrder_bookId: (buyerorder_bookid, callback) => {
        console.log("buyorder---", buyerorder_bookid);

        let sql_find = `select * from Buyerorder where buyerorder_bookid=?`;

        try {
            conn.query(sql_find, buyerorder_bookid, function (err, results) {
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

    getOrder_buyerId: (buyerorder_buyerid, callback) => {
        console.log("buyorder---", buyerorder_buyerid);

        let sql_find = `select * from Buyerorder where buyerorder_buyerid=?`;

        try {
            conn.query(sql_find, buyerorder_buyerid, function (err, results) {
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

    getOrder_sellerId: (buyerorder_sellerid, callback) => {
        console.log("buyorder---", buyerorder_sellerid);

        let sql_find = `select * from Buyerorder where buyerorder_sellerid=?`;

        try {
            conn.query(sql_find, buyerorder_sellerid, function (err, results) {
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

    getOrder_status: ({ buyerorder_status }, callback) => {
        console.log("buyorder---", buyerorder_status);

        let sql_find = `select * from Buyerorder where buyerorder_status=?`;

        try {
            conn.query(sql_find, buyerorder_status, function (err, results, fields) {
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
        let sql_find_total = `select COUNT(*) AS count from (select * from buyerorder where FIND_IN_SET (buyerorder_status,?)) as a`;

        let sql_find = `select * from buyerorder where FIND_IN_SET (buyerorder_status,?)`
        let sql_find_book = `select buyerorder_bookid from buyerorder where  FIND_IN_SET (buyerorder_status,?)`
        let sql_find_user = `select buyerorder_buyerid from buyerorder where  FIND_IN_SET (buyerorder_status,?)`


        if (orderSn !== '' && orderSn !== undefined) {
            sql_find = sql_find + " and buyerorder_id = '" + orderSn + "'"
            sql_find_book = sql_find_book + " and buyerorder_id = '" + orderSn + "'"
            sql_find_user = sql_find_user + " and buyerorder_id = '" + orderSn + "'"
        }
        if (consignee !== '' && consignee !== undefined) {
            sql_find = sql_find + " and buyerorder_buyerid in (SELECT user_id FROM User where user_nickname like '%" +
                consignee + "%')"
            sql_find_book = sql_find_book + " and buyerorder_buyerid in (SELECT user_id FROM User where user_nickname like '%" +
                consignee + "%')"
            sql_find_user = sql_find_user + " and buyerorder_buyerid in (SELECT user_id FROM User where user_nickname like '%" +
                consignee + "%')"
        }

        let sql_find_all = `SELECT * FROM (SELECT * FROM (${sql_find}) a LEFT JOIN (select user_id,user_nickname,user_telphone,user_image from user where user_id in (${sql_find_user})) b on a.buyerorder_buyerid=b.user_id) m LEFT JOIN (SELECT * FROM (select * from bookabout WHERE bookA_id in (${sql_find_book})) a JOIN books b ON a.bookA_isbn=b.book_isbn) n ON m.buyerorder_bookid=n.bookA_id`
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
                        //将查询出来的数据返回给回调函数
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

    getOrder_sAn: (buyerorder_status, callback) => {
        console.log("buyorder---", buyerorder_status);

        let sql_find = `select * from (select * from buyerorder where buyerorder_status=?)a LEFT JOIN (select user_id,user_nickname from user where user_id in(select buyerorder_buyerid from buyerorder where buyerorder_status=?))b on a.buyerorder_buyerid=b.user_id;`;

        let sql_findParams = [buyerorder_status, buyerorder_status];

        try {
            conn.query(sql_find, sql_findParams, function (err, results, fields) {
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

    getOrder_buyidStat: ({ buyerorder_buyerid, buyerorder_status }, callback) => {
        let sql_find = `select * from Buyerorder where buyerorder_buyerid=? and buyerorder_status=?`;
        let sql_findParams = [buyerorder_buyerid, buyerorder_status];

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

module.exports = BuyerorderService
