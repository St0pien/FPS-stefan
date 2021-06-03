const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, '..', 'backend', 'src', 'main', 'resources', 'public', 'game'),
        filename: 'bundle.js'
    },
    mode: 'development',

    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            filename: './index.html',
            template: './src/public/index.html',
            minify: true,
            inject: 'head'
        }),
        new MiniCssExtractPlugin()
    ],

    module: {
        rules: [
            {
                test: /\.css/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(png|jp(e*)g|svg|gif|fbx)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8000,
                            name: 'assets/[hash]-[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(glsl|vert|frag)$/,
                use: ['raw-loader']
            }
        ]
    },

    devServer: {
        port: 8080,
        watchOptions: {
            poll: 100
        }
    }
}