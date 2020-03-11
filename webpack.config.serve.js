const path = require('path');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const createHtmlPlugin = (chunkName, fileName) => new HTMLWebpackPlugin({
    filename: `${fileName}.html`,
    chunks: [chunkName],
    template: path.resolve(__dirname, `src/public/${fileName}.html`),
    minify: true
});

const createPolyfill = path => [path];

module.exports = {
    entry: {
        main: createPolyfill("./src/main.js"),
        application: createPolyfill("./src/popup/index.js"),
        options: createPolyfill("./src/options/index.js"),
        background: createPolyfill("./src/background/index.js"),
    },
    mode: "development",
    output: {
        path: __dirname + "/dist",
        filename: "[name].bundle.js",
        pathinfo: false,
    },
    plugins: [
        new ProgressBarPlugin(),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        new CopyPlugin([{ from: "basicConfig", to: "" }]),
        createHtmlPlugin("application", "index"),
        createHtmlPlugin("options", "options"),
        new VueLoaderPlugin()
    ],
    watch: true,
    watchOptions: {
        aggregateTimeout: 600,
        ignored: /node_modules/,
    },
    optimization: {
        minimize: false,
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
                test: /\.vue$/,
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
                use: [
                    'file-loader',
                ],
            }
        ],
    },
    stats: {
        builtAt: true,
        colors: true,
    },
};
