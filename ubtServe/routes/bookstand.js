var express = require('express');
const BookStandController = require('../controllers/BookStandController');
var router = express.Router();

//添加
router.post("/",BookStandController.addStand)
//更新位置
router.put("/location/:id", BookStandController.updateStand_location)
//更新数量：+
router.put("/add/:id", BookStandController.updateStand_add)
//更新数量：-
router.put("/reduce/:id", BookStandController.updateStand_reduce)
//删除
router.delete("/:id", BookStandController.deleteStand)
//查询
router.get("/:id", BookStandController.getStand)

module.exports = router;
