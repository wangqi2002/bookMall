const jwt = require('jsonwebtoken');

// 密钥
const jwtSecret = 'dkfjdjfkdfdfd';  //签名

//登录接口 生成token的方法
// setToken携带的参数及参数的数量自定义
const setToken = function (user_id) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign(
            // 存储的数据
            { user_id: user_id },
            // 密钥
            jwtSecret,
            // 过期时间
            { expiresIn: 60 * 60 * 1 },
        );
        resolve(token)
    })
}
//各个接口需要验证token的方法
const getToken = function (token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject({
                code: 0,
                value: "token是空的"
            })
        } else {
            jwt.verify(token.split(' ')[1], jwtSecret, (err, data) => {
                if (err && err.message === 'invalid token') {
                    // return res.send({ message: '无效 token', code: 0 })
                    reject({
                        code: 0,
                        value: "无效 token"
                    })
                } else if (err && err.message === 'jwt expired') {
                    // return res.send({ message: 'token 失效', code: 0 })
                    reject({
                        code: 0,
                        value: "token失效"
                    })
                }
                resolve(data);
                next()
            });
        }
    })
}

module.exports = {
    setToken,
    getToken
}