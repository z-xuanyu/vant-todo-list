const autoprefixer = require("autoprefixer");
const pxtorem = require("postcss-pxtorem");

module.exports = {
  // 开发环境与生产环境运行环境配置
  publicPath: process.env.NODE_ENV === "production" ? "/todo-list/" : "/",
  devServer: {
    proxy: {
      "/mock-api": {
        target:
          "https://www.fastmock.site/mock/35513a0f1d224c85247701864cd0732f/todo/",
        changeOrigin: true,
        pathRewrite: {
          "^/mock-api": "/",
        },
      },
    },
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer({
            browsers: ["Android >= 4.0", "iOS >= 7"],
          }),
          pxtorem({
            rootValue: 37.5,
            propList: ["*"],
          }),
        ],
      },
    },
  },
};
