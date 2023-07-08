var express = require('express');
const IndexController = require('../controllers/IndexController');
var router = express.Router();

/* GET home page. */
router.get('/', IndexController.pay);

router.post("/payPc", IndexController.payPc)
router.post("/payWechat", IndexController.payWechat)
router.post("/payBack", IndexController.payBack)
module.exports = router;
