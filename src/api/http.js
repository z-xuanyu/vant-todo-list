import axios from "axios";
import { Toast } from "vant";
import qs from "qs";
import { Promise } from "core-js";
import router from "vue-router";
// 根据环境变量进行区分
switch (process.env.NODE_EDV) {
  //开发环境
  case "development":
    axios.defaults.baseURL = "http://localhost:8080";
    break;
  // 测试环境
  case "test":
    axios.defaults.baseURL = "http://192.168.20.15:9000";
    break;
  // 生产环境
  case "production":
    axios.defaults.baseURL = "http://api.zhouxuanyu.com/api/v1";
    break;
}
// 设置超时请求时间
axios.defaults.timeout = 10000;
// 设置CORS跨域允许携带资源凭证
axios.defaults.withCredentials = true;
// 设置POST请求头，告知服务器请求头主体的数据格式
axios.defaults.headers["Content-Type"] = "application/x-www-from-urlencoded";
axios.defaults.transformRequest = (data) => qs.stringify(data);

// 封装vant提示
const tip = (msg) => {
  Toast({
    message: msg,
    duration: 1000,
    forbidClick: true,
  });
};
// vue 路由跳转

const toLogin = () => {
  router.replace({
    path: "/login",
    query: {
      redirect: router.currentRoute.fullPath,
    },
  });
};
// 设置请求拦截器
axios.interceptors.request.use(
  (config) => {
    //设置请求前loading
    Toast.loading({
      mask: true,
      duration: 500,
      message: "加载中...",
    });
    // 添加TOKEN验证，可以从本地存储中获值，也可以从vuex中取值，主要是看自己怎么存储值的。
    //  JWT实现TOKEN校验
    const token = localStorage.getItem("token");
    token && (config.headers.Authorization = token);
    return config;
  },
  (error) => {
    //请求失败
    return Promise.reject(error);
  }
);

// 设置响应拦截器

// 状态码
axios.defaults.validateStatus = (status) => {
  return /^(2|3)\d{2}$/.test(status);
};

axios.interceptors.response.use(
  (response) => {
    // 返回响应主体中的信息,例如知道服务器返回CODE值来知道成功还是失败
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 请求已经发送，只不过状态码不是200系列，设置不同的状态码的不同处理
      switch (error.response.status) {
        case "401": //表示当前请求需要用户验证,一般是用户属于未登录状态
          toLogin(); //跳转到登录页面
          break;
        case "403": //服务器已经理解接收到请求，当时拒绝执行它，一般是用户的TOKEN过期
          tip("登录过期，请重新登录"); //提示用户TOKEN已经过期，需要重新登录
          localStorage.removeItem("token");
          // 1s之后跳转到登录页面
          setTimeout(() => {
            toLogin();
          }, 1000);
          break;
        case "404": //请求失败，服务器未发现请求的资源
          tip("请求的资源不存在");
          break;
      }
      return Promise.reject(error.response);
    } else {
      // 属于断网状态时处理
      if (!window.navigator.onLine) {
        //当网络断开时可以让它跳转到断网的页面
        return;
      }
      return Promise.reject(error);
    }
  }
);
// 导出封装好的axios
export default axios;
