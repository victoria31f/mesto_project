const path = require('path');
// подключаем path к конфигу вебпак
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // подключаем плагин
const isDev = process.env.NODE_ENV === 'development'; // создаем переменную для development-сборки

module.exports = {
    entry: { main: './src/index.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.[chunkhash].js'
    },
    module: {
        rules: [
            { // тут описываются правила
                test: /\.js$/i, // регулярное выражение, которое ищет все js файлы
                use: { loader: "babel-loader" }, // весь JS обрабатывается пакетом babel-loader
                exclude: /node_modules/ // исключает папку node_modules
            },
            {
                test: /\.css$/i, // применять это правило только к CSS-файлам
                use: [
                        (isDev ? 'style-loader' : MiniCssExtractPlugin.loader),
                        'css-loader',
                        'postcss-loader'
                    ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|ico|svg)$/,
                use: [
                    'file-loader?name=../images/[name].[ext]', // указали папку, куда складывать изображения
                    {
                        loader: 'image-webpack-loader',
                        options: {}
                    },
                ]
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file-loader?name=./vendor/[name].[ext]'
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({filename: 'style.[contenthash].css'}),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default'],
            },
            canPrint: true
        }),
        new HtmlWebpackPlugin({
            // Означает, что:
            inject: false, // стили НЕ нужно прописывать внутри тегов
            template: './src/index.html', // откуда брать образец для сравнения с текущим видом проекта
            filename: 'index.html' // имя выходного файла, то есть того, что окажется в папке dist после сборки
        }),
        new WebpackMd5Hash(),
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
}
// module.exports — это синтаксис экспорта в Node.js