const conn = require("../model/connectionRequest")
const verToken = require("../token/token")
const axios = require("axios")
const LoginService = {
    avoidLogin: (req, callback) => {
        // 获取请求头中的信息
        const beareHeader = req.headers.authorization;
        verToken.getToken(beareHeader).then((data) => {
            callback({ code: 1, value: "已登录", info: data });
        }).catch((err) => {
            callback({ code: 0, value: "请登录------" })
        })
    },

    handerWeather: async () => {
        let { data } = await axios.get(`http://v0.yiketianqi.com/api?unescape=1&version=v91&appid=43656176&appsecret=I42og6Lm&ext=&cityid=&city=${encodeURI("合肥")}`);
        let weatherData = {
            city: data.city + '市',
            date: data.update_time,
            week: data.data[0].week,
            weather: data.data[0].wea
        }
        return { code: 1, value: "天气获取成功", data: weatherData };
    }
}

module.exports = LoginService
