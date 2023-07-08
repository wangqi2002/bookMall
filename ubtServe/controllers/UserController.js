const UserService = require("../services/UserService")
const path = require("path")
const multer = require("multer")

//上传文件
const storage = multer.diskStorage({
    //存储位置
    destination: function (req, file, cb) {
        console.log(file);
        let filePath = path.resolve(__dirname, "../public/images/userImg");
        cb(null, filePath)
    },
    //文件名字
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + file.originalname)
    }
})

const upload = multer({ storage: storage }).single("file")

const UserController = {
    addUser: async (req, res) => {
        // console.log(req.body)

        await UserService.addUser(req.body, (result) => {
            res.send(result)
        });
    },

    addUserWeChat: async (req, res) => {
      console.log('controller say:',req.body)
      // const { user_login_account, user_login_password, user_telphone } = req.body
  
      await UserService.addUserWeChat(req.body, (result) => {
        res.send(result)
      });
    },

    changeAvater: async (req, res) => {
        console.log(req.file, req.params.id)
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                //上传错误
            } else if (err) {
                //未知错误
            }
            res.send({ code: 1, value: "文件上传成功", data: req.file })
        })
    },

    changeAvaterw: async (req, res) => {
      console.log(req.params.id)
      const user_image = `/images/userImg/${req.file.filename}`
      await UserService.changeAvaterw(req.params.id, user_image, (result) => {
        res.send(result)
      });
    },

    changeTele: async (req, res) => {
        // console.log(req.body)
        const { user_telphone } = req.body
        await UserService.changeTele(user_telphone, req.params.id, (result) => {
            res.send(result)
        });
    },

    changeWeichat: async (req, res) => {
        // console.log(req.body)
        const { user_weichat } = req.body
        await UserService.changeWeichat(user_weichat, req.params.id, (result) => {
            res.send(result)
        });
    },

    changepwd: async (req, res) => {
        // console.log(req.body)
        const { user_password } = req.body
        await UserService.changepwd(user_password, req.params.id, (result) => {
            res.send(result)
        });
    },

    getUser: async (req, res) => {
        console.log(req.query)
        await UserService.getUser(req.query,(results) => {
            // 以json的形式返回
            res.send(results)
        })
    },

    findUser: async (req, res) => {
        console.log(req.query)
        await UserService.findUser(req.query,(results) => {
            // 以json的形式返回
            res.send(results)
        })
    },

    getSvg: async (req, res) => {
        await UserService.getSvg(req.body, (results) => {
            // 以json的形式返回
            res.send(results)
        })
    },

    getUserInfo: async (req, res) => {
        // console.log(req.body)
        await UserService.getUserInfo(req.body, (result) => {
            // console.log(result)
            res.send(result)
        })
    },

    getUserInfoW: async (req, res) => {
        // console.log(req.body)
        await UserService.getUserInfoW(req.body, (result) => {
            // console.log(result)
            res.send(result)
        })
    },

    updateNoHeadInfo: async (req, res) => {
    //   console.log(req.body)
      await UserService.updateNoHeadInfo(req.body, (results) => {
        // 以json的形式返回
        res.send(results)
      })
    },

    updateInfo: async (req, res) => {
        console.log(req.body, req.files)
        const { user_nickname, user_loacation, user_image, user_id } = req.body
        await UserService.updateInfo(user_nickname, user_loacation, user_image, user_id, (result) => {
            res.send(result)
        });
    },

    changeCollect: async (req, res) => {
        console.log(req.body)
        await UserService.changeCollect(req.body, (result) => {
            res.send(result)
        });
    },

    getCollections: async (req, res) => {
        console.log(req.params.id)
        await UserService.getCollections(req.params.id, (result) => {
            res.send(result)
        });
    },

    deleteCollectionAll: async (req, res) => {
        console.log(req.params.id)
        await UserService.deleteCollectionAll(req.params.id, (result) => {
            res.send(result)
        });
    },
}

module.exports = UserController