const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
});
configureWebpack: (config) => {
  config.devtool = "source-map";
};
