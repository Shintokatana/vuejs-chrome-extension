const path = require('path');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const createHtmlPlugin = (chunkName, fileName) => new HTMLWebpackPlugin({
    filename: `${fileName}.html`,
    chunks: [chunkName],
    template: path.resolve(__dirname, `src/public/${fileName}.html`),
    minify: true
});

const createPolyfill = path => ['@babel/polyfill', path];

module.exports = {
    entry: {
        main: createPolyfill("./src/main.js"),
        application: createPolyfill("./src/popup/index.js"),
        options: createPolyfill("./src/options/index.js"),
        background: createPolyfill("./src/background/index.js"),
    },
    mode: "production",
    output: {
        path: __dirname + "/dist",
        filename: chunkData =>
            chunkData.chunk.name === "application" ||
      chunkData.chunk.name === "options"
                ? "[name].[contenthash].js"
                : "[name].bundle.js",
        pathinfo: false,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ProgressBarPlugin(),
        new CopyPlugin([{ from: "basicConfig", to: "" }]),
        createHtmlPlugin("application", "index"),
        createHtmlPlugin("options", "options"),
    ],
    watchOptions: {
        aggregateTimeout: 600,
        ignored: /node_modules/,
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true,
                    },
                },
                parallel: true,
                cache: false,
                sourceMap: false,
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    parser: require("postcss-safe-parser"),
                    map: false,
                },
            }),
            new VueLoaderPlugin()
        ],
    },
    performance: {
        hints: "warning",
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, "src"),
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.(vue)$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, "src"),
                use: {
                    loader: "vue-loader"
                }
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                include: path.resolve(__dirname, "src/styles"),
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ["file-loader"],
            },
        ],
    },
    stats: {
        builtAt: true,
        colors: true,
    },
    devtool: false,
};
