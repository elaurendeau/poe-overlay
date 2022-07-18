const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
    configureWebpack: {
        devtool: "source-map",
    },
    transpileDependencies: ["vuetify"],
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: false,
            preload: "src/backend/preload/preload.ts",
            mainProcessWatch: ["src/backend/*", "src/backend/*/*"],
        },
    },
});
