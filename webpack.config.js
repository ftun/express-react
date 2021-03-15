const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        main : path.join(__dirname, '/fe/index.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "[name].js",
        chunkFilename: '[name].bundle.js',
        publicPath: '/'
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        historyApiFallback: true,
        port: 5000,
        proxy: {
            "/api": {
                target : "http://localhost:" + process.env.PORT,
                pathRewrite: {
                  '^/api' : ''
                }
            }
        }
        // hot: true
    },
    plugins: [
        // new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.PORT' : JSON.stringify(process.env.PORT),
        }),
        new HtmlWebPackPlugin({
            template: "./public/index.html",
            filename: "./index.html",
            inject: 'body'
        }),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            //se asigno esa opcion para que los estilos aparezcan en solo tag de style.
                            injectType: 'singletonStyleTag',
                        }
                    },
                    "css-loader"
                ]
            }
        ]
    } /*,
    resolve: {
        alias: {
            'react-router-dom': path.resolve('./node_modules/react-router-dom')
        }
    } */
};
