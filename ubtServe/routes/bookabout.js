var express = require('express');
const BookAboutController = require('../controllers/BookAboutController');
const { upload_detailsImg } = require('../services/Upload')
var router = express.Router();

//添加书籍
router.post("/", upload_detailsImg.array('book_image', 4), BookAboutController.addBook)
router.post("/addW", BookAboutController.addBookW)
//更新类别
router.put("/kind/:id", BookAboutController.updateBook_kind)
//更新状态
router.put("/state/:id", BookAboutController.updateBook_state)
//更新价格
router.put("/price/:id", BookAboutController.updateBook_price)
//删除
router.delete("/:id", BookAboutController.deleteBook)
//查询所有书籍
router.get("/all", BookAboutController.getBook)
//查询所有书籍
router.get("/all_link", BookAboutController.getBook_link)
//查询所有书籍 分页
router.get("/all_page", BookAboutController.getBook_page)
//总条数
router.get("/allnum", BookAboutController.getBooknum)
//首页展示 limit限制
router.get("/link", BookAboutController.getLinkbook)
//根据id查询
router.get("/id/:id", BookAboutController.getBook_id)
//根据id查询可以展示到页面的书籍
router.get("/idTrue/:id", BookAboutController.getBook_idTrue)
//根据isbn查询
router.get("/isbn/:id", BookAboutController.getBook_isbn)
//根据isbn查询 分页
router.get("/isbn_page/:id", BookAboutController.getBook_isbn_page)
//根据kind查询
router.get("/kind/:id", BookAboutController.getBook_kind)
//根据kind查询state=2
router.get("/kind_link/:id", BookAboutController.getBook_kindlink)
//根据stand查询
router.get("/stand/:id", BookAboutController.getBook_stand)
//根据state分页查询
router.get("/state", BookAboutController.getBook_state)
//isbn和state联查
router.get("/isbnlink", BookAboutController.getBook_isbnlink)
//isbn和state联查
router.get("/standlink", BookAboutController.getBook_standlink)

// 商品图片
router.post("/avator/:id", upload_detailsImg.single('bookA_image'), BookAboutController.changeBookAimage)
// router.post("/avator/:id",upload_detailsImg.single('book_image'), BookAboutController.changeBookAimage)


module.exports = router;
