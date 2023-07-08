const express = require('express');
const LoginController = require('../controllers/LoginController');
const router = express.Router();

// 用户登录
router.post("/userLogin", LoginController.userLogin)
// 用户登录 验证码
router.post("/userLoginS", LoginController.userLoginS)
// 用户登录 微信
router.post("/userLoginW", LoginController.userLoginW)
// 管理员登录
router.post("/adminLogin", LoginController.adminLogin)
// 用户免登录
router.post("/avoidLogin", LoginController.avoidLogin)
// 获取天气位置信息
router.post("/getWeather", LoginController.getWeather)
// 设置管理员免登录
router.post("/avoidAdminLogin", LoginController.avoidAdminLogin)
router.post("/exitLogin", LoginController.exitLogin)

module.exports = router