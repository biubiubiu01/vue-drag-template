const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  productionSourceMap: false,
  outputDir: "dist",
  publicPath: "./",
  lintOnSave: !isProd,
  devServer: {
    port: 80,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
  },
  css: {},

  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
    externals: {},
  },
  chainWebpack(config) {
    //设置开发环境sourceMap
    config.when(!isProd, (config) => config.devtool("cheap-source-map"));
    //生产环境
    config.when(isProd, (config) => {
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial",
          },
          commons: {
            name: "chunk-commons",
            test: /[\\/]src[\\/]js[\\/]/,
            minChunks: 2, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });

      config.optimization.runtimeChunk("single");

      //去除生产环境debugger 和console
      config.optimization.minimizer("terser").tap((args) => {
        args[0].terserOptions.compress.warnings = false;
        args[0].terserOptions.compress.drop_console = true;
        args[0].terserOptions.compress.drop_debugger = true;
        args[0].terserOptions.compress.pure_funcs = ["console.*"];
        return args;
      });
    });
  },
};
