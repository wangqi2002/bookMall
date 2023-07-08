const conn = require("../model/connectionRequest")
const axios = require("axios")
const fs = require("fs")
const path = require("path")
const BooksService = {
    addBook: async ({ book_isbn, book_name, book_author, book_press, book_publication_time, book_framing, book_publiction_price, book_cover, book_abstract }, callback) => {
        console.log("book+++", book_isbn, book_name, book_author, book_press, book_publication_time, book_framing, book_publiction_price, book_cover, book_abstract)
        if (book_author === "") {
            book_author = "佚名"
        }
        if (book_press === "") {
            book_press = "未知"
        }
        if (book_publiction_price === "") {
            book_publiction_price = 0
        }
        let data = null;
        if (book_cover.indexOf("images") == -1) {
            const res = await axios({
                url: book_cover,
                method: "get",
                responseType: "stream"
            });
            data = res.data;
        }
        let sql_look_isbn = `select * from books where book_isbn = ?`;

        try {
            conn.query(sql_look_isbn, book_isbn, (err1, result1) => {
                if (err1) {
                    throw err1
                }
                if (result1.length) {
                    callback({ code: 0, value: "已录" })
                } else {
                    let imgName = Date.now() + '.jpg'
                    let imgUrl = `/images/bookCover/${imgName}`
                    data.pipe(fs.createWriteStream(path.resolve(__dirname, "../public/images/bookCover/" + imgName)))
                    let sql_insert = `insert into Books values(?,?,?,?,?,?,?,?,?)`
                    let sql_insertParams = [book_isbn, book_name, book_author, book_press, book_publication_time, book_framing, book_publiction_price, imgUrl, book_abstract]
                    conn.query(sql_insert, sql_insertParams, (err2, results2) => {
                        if (err2) {
                            throw err2
                        }
                        if (err2) {
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

    deleteBook: (book_isbn, callback) => {

        let sql_delete = `delete from Books where book_isbn=?`;
        let sql_find = `select book_id from bookabout where book_isbn=?`;

        try {
            conn.query(sql_find, book_isbn, function (err1, result1) {
                if (err1) {
                    throw err1
                }
                if (result1.length) {
                    callback({ code: 0, value: "还存在同ISBN号的书籍" })
                } else {
                    conn.query(sql_delete, book_isbn, (err, results) => {
                        if (err) {
                            callback({ code: 0, value: "删除失败！" })
                            throw err
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

    getBook_id: (book_isbn, callback) => {
        let sql_find = `select * from Books where book_isbn=?`;

        try {
            conn.query(sql_find, book_isbn, function (err, results, fields) {
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

    getBook: (args, callback) => {
        let sql_find = `select * from Books`;

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

    getBooknum: (args, callback) => {
        let sql_find = `select count(1) as total from Books`;

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

    getIsbn: (url, callback) => {
        console.log("book+++", url);
        let sql_find = `select * from books where book_isbn=?`;
        try {
            conn.query(sql_find, url, async (err, result) => {
                if (err) {
                    throw err
                }
                if (result.length) {
                    //将查询出来的数据返回给前端页面
                    callback &&
                        callback(
                            result ? JSON.parse(JSON.stringify({ code: 1, vlaue: "书籍查询成功", book: result[0] })) : null
                        )
                } else {
                    let { data } = await axios.get(`https://api.jike.xyz/situ/book/isbn/${url}?apikey=13152.2e3996fbce0a7c9b5620ae7b5cbe3fb0.64ceaaf709945c2a8a4f21f31c266e6d`)
                    if (!data.data) {
                        callback({ code: 0, value: "暂时未查询到图书!" })
                        return;
                    }
                    let price = data.data.price;
                    let reg = /^[0-9]/;
                    let strPrice = ''
                    for (let i = 0; i < price.length; i++) {
                        if (reg.test(price[i]) || price[i] == '.')
                            strPrice += price[i]
                    }
                    callback && callback(
                        result ? JSON.parse(JSON.stringify({
                            code: 1, vlaue: "书籍查询成功", book: {
                                book_isbn: data.data.id,
                                book_name: data.data.name,
                                book_author: data.data.author,
                                book_press: data.data.publishing,
                                book_publication_time: data.data.published,
                                book_framing: data.data.designed,
                                book_publiction_price: strPrice,
                                book_cover: data.data.photoUrl,
                                book_abstract: data.data.description,
                            }
                        })) : null
                    )
                }
            })
        } catch (error) {
            console.log(error);
        }
    },

    getbook: (url, callback) => {
        console.log("book+++", url);
        let sql_find = `select * from books where book_isbn=(select bookA_isbn from bookabout where bookA_id = ?)`;
        try {
            conn.query(sql_find, url, async (err, result) => {
                if (err) {
                    throw err
                }
                if (result.length) {
                    //将查询出来的数据返回给前端页面
                    callback &&
                        callback(
                            result ? JSON.parse(JSON.stringify({ code: 1, vlaue: "书籍查询成功", book: result[0] })) : null
                        )
                } else {
                    callback({ code: 0, value: "库中无此图书!" })
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = BooksService
