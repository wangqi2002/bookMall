const PayService = require("../services/PayService")
const PayController = {
    placeAnOrder: async (req, res) => {
        // console.log(req.body)
        
        /* await */ PayService.placeAnOrder(req.body, (result) => {
            res.send(result)
        });
    },
    addRecord: async (req, res) => {
        // console.log(req.body)
        
        await PayService.addRecord(req.body, (result) => {
            res.send(result)
        });
    }
}

module.exports = PayController