const conn = require("../model/connectionRequest")
const { createRandomString } = require("../util/tool")
const BookAboutService = {
    addBook: (bookA_isbn, bookA_old_degree, bookA_price, bookA_image, bookA_stand, bookA_kind, callback) => {
        console.log("bookabout---", bookA_isbn, bookA_old_degree, bookA_price, bookA_image, bookA_stand, bookA_kind);

        let bookA_id = createRandomString(18);
        let bookA_date = new Date();
        let sql_insert = `INSERT INTO bookabout VALUES(?,?,?,?,?,?,?,default,?)`;
        let sql_insertParams = [bookA_id, bookA_isbn, bookA_old_degree, bookA_price, bookA_image, bookA_stand, bookA_kind, bookA_date];

        try {
            conn.query(sql_insert, sql_insertParams, (err, results) => {
                if (err) {
                    throw err
                }
                if (err) {
                    callback({ code: 0, value: "插入失败！" })
                } else {
                    callback({ code: 1, value: "插入成功", _id: bookA_id })
                }
            })
        } catch (error) {
            console.log(error);
        }
    },
    addBookW: ({ bookA_id, bookA_isbn, bookA_old_degree, bookA_price, bookA_stand, bookA_kind }, callback) => {
        console.log("bookabout---", bookA_id, bookA_isbn, bookA_old_degree, bookA_price, bookA_stand, bookA_kind);

        let bookA_date = new Date();
        let bookA_image = `/images/detailsImg/default.png`
        let sql_insert = `INSERT INTO bookabout VALUES(?,?,?,?,?,?,?,default,?)`;
        let sql_insertParams = [bookA_id, bookA_isbn, bookA_old_degree, bookA_price, bookA_image, bookA_stand, bookA_kind, bookA_date];

        try {
            conn.query(sql_insert, sql_insertParams, (err, results) => {
                if (err) {
                    throw err
                }
                if (err) {
                    callback({ code: 0, value: "插入失败！" })
                } else {
                    callback({ code: 1, value: "插入成功", _id: bookA_id })
                }
            })
        } catch (error) {
            console.log(error);
        }
    },

    updateBook_kind: ({ bookA_kind }, bookA_id, callback) => {
        console.log("bookabout---", bookA_id, bookA_kind);

        let sql_update = `UPDATE bookabout set bookA_kind=? where bookA_id=?`;
        let sql_updateParams = [bookA_kind, bookA_id];
        let sql_look_id = `SELECT * FROM bookabout WHERE bookA_id= ?`

        try {
            conn.query(sql_look_id, bookA_id, (err1, result1) => {
                if (err1) {
                    throw err1
                }
                if (!result1.length) {
                    callback({ code: 0, value: "该书籍不存在！" })
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

    updateBook_state: ({ bookA_state }, bookA_id, callback) => {
        console.log("bookabout---", bookA_id, bookA_state);

        let sql_update = `UPDATE bookabout set bookA_state=? where bookA_id=?`;
        let sql_updateParams = [bookA_state, bookA_id];
        let sql_look_id = `SELECT * FROM bookabout WHERE bookA_id= ?`

        try {
            conn.query(sql_look_id, bookA_id, (err1, result1) => {
                if (err1) {
                    throw err1
                }
                if (!result1.length) {
                    callback({ code: 0, value: "该书籍不存在！" })
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

    updateBook_price: ({ bookA_price }, bookA_id, callback) => {
        console.log("bookabout---", bookA_id, bookA_price);

        let sql_update = `UPDATE bookabout set bookA_price=? where bookA_id=?`;
        let sql_updateParams = [bookA_price, bookA_id];
        let sql_look_id = `SELECT * FROM bookabout WHERE bookA_id= ?`

        try {
            conn.query(sql_look_id, bookA_id, (err1, result1) => {
                if (err1) {
                    throw err1
                }
                if (!result1.length) {
                    callback({ code: 0, value: "该书籍不存在！" })
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

    deleteBook: (bookA_id, callback) => {
        console.log("bookabout---", bookA_id);

        let sql_delete = `delete from bookabout where bookA_id=?`;

        try {
            conn.query(sql_delete, bookA_id, (err, results) => {
                if (err) {
                    throw err
                }
                if (err) {
                    callback({ code: 0, value: "删除失败！" })
                } else {
                    callback({ code: 1, value: "删除成功" })
                }
            })
        } catch (error) {
            console.log(error);
        }
    },

    getBook: (args, callback) => {
        let sql_find = `select * from bookabout a LEFT OUTER JOIN books s  ON a.bookA_isbn=s.book_isbn `;

        try {
            conn.query(sql_find, function (err, results) {
                if (err) {
                    throw err
                }
                callback &&
                    callback(
                        results ? JSON.parse(JSON.stringify(results)) : null
                    )
            })
        } catch (error) {
            console.log(error);
        }
    },

    getBook_link: (args, callback) => {
        let sql_find = `select * from bookabout a LEFT OUTER JOIN books s  ON a.bookA_isbn=s.book_isbn WHERE bookA_state=2`;

        try {
            conn.query(sql_find, function (err, results) {
                if (err) {
                    throw err
                }
                callback &&
                    callback(
                        results ? JSON.parse(JSON.stringify(results)) : null
                    )
            })
        } catch (error) {
            console.log(error);
        }
    },

    getBook_page: ({ page }, callback) => {
        let sql_find_total = `select COUNT(*) AS count from bookabout`;
        let sql_find = `select * from (select * from bookabout LIMIT 6 OFFSET ?) a LEFT OUTER JOIN books s ON a.bookA_isbn=s.book_isbn`
        let offsets = (parseInt(page) - 1) * 6
        let sql_findParams = [offsets];
        let result = { count: null, bookData: null, page: page };

        try {
            conn.query(sql_find_total, function (err, results1) {
                if (err) {
                    throw err
                }
                result.count = results1[0].count
                if (results1[0].count > 0) {
                    conn.query(sql_find, sql_findParams, function (err, results2) {
                        if (err) {
                            throw err
                        }
                        result.bookData = results2
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

    getBooknum: (args, callback) => {
        let sql_find = `select count(1) as total from bookabout where bookA_state=2`;

        try {
            conn.query(sql_find, function (err, results) {
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

    getLinkbook: ({ onset, offset, classify }, callback) => {
        console.log("bookabout---", onset, offset, classify)
        let sql_find;
        let sql_count;
        if (classify !== '全部') {
            sql_find = `select * from bookabout a LEFT OUTER JOIN books s  ON a.bookA_isbn=s.book_isbn WHERE bookA_state=2 and bookA_kind = '${classify}' limit ?,?`;
            sql_count = `SELECT COUNT(bookA_kind = '${classify}' or null) as classify from bookabout where bookA_state=2`;
        } else {
            sql_find = `select * from bookabout a LEFT OUTER JOIN books s  ON a.bookA_isbn=s.book_isbn WHERE bookA_state=2 limit ?,?`;
            sql_count = `SELECT COUNT(1) as classify from bookabout where bookA_state=2`;
        }

        let sql_findParams = [parseInt(onset), parseInt(offset)];
        conn.query(sql_find, sql_findParams, function (err, results) {
            if (err) {
                throw err
            }
            else {
                conn.query(sql_count, (err1, result1) => {
                    let totalResult = {
                        books: results,
                        count: result1[0].classify
                    }
                    callback &&
                        callback(
                            results ? JSON.parse(JSON.stringify(totalResult)) : null
                        )
                })
            }
        })
    },

    getBook_isbnlink: ({ bookA_isbn, bookA_state }, callback) => {
        let sql_find = `select * from bookabout a LEFT OUTER JOIN books s ON a.bookA_isbn=s.book_isbn where bookA_isbn=? and bookA_state=?`;
        let sql_findParams = [bookA_isbn, bookA_state];

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

    getBook_standlink: ({ bookA_stand, bookA_state }, callback) => {
        let sql_find = `select * from bookabout a LEFT OUTER JOIN books s ON a.bookA_isbn=s.book_isbn where bookA_stand=? and bookA_state=?`;
        let sql_findParams = [bookA_stand, bookA_state];

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

    getBook_id: (bookA_id, callback) => {
        let sql_find = `select * from bookabout a LEFT OUTER JOIN books s  ON a.bookA_isbn=s.book_isbn where bookA_id=?`;

        try {
            conn.query(sql_find, bookA_id, function (err, results, fields) {
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

    getBook_idTrue: (bookA_id, callback) => {
        let sql_find = `select * from bookabout a LEFT OUTER JOIN books s  ON a.bookA_isbn=s.book_isbn where bookA_id=? and bookA_state=2`;

        try {
            conn.query(sql_find, bookA_id, function (err, results, fields) {
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

    getBook_isbn: (bookA_isbn, callback) => {
        let sql_find = `select * from bookabout where bookA_isbn=?`;

        try {
            conn.query(sql_find, bookA_isbn, function (err, results, fields) {
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

    getBook_isbn_page: (bookA_isbn, callback) => {
        let sql_find_total = `select COUNT(*) AS count from (select * from bookabout where bookA_isbn=?) as a`;
        let sql_find = `select * from (select * from bookabout where bookA_isbn=?) a LEFT OUTER JOIN books s  ON a.bookA_isbn=s.book_isbn`;
        let sql_findParams = [bookA_isbn];
        let result = { count: null, bookData: null };

        try {
            conn.query(sql_find_total, sql_findParams, function (err, results1, fields) {
                if (err) {
                    throw err
                }
                result.count = results1[0].count
                if (results1[0].count > 0) {
                    conn.query(sql_find, sql_findParams, function (err, results2) {
                        if (err) {
                            throw err
                        }
                        result.bookData = results2
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

    getBook_kind: (bookA_kind, callback) => {
        let sql_find = `select * from bookabout where bookA_kind=?`;

        try {
            conn.query(sql_find, bookA_kind, function (err, results, fields) {
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

    getBook_kindlink: (bookA_kind, callback) => {
        let sql_find = `select * from bookabout a LEFT OUTER JOIN books s  ON a.bookA_isbn=s.book_isbn where bookA_kind=? and bookA_state=2`;

        try {
            conn.query(sql_find, bookA_kind, function (err, results, fields) {
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

    getBook_stand: (bookA_stand, callback) => {
        let sql_find = `select * from bookabout where bookA_stand=?`;

        try {
            conn.query(sql_find, bookA_stand, function (err, results) {
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

    getBook_state: ({ state, page }, callback) => {
        let sql_find_total = `select COUNT(*) AS count from (select * from bookabout where bookA_state=?) as a`;
        let sql_find = `select * from (select * from bookabout where bookA_state=? LIMIT 6 OFFSET ?) a LEFT OUTER JOIN books s ON a.bookA_isbn=s.book_isbn`
        let offsets = (parseInt(page) - 1) * 6
        let sql_findParams = [state, offsets];
        let result = { count: null, bookData: null, page: page };

        try {
            conn.query(sql_find_total, state, function (err, results1) {
                if (err) {
                    throw err
                }
                result.count = results1[0].count
                if (results1[0].count > 0) {
                    conn.query(sql_find, sql_findParams, function (err, results2) {
                        if (err) {
                            throw err
                        }
                        result.bookData = results2
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

    changeBookAimage: (bookA_id, bookA_image, callback) => {
        console.log("bookabout---", bookA_id, bookA_image);

        let sql_update = `UPDATE bookabout set bookA_image=? where bookA_id=?`;
        let sql_updateParams = [bookA_image, bookA_id];
        let sql_look_account = `SELECT * FROM bookabout WHERE bookA_id= ?`
        conn.query(sql_look_account, bookA_id, (err1, result1) => {
            if (err1) {
                throw err1
            }
            if (!result1.length) {
                callback({
                    code: 0,
                    value: "该书不存在！"
                })
            } else {
                conn.query(sql_update, sql_updateParams, (err2, results2) => {
                    if (err2) {
                        throw err2
                    }
                    if (err2) {
                        callback({
                            code: 0,
                            value: "更新失败！"
                        })
                    } else {
                        callback({
                            code: 1,
                            value: "更新成功"
                        })
                    }
                })
            }
        })

    },
}

module.exports = BookAboutService
