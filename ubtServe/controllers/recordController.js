const recordService = require("../services/recordService")
const recordController = {
    addRecord: async (req, res) => {
        // console.log(req.body)
        
        await recordService.addRecord(req.body, (result) => {
            res.send(result)
        });
    },

    getRecord_id: async (req, res) => {
        await recordService.getRecord_id(req.params.id, (results) => {
            // 以json的形式返回
            res.json({ results })
        })
    },
}

module.exports = recordController