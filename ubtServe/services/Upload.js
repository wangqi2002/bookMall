const multer = require("multer")
const path = require("path")


//上传用户头像
const storage_userImg = multer.diskStorage({
    //存储位置
    destination: function (req, file, cb) {
        let filePath = path.resolve(__dirname, "../public/images/userImg");
        cb(null, filePath)
    },
    //文件名字
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6)
        cb(null, uniqueSuffix + file.originalname)
    }
})

//上传书籍详情图片
const storage_detailsImg = multer.diskStorage({
    //存储位置
    destination: function (req, file, cb) {
        let filePath = path.resolve(__dirname, "../public/images/detailsImg");
        cb(null, filePath)
    },
    //文件名字
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6)
        cb(null, uniqueSuffix + file.originalname)
    }
})

const upload_userImg = multer({ storage: storage_userImg })
const upload_detailsImg = multer({ storage: storage_detailsImg })

module.exports = {
    upload_userImg,
    upload_detailsImg
}
