var express = require('express');
const recordController = require('../controllers/recordController');
var router = express.Router();

/* GET users listing. */
//添加
router.post("/", recordController.addRecord)
//查询
router.get("/:id", recordController.getRecord_id)

module.exports = router;
