//css样式从js文件中分离出来,需要通过命令行安装 extract-text-webpack-plugin依赖包
var ExtractTextPlugin = require("extract-text-webpack-plugin");
//可视化分析包大小
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// config/webpack.common.js
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  devtool: "source-map",
  //entry: __dirname + "/src/index.js",
  entry: {
    //app: __dirname + "/src/styles/app.scss",
    //bundle: __dirname + "/src/index.js",
    index: __dirname + "/src/pages/index.js",
    business: __dirname + "/src/pages/bussiness.js"
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].js"
  },
  devServer: {
    //本地服务器所加载的页面所在的目录
    contentBase: "/public",
    port: 1219,
    //不跳转
    historyApiFallback: true,
    //实时刷新
    inline: true
  },
  plugins: [
    /*
    new MiniCssExtractPlugin({
      filename: "itinerary.css",
      chunkFilename: "[name].css?v=[hash]"
    }),
    */

    //new BundleAnalyzerPlugin(),
    //提取出来的样式放在style.css文件中
    new ExtractTextPlugin("css/style.css")
  ],
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: [
          /* 
            开启多进程打包。 
            进程启动大概为600ms，进程通信也有开销。
            只有工作消耗时间比较长，才需要多进程打包
          */
          {
            loader: 'thread-loader',
            options: {
              workers: 2 // 进程2个
            }
          },
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              plugins: ['transform-decorators-legacy'],
              presets: ["env", "react", "stage-0"]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [{ loader: "css-loader" }, { loader: "sass-loader" }]
        })
      }
    ]
  }
});
