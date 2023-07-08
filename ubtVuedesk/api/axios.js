import axios from 'axios'

// 给所有axios请求设置基础的域名
// axios.defaults.baseURL = 'http://localhost:3000'


//用axios.create可以创建axios的实例，允许不同实例有不同配置
/* const axios1 = axios.create({
    // 前端请求的地址
    baseURL: 'http://localhost:8080',
    // 请求超时的时间
    timeout: 5000
});  */
const axios1 = axios.create({
  // 前端请求的地址
  // baseURL: 'http://47.113.229.104:9527',
  baseURL: '',
  // 请求超时的时间
  timeout: 5000
});


//添加请求拦截器，会在发起请求之前执行相应的需求,使用token验证时必须加上这玩意
axios1.interceptors.request.use(function (config) {
  if (localStorage.getItem("token")) {
    config.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
  } /* else {
    config.headers.common['Authorization'] = 'Bearer '
  } */
  return config;
}, function (error) {
  return Promise.reject(error);
});

// //添加响应拦截器，会在返回数据后先执行相应的需求
axios1.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(error);
});
export default axios1