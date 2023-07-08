const IndexService = require("../services/IndexService")
const IndexController = {
    pay: async (req, res) => {
        // console.log(req.body)
        await IndexService.pay((result) => {
            console.log(result)
            res.send(result)
        });
    },
    payPc: async (req, res) => {
        await IndexService.payPc(req.body, (result) => {
            res.send(result)
        });
    },
    payWechat: async (req, res) => {
        await IndexService.payWechat(req.body, (result) => {
            res.send(result)
        });
    },
    payBack: async (req, res) => {
        await IndexService.payBack(req.body, (result) => {
            res.send(result)
        });
    },
}

module.exports = IndexController
