const conn = require("../model/connectionRequest")
const BookStandService = {
    addStand: async ({ book_stand_id, book_stand_location }, callback) => {
        console.log("bookstand---", book_stand_id, book_stand_location)

        let sql_look_id = `select * from BookStand where book_stand_id = ?`
        let sql_insert = `insert into BookStand values(?,default,?)`
        let sql_update = `update BookStand set book_stand_number=book_stand_number+1 where book_stand_id = ?`
        let sql_insertParams = [book_stand_id, book_stand_location]

        try {
            conn.query(sql_look_id, book_stand_id, (err1, result1) => {
                if (err1) {
                    throw err1
                }
                if (result1.length) {
                    conn.query(sql_update, book_stand_id, (err2, results2) => {
                        if (err2) {
                            throw err2
                        }
                        if (err2) {
                            callback({ code: 0, value: "更新失败！" })
                        } else {
                            callback({ code: 1, value: "更新成功" })
                        }
                    })
                } else {
                    conn.query(sql_insert, sql_insertParams, (err3, results3) => {
                        if (err3) {
                            throw err3
                        }
                        if (err3) {
                            callback({ code: 0, value: "插入失败！" })
                        } else {
                            callback({ code: 1, value: "插入成功" })
                        }
                    })
                }
            })
        } catch (error) {
            console.log(error);
        }
    },

    updateStand_location: (book_stand_id, { book_stand_location }, callback) => {
        console.log("bookstand---", book_stand_id, book_stand_location);

        let sql_update = `UPDATE bookstand set book_stand_location=? where book_stand_id=?`;
        let sql_updateParams = [book_stand_location, book_stand_id];
        let sql_look_id = `SELECT * FROM bookstand WHERE book_stand_id= ?`

        try {
            conn.query(sql_look_id, book_stand_id, (err1, result1) => {
                if (err1) {
                    throw err1
                }
                if (!result1.length) {
                    callback({ code: 0, value: "该书立不存在！" })
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

    updateStand_add: (book_stand_id, callback) => {
        console.log("bookstand---", book_stand_id);

        let sql_update = `update BookStand set book_stand_number=book_stand_number+1 where book_stand_id = ?`
        let sql_look_id = `SELECT * FROM bookstand WHERE book_stand_id= ?`

        try {
            conn.query(sql_look_id, book_stand_id, (err1, result1) => {
                if (err1) {
                    throw err1
                }
                if (!result1.length) {
                    callback({ code: 0, value: "该书立不存在！" })
                } else {
                    conn.query(sql_update, book_stand_id, (err2, results2) => {
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

    updateStand_reduce: (book_stand_id, callback) => {
        console.log("bookstand---", book_stand_id);

        let sql_update = `update BookStand set book_stand_number=book_stand_number-1 where book_stand_id = ?`
        let sql_look_id = `SELECT * FROM bookstand WHERE book_stand_id= ?`

        try {
            conn.query(sql_look_id, book_stand_id, (err1, result1) => {
                if (err1) {
                    throw err1
                }
                if (!result1.length) {
                    callback({ code: 0, value: "该书立不存在！" })
                } else {
                    if (result1[0].book_stand_number > 0) {
                        conn.query(sql_update, book_stand_id, (err2, results2) => {
                            if (err2) {
                                throw err2
                            }
                            if (err2) {
                                callback({ code: 0, value: "更新失败！" })
                            } else {
                                callback({ code: 1, value: "更新成功" })
                            }
                        })
                    } else {
                        callback({ code: 0, value: "该书立内书籍以售完！" })
                    }
                }
            })
        } catch (error) {
            console.log(error);
        }
    },

    deleteStand: (book_stand_id, callback) => {
        console.log("bookstand---", book_stand_id)
        let sql_delete = `delete from bookstand where book_stand_id=?`;
        let sql_find = `select book_stand_number from bookstand book_stand_id=?`;

        try {
            conn.query(sql_find, book_stand_id, function (err1, result1) {
                if (err1) {
                    throw err1
                }
                if (result1[0] > 0) {
                    callback({ code: 0, value: "该书立中的书未售完！" })
                } else {
                    conn.query(sql_delete, book_stand_id, (err, results) => {
                        if (err) {
                            throw err
                        }
                        if (err) {
                            callback({ code: 0, value: "删除失败！" })
                        } else {
                            callback({ code: 1, value: "删除成功" })
                        }
                    })
                }
            })
        } catch (error) {
            console.log(error);
        }
    },

    getStand: (book_stand_id, callback) => {
        console.log("bookstand---", book_stand_id)
        let sql_find = `select * from bookstand where book_stand_id=?`;

        try {
            conn.query(sql_find, book_stand_id, function (err, results) {
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

module.exports = BookStandService
