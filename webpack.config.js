// webpack.config.js
const path = require( '.' );
module.exports = {
    context: __dirname,
    entry: './src/index.js',
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'cencilio.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/
                use: 'babel-loader',
            }
        ]
    }
};
