### webpack
#### 介绍
    [webpack文档](https://www.webpackjs.com/concepts/)
    webpack 是一个js静态模块打包器，它可以递归的构建一个依赖关系图，包含打包程序里面的所有模块，  
    最后打包成一个bundle.js 或者多个bundle.js，  它本身只识别 .js 和.json 的文件，  
    其他文件会用不同的loader 处理成js。主要的几个模块： entry， output, loader, plugins。  
#### 单页面打包
```
    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    module.export = {
        entry: './index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'first-bundle.js'
        },
        module: {
            rules:[
                {test: /\.txt$/, use: 'raw-loader'}
            ]
        },
        plugins: {
            new HtmlWebpackPlugin({
                template: './src/index.html', // html 模板，
                minify: true,
                ...
            }),
        }
    }

```
#### 多页面打包
```
'use strict';
const webpack = require('webpack');
// 获取文件目录下文件
const glob = require('glob');
const path = require('path');
// 压缩css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// 将js css 等自动插进HTML 模板中
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 清空上一次打包的文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 打包进度显示
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

const serMpa = () => {
    const entry = {};
     
    const HtmlWebpackPlugins = [];
    // glob 获取通配文件
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))
    // console.log(entryFiles, 'entrys');
        // /src/search/index.js
    entryFiles.forEach((item) => {
        // console.log(item);
        let pageName = item.match(/src\/(.*)(\/index\.js)$/); // 此处正则不严谨
        entry[pageName[1]] = './' + pageName[0];
        // entry: {
        //     index: './src/index.js',
        //     search: './src/search.js'
        // },

        HtmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template: path.join(__dirname, `src/${pageName[1]}/index.html`),
                loading: '页面正在努力加载中。。。',
                filename: `${pageName[1]}.html`,
                chunks: ['vendors', pageName[1]],
                inject: true,
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: false
                }
            }),
        )
    })
    // console.log(entry);
    
    return {
        entry,
        HtmlWebpackPlugins
    }
}
const {entry, HtmlWebpackPlugins} = serMpa();

module.exports = {
    entry: entry,
    output: {
        path: path.join(__dirname, `dist`),
        // path: '/home/proj/cdn/assets/[hash]',
        filename: '[name]_[chunkhash:8].js',
        // chunkFilename: '[name].bundle.js',
    },
    optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 0,
        //   maxSize: 0,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          automaticNameDelimiter: '~',
          name: true, 
          cacheGroups: {
            commons: {
                name: 'commons',
                chunks: 'all',
                minChunks: 2,
            },
          }
        }
    },
    module: {
        rules: [
            {
                test: /.js$/,
                use: 'babel-loader'
            },
            {
                test: /.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUni: 75,
                            remPrecision: 8 // rem 的小数点数
                        }
                    }
                ]
            },
            {
                test: /.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8][ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            // 打包到文件中
            banner: '+++++ adouwt 版权拥有，侵权必究，+++++++'
        }),
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new CleanWebpackPlugin(),
        new ProgressBarPlugin(),
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //         {
        //           module: 'react',
        //           entry: 'https://unpkg.com/react@16/umd/react.production.min.js',
        //           global: 'React',
        //         },
        //         {
        //             module: 'react-dom',
        //             entry: 'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js',
        //             global: 'ReactDOM',
        //         },
        //       ],
        // })
    ].concat(HtmlWebpackPlugins),
    devtool: 'inline-source-map',
    mode: 'production',
};


```
#### 打包优化
1.webpack 默认只支持 .js 和 .json  的文件，对于入口文件 和相互引入的文件，指定文件后缀名字；   
2.使用HappyPack 开辟多进程打包    
3.在配置loader 解析文件时候，用exclude 指出不需要解析的文件  
4.使用ParallelUglifyPlugin开启多进程压缩JS文件  
5.Tree Shaking剔除JS死代码（import 这个顶层模块导入方法，打包时候，将没有用的模块注释，压缩阶段删除注释部分代码）  
6.提取第三方库,（optimization 配置，提取公共的模块，or html-webpack-externals-plugin 插件，提出公共的库函数）  
7.静态js css等文件上cdn  
#### loader 使用及开发

#### plugin 使用及开发

(待续。。。)