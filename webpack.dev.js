const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

	// This option controls if and how source maps are generated.
	// https://webpack.js.org/configuration/devtool/
	devtool: 'eval-cheap-module-source-map',

	// https://webpack.js.org/concepts/entry-points/#multi-page-application
	entry: {
		index: './app/js/index.js',
		about: './app/js/about.js'
		// contacts: './src/page-contacts/main.js'
	},

	// https://webpack.js.org/configuration/dev-server/
	devServer: {
		port: 8080,
		overlay: true
	},

	// https://webpack.js.org/concepts/loaders/
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
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
				test: /\.(scss|css)$/,
				use: [
					{
						// creates style nodes from JS strings
						loader: "style-loader",
						options: {
							sourceMap: true
						}
					},
					{
						// translates CSS into CommonJS
						loader: "css-loader",
						options: {
							sourceMap: true
						}
					},
					{
						// compiles Sass to CSS
						loader: "sass-loader",
						options: {
							outputStyle: 'expanded',
							sourceMap: true,
							sourceMapContents: true
						}
					}
					// Please note we are not running postcss here
				]
			},
			{
				// Load all images as base64 encoding if they are smaller than 8192 bytes
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							// On development we want to see where the file is coming from, hence we preserve the [path]
							name: '[path][name].[ext]?hash=[hash:20]',
							limit: 8192
						}
					}
				]
			}
		],
	},

	// https://webpack.js.org/concepts/plugins/
	plugins: [
		new HtmlWebpackPlugin({
			template: './app/index.html',
			inject: true,
			chunks: ['index'],
			filename: 'index.html'
		}),
		new HtmlWebpackPlugin({
			template: './app/about.html',
			inject: true,
			chunks: ['about'],
			filename: 'about.html'
		})
	]
};
