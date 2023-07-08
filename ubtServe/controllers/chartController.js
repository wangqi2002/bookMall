const express = require("express")
const router = express.Router()
const multer = require("multer")
const { upload, handerchartInfo, handerGetChartInfo,handerGetChartInfoNew,handerRemoveMsgRead } = require("../services/ChartService")

const chartController = {
    uploadChartImg: async (req, res) => {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                //上传错误
            } else if (err) {
                //未知错误
            }
            res.send({ code: 1, value: "文件上传成功", data: req.file })
        })
    },

    chartInfoSubmit: async (req, res) => {
        handerchartInfo(req.body, function (result) {
            console.log(result);
            res.send(result)
        });
    },
    getChartInfo: async (req, res) => {
        console.log(req.body);
        handerGetChartInfo(req.body, function (result) {
            res.send(result)
        })
    },
    getChartInfoNew: async (req, res) => {
        handerGetChartInfoNew(function (result) {
            res.send(result)
        })
    },
    removeMsgRead: async (req, res) => {
        handerRemoveMsgRead(req.body,function (result) {
            res.send(result)
        })
    },
    // 聊天测试路由
    testChart:async(req,res)=>{
    }
}


module.exports = chartController
