import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import http from "./api/http"; //引入封装好的axios
Vue.prototype.$http = http; //把封装好的axios 挂载在vue原型
import "lib-flexible"; //移动端适配
// vant ui库
import {
  Button,
  NavBar,
  Icon,
  SwipeCell,
  Checkbox,
  PullRefresh,
  Toast,
  List,
  Dialog,
  Col,
  Row,
  Popup,
  Form,
  Field,
} from "vant";
Vue.use(Button)
  .use(Col)
  .use(Row)
  .use(NavBar)
  .use(Icon)
  .use(SwipeCell)
  .use(Checkbox)
  .use(PullRefresh)
  .use(Toast)
  .use(List)
  .use(Popup)
  .use(Form)
  .use(Field)
  .use(Dialog);
Vue.config.productionTip = false;
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
