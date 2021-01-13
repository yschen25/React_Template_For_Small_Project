const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({size: 5});

let isDev = process.env.NODE_ENV === 'dev';

module.exports = {
    entry: {
        index: ['./main.js']
    },
    output: {
        filename: 'dist/js/bundle.[hash].js',
        path: path.resolve('./'),
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devServer: {
        host: 'localhost',
        inline: true,
        port: 3310,
        open: true
    },
    plugins: [
        // Insert a bundle file into new html file automatically when run webpack -p
        new HtmlWebpackPlugin({
            template: './main.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true,
            },
            hash: true,
            stats: {
                children: false
            }
        }),
        // Multiple threads
        new HappyPack({
            id: 'babel',
            threadPool: happyThreadPool,
            loaders: ['babel-loader?cacheDirectory']
        })
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attrs: false
                        }
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: true
                    }
                }
            },
            {
                /* The postcss-loader should be placed after css-loader and style-loader,
                   but before other preprocessor loaders like e.g sass|less|stylus-loader */
                test: /\.(css|scss|sass)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(gif|jpg|png|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            publicPath: isDev ? '' : '../images',
                            outputPath: './dist/images',
                            name: 'i.[hash].[ext]'
                        }
                    }
                ]
            }
        ]
    }
};
