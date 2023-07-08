const AdminService = require("../services/AdminService")
const path = require("path")
const AdminController = {
    addAdmin: async (req, res) => {
        console.log(req.body.user)
        await AdminService.addAdmin(req.body.user, (result) => {
            res.send(result)
        });
    },

    getAdminInfo: async (req, res) => {
        // console.log(req.body)
        await AdminService.getAdminInfo(req.body, (result) => {
            // console.log(result)
            res.send(result)
        })
    },

    update_name: async (req, res) => {
        // console.log(req.body)
        await AdminService.update_name(req.body, (result) => {
            res.send(result)
        });
    },

    update_permission: async (req, res) => {
        // console.log(req.body)
        await AdminService.update_permission(req.body, (result) => {
            res.send(result)
        });
    },

    getAdmin: async (req, res) => {
        await AdminService.getAdmin((results) => {
            // 以json的形式返回
            res.send({ code: 1, value: "管理员获取成功", data: results })
        })
    },

    deleteAdmin: async (req, res) => {
        console.log(req.body)
        await AdminService.deleteAdmin(req.body, (results) => {
            // 以json的形式返回
            res.send(results)
        })
    },
}

module.exports = AdminController