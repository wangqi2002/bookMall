var express = require('express');
const PayController = require('../controllers/PayController');
var router = express.Router();

/* GET users listing. */
//添加
router.post("/", PayController.addRecord)
//下单返回 返回二维码
router.post("/placeAnOrder", PayController.placeAnOrder)

module.exports = router;
