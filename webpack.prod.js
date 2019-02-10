const path = require('path');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin'); //installed via npm
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MediaQueryPlugin = require('media-query-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const buildPath = path.resolve(__dirname, 'build');

module.exports = {

	// This option controls if and how source maps are generated.
	// https://webpack.js.org/configuration/devtool/
	devtool: 'source-map',

	// https://webpack.js.org/concepts/entry-points/#multi-page-application
	entry: {
		index: './app/js/index.js',
		about: './app/js/about.js',
		// contacts: './src/page-contacts/main.js'
	},

	// how to write the compiled files to disk
	// https://webpack.js.org/concepts/output/
	output: {
		filename: 'js/[name].[hash:20].js',
		path: buildPath
	},

	// https://webpack.js.org/concepts/loaders/
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					'thread-loader',
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				]
			},
			{
				test: /\.(ttf|eot|woff|woff2)$/,
				loader: 'file-loader',
				options: {
					name: 'fonts/[name].[ext]',
				}
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							interpolate: true
						}
					}
				]
			},
			{
				test: /\.(scss|css|sass)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						// translates CSS into CommonJS
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: MediaQueryPlugin.loader
					},
					{
						// Runs compiled CSS through postcss for vendor prefixing
						loader: 'postcss-loader',
						options: {
							sourceMap: true
						}
					},
					{
						// compiles Sass to CSS
						loader: 'sass-loader',
						options: {
							outputStyle: 'expanded',
							sourceMap: true,
							sourceMapContents: true
						}
					}
				]
			},
			{
				// Load all images as base64 encoding if they are smaller than 8192 bytes
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: 'img/[name].[hash:20].[ext]',
							limit: 8192
						}
					}
				]
			}
		]
	},

	// https://webpack.js.org/concepts/plugins/
	plugins: [
		new webpack.ProvidePlugin({
			fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
		}),
		new CleanWebpackPlugin(buildPath),
		new HtmlWebpackPlugin({
			template: './app/index.html',
			inject: 'body',
			chunks: ['index'],
			filename: 'index.html'
		}),
		new HtmlWebpackPlugin({
			template: './app/about.html',
			inject: 'body',
			chunks: ['about'],
			filename: 'about.html'
		}),
		new MiniCssExtractPlugin({
			filename: "css/[name].[contenthash].css",
			chunkFilename: "css/[id].[contenthash].css"
		}),
		new CopyWebpackPlugin([
			{
				from: './app/.htaccess',
				to: '.htaccess',
				toType: 'file'
			}
		])
	],

	// https://webpack.js.org/configuration/optimization/
	optimization: {
		splitChunks: {
			chunks: 'all'
		},
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: true
			}),
			new OptimizeCssAssetsPlugin({})
		]
	},
};
