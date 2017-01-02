var path = require('path'),
	webpack = require('webpack'),
	cssnext = require('postcss-cssnext');
	
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	target: 'web',
    debug: true,
    cache: true,
    watch: true,
	devtool: 'cheap-eval-source-map',
	context: path.resolve(),
	entry: './src/index.js',
	output: {
        path: path.resolve('build'),
        publicPath: '/',
        filename: 'app.js'
    },
    plugins: isProduction ? [
        new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.ProvidePlugin({React: 'react', ReactDOM: 'react-dom'}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	] : [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({React: 'react', ReactDOM: 'react-dom'})
	],
	resolve: {
        modulesDirectories: [ 'node_modules', 'src' ],
        root: path.resolve('./src')
    },
	module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel'
            }, {
                test: /\.svg$/,
                loader: 'svg-inline'
            }, {
                test: /\.png/,
                loader: 'url-loader?limit=10000&mimetype=image/png'
            }, {
                test: /\.jpe?g/,
                loader: 'url-loader?limit=10000&mimetype=image/jpg'
            },
            {
            	test: /\.m\.css$/,
            	loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss'
            },
			{
                test: /styles\.css$/,
                loader: 'style-loader!css!postcss'
            }
        ]
    },
	devServer: {
        contentBase: path.resolve('build'),
        hot: true,
        stats: { colors: true },
        historyApiFallback: true,
        inline: true
    },
    postcss: function () {
        return [ cssnext() ];
    }
}
