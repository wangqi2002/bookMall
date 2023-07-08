var express = require('express');
const BooksController = require('../controllers/BooksController');
var router = express.Router();

/* GET users listing. */
//添加书籍信息
router.post("/", BooksController.addBook)
//获得isbn号内容
router.get("/getIsbn/:id", BooksController.getIsbn)
//获得书籍号内容
router.get("/getbook/:id", BooksController.getbook)
//删除
router.delete("/:id", BooksController.deleteBook)
//查询已录isbn条数和内容
router.get("/", BooksController.getBook)
router.get("/num", BooksController.getBooknum)

module.exports = router;
