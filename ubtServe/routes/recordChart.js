var express = require('express');
const ChartController = require('../controllers/chartController');
var router = express.Router();

//发送消息
router.post("/uploadChartImg", ChartController.uploadChartImg)
// 聊天信息提交数据库
router.post("/chartInfoSubmit",ChartController.chartInfoSubmit)
// 获取聊天信息
router.post("/getChartInfo",ChartController.getChartInfo)
// 平台获取聊天信息
router.post("/getChartInfoNew",ChartController.getChartInfoNew)
// 清除未读消息
router.post("/removeMsgRead",ChartController.removeMsgRead)
// socket.io测试路由
router.post("/testChart",ChartController.testChart)


module.exports = router;
